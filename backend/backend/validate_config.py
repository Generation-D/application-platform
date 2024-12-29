from datetime import datetime, date
from backend.utils.consts import DATETIME_FORMAT, REGEX_JS
from backend.enums.question_type import QuestionType
from typing import Any, Dict

from backend.utils.utils_file import read_yaml_file

DEFAULT_PARAMS = {
    'order': int,
    'mandatory': bool,
    'question': str,
}

# Define the specific parameters for each question type
SPECIFIC_PARAMS = {
    'maxTextLength': int,
    'minAnswers': int,
    'maxAnswers': int,
    'userInput': bool,
    'Answers': list,
    'maxFileSizeInMB': float,
    'minDate': date,
    'maxDate': date,
    'minDatetime': datetime,
    'maxDatetime': datetime,
    'minNumber': int,
    'maxNumber': int,
    'allowedFileTypes': list,
}

# Define which specific parameters are used by each question type
QUESTION_TYPE_PARAMS = {
    QuestionType.SHORT_TEXT: ['maxTextLength'],
    QuestionType.LONG_TEXT: ['maxTextLength'],
    QuestionType.MULTIPLE_CHOICE: ['minAnswers', 'maxAnswers', 'userInput', 'Answers'],
    QuestionType.VIDEO_UPLOAD: ['maxFileSizeInMB'],
    QuestionType.DATE_PICKER: ['minDate', 'maxDate'],
    QuestionType.DATETIME_PICKER: ['minDatetime', 'maxDatetime'],
    QuestionType.NUMBER_PICKER: ['minNumber', 'maxNumber'],
    QuestionType.PDF_UPLOAD: ['maxFileSizeInMB'],
    QuestionType.IMAGE_UPLOAD: ['maxFileSizeInMB'],
    QuestionType.DROPDOWN: ['minAnswers', 'maxAnswers', 'Answers', 'userInput'],
    QuestionType.CHECKBOX: [],
    QuestionType.CONDITIONAL: ['Answers'],
}

# Construct the mandatory parameters dictionary
MANDATORY_PARAMS = {
    question_type: {
        param: SPECIFIC_PARAMS[param]
        for param in params
    }
    for question_type, params in QUESTION_TYPE_PARAMS.items()
}

# Merge the default parameters with the specific ones for each question type
for question_type in MANDATORY_PARAMS:
    MANDATORY_PARAMS[question_type].update(DEFAULT_PARAMS)

OPTIONAL_PARAMS = {
    "ALL": {
        "note": str,
        "preinformationbox": str,
        "postinformationbox": str,
    },
    QuestionType.SHORT_TEXT: {
        'formattingRegex': str,
    },
}

QUESTION_TYPES_DB_TABLE = {
    QuestionType.SHORT_TEXT: "short_text_question_table",
    QuestionType.LONG_TEXT: "long_text_question_table",
    QuestionType.MULTIPLE_CHOICE: "multiple_choice_question_table",
    QuestionType.VIDEO_UPLOAD: "video_upload_question_table",
    QuestionType.DATE_PICKER: "date_picker_question_table",
    QuestionType.DATETIME_PICKER: "datetime_picker_question_table",
    QuestionType.NUMBER_PICKER: "number_picker_question_table",
    QuestionType.PDF_UPLOAD: "pdf_upload_question_table",
    QuestionType.IMAGE_UPLOAD: "image_upload_question_table",
    QuestionType.DROPDOWN: "dropdown_question_table",
    QuestionType.CHECKBOX: "checkbox_question_table",
    QuestionType.CONDITIONAL: "conditional_question_table",
}


def validate_nested_questions(nested_questions, phase_name):
    """ Validate the structure of nested questions in a conditionalQuestion. """
    if not isinstance(nested_questions, list):
        raise ValueError(f"In phase {phase_name}, nested questions should be a list.")

    for question in nested_questions:
        validate_question_structure(question, phase_name, None, None)


def validate_question_structure(question, phase_name, seen_orders: set, phase_sections):
    if 'questionType' not in question:
        raise ValueError("A question is missing the 'questionType' field.")

    this_question_type = QuestionType.from_str(question['questionType'])
    if not this_question_type:
        raise ValueError(
            f"Invalid 'questionType': {question['questionType']}. Has to be one of the followings: {QuestionType.list_values()}"
        )

    order = question.get('order')
    if seen_orders:
        if order in seen_orders:
            raise ValueError(f"The order number {order} in phase '{phase_name}' is NOT Unique!")
        seen_orders.add(order)

    for param, paramtype in MANDATORY_PARAMS.get(this_question_type, {}).items():
        if not seen_orders and param == "order":
            continue
        if param not in question:
            raise ValueError(f"The {this_question_type} question {question} is missing the parameter '{param}' field!")
        if not isinstance(question[param], paramtype):
            raise ValueError(
                f"The additional parameter field '{param}' is type of {type(question[param])} instead of {paramtype}.")

    for param, paramtype in OPTIONAL_PARAMS.get("ALL", {}).items():
        if param in question and not isinstance(question[param], paramtype):
            raise ValueError(
                f"The optional parameter field '{param}' is type of {type(question[param])} instead of {paramtype}.")

    for param, paramtype in OPTIONAL_PARAMS.get(this_question_type, {}).items():
        if param in question and not isinstance(question[param], paramtype):
            raise ValueError(
                f"The optional parameter field '{param}' is type of {type(question[param])} instead of {paramtype}.")

    if this_question_type == QuestionType.SHORT_TEXT and "formattingDescription" in question:
        if not isinstance(question[param], str):
            raise ValueError(
                f"The optional parameter field '{param}' is type of {type(question[param])} instead of str.")
        if "formattingRegex" not in question:
            raise ValueError(f"The optional parameter field '{param}' can't be set if formattingRegex is not Set.")
        if question["formattingRegex"] in REGEX_JS.keys():
            raise ValueError(
                f"The optional parameter field '{param}' can't be set if formattingRegex is one of the Predefined Values."
            )

    if phase_sections:
        if "sectionNumber" not in question:
            raise ValueError(
                f"In phase {phase_name} the Sections are enabled but ne question '{question['question']}' is missing the sectionNumber!"
            )
        if not isinstance(question["sectionNumber"], int):
            raise ValueError(f"The field 'sectionNumber' is type of {type(question[param])} instead of int.")
        if len(phase_sections) + 1 < question["sectionNumber"]:
            raise ValueError(
                f"The sectionNumber {question['sectionNumber']} in question '{question['question']}' is bigger than the number of sections in this phase!"
            )
    if this_question_type == QuestionType.CONDITIONAL:
        for option in question['Answers']:
            if 'value' not in option or not isinstance(option['value'], str):
                raise ValueError(
                    f"In phase {phase_name}, 'value' field is missing or not a string in a conditional question option."
                )

            if 'questions' in option:
                validate_nested_questions(option['questions'], phase_name)


def run_structure_checks(yaml_data: Dict[str, Any]) -> None:
    # Check if 'questions' is in the YAML
    if 'questions' not in yaml_data:
        raise ValueError("'questions' not found in the YAML data.")

    # Check if at least one phase is inside 'questions'
    if not yaml_data['questions']:
        raise ValueError("No Phases found in 'questions'.")

    # Check for necessary fields in each question
    for phase_name, phase in yaml_data['questions'].items():
        if 'phaseLabel' not in phase or not isinstance(phase['phaseLabel'], str):
            raise ValueError(
                f"The phase {phase_name} is missing the 'phaseLabel' field or 'phaseLabel' is not a String.")

        if 'startDate' not in phase or not isinstance(phase['startDate'], date):
            raise ValueError(
                f"The phase {phase_name} is missing the 'startDate' field or 'startDate' is not in ISO8601 standard: {DATETIME_FORMAT}."
            )

        if 'endDate' not in phase or not isinstance(phase['endDate'], date):
            raise ValueError(
                f"The phase {phase_name} is missing the 'endDate' field or 'endDate' is not in ISO8601 standard: {DATETIME_FORMAT}."
            )

        if 'sections' in phase:
            if not isinstance(phase['sections'], list):
                raise ValueError(f"The phase {phase_name} has the 'sections' field but it's is not a list.")
            for section in phase['sections']:
                if not isinstance(section, dict):
                    raise ValueError(
                        f"The phase {phase_name} has the 'sections' field but the section {section} is not a string.")

        seen_orders = set()
        for question in phase["questions"]:
            validate_question_structure(question, phase_name, seen_orders, phase.get('sections', None))


def validate_config_structure():
    yaml_content = read_yaml_file("apl_config.yml")
    # Validate the structure of the YAML content
    try:
        run_structure_checks(yaml_content)
        print("YAML is valid.")
    except ValueError as e:
        print(f"YAML validation error: {e}")
