import { z } from "zod";
import { regexKeys } from "./consts";
import { QuestionType } from "@/components/questiontypes/utils/questiontype_selector";

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

const ShortTextQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.ShortText),
  maxTextLength: z.number().int().positive().optional(),
  formattingRegex: RegexKeySchema.optional(),
  formattingDescription: z.string().optional(),
});

const LongTextQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.LongText),
  maxTextLength: z.number().int().positive().optional(),
});

const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.MultipleChoice),
  minAnswers: z.number().int().nonnegative().optional(),
  maxAnswers: z.number().int().positive().optional(),
  Answers: z.array(z.string()).min(1),
  userInput: z.boolean().optional(),
});

const DropdownQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.Dropdown),
  minAnswers: z.number().int().nonnegative().optional(),
  maxAnswers: z.number().int().positive().optional(),
  Answers: z.array(z.string()).min(1),
  userInput: z.boolean().optional(),
});

const CheckBoxQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.CheckBox),
});

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

const DatePickerQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.DatePicker),
  minDate: z.coerce.date().optional(),
  maxDate: z.coerce.date().optional(),
});

const DatetimePickerQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.DatetimePicker),
  minDatetime: z.coerce.date().optional(),
  maxDatetime: z.coerce.date().optional(),
});

const NumberPickerQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.NumberPicker),
  minNumber: z.number().optional(),
  maxNumber: z.number().optional(),
});

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

export type PhasesConfig = z.infer<typeof PhasesConfigSchema>;
export type Phase = z.infer<typeof PhaseSchema>;
export type Section = z.infer<typeof SectionSchema>;
