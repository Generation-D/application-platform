"use client";
import React from "react";

import { AnswerState } from "@/store/slices/answerSlice";
import { useAppSelector } from "@/store/store";
import { numberToLetter } from "@/utils/helpers";

import { Question } from "./questions";

export const MissingQuestions = ({
  phaseQuestions,
}: {
  phaseQuestions: Question[];
}) => {
  const answeredQuestions = useAppSelector<AnswerState>(
    (state) => state.answerReducer,
  );

  const renderQuestion = (question: Question, dependingOrder?: number) => (
    <li key={question.questionid}>
      {dependingOrder
        ? `${dependingOrder} ${numberToLetter(question.questionorder)}) `
        : `${question.questionorder}. `}
      <span
        className="break-after-avoid"
        dangerouslySetInnerHTML={{ __html: question.questiontext }}
      ></span>
    </li>
  );

  const copyPhaseQuestions = phaseQuestions.map((phaseQuestion) => {
    return phaseQuestion;
  });

  const questionsJSX = copyPhaseQuestions
    .sort((a, b) => a.questionorder - b.questionorder)
    .flatMap((question) => {
      if (question.questiontype !== "conditional") {
        if (question.mandatory && !(question.questionid in answeredQuestions)) {
          return renderQuestion(question);
        }
        return [];
      }

      if (question.questionid in answeredQuestions) {
        return question.params.choices.flatMap(
          (choice: {
            choiceid: string;
            choicevalue: string;
            questions: Question[];
          }) => {
            const copyChoiceQuestions = choice.questions.map(
              (choiceQuestion) => {
                return choiceQuestion;
              },
            );
            return copyChoiceQuestions
              .sort(
                (a: Question, b: Question) => a.questionorder - b.questionorder,
              )
              .flatMap((condQuestion: Question) => {
                if (
                  condQuestion.mandatory &&
                  !(condQuestion.questionid in answeredQuestions) &&
                  answeredQuestions[question.questionid].answervalue ===
                    choice.choiceid
                ) {
                  return renderQuestion(condQuestion, question.questionorder);
                }
                return [];
              });
          },
        );
      } else if (question.mandatory) {
        return renderQuestion(question);
      }
      return [];
    });

  return (
    questionsJSX.length !== 0 && (
      <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <div>
          <span className="font-medium">
            Die folgenden verpflichtenden Fragen sind noch ausstehend:
          </span>
          <ul className="mt-1.5 list-inside">{questionsJSX}</ul>
        </div>
      </div>
    )
  );
};
