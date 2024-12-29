from enum import Enum, unique


@unique
class QuestionType(Enum):
    SHORT_TEXT = "shortText"
    LONG_TEXT = "longText"
    MULTIPLE_CHOICE = "multipleChoice"
    VIDEO_UPLOAD = "videoUpload"
    IMAGE_UPLOAD = "imageUpload"
    PDF_UPLOAD = "pdfUpload"
    DATE_PICKER = "datePicker"
    DATETIME_PICKER = "datetimePicker"
    NUMBER_PICKER = "numberPicker"
    DROPDOWN = "dropdown"
    CONDITIONAL = "conditional"
    CHECKBOX = "checkBox"

    @classmethod
    def list_values(cls):
        return [member.value for member in cls]

    @classmethod
    def from_str(cls, string: str) -> 'QuestionType | None':
        mapping = {member.value: member for member in cls}
        return mapping.get(string)

    def __str__(self):
        return self.value
