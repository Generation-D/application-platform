"use client";

import React, { useEffect, useState } from "react";

import {
  fetchLongTextAnswer,
  saveLongTextAnswer,
} from "@/actions/answers/longText";
import {logger} from "@/logger/logger";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../layout/awaiting";

export interface LongTextQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  maxtextlength: number;
}

const LongTextQuestionType: React.FC<LongTextQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  maxtextlength,
  selectedSection,
  selectedCondChoice,
  questionsuborder,
  applicationid
}) => {
  const dispatch = useAppDispatch();

  const answer = useAppSelector<string>(
    (state) => (state.answerReducer[questionid]?.answervalue as string) || "",
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      setIsLoading(true);
      try {
        const savedAnswer = await fetchLongTextAnswer(questionid, applicationid);
        updateAnswerState(savedAnswer.answertext, savedAnswer.answerid);
      } catch (error) {
        logger.error(JSON.stringify(error));
      } finally {
        setIsLoading(false);
      }
    }
    loadAnswer();
  }, [questionid, selectedSection, selectedCondChoice]);

  const updateAnswerState = (answervalue: string, answerid?: string) => {
    dispatch(
      UpdateAnswer({
        questionid: questionid,
        answervalue: answervalue,
        answerid: answerid || "",
      }),
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!iseditable) {
      return;
    }
    updateAnswerState(event.target.value);
  };

  return (
    <QuestionTypes
      applicationid={applicationid}
      phasename={phasename}
      questionid={questionid}
      mandatory={mandatory}
      questiontext={questiontext}
      questionnote={questionnote}
      questionorder={questionorder}
      iseditable={iseditable}
      questionsuborder={questionsuborder}
    >
      <AwaitingChild isLoading={isLoading}>
        <textarea
          className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out resize-none"
          required={mandatory}
          maxLength={maxtextlength}
          disabled={!iseditable}
          aria-disabled={!iseditable}
          style={{ minHeight: "200px" }}
          onBlur={(event) => saveLongTextAnswer(event.target.value, questionid)}
          onChange={handleChange}
          value={answer}
        />
        <p
          className={`italic  text-sm text-right ${
            answer.length >= maxtextlength ? "text-red-500" : "text-gray-500"
          } `}
        >
          {answer.length}/{maxtextlength} Zeichen
        </p>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default LongTextQuestionType;
