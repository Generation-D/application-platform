"use client";

import React, { useEffect } from "react";

import { ExtendedAnswerType } from "@/actions/answers/answers";
import getQuestionComponent, {
  QuestionType,
} from "@/components/questiontypes/utils/questiontype_selector";
import {logger} from "@/logger/logger";
import { INIT_PLACEHOLDER, UpdateAnswer } from "@/store/slices/answerSlice";
import { PhaseData, setPhase } from "@/store/slices/phaseSlice";
import { useAppDispatch } from "@/store/store";

import { InformationBox } from "./informationBox";

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

export interface Question extends DefaultQuestion {
  params: any;
}

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
  const copyPhaseQuestions = phaseQuestions.map((phaseQuestions) => {
    return phaseQuestions;
  });
  dispatch(
    setPhase({
      phasename: phaseData.phasename,
      phasedata: phaseData,
      phasequestions: phaseQuestions,
    }),
  );
  useEffect(() => {
    phaseAnswers.forEach((answer) => {
      updateAnswerState(
        answer.questionid,
        answer.answerid,
        answer?.answervalue,
      );
    });
  }, [phaseAnswers]);

  const updateAnswerState = (
    questionid: string,
    answerid?: string,
    answervalue?: string | null,
  ) => {
    dispatch(
      UpdateAnswer({
        questionid: questionid,
        answervalue: answervalue || INIT_PLACEHOLDER,
        answerid: answerid || "",
      }),
    );
  };

  return (
    <div className="mt-5 mb-7 border-b border-r rounded-xl shadow shadow-secondary p-5">
      {copyPhaseQuestions
        .sort((a, b) => a.questionorder - b.questionorder)
        .map((phaseQuestion) => {
          const QuestionComponent = getQuestionComponent(
            phaseQuestion.questiontype,
          );
          if (!QuestionComponent) {
            logger.error(`Unknown question type: ${phaseQuestion.questiontype}`);
            return null;
          }
          return (
            <React.Fragment key={phaseQuestion.questionid}>
              {phaseQuestion.preinformationbox && (
                <InformationBox
                  key={`${phaseQuestion.questionid}_pre_infobox`}
                  text={phaseQuestion.preinformationbox}
                />
              )}
              <QuestionComponent
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
              />
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
