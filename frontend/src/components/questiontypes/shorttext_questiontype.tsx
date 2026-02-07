"use client";
import React, { useEffect, useState } from "react";

import {
  fetchShortTextAnswer,
  saveShortTextAnswer,
} from "@/actions/answers/shortText";
import Logger from "@/logger/logger";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkRegex } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../layout/awaiting";

export interface ShortTextQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  maxtextlength: number;
  formattingregex: string | null;
  formattingdescription: string | null;
}

const log = new Logger("ShortTextQuestionType");

const ShortTextQuestionType: React.FC<ShortTextQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  answerid,
  maxtextlength,
  formattingregex,
  formattingdescription,
  selectedSection,
  selectedCondChoice,
  questionsuborder,
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
        const savedAnswer = await fetchShortTextAnswer(questionid);
        updateAnswerState(savedAnswer.answertext, savedAnswer.answerid);
      } catch (error) {
        log.error(JSON.stringify(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadAnswer();
  }, [questionid, answerid, selectedSection, selectedCondChoice]);

  const updateAnswerState = (answervalue: string, answerid?: string) => {
    dispatch(
      UpdateAnswer({
        questionid: questionid,
        answervalue: answervalue,
        answerid: answerid || "",
      }),
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    updateAnswerState(event.target.value);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    const textinput = event.target.value;
    if (
      textinput != "" &&
      formattingregex &&
      !checkRegex(formattingregex, textinput)
    ) {
      updateAnswerState("");
      alert(`Dieses Format wird nicht unterstützt!`);
      return;
    }
    saveShortTextAnswer(textinput, questionid);
  };

  return (
    <QuestionTypes
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
        <input
          type="text"
          name={questionid}
          id={questionid}
          value={answer}
          disabled={!iseditable}
          aria-disabled={!iseditable}
          className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
          required={mandatory}
          maxLength={maxtextlength}
          onBlur={(event) => handleBlur(event)}
          onChange={(event) => handleChange(event)}
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

export default ShortTextQuestionType;
