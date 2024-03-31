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


def retrieve_answers(question_table_sorted, sp, application_id, conditional_dependence,
                     skip=['f47e99dd-b360-4f8f-88c9-c0257c35e860']) -> tuple:
    '''
    Retrieve the answers for a given application id and dependent questions. Return a tuple, where the first element is
    a dictionary with the question id as key and a tuple of the question type, question text and answer as value.
    The second element is a boolean indicating if the application is complete.

    Skip the "Read-Deck".
    '''

    application_complete = True
    result = {}
    for jj, question in question_table_sorted.iterrows():
        question_id = question['questionid']
        if question_id in skip:
            continue
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
    with open(file, 'w') as f:
        f.write(','.join(colnames) + '\n')


def add_to_csv(file, answers_formatted: dict, credentials: dict):
    if not os.path.exists(file):
        creadentials_colnames = list(credentials.keys())
        questions = list(answers_formatted.keys())
        csv_add_colnames(file, creadentials_colnames + questions)
    csv_text = ''
    with open(file, 'a') as f:
        csv_text += ','.join([str(x) for x in credentials.values()])
        for question, answer in answers_formatted.items():
            csv_text += ',' + str(answer).replace(
                '', ';')  # TODO: the problem with text is that it can contain commas and newlines and so on!
        f.write(csv_text + '\n')


def main():

    supabase_public = init_supabase(schema='public')
    storage_client = init_supabase_bucket_client()

    # TODO: take snapshot of the dB and then do the pdfs!
    sp = SupabaseTable(supabase_public)

    # TODO: assert phase id!
    question_table_sorted = sp['question_table'].sort_values('questionorder')
    conditional_dependence = get_dependent_questions(sp)

    # create save_dirs:
    save_dir = 'bewerbungen_pdf'
    os.makedirs(save_dir, exist_ok=True)

    save_dir_incomplete = os.path.join(save_dir, 'incomplete')
    os.makedirs(save_dir_incomplete, exist_ok=True)

    save_dir_complete = os.path.join(save_dir, 'complete')
    os.makedirs(save_dir_complete, exist_ok=True)
    # empty log file and csv

    # create or empty the log file
    open(os.path.join(save_dir, 'completed.csv'), 'w').close()
    full_data_path = os.path.join(save_dir, 'full_data.csv')
    if os.path.exists(full_data_path):
        os.remove(full_data_path)

    title_question_id = 'f5f03483-66d3-4e6d-8c26-4d17e8d53a8b'

    all_emails = []
    applications_complete_emails = []  # TODO: these are not the mentioned contact emails!
    applications_complete_count = 0
    for ii, application in tqdm(sp['application_table'].iterrows(), desc='Creating pdfs',
                                total=len(sp['application_table'])):

        try:
            email = sp['users'][sp['users']['id'] == application['userid']]['email'].values[0]
            all_emails.append(email)
        except Exception as e:
            print('Did you forget to update the view?\n' + \
                  'create view public.users as select * from auth.users;' + \
                  'revoke all on public.users from anon, authenticated;')
            raise e

        application_id = application['applicationid']
        user_id = application['userid']

        title_question = sp['question_table'][sp['question_table']['questionid'] == title_question_id]
        title = get_answer(sp, application_id, title_question.iloc[0])
        # if title is None:
        #  continue  # skip this application as no title is given!

        title_text = title['answertext'].values[0] if title is not None else MISSING_ANSWER
        text = f'<h3> Teamname </h3>'
        text += f'{title_text}<br><br>\n\n\n'
        question_table_sorted = question_table_sorted[~(title_question_id == question_table_sorted['questionid'])]

        answers, application_complete = retrieve_answers(question_table_sorted, sp, application_id,
                                                         conditional_dependence)

        missing_answer_ids = [question for question, answer in answers.items() if answer is None]
        missing_questions = question_table_sorted[question_table_sorted['questionid'].isin(missing_answer_ids)][[
            'questionid', 'mandatory'
        ]]
        print('Answers missing: ', len(missing_answer_ids))
        with open(os.path.join(save_dir, 'log.txt'), 'a') as f:
            f.write(f'User: {user_id}{"_INCOMPLETE" * (not application_complete)}   {email}\n')
            f.write(
                f'Answers missing: {len(missing_answer_ids)} {[(id, f"mandatory: {mandatory}") for _, (id, mandatory) in missing_questions.iterrows()]}\n'
            )
            f.write('\n')

        answers = {k: v for k, v in sorted(answers.items(), key=lambda item: int(item[1][1].split(' ')[1]))}

        answers_formatted = {}
        for (question_type, question_text, answer) in answers.values():
            if answer is None:
                answer_parsed = MISSING_ANSWER
            else:
                answer_parsed = ANSWER_TO_PARSER[question_type](sp, answer, storage_client)
            answers_formatted[question_text] = answer_parsed

        for question_text, answer_parsed in answers_formatted.items():
            text += '<h3> ' + str_to_html(question_text) + '</h3>    <br>\n\n'
            text += str_to_html(answer_parsed)
            if text[-3:] == 'ul>':  # print one line break less if preceded by list
                text += '    <br>\n\n\n'
            else:
                text += '    <br><br>\n\n\n'

        file_content = create_html_file_content(text)
        name_title = "".join(i for i in title_text if i not in "\/:*?<>|") if title_text != MISSING_ANSWER else "NaN"
        file_name = f'{user_id}_{name_title}{"_INCOMPLETE" * (not application_complete)}.pdf'
        file_path = os.path.join(save_dir, file_name)

        html = HTML(string=file_content, base_url="/")
        css = CSS(string='@page { size: A3; margin: 0; }')
        html.write_pdf(file_path, stylesheets=[css])

        if application_complete:
            applications_complete_count += 1
            applications_complete_emails.append(email)

        # write a csv with key, name, e-mail, pdf_name
        with open(os.path.join(save_dir, 'completed.csv'), 'a') as f:
            f.write(f'{user_id},{name_title},{email},{file_name}\n')

    print(f'Application complete: {applications_complete_count} of {len(sp["application_table"])}')
    print()
    print(f'All emails non-completed: {list(set(all_emails) - set(applications_complete_emails))}')
    print()
    print(f'All emails completed: {applications_complete_emails}')


if __name__ == '__main__':
    # add argparse!
    main()
