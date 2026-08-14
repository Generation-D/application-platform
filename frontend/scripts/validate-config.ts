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

// Construct the mandatory parameters dictionary and merge default parameters
export const MANDATORY_PARAMS: Record<
  string,
  Record<string, RuntimeType>
> = Object.entries(QUESTION_TYPE_PARAMS).reduce(
  (acc, [questionType, params]) => {
    const specificMap: Record<string, RuntimeType> = {};
    for (const param of params) {
      specificMap[param] = SPECIFIC_PARAMS[param];
    }
    acc[questionType] = { ...specificMap, ...DEFAULT_PARAMS };
    return acc;
  },
  {} as Record<string, Record<string, RuntimeType>>,
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

// // Runtime type checker mirroring Python's `isinstance`
// function isTypeOf(value: any, expectedType: RuntimeType): boolean {
//   if (value === null || value === undefined) return false;
//   switch (expectedType) {
//     case 'string':
//       return typeof value === 'string';
//     case 'number':
//       return typeof value === 'number' && !isNaN(value);
//     case 'integer':
//       return Number.isInteger(value);
//     case 'boolean':
//       return typeof value === 'boolean';
//     case 'array':
//       return Array.isArray(value);
//     case 'date':
//       return value instanceof Date && !isNaN(value.getTime());
//     case 'object':
//       return typeof value === 'object' && !Array.isArray(value);
//     default:
//       return false;
//   }
// }

// function getTypeName(value: any): string {
//   if (value === null) return 'null';
//   if (Array.isArray(value)) return 'list';
//   if (value instanceof Date) return 'date/datetime';
//   return typeof value;
// }

// /** Validate the structure of nested questions in a conditionalQuestion. */
// export function validateNestedQuestions(nestedQuestions: any, phaseName: string): void {
//   if (!Array.isArray(nestedQuestions)) {
//     throw new Error(`In phase ${phaseName}, nested questions should be a list.`);
//   }

//   for (const question of nestedQuestions) {
//     validateQuestionStructure(question, phaseName, null, null);
//   }
// }

// export function validateQuestionStructure(
//   question: Record<string, any>,
//   phaseName: string,
//   seenOrders: Set<number> | null,
//   phaseSections: any[] | null
// ): void {
//   if (!('questionType' in question)) {
//     throw new Error("A question is missing the 'questionType' field.");
//   }

//   const thisQuestionType = questionTypeFromStr(question['questionType']);
//   if (!thisQuestionType) {
//     throw new Error(
//       `Invalid 'questionType': ${question['questionType']}. Has to be one of the followings: ${listQuestionTypeValues()}`
//     );
//   }

//   const order = question['order'];
//   if (seenOrders !== null) {
//     if (seenOrders.has(order)) {
//       throw new Error(`The order number ${order} in phase '${phaseName}' is NOT Unique!`);
//     }
//     seenOrders.add(order);
//   }

//   const mandatoryParamsForType = MANDATORY_PARAMS[thisQuestionType] || {};
//   for (const [param, paramType] of Object.entries(mandatoryParamsForType)) {
//     if (seenOrders === null && param === 'order') {
//       continue;
//     }
//     if (!(param in question)) {
//       throw new Error(
//         `The ${thisQuestionType} question ${JSON.stringify(question)} is missing the parameter '${param}' field!`
//       );
//     }
//     if (!isTypeOf(question[param], paramType)) {
//       throw new Error(
//         `The additional parameter field '${param}' is type of ${getTypeName(question[param])} instead of ${paramType}.`
//       );
//     }
//   }

//   for (const [param, paramType] of Object.entries(OPTIONAL_PARAMS['ALL'] || {})) {
//     if (param in question && !isTypeOf(question[param], paramType)) {
//       throw new Error(
//         `The optional parameter field '${param}' is type of ${getTypeName(question[param])} instead of ${paramType}.`
//       );
//     }
//   }

//   for (const [param, paramType] of Object.entries(OPTIONAL_PARAMS[thisQuestionType] || {})) {
//     if (param in question && !isTypeOf(question[param], paramType)) {
//       throw new Error(
//         `The optional parameter field '${param}' is type of ${getTypeName(question[param])} instead of ${paramType}.`
//       );
//     }
//   }

//   if (thisQuestionType === QuestionType.SHORT_TEXT && 'formattingDescription' in question) {
//     if (typeof question['formattingDescription'] !== 'string') {
//       throw new Error(
//         `The optional parameter field 'formattingDescription' is type of ${getTypeName(question['formattingDescription'])} instead of str.`
//       );
//     }
//     if (!('formattingRegex' in question)) {
//       throw new Error("The optional parameter field 'formattingDescription' can't be set if formattingRegex is not Set.");
//     }
//     if (question['formattingRegex'] in REGEX_JS) {
//       throw new Error(
//         "The optional parameter field 'formattingDescription' can't be set if formattingRegex is one of the Predefined Values."
//       );
//     }
//   }

//   if (phaseSections) {
//     if (!('sectionNumber' in question)) {
//       throw new Error(
//         `In phase ${phaseName} the Sections are enabled but ne question '${question['question']}' is missing the sectionNumber!`
//       );
//     }
//     if (!Number.isInteger(question['sectionNumber'])) {
//       throw new Error(
//         `The field 'sectionNumber' is type of ${getTypeName(question['sectionNumber'])} instead of int.`
//       );
//     }
//     if (phaseSections.length + 1 < question['sectionNumber']) {
//       throw new Error(
//         `The sectionNumber ${question['sectionNumber']} in question '${question['question']}' is bigger than the number of sections in this phase!`
//       );
//     }
//   }

//   if (thisQuestionType === QuestionType.CONDITIONAL) {
//     if (Array.isArray(question['Answers'])) {
//       for (const option of question['Answers']) {
//         if (!('value' in option) || typeof option['value'] !== 'string') {
//           throw new Error(
//             `In phase ${phaseName}, 'value' field is missing or not a string in a conditional question option.`
//           );
//         }

//         if ('questions' in option) {
//           validateNestedQuestions(option['questions'], phaseName);
//         }
//       }
//     }
//   }
// }

// export function runStructureChecks(yamlData: Record<string, any>): void {
//   // Check if 'questions' is in the YAML
//   if (!('questions' in yamlData)) {
//     throw new Error("'questions' not found in the YAML data.");
//   }

//   // Check if at least one phase is inside 'questions'
//   if (!yamlData['questions'] || Object.keys(yamlData['questions']).length === 0) {
//     throw new Error("No Phases found in 'questions'.");
//   }

//   // Check for necessary fields in each question
//   for (const [phaseName, phase] of Object.entries(yamlData['questions']) as [string, any][]) {
//     if (!('phaseLabel' in phase) || typeof phase['phaseLabel'] !== 'string') {
//       throw new Error(
//         `The phase ${phaseName} is missing the 'phaseLabel' field or 'phaseLabel' is not a String.`
//       );
//     }

//     if (!('startDate' in phase) || !isTypeOf(phase['startDate'], 'date')) {
//       throw new Error(
//         `The phase ${phaseName} is missing the 'startDate' field or 'startDate' is not in ISO8601 standard: ${DATETIME_FORMAT}.`
//       );
//     }

//     if (!('endDate' in phase) || !isTypeOf(phase['endDate'], 'date')) {
//       throw new Error(
//         `The phase ${phaseName} is missing the 'endDate' field or 'endDate' is not in ISO8601 standard: ${DATETIME_FORMAT}.`
//       );
//     }

//     if ('sections' in phase) {
//       if (!Array.isArray(phase['sections'])) {
//         throw new Error(`The phase ${phaseName} has the 'sections' field but it's is not a list.`);
//       }
//       for (const section of phase['sections']) {
//         if (typeof section !== 'object' || section === null || Array.isArray(section)) {
//           throw new Error(
//             `The phase ${phaseName} has the 'sections' field but the section ${JSON.stringify(section)} is not a string.`
//           );
//         }
//       }
//     }

//     const seenOrders = new Set<number>();
//     if (Array.isArray(phase['questions'])) {
//       for (const question of phase['questions']) {
//         validateQuestionStructure(question, phaseName, seenOrders, phase['sections'] || null);
//       }
//     }
//   }
// }
