import { type SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { REGEX_JS, REGEX_TO_DESCRIPTION } from "./consts";
import { convertToTimezone } from "./datetime";
import YAML from "yaml";
import * as fs from "node:fs";
import {
  DEFAULT_PARAMS,
  MANDATORY_PARAMS,
  OPTIONAL_PARAMS,
  QUESTION_TYPES_DB_TABLE,
} from "./validate-config";
import { parseArgs } from "util";
import { Database } from "@/types/database.types";
import {
  PhasesConfig,
  PhasesConfigSchema,
  Question,
} from "./phasesConfigSchema";
import {
  QuestionType,
  questionTypeFromStr,
} from "@/components/questiontypes/utils/questiontype_selector";
import { getSupabase } from "./utils";

const log = {
  debug: console.debug,
  info: console.info,
  error: console.error,
};

export async function processNestedQuestions(
  nestedQuestions: Question[],
  phaseId: string,
  phaseSections: Record<number, string>,
  supabase: SupabaseClient,
  dependsOn: string,
): Promise<void> {
  for (let order = 0; order < nestedQuestions.length; order++) {
    const nestedQuestion = nestedQuestions[order];
    nestedQuestion["order"] = order + 1;
    await processQuestion(
      nestedQuestion,
      phaseId,
      phaseSections,
      supabase,
      dependsOn,
    );
  }
}

export async function processQuestion(
  question: Question,
  phaseId: string,
  phaseSections: Record<number, string>,
  supabase: SupabaseClient,
  dependsOn: string | null = null,
): Promise<void> {
  const questionType = questionTypeFromStr(question["questionType"]);
  if (!questionType) {
    throw new Error(`Invalid QuestionType: ${question["questionType"]}`);
  }

  const sectionNumber = question["sectionNumber"];
  const dataQuestionTable = createDataQuestionsTable(
    questionType,
    question.order,
    phaseId,
    question["mandatory"] ?? false,
    question["question"],
    question["note"] ?? "",
    question["preInformationBox"] ?? "",
    question["postInformationBox"] ?? "",
    phaseSections,
    sectionNumber,
    dependsOn,
  );

  log.debug(`Create Question "${JSON.stringify(question)}"`);
  const responseQuestionTable = await supabase
    .from("question_table")
    .insert(dataQuestionTable)
    .select();
  if (responseQuestionTable.error) throw responseQuestionTable.error;

  log.debug(`Create QuestionType ${questionType}`);
  const questionId = responseQuestionTable.data[0]["questionid"];
  const dataQuestionTypeTable = createDataQuestionTypeTable(
    questionId,
    questionType,
    question,
  );

  const responseQuestionTypeTable = await supabase
    .from(QUESTION_TYPES_DB_TABLE[questionType])
    .insert(dataQuestionTypeTable)
    .select();
  if (responseQuestionTypeTable.error) throw responseQuestionTypeTable.error;

  log.info(JSON.stringify(responseQuestionTypeTable));

  if (
    question.questionType === QuestionType.PDFUpload ||
    question.questionType === QuestionType.ImageUpload ||
    question.questionType === QuestionType.VideoUpload
  ) {
    let fileType = "";
    let allowedMimeTypes: string[] = [];

    if (question.questionType === QuestionType.PDFUpload) {
      fileType = "pdf";
      allowedMimeTypes = ["application/pdf"];
    } else if (question.questionType === QuestionType.VideoUpload) {
      fileType = "video";
      allowedMimeTypes = ["video/mp4"];
    } else if (question.questionType === QuestionType.ImageUpload) {
      fileType = "image";
      allowedMimeTypes = ["image/png", "image/jpeg"];
    }

    await createFileStorage(
      supabase,
      fileType,
      questionId,
      question["maxFileSizeInMB"],
      allowedMimeTypes,
    );
  } else if (question.questionType === QuestionType.MultipleChoice) {
    for (const answer of question["Answers"]) {
      const dataListTable = createDataChoiceTable(questionId, answer);
      try {
        const responseListTable = await supabase
          .from("multiple_choice_question_choice_table")
          .insert(dataListTable)
          .select();
        if (responseListTable.error) throw responseListTable.error;
        log.info(JSON.stringify(responseListTable));
      } catch {
        log.info(
          "Failed to insert data into multiple_choice_question_choice_table",
        );
      }
    }
  } else if (question.questionType === QuestionType.Dropdown) {
    for (const answer of question["Answers"]) {
      const dataListTable = createDataOptionTable(questionId, answer);
      try {
        const responseListTable = await supabase
          .from("dropdown_question_option_table")
          .insert(dataListTable)
          .select();
        if (responseListTable.error) throw responseListTable.error;
        log.info(JSON.stringify(responseListTable));
      } catch {
        log.info("Failed to insert data into dropdown_question_option_table");
      }
    }
  } else if (question.questionType === QuestionType.Conditional) {
    for (const answer of question["Answers"]) {
      const dataConditionalChoiceTable = createDataConditionalChoiceTable(
        questionId,
        answer["value"],
      );
      const responseConditionalChoiceTable = await supabase
        .from("conditional_question_choice_table")
        .insert(dataConditionalChoiceTable)
        .select();
      if (responseConditionalChoiceTable.error)
        throw responseConditionalChoiceTable.error;

      await processNestedQuestions(
        answer["questions"],
        phaseId,
        phaseSections,
        supabase,
        responseConditionalChoiceTable.data[0]["choiceid"],
      );
    }
  }
}

export async function processConfig(
  configFilepath: string,
  supabase: SupabaseClient<Database>,
): Promise<void> {
  const configData = await getPhasesConfig(configFilepath);
  //   runStructureChecks(configData);

  const phaseEntries = Object.entries(configData["questions"]);

  for (
    let phaseCounter = 0;
    phaseCounter < phaseEntries.length;
    phaseCounter++
  ) {
    const [phaseName, phase] = phaseEntries[phaseCounter];

    // Check if phase already exists in the database
    const existingPhases = await supabase
      .from("phase_table")
      .select("phaseid, phasename")
      .eq("phasename", phaseName);

    let phaseId = uuidv4();

    if (existingPhases.data && existingPhases.data.length > 0) {
      phaseId = existingPhases.data[0]["phaseid"];
      const existingPhaseQuestions = await supabase
        .from("question_table")
        .select("*")
        .eq("phaseid", phaseId);

      if (
        existingPhaseQuestions.data &&
        existingPhaseQuestions.data.length > 0
      ) {
        log.info(`Phase ${phaseName} already exists, skipping...`);
        log.debug(JSON.stringify(existingPhases.data));
        continue;
      }
    }

    const dataPhaseTable = {
      phasename: phaseName,
      phaselabel: phase.phaseLabel,
      phaseorder: phaseCounter,
      startdate: convertToTimezone(phase.startDate),
      enddate: convertToTimezone(phase.endDate, { endOfDay: true }),
      sectionsenabled: "sections" in phase,
      phaseid: phaseId,
    };

    log.info(`Creating new Phase ${phaseName}`);
    const responsePhaseTable = await supabase
      .from("phase_table")
      .upsert(dataPhaseTable)
      .select();
    if (responsePhaseTable.error) throw responsePhaseTable.error;

    const phaseSections: Record<number, string> = {};
    phaseId = responsePhaseTable.data[0]["phaseid"];

    if (phase.sections) {
      for (let order = 0; order < phase["sections"].length; order++) {
        const section = phase["sections"][order];
        const dataSectionTable = {
          sectionname: section["name"],
          sectiondescription: section["description"] ?? "",
          sectionorder: order + 1,
          phaseid: phaseId,
        };
        const responseSectionTable = await supabase
          .from("sections_table")
          .insert(dataSectionTable)
          .select();
        if (responseSectionTable.error) throw responseSectionTable.error;

        phaseSections[order + 1] = responseSectionTable.data[0]["sectionid"];
      }
    }
    log.info(JSON.stringify(responsePhaseTable));

    for (const question of phase["questions"]) {
      await processQuestion(question, phaseId, phaseSections, supabase);
    }
    log.info(`Processed Phase ${phaseName} successfully`);
  }
}

export function createDataQuestionsTable(
  questionType: QuestionType,
  orderNumber: number,
  phaseId: string,
  mandatory: boolean,
  question: string,
  questionNote: string,
  preInformationBox: string,
  postInformationBox: string,
  sections: Record<number, string>,
  sectionNumber?: number,
  dependsOn: string | null = null,
) {
  return {
    questiontype: String(questionType),
    questionorder: orderNumber,
    phaseid: phaseId,
    mandatory: mandatory ? 1 : 0,
    questiontext: question,
    questionnote: questionNote,
    preinformationbox: preInformationBox,
    postinformationbox: postInformationBox,
    sectionid:
      sectionNumber !== undefined ? (sections[sectionNumber] ?? null) : null,
    depends_on: dependsOn,
  };
}

export function createDataQuestionTypeTable(
  questionId: string,
  questionType: QuestionType,
  question: Question,
) {
  const dataQuestionTypeTable: Record<string, string> = {
    questionid: questionId,
  };

  const mandatoryMap = MANDATORY_PARAMS[questionType] || {};
  for (const param of Object.keys(mandatoryMap)) {
    if (param !== "Answers" && !(param.toLowerCase() in DEFAULT_PARAMS)) {
      const key = param as keyof typeof question;
      const value = question[key];
      dataQuestionTypeTable[param.toLowerCase()] = String(value);
    }
  }

  const optionalMap = OPTIONAL_PARAMS[questionType] || {};
  for (const optParam of Object.keys(optionalMap)) {
    if (!(optParam in question)) {
      continue;
    }
    if (
      optParam === "formattingRegex" &&
      question.questionType === QuestionType.ShortText
    ) {
      const regexKey = question.formattingRegex;
      if (!regexKey) {
        continue;
      }
      dataQuestionTypeTable[optParam.toLowerCase()] =
        REGEX_JS[regexKey] ?? null;
      dataQuestionTypeTable["formattingdescription"] =
        REGEX_TO_DESCRIPTION[regexKey] ??
        question["formattingDescription"] ??
        null;
    }
  }

  return dataQuestionTypeTable;
}

export function createDataChoiceTable(questionId: string, choiceText: string) {
  return {
    questionid: questionId,
    choicetext: choiceText,
  };
}

export function createDataOptionTable(questionId: string, optionText: string) {
  return {
    questionid: questionId,
    optiontext: optionText,
  };
}

export function createDataConditionalChoiceTable(
  questionId: string,
  choiceValue: string,
) {
  return {
    questionid: questionId,
    choicevalue: choiceValue,
  };
}

export async function createFileStorage(
  supabase: SupabaseClient<Database>,
  fileType: string,
  questionId: string,
  fileSizeLimitInMB: number,
  allowedMimeTypes: string[],
): Promise<void> {
  const bucketName = `${fileType}-${questionId}`;
  const response = await supabase.storage.createBucket(bucketName, {
    public: false,
    fileSizeLimit: fileSizeLimitInMB * Math.pow(2, 20),
    allowedMimeTypes: allowedMimeTypes,
  });
  log.info(JSON.stringify(response));
}

export async function getPhasesConfig(
  configFilePath: string,
): Promise<PhasesConfig> {
  const fileContent = fs.readFileSync(configFilePath, "utf-8");

  const rawData = YAML.parse(fileContent);

  return PhasesConfigSchema.parse(rawData);
}

(async () => {
  const supabase = getSupabase();

  const { values, positionals } = parseArgs({
    options: {
      file: {
        type: "string",
        short: "f",
      },
    },
    allowPositionals: true,
  });

  const filePath = values.file ?? positionals[0];

  if (!filePath) {
    console.error(
      "Error: Please provide a file via '-f <file>' or as the first argument.",
    );
    return;
  }

  await processConfig(filePath, supabase);
})().catch((e) => console.error(e));
