import os
from tqdm import tqdm
import datetime
import pandas as pd
from weasyprint import HTML, CSS
from collections import defaultdict

from typing import Optional, Dict, Tuple

import supabase
from backend.utils.utils_supabase import init_supabase, init_supabase_bucket_client
from backend.validate_config import QUESTION_TYPES_DB_TABLE
from backend.enums.question_type import QuestionType
from pdf_utils import parse_text_answer, parse_multiple_choice_answer, parse_video_upload_answer, \
    parse_date_picker_answer, parse_number_picker_answer, parse_pdf_upload_answer, parse_image_upload_answer, \
    parse_dropdown_answer, parse_conditional_answer, parse_checkbox_answer, str_to_html, list_to_html

MISSING_ANSWER = 'NaN'

ANSWER_TO_PARSER = {
    QuestionType.SHORT_TEXT: parse_text_answer,
    QuestionType.LONG_TEXT: parse_text_answer,
    QuestionType.MULTIPLE_CHOICE: parse_multiple_choice_answer,
    QuestionType.VIDEO_UPLOAD: parse_video_upload_answer,
    QuestionType.DATE_PICKER: parse_date_picker_answer,
    QuestionType.DATETIME_PICKER: parse_date_picker_answer,
    QuestionType.NUMBER_PICKER: parse_number_picker_answer,
    QuestionType.PDF_UPLOAD: parse_pdf_upload_answer,
    QuestionType.IMAGE_UPLOAD: parse_image_upload_answer,
    QuestionType.DROPDOWN: parse_dropdown_answer,
    QuestionType.CONDITIONAL: parse_conditional_answer,
    QuestionType.CHECKBOX: parse_checkbox_answer,
}

QUESTION_TYPES_DB_ANSWER_TABLE = {
    key: value.replace('question', 'answer')
    for key, value in QUESTION_TYPES_DB_TABLE.items()
}


class SupabaseTable:
    def __init__(self, schema: supabase._sync.client.SyncClient) -> None:
        self.loaded_tables = {
            'answer_table': pd.DataFrame(schema.table('answer_table').select('*').execute().data),
            'application_table': pd.DataFrame(schema.table('application_table').select('*').execute().data),
            'question_table': pd.DataFrame(schema.table('question_table').select('*').execute().data),
        }
        # TODO: add check, that the loaded data is as long as the number of rows in the table in supabase!
        self.schema = schema

    def __getitem__(self, key):
        if key in self.loaded_tables:
            return self.loaded_tables[key]
        # load the data
        self.loaded_tables[key] = pd.DataFrame(self.schema.table(key).select('*').execute().data)
        return self.loaded_tables[key]


# define variables
def create_html_file_content(text):
    return f'''<!DOCTYPE html>
<html>
<head>
<title>Formulareingaben</title>
<meta charset='utf-8'/>
<link rel='preconnect' href='https://fonts.gstatic.com'>
<link href='https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;1,300&display=swap' rel='stylesheet'>
</head>
<body>
<div class='body'>
<div class='body-image'></div>
<div class='body-inner'>
<div class='header-bar'><div class='header-textbox'>Generation-D<br>Wettbewerb ''' + str(datetime.date.today().year) + '''</div></div>
<div class='content'>''' + \
        text + \
        '''</div>
</div>
</div>
<style>body{width:100%;height:100%;margin:0;background-color:gray;}.body{max-width:1100px;margin:auto;padding-top:162px;
line-height:1.5;font-family:'Poppins',sans-serif;background-color:#304149;}h3,
h5{color:#304149;}h5{margin-top:-15px;}.body-image{height:115px;width:100%;position:absolute;top:35px;
background:url(''' + os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets/logo-white.png') + ''') no-repeat center;
background-size:72%;}.body-inner{padding:0 70px;}.header-bar{position:relative;height:20px;background:white;margin-left:70px;margin-bottom:120px;}.header-textbox{position:absolute;color:#304149;background:#fe914e;right:-70px;width:44%;max-width:387px;min-width:225px;padding:1px 27px 2px;font-size:32px;font-weight:bold;}.content{padding:0 70px 5px 70px;position:relative;color:#353535;background-color:#f5bc77}.content>:first-child{margin-top:0;padding-top:20px}.content:before{content:'';background-color:#f5bc77;position:absolute;height:100%;width:80px;left:-70px;}</style>
</body>
</html>'''


def get_question_type(sp, question_id) -> QuestionType:
    question_type_str = sp['question_table'][sp['question_table']['questionid'] ==
                                             question_id]['questiontype'].values[0]
    return QuestionType.str_to_enum(question_type_str)


def get_answer(sp: SupabaseTable, application_id, question) -> Dict[Optional[pd.core.frame.DataFrame], bool]:
    '''
    Get the answer for a given question id and application id and dependent questions.
    '''
    question_id = question['questionid']
    applicants_answers = sp['answer_table'][sp['answer_table']['applicationid'] == application_id]
    if len(applicants_answers) == 0:
        return None  # Applicant has not answered any question!
    answer_id = applicants_answers[applicants_answers['questionid'] == question_id]['answerid'].values
    if len(answer_id) == 0:
        return None  # Applicant has not answered this question!
    assert len(answer_id) == 1, 'Multiple answers for one question not yet supported!'
    answer_id = answer_id[0]

    depends_on = question['depends_on']
    if depends_on is not None:
        conditional_choice_table = sp['conditional_question_choice_table']
        dependent_entry = conditional_choice_table[conditional_choice_table['choiceid'] == depends_on]
        assert len(dependent_entry) != 0, 'Dependent question is not conditional!'
        choice_value = dependent_entry['choicevalue'].values[0]
        if choice_value == 'Nein':
            return None
        assert choice_value == 'Ja', 'Conditional choice value not supported!'

    question_type = get_question_type(sp, question_id)
    answer_type_table_name = QUESTION_TYPES_DB_ANSWER_TABLE[question_type]
    answer_type_table = sp[answer_type_table_name]
    answer = answer_type_table[answer_type_table['answerid'] == answer_id]
    return answer


def get_dependent_questions(sp: SupabaseTable) -> dict:
    result = defaultdict(list)
    for ii, question in sp['question_table'].iterrows():
        question_id = question['questionid']
        question_type = get_question_type(sp, question_id)
        question_text = f'Frage {ii} [{question_type.value}]: ' + question['questiontext']
        if question['depends_on'] is not None:
            cqct = sp['conditional_question_choice_table']
            res = cqct[cqct['choiceid'] == question['depends_on']]

            depends_on_choice = res['choicevalue'].values[0]
            depends_on_question_id = res['questionid'].values[0]

            result[question_id].append({
                'depends_on_question_id': depends_on_question_id,
                'choice_value': depends_on_choice
            })
    return result


def retrieve_answers(question_table_sorted, sp, application_id, conditional_dependence) -> tuple:
    '''
    Retrieve the answers for a given application id and dependent questions. Return a tuple, where the first element is
    a dictionary with the question id as key and a tuple of the question type, question text and answer as value.
    The second element is a boolean indicating if the application is complete.
    '''

    application_complete = True
    result = {}
    for jj, question in question_table_sorted.iterrows():
        question_id = question['questionid']
        question_type = get_question_type(sp, question_id)
        question_text = f'Frage {jj} [{question_type.value}]: ' + question['questiontext']

        answer = get_answer(sp, application_id, question)

        if len(conditional_dependence[question_id]) != 0:
            # if this question is mandatory dependent on another question
            assert len(conditional_dependence[question_id]) == 1, 'Multiple dependencies not supported!'
            sub_question_id = conditional_dependence[question_id][0]['depends_on_question_id']
            sub_question = sp['question_table'][sp['question_table']['questionid'] == sub_question_id].iloc[0]
            sub_question_text = f'Frage {jj} [{question_type.value}]: ' + sub_question['questiontext']
            answer_sub = get_answer(sp, application_id, sub_question)
            if answer_sub is None and sub_question['mandatory']:
                assert answer is None, 'Conditional questions cannot be dependent!'
                application_complete = False
                result[question_id] = (question_type, question_text, None)
                continue
            conditional_result = parse_conditional_answer(sp, answer_sub)
            assert len(conditional_dependence[sub_question_id]) == 0, 'Conditional questions cannot be dependent!'
            assert conditional_result in ['Ja', 'Nein'], 'Conditional questions can only be yes or no!'
            if conditional_result != conditional_dependence[question_id][0]['choice_value']:
                continue

        if answer is None and question['mandatory']:
            application_complete = False
            result[question_id] = (question_type, question_text, None)
            continue

        result[question_id] = (question_type, question_text, answer)
    return result, application_complete


def csv_add_colnames(file, colnames):
    colnames_sanitized = [str(x).replace(',', ';') for x in colnames]
    with open(file, 'w') as f:
        f.write(','.join(colnames_sanitized) + '\n')


# def add_to_csv(file, answers_formatted: dict, credentials: dict):
#     if not os.path.exists(file):
#         creadentials_colnames = list(credentials.keys())
#         questions = list(answers_formatted.keys())
#         csv_add_colnames(file, creadentials_colnames + questions)
#     csv_text = ''
#     with open(file, 'a') as f:
#         csv_text += ','.join([str(x) for x in credentials.values()])
#         for question, answer in answers_formatted.items():
#             csv_text += ',' + str(answer).replace(
#                 '', ';')  # TODO: the problem with text is that it can contain commas and newlines and so on!
#         f.write(csv_text + '\n')


def add_to_csv(file, row: list):
    row_sanitized = [str(x).replace(',', ';') for x in row]
    with open(file, 'a') as f:
        f.write(','.join([str(x) for x in row_sanitized]) + '\n')


def main():

    supabase_public = init_supabase(schema='public')
    storage_client = init_supabase_bucket_client()
    sp = SupabaseTable(supabase_public)

    pdf_read_deck_bucket = storage_client.get_bucket('pdf-f47e99dd-b360-4f8f-88c9-c0257c35e860')
    read_decks = pdf_read_deck_bucket.list()

    title_question_id = 'f5f03483-66d3-4e6d-8c26-4d17e8d53a8b'

    read_deck_csv = 'bewerbungen_pdf/read_deck_overview.csv'
    csv_add_colnames(read_deck_csv, ['team_name', 'user_id', 'pdf_link'])

    for read_deck in read_decks:
        user_id_deck = read_deck['name'].split('_')[0]
        application_id = sp['application_table'][sp['application_table']['userid'] ==
                                                 user_id_deck]['applicationid'].values[0]

        # team title name
        title_question = sp['question_table'][sp['question_table']['questionid'] == title_question_id]
        title = get_answer(sp, application_id, title_question.iloc[0])['answertext'].values[0]

        days_to_seconds = 24 * 60 * 60
        download_url = pdf_read_deck_bucket.create_signed_url(read_deck['name'], 365 * days_to_seconds)
        add_to_csv(read_deck_csv, [title, user_id_deck, download_url['signedURL']])

    print(f'All read decks completed {len(read_decks)}')


if __name__ == '__main__':
    # add argparse!
    main()
