import { z } from "zod";
import { regexKeys } from "./consts";
import { QuestionType } from "@/components/questiontypes/utils/questiontype_selector";

// ==========================================
// 1. Date & Regex Helper Schemas
// ==========================================

// YAML parsers often parse `YYYY-MM-DD` as Date objects automatically.
// This helper accepts both native Date instances and ISO strings.
const DateOrStringSchema = z.union([
  z.date(),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected format: YYYY-MM-DD"),
]);

const DatetimeOrStringSchema = z.union([
  z.date(),
  z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      "Expected format: YYYY-MM-DDTHH:mm:ss",
    ),
]);

// ==========================================
// 2. Base & Specific Question Definitions
// ==========================================

const BaseQuestionSchema = z.object({
  order: z.number().int().positive(),
  question: z.string().min(1),
  mandatory: z.boolean().default(false),
  sectionNumber: z.number().int().positive().optional(),
  note: z.string().optional(),
  preInformationBox: z.string().optional(),
  postInformationBox: z.string().optional(),
});

export const RegexKeySchema = z.enum(regexKeys);

// Short Text Question
const ShortTextQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.ShortText),
  maxTextLength: z.number().int().positive().optional(),
  formattingRegex: RegexKeySchema.optional(),
  formattingDescription: z.string().optional(),
});

// Long Text Question
const LongTextQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.LongText),
  maxTextLength: z.number().int().positive().optional(),
});

// Multiple Choice Question
const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.MultipleChoice),
  minAnswers: z.number().int().nonnegative().optional(),
  maxAnswers: z.number().int().positive().optional(),
  Answers: z.array(z.string()).min(1),
  userInput: z.boolean().optional(),
});

// Dropdown Question
const DropdownQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.Dropdown),
  minAnswers: z.number().int().nonnegative().optional(),
  maxAnswers: z.number().int().positive().optional(),
  Answers: z.array(z.string()).min(1),
  userInput: z.boolean().optional(),
});

// Checkbox Question
const CheckBoxQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.CheckBox),
});

// File Upload Questions (video, pdf, image)
const VideoUploadQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.VideoUpload),
  maxFileSizeInMB: z.number().positive().default(10.0),
});

const PdfUploadQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.PDFUpload),
  maxFileSizeInMB: z.number().positive().default(5.0),
});

const ImageUploadQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.ImageUpload),
  maxFileSizeInMB: z.number().positive().default(5.0),
});

// Date & Time Pickers
const DatePickerQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.DatePicker),
  minDate: DateOrStringSchema.optional(),
  maxDate: DateOrStringSchema.optional(),
});

const DatetimePickerQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.DatetimePicker),
  minDatetime: DatetimeOrStringSchema.optional(),
  maxDatetime: DatetimeOrStringSchema.optional(),
});

// Number Picker
const NumberPickerQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.NumberPicker),
  minNumber: z.number().optional(),
  maxNumber: z.number().optional(),
});

// ==========================================
// 3. Non-recursive Question Discriminated Union
// ==========================================

const NonConditionalQuestionSchema = z.discriminatedUnion("questionType", [
  ShortTextQuestionSchema,
  LongTextQuestionSchema,
  MultipleChoiceQuestionSchema,
  DropdownQuestionSchema,
  CheckBoxQuestionSchema,
  VideoUploadQuestionSchema,
  PdfUploadQuestionSchema,
  ImageUploadQuestionSchema,
  DatePickerQuestionSchema,
  DatetimePickerQuestionSchema,
  NumberPickerQuestionSchema,
]);

// ==========================================
// 4. Recursive Conditional Question Schema
// ==========================================

export type Question =
  | z.infer<typeof NonConditionalQuestionSchema>
  | {
      questionType: "conditional";
      order: number;
      question: string;
      mandatory: boolean;
      sectionNumber?: number;
      note?: string;
      preInformationBox?: string;
      postInformationBox?: string;
      Answers: Array<{
        value: string;
        questions: Question[];
      }>;
    };

export const QuestionSchema: z.ZodType<Question> = z.lazy(() =>
  z.union([
    NonConditionalQuestionSchema,
    BaseQuestionSchema.extend({
      questionType: z.literal("conditional"),
      Answers: z.array(
        z.object({
          value: z.string(),
          questions: z.array(QuestionSchema),
        }),
      ),
    }),
  ]),
);

// ==========================================
// 5. Sections, Phases, and Root Config
// ==========================================

export const SectionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const PhaseSchema = z.object({
  phaseLabel: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  sections: z.array(SectionSchema).optional(),
  questions: z.array(QuestionSchema),
});

export const PhasesConfigSchema = z.object({
  questions: z.record(z.string(), PhaseSchema), // Matches dynamic keys like `phase-1`, `phase-2`
});

// Inferred TypeScript Type for the entire YAML structure
export type PhasesConfig = z.infer<typeof PhasesConfigSchema>;
export type Phase = z.infer<typeof PhaseSchema>;
export type Section = z.infer<typeof SectionSchema>;
