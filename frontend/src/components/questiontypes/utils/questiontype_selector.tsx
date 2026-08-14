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

export enum QuestionTypeTable {
  ShortTextQuestionTable = "short_text_question_table",
  LongTextQuestionTable = "long_text_question_table",
  NumberPickerQuestionTable = "number_picker_question_table",
  DatetimePickerQuestionTable = "datetime_picker_question_table",
  DatePickerQuestionTable = "date_picker_question_table",
  ImageUploadQuestionTable = "image_upload_question_table",
  VideoUploadQuestionTable = "video_upload_question_table",
  PdfUploadQuestionTable = "pdf_upload_question_table",
  MultipleChoiceQuestionTable = "multiple_choice_question_table",
  DropdownQuestionTable = "dropdown_question_table",
  CheckBoxQuestionTable = "checkbox_question_table",
  ConditionalQuestionTable = "conditional_question_table",
}

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
    key: phaseQuestion.questionid,
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
        <ShortTextQuestionType {...questionProps} {...phaseQuestion.params} />
      );
    case QuestionType.LongText:
      return (
        <LongTextQuestionType {...questionProps} {...phaseQuestion.params} />
      );
    case QuestionType.NumberPicker:
      return (
        <NumberPickerQuestionType
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.DatetimePicker:
      return (
        <DatetimePickerQuestionType
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.DatePicker:
      return (
        <DatePickerQuestionType {...questionProps} {...phaseQuestion.params} />
      );
    case QuestionType.ImageUpload:
      return (
        <ImageUploadQuestionType {...questionProps} {...phaseQuestion.params} />
      );
    case QuestionType.VideoUpload:
      return (
        <VideoUploadQuestionType {...questionProps} {...phaseQuestion.params} />
      );
    case QuestionType.PDFUpload:
      return (
        <PDFUploadQuestionType {...questionProps} {...phaseQuestion.params} />
      );
    case QuestionType.MultipleChoice:
      return (
        <MultipleChoiceQuestionType
          {...questionProps}
          {...phaseQuestion.params}
        />
      );
    case QuestionType.Dropdown:
      return (
        <DropdownQuestionType {...questionProps} {...phaseQuestion.params} />
      );
    case QuestionType.CheckBox:
      return (
        <CheckBoxQuestionType {...questionProps} {...phaseQuestion.params} />
      );
    case QuestionType.Conditional:
      return (
        <ConditionalQuestionType {...questionProps} {...phaseQuestion.params} />
      );
  }
};

export default getQuestionComponent;
