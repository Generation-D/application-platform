import { z } from "zod";
import { regexKeys } from "./consts";
import { QuestionType } from "@/components/questiontypes/utils/questiontype_selector";

export const RegexKeySchema = z.enum(regexKeys);

const BaseQuestionSchema = z.object({
  order: z.number().int().positive(),
  question: z.string().min(1),
  mandatory: z.boolean().default(false),
  sectionNumber: z.number().int().positive().optional(),
  note: z.string().optional(),
  preInformationBox: z.string().optional(),
  postInformationBox: z.string().optional(),
});

const ShortTextQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.ShortText),
  maxTextLength: z.number().int().positive(),
  formattingRegex: RegexKeySchema.optional(),
  formattingDescription: z.string().optional(),
});

const LongTextQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.LongText),
  maxTextLength: z.number().int().positive(),
});

const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.MultipleChoice),
  minAnswers: z.number().int().nonnegative().default(1),
  maxAnswers: z.number().int().positive().default(1),
  Answers: z.array(z.string().min(1)).min(1),
  userInput: z.boolean().default(false),
}).refine((data) => data.minAnswers <= data.maxAnswers, {
  message: "minAnswers cannot be greater than maxAnswers",
  path: ["minAnswers"],
});

const DropdownQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.Dropdown),
  minAnswers: z.number().int().nonnegative().default(1),
  maxAnswers: z.number().int().positive().default(1),
  Answers: z.array(z.string().min(1)).min(1),
  userInput: z.boolean().default(false),
}).refine((data) => data.minAnswers <= data.maxAnswers, {
  message: "minAnswers cannot be greater than maxAnswers",
  path: ["minAnswers"],
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
  minDate: z.coerce.date(),
  maxDate: z.coerce.date(),
}).refine((data) => data.minDate <= data.maxDate, {
  message: "minDate must be less than or equal to maxDate",
  path: ["minDate"],
});

const DatetimePickerQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.DatetimePicker),
  minDatetime: z.coerce.date(),
  maxDatetime: z.coerce.date(),
}).refine((data) => data.minDatetime <= data.maxDatetime, {
  message: "minDatetime must be less than or equal to maxDatetime",
  path: ["minDatetime"],
});

const NumberPickerQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal(QuestionType.NumberPicker),
  minNumber: z.number(),
  maxNumber: z.number(),
}).refine((data) => data.minNumber <= data.maxNumber, {
  message: "minNumber must be less than or equal to maxNumber",
  path: ["minNumber"],
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
      Answers: z
        .array(
          z.object({
            value: z.string().min(1),
            questions: z.array(QuestionSchema),
          }),
        )
        .min(1),
    }),
  ]),
);

export const SectionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

function validateQuestionOrdersAndSections(
  questions: Question[],
  sectionCount: number,
  ctx: z.RefinementCtx,
  path: (string | number)[] = ["questions"],
) {
  const seenOrders = new Set<number>();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const questionPath = [...path, i];

    if (seenOrders.has(q.order)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate question order detected: ${q.order}. Question orders must be unique within their section/scope.`,
        path: questionPath,
      });
    }
    seenOrders.add(q.order);

    if (q.sectionNumber !== undefined) {
      if (sectionCount === 0) {
        ctx.addIssue({
          code: "custom",
          message: `Question with order ${q.order} references section ${q.sectionNumber}, but no sections exist for this phase.`,
          path: questionPath,
        });
      } else if (q.sectionNumber < 1 || q.sectionNumber > sectionCount) {
        ctx.addIssue({
          code: "custom",
          message: `Question with order ${q.order} references section ${q.sectionNumber}, but valid sections are 1 through ${sectionCount}.`,
          path: questionPath,
        });
      }
    }

    if (q.questionType === "conditional" && Array.isArray(q.Answers)) {
      q.Answers.forEach((ans, ansIdx) => {
        if (Array.isArray(ans.questions)) {
          validateQuestionOrdersAndSections(ans.questions, sectionCount, ctx, [
            ...questionPath,
            "Answers",
            ansIdx,
            "questions",
          ]);
        }
      });
    }
  }
}

export const PhaseSchema = z
  .object({
    phaseLabel: z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    sections: z.array(SectionSchema).optional().default([]),
    questions: z.array(QuestionSchema),
  })
  .refine((phase) => phase.startDate <= phase.endDate, {
    message: "startDate must be before or equal to endDate",
    path: ["startDate"],
  })
  .superRefine((phase, ctx) => {
    const sectionCount = phase.sections?.length ?? 0;
    validateQuestionOrdersAndSections(phase.questions, sectionCount, ctx);
  });

export const PhasesConfigSchema = z.object({
  questions: z.record(z.string(), PhaseSchema),
});

export type PhasesConfig = z.infer<typeof PhasesConfigSchema>;
export type Phase = z.infer<typeof PhaseSchema>;
export type Section = z.infer<typeof SectionSchema>;
