"use client";

import React, { useCallback, useEffect } from "react";

import { ExtendedAnswerType } from "@/actions/answers/answers";
import getQuestionComponent, {
  QuestionType,
} from "@/components/questiontypes/utils/questiontype_selector";
import { INIT_PLACEHOLDER, UpdateAnswer } from "@/store/slices/answerSlice";
import { PhaseData, setPhase } from "@/store/slices/phaseSlice";
import { useAppDispatch } from "@/store/store";

import { InformationBox } from "./informationBox";
import { ShortTextQuestionTypeExtraProps } from "./questiontypes/shorttext_questiontype";
import { VideoUploadQuestionTypeExtraProps } from "./questiontypes/videoupload_questiontype";
import { LongTextQuestionTypeExtraProps } from "./questiontypes/longtext_questiontype";
import { NumberPickerQuestionTypeExtraProps } from "./questiontypes/numberpicker_questiontype";
import { DatetimePickerQuestionTypeExtraProps } from "./questiontypes/datetimepicker_questiontype";
import { DatePickerQuestionTypeExtraProps } from "./questiontypes/datepicker_questiontype";
import { ImageUploadQuestionTypeExtraProps } from "./questiontypes/imageupload_questiontype";
import { PDFUploadQuestionTypeExtraProps } from "./questiontypes/pdfupload_questiontype";
import { MultipleChoiceQuestionTypeExtraProps } from "./questiontypes/multiplechoice_questiontype";
import { DropdownQuestionTypeExtraProps } from "./questiontypes/dropdown_questiontype";
import { CheckBoxQuestionTypeExtraProps } from "./questiontypes/checkbox_questiontype";
import { ConditionalQuestionTypeExtraProps } from "./questiontypes/conditional_questiontype";

export interface DefaultQuestion {
  questionid: string;
  questiontype: QuestionType;
  questionorder: number;
  questionsuborder?: string;
  phaseid: string;
  mandatory: boolean;
  questiontext: string;
  questionnote: string;
  sectionid: string | null;
  preinformationbox: string | null;
  postinformationbox: string | null;
  selectedSection: string | null;
  selectedCondChoice: string | null;
  depends_on: string | null;
}

interface BaseQuestion<T extends QuestionType, P> extends DefaultQuestion {
  questiontype: T;
  params: P;
}

export type Question =
  | BaseQuestion<QuestionType.ShortText, ShortTextQuestionTypeExtraProps>
  | BaseQuestion<QuestionType.LongText, LongTextQuestionTypeExtraProps>
  | BaseQuestion<QuestionType.NumberPicker, NumberPickerQuestionTypeExtraProps>
  | BaseQuestion<
      QuestionType.DatetimePicker,
      DatetimePickerQuestionTypeExtraProps
    >
  | BaseQuestion<QuestionType.DatePicker, DatePickerQuestionTypeExtraProps>
  | BaseQuestion<QuestionType.ImageUpload, ImageUploadQuestionTypeExtraProps>
  | BaseQuestion<QuestionType.VideoUpload, VideoUploadQuestionTypeExtraProps>
  | BaseQuestion<QuestionType.PDFUpload, PDFUploadQuestionTypeExtraProps>
  | BaseQuestion<
      QuestionType.MultipleChoice,
      MultipleChoiceQuestionTypeExtraProps
    >
  | BaseQuestion<QuestionType.Dropdown, DropdownQuestionTypeExtraProps>
  | BaseQuestion<QuestionType.CheckBox, CheckBoxQuestionTypeExtraProps>
  | BaseQuestion<QuestionType.Conditional, ConditionalQuestionTypeExtraProps>;

interface QuestionnaireProps {
  phaseData: PhaseData;
  phaseQuestions: Question[];
  phaseAnswers: ExtendedAnswerType[];
  iseditable: boolean;
  selectedSection: string | null;
  selectedCondChoice: string | null;
  applicationid: string;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  phaseData,
  phaseQuestions,
  phaseAnswers,
  iseditable,
  selectedSection,
  selectedCondChoice,
  applicationid,
}) => {
  const dispatch = useAppDispatch();
  // need a copy, so I can modify it beneath
  const copyPhaseQuestions = [...phaseQuestions];
  dispatch(
    setPhase({
      phasename: phaseData.phasename,
      phasedata: phaseData,
      phasequestions: phaseQuestions,
    }),
  );

  const updateAnswerState = useCallback(
    (questionid: string, answerid?: string, answervalue?: string | null) => {
      dispatch(
        UpdateAnswer({
          questionid: questionid,
          answervalue: answervalue || INIT_PLACEHOLDER,
          answerid: answerid || "",
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    phaseAnswers.forEach((answer) => {
      updateAnswerState(
        answer.questionid,
        answer.answerid,
        answer?.answervalue,
      );
    });
  }, [phaseAnswers, updateAnswerState]);

  return (
    <div className="mt-5 mb-7 border-b border-r rounded-xl shadow shadow-secondary p-5">
      {copyPhaseQuestions
        .sort((a, b) => a.questionorder - b.questionorder)
        .map((phaseQuestion) => {
          const QuestionComponent = getQuestionComponent(
            applicationid,
            phaseQuestion,
            phaseData.phasename,
            iseditable,
            selectedSection,
            selectedCondChoice,
          );

          return (
            <React.Fragment key={phaseQuestion.questionid}>
              {phaseQuestion.preinformationbox && (
                <InformationBox
                  key={`${phaseQuestion.questionid}_pre_infobox`}
                  text={phaseQuestion.preinformationbox}
                />
              )}
              {QuestionComponent}
              {/* <QuestionComponent
                applicationid={applicationid}
                key={phaseQuestion.questionid}
                phasename={phaseData.phasename}
                questionid={phaseQuestion.questionid}
                mandatory={phaseQuestion.mandatory}
                questiontext={phaseQuestion.questiontext}
                questionnote={phaseQuestion.questionnote}
                questionorder={phaseQuestion.questionorder}
                iseditable={iseditable}
                selectedSection={selectedSection}
                selectedCondChoice={selectedCondChoice}
                answerid={
                  phaseAnswers.find(
                    (answer) => answer.questionid == phaseQuestion.questionid,
                  )?.answerid
                }
                phaseAnswers={phaseAnswers}
                {...phaseQuestion.params}
              /> */}
              {phaseQuestion.postinformationbox && (
                <InformationBox
                  key={`${phaseQuestion.questionid}_post_infobox`}
                  text={phaseQuestion.postinformationbox}
                />
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default Questionnaire;
