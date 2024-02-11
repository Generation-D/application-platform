import io
import pdf2image
import pandas as pd
import PIL
from PIL import Image


import storage3


def list_to_html(vals: list) -> str:
    text = ''
    if len(vals) == 1:
        text += vals[0]
    else:
        text += '<ul>\n'
        for val in vals:
            text += f'<li>{val}</li>\n'
        text += '</ul>'
    return text


def str_to_html(string: list) -> str:
    text = ''
    if string[0:4] == "http":
        text += f'<a href="{string}">Link</a>'
    else:
        text += string.replace('\n', '    <br>\n')
    return text


def parse_text_answer(sp, answer: pd.core.frame.DataFrame, *args, **kwargs) -> str:
    assert len(answer) == 1
    return str_to_html(answer['answertext'].values[0])


def parse_multiple_choice_answer(sp, answer: pd.core.frame.DataFrame, *args, **kwargs) -> str:
    assert len(answer) == 1, 'Not implemented yet!'
    selected_choice_ids = answer['selectedchoice'].values[0].split(', ')
    multiple_choice_info_table = sp['multiple_choice_question_choice_table']
    mc_selection = multiple_choice_info_table[multiple_choice_info_table['choiceid'].isin(selected_choice_ids)]
    mc_selection_list = mc_selection['choicetext'].values.tolist()
    answer = list_to_html(mc_selection_list)
    return list_to_html(mc_selection_list)


def parse_video_upload_answer(sp, answer: pd.core.frame.DataFrame, *args, **kwargs):
    assert len(answer) == 1, 'Not implemented yet!'
    assert False


def parse_date_picker_answer(sp, answer: pd.core.frame.DataFrame, *args, **kwargs):
    assert len(answer) == 1, 'Not implemented yet!'
    assert False


def parse_number_picker_answer(sp, answer: pd.core.frame.DataFrame, *args, **kwargs):
    assert len(answer) == 1, 'Not implemented yet!'
    assert False


def parse_pdf_upload_answer(sp, answer: pd.core.frame.DataFrame, storage_client: storage3.SyncStorageClient, *args,
                            **kwargs):
    # assert len(answer) == 1, 'Not implemented yet!'
    answer_id = answer['answerid'].values[0]
    question_id = sp['answer_table'][sp['answer_table']['answerid'] == answer_id]['questionid'].values[0]
    bucket_name = 'pdf-' + question_id
    application_id = sp['answer_table'][sp['answer_table']['answerid'] == answer_id]['applicationid'].values[0]
    user_id = sp['application_table'][sp['application_table']['applicationid'] == application_id]['userid'].values[0]
    image_supabase_name = user_id + '_' + answer['pdfname'].values[0]
    image_bytes = storage_client.get_bucket(bucket_name).download(image_supabase_name)
    pages = pdf2image.convert_from_bytes(image_bytes)
    result_html = ''
    for ii, page in enumerate(pages):
        targe_height = 800
        height_ratio = targe_height / page.height
        image = page.resize((int(page.width * height_ratio), int(page.height * height_ratio)))
        image_path = f'/tmp/{question_id}_{ii}_gend.png'
        image.save(image_path)
        result_html += (f'<img src="{image_path}" alt="~ PDF Broken ~">    <br>\n')
    return result_html


def parse_image_upload_answer(sp, answer: pd.core.frame.DataFrame, storage_client: storage3.SyncStorageClient, *args,
                              **kwargs):
    assert len(answer) == 1, 'Not implemented yet!'
    answer_id = answer['answerid'].values[0]
    question_id = sp['answer_table'][sp['answer_table']['answerid'] == answer_id]['questionid'].values[0]
    bucket_name = 'image-' + question_id
    application_id = sp['answer_table'][sp['answer_table']['answerid'] == answer_id]['applicationid'].values[0]
    user_id = sp['application_table'][sp['application_table']['applicationid'] == application_id]['userid'].values[0]
    image_supabase_name = user_id + '_' + answer['imagename'].values[0]
    image_bytes = storage_client.get_bucket(bucket_name).download(image_supabase_name)
    try:
        image = Image.open(io.BytesIO(image_bytes))
        max_height = 800
        max_width = 800
        ratio = min(max_height / image.height, max_width / image.width)
        image = image.resize((int(image.width * ratio), int(image.height * ratio)))
        image.save('/tmp/img_gend.png')
    except PIL.UnidentifiedImageError:
        pass
    return f'<img src="/tmp/img_gend.png" alt="~ Image Broken ~">'


def parse_dropdown_answer(sp, answer: pd.core.frame.DataFrame, *args, **kwargs):
    assert len(answer) == 1, 'Not implemented yet!'
    assert False


def parse_conditional_answer(sp, answer: pd.core.frame.DataFrame, *args, **kwargs):
    choice_id = answer['selectedchoice'].values[0]
    condition_question_choice_tale = sp['conditional_question_choice_table']
    return condition_question_choice_tale[condition_question_choice_tale['choiceid'] ==
                                          choice_id]['choicevalue'].values[0]


def parse_checkbox_answer(sp, answer: pd.core.frame.DataFrame, *args, **kwargs):
    assert len(answer) == 1, 'Not implemented yet!'
    checked = answer['checked'].values[0]
    return str(checked)
