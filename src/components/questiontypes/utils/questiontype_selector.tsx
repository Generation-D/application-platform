import CheckBoxQuestionType from "@/components/questiontypes/checkbox_questiontype";
import ConditionalQuestionType from "@/components/questiontypes/conditional_questiontype";
import DatePickerQuestionType from "@/components/questiontypes/datepicker_questiontype";
import DatetimePickerQuestionType from "@/components/questiontypes/datetimepicker_questiontype";
import DropdownQuestionType from "@/components/questiontypes/dropdown_questiontype";
import ImageUploadQuestionType from "@/components/questiontypes/imageupload_questiontype";
import LongTextQuestionType from "@/components/questiontypes/longtext_questiontype";
import MultipleChoiceQuestionType from "@/components/questiontypes/multiplechoice_questiontype";
import NumberPickerQuestionType from "@/components/questiontypes/numberpicker_questiontype";
import PDFUploadQuestionType from "@/components/questiontypes/pdfupload_questiontype";
import ShortTextQuestionType from "@/components/questiontypes/shorttext_questiontype";
import VideoUploadQuestionType from "@/components/questiontypes/videoupload_questiontype";
import { Question } from "@/components/questions";
  import { Database } from "@/types/database.types";

export enum QuestionType {
  ShortText = "shortText",
  LongText = "longText",
  NumberPicker = "numberPicker",
  DatetimePicker = "datetimePicker",
  DatePicker = "datePicker",
  ImageUpload = "imageUpload",
  VideoUpload = "videoUpload",
  PDFUpload = "pdfUpload",
  MultipleChoice = "multipleChoice",
  Dropdown = "dropdown",
  CheckBox = "checkBox",
  Conditional = "conditional",
}

export function listQuestionTypeValues(): QuestionType[] {
  return Object.values(QuestionType);
}

function isValidEnum<T extends Record<string, string>>(
  enumObj: T,
  value: string
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}

export function questionTypeFromStr(value: string): QuestionType | null {
 if (isValidEnum(QuestionType, value)) {
    return value;
  }
  return null;
}

export const QuestionTypesTable = {
  [QuestionType.ShortText]: "short_text_question_table",
  [QuestionType.LongText]: "long_text_question_table",
  [QuestionType.MultipleChoice]: "multiple_choice_question_table",
  [QuestionType.VideoUpload]: "video_upload_question_table",
  [QuestionType.DatePicker]: "date_picker_question_table",
  [QuestionType.DatetimePicker]: "datetime_picker_question_table",
  [QuestionType.NumberPicker]: "number_picker_question_table",
  [QuestionType.PDFUpload]: "pdf_upload_question_table",
  [QuestionType.ImageUpload]: "image_upload_question_table",
  [QuestionType.Dropdown]: "dropdown_question_table",
  [QuestionType.CheckBox]: "checkbox_question_table",
  [QuestionType.Conditional]: "conditional_question_table",
} as const;

export enum AnswerTypeTable {
  ShortTextAnswerTable = "short_text_answer_table",
  LongTextAnswerTable = "long_text_answer_table",
  NumberPickerAnswerTable = "number_picker_answer_table",
  DatetimePickerAnswerTable = "datetime_picker_answer_table",
  DatePickerAnswerTable = "date_picker_answer_table",
  ImageUploadAnswerTable = "image_upload_answer_table",
  VideoUploadAnswerTable = "video_upload_answer_table",
  PdfUploadAnswerTable = "pdf_upload_answer_table",
  MultipleChoiceAnswerTable = "multiple_choice_answer_table",
  DropdownAnswerTable = "dropdown_answer_table",
  CheckBoxAnswerTable = "checkbox_answer_table",
  ConditionalAnswerTable = "conditional_answer_table",
}

const getQuestionComponent = (
  applicationid: string,
  phaseQuestion: Question,
  phasename: string,
  iseditable: boolean,
  selectedSection: string | null | undefined,
  selectedCondChoice: string | null | undefined,
  questionsuborder: string | undefined = undefined,
) => {
  const questionProps = {
    applicationid: applicationid,
    phasename: phasename,
    questionid: phaseQuestion.questionid,
    mandatory: phaseQuestion.mandatory,
    questiontext: phaseQuestion.questiontext,
    questionnote: phaseQuestion.questionnote,
    questionorder: phaseQuestion.questionorder,
    iseditable: iseditable,
    selectedSection: selectedSection,
    selectedCondChoice: selectedCondChoice,
    questionsuborder: questionsuborder,
  };

  switch (phaseQuestion.questiontype) {
    case QuestionType.ShortText:
      return (
        <ShortTextQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.LongText:
      return (
        <LongTextQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.NumberPicker:
      return (
        <NumberPickerQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.DatetimePicker:
      return (
        <DatetimePickerQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.DatePicker:
      return (
        <DatePickerQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.ImageUpload:
      return (
        <ImageUploadQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.VideoUpload:
      return (
        <VideoUploadQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.PDFUpload:
      return (
        <PDFUploadQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.MultipleChoice:
      return (
        <MultipleChoiceQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.Dropdown:
      return (
        <DropdownQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.CheckBox:
      return (
        <CheckBoxQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.Conditional:
      return (
        <ConditionalQuestionType
          key={phaseQuestion.questionid}
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
  }
};

export default getQuestionComponent;
