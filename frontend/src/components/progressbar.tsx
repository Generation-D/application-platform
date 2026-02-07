"use client";
import React, { useEffect, useState } from "react";

import { AnswerState } from "@/store/slices/answerSlice";
import { useAppSelector } from "@/store/store";
import { transformReadableDate } from "@/utils/helpers";

import { AwaitingChild } from "./layout/awaiting";
import { Question } from "./questions";

export const ProgressBar = ({
  progressbarId,
  mandatoryQuestionIds,
  phaseQuestions,
  endDate,
}: {
  progressbarId: string;
  mandatoryQuestionIds: string[];
  phaseQuestions: Question[];
  endDate: string;
}) => {
  const answeredQuestions = useAppSelector<AnswerState>(
    (state) => state.answerReducer,
  );
  const [numAnswered, setNumAnswered] = useState(0);
  const [numMandatory, setNumMandatory] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const calculateProgress = () => {
    const answeredMandatory = mandatoryQuestionIds.filter(
      (questionId) => questionId in answeredQuestions,
    ).length;

    let conditionalMandatory = 0;
    let answeredConditional = 0;

    phaseQuestions.forEach((question: Question) => {
      if (
        question.questiontype !== "conditional" ||
        !(question.questionid in answeredQuestions)
      ) {
        return;
      }

      question.params.choices.forEach(
        (choice: {
          choiceid: string;
          choicevalue: string;
          questions: Question[];
        }) => {
          const isChosen =
            answeredQuestions[question.questionid].answervalue ===
            choice.choiceid;
          const mandatoryChoices = choice.questions.filter(
            (q: Question) => q.mandatory,
          ).length;
          conditionalMandatory += isChosen ? mandatoryChoices : 0;

          answeredConditional += isChosen
            ? choice.questions.filter(
                (q) => q.mandatory && q.questionid in answeredQuestions,
              ).length
            : 0;
        },
      );
    });

    setNumAnswered(answeredMandatory + answeredConditional);
    setNumMandatory(mandatoryQuestionIds.length + conditionalMandatory);
  };

  useEffect(() => {
    setIsLoading(true);
    calculateProgress();
    setIsLoading(false);
  }, [mandatoryQuestionIds, progressbarId, phaseQuestions, answeredQuestions]);

  const stringDate = transformReadableDate(endDate);
  const progressPercentage = (numAnswered / numMandatory) * 100;

  return (
    <AwaitingChild isLoading={isLoading}>
      <div className="w-full bg-gray-300 rounded-2xl border">
        <div
          style={{ width: `${progressPercentage}%` }}
          className={`h-4 rounded-2xl border ${
            numAnswered !== numMandatory ? "bg-secondary" : "bg-green-600"
          }`}
        />
      </div>
      {numAnswered === numMandatory &&
        (new Date(endDate) > new Date() ? (
          <div className="md-3 italic text-gray-500">
            Eure Bewerbungsphase ist vollständig, ihr könnt sie aber bis zum{" "}
            {stringDate} weiter ändern.
          </div>
        ) : (
          <div className="md-3 italic text-gray-500">
            Eure Bewerbungsphase ist vollständig. Die Phase ist seit dem{" "}
            {stringDate} zu Ende. Ihr könnt Eure Ergebnisse weiterhin einsehen.
          </div>
        ))}
    </AwaitingChild>
  );
};
