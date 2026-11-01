import { QuestionType } from "@/components/questiontypes/utils/questiontype_selector";

type RuntimeType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array"
  | "date"
  | "object";

export const DEFAULT_PARAMS: Record<string, RuntimeType> = {
  order: "integer",
  mandatory: "boolean",
  question: "string",
};

// Define the specific parameters for each question type
const SPECIFIC_PARAMS: Record<string, RuntimeType> = {
  maxTextLength: "integer",
  minAnswers: "integer",
  maxAnswers: "integer",
  userInput: "boolean",
  Answers: "array",
  maxFileSizeInMB: "number",
  minDate: "date",
  maxDate: "date",
  minDatetime: "date",
  maxDatetime: "date",
  minNumber: "integer",
  maxNumber: "integer",
  allowedFileTypes: "array",
};

// Define which specific parameters are used by each question type
const QUESTION_TYPE_PARAMS: Record<QuestionType, string[]> = {
  [QuestionType.ShortText]: ["maxTextLength"],
  [QuestionType.LongText]: ["maxTextLength"],
  [QuestionType.MultipleChoice]: [
    "minAnswers",
    "maxAnswers",
    "userInput",
    "Answers",
  ],
  [QuestionType.VideoUpload]: ["maxFileSizeInMB"],
  [QuestionType.DatePicker]: ["minDate", "maxDate"],
  [QuestionType.DatetimePicker]: ["minDatetime", "maxDatetime"],
  [QuestionType.NumberPicker]: ["minNumber", "maxNumber"],
  [QuestionType.PDFUpload]: ["maxFileSizeInMB"],
  [QuestionType.ImageUpload]: ["maxFileSizeInMB"],
  [QuestionType.Dropdown]: ["minAnswers", "maxAnswers", "Answers", "userInput"],
  [QuestionType.CheckBox]: [],
  [QuestionType.Conditional]: ["Answers"],
};

export const MANDATORY_PARAMS: Record<
  string,
  Record<string, RuntimeType>
> = Object.fromEntries(
  Object.entries(QUESTION_TYPE_PARAMS).map(([questionType, params]) => {
    const specificMap = Object.fromEntries(
      params.map((param) => [param, SPECIFIC_PARAMS[param]]),
    );

    return [questionType, { ...specificMap, ...DEFAULT_PARAMS }];
  }),
);

export const OPTIONAL_PARAMS: Record<string, Record<string, RuntimeType>> = {
  ALL: {
    note: "string",
    preinformationbox: "string",
    postinformationbox: "string",
  },
  [QuestionType.ShortText]: {
    formattingRegex: "string",
  },
};

export const QUESTION_TYPES_DB_TABLE: Record<QuestionType, string> = {
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
};
