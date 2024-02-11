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
    def list_enums(cls):
        """Return a list of all enum members."""
        # Return all enum members in a list
        return list(cls.__members__.values())

    @classmethod
    def str_to_enum(cls, str_value):
        """Convert a string to the corresponding Enum value."""
        # Look up the enum by name. If not found, default to None.
        for member in cls.__members__.values():
            if member.value == str_value:
                return member
        # If not found, return None
        return None

    def __str__(self):
        return self.value
