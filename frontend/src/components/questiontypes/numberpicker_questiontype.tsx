"use client";
import React, { useEffect, useState } from "react";

import {
  fetchNumberPickerAnswer,
  saveNumberPickerAnswer,
} from "@/actions/answers/numberPicker";
import Logger from "@/logger/logger";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../layout/awaiting";

export interface NumberPickerQuestionTypeProps
  extends DefaultQuestionTypeProps {
  answerid: string | null;
  minnumber: number;
  maxnumber: number;
}

const log = new Logger("NumberPickerQuestionType");

const NumberPickerQuestionType: React.FC<NumberPickerQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  minnumber,
  maxnumber,
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
        const savedAnswer = await fetchNumberPickerAnswer(questionid, applicationid);
        updateAnswerState(savedAnswer.pickednumber, savedAnswer.answerid);
      } catch (error) {
        log.error(JSON.stringify(error));
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    const inputNumber: number = +event.target.value;
    if (
      isNaN(inputNumber) &&
      event.target.value != "+" &&
      event.target.value != "-"
    ) {
      alert(
        "Du musst eine Zahl angeben! Andere Zeichen als Nummern sind nicht erlaubt.",
      );
      return;
    } else if (event.target.value == "+" || event.target.value == "-") {
      updateAnswerState(event.target.value);
      return;
    }

    if (
      (!minnumber || minnumber <= inputNumber) &&
      (!maxnumber || maxnumber >= inputNumber)
    ) {
      updateAnswerState(event.target.value);
    } else {
      alert(
        `Deine Zahl ${inputNumber} muss zwischen ${minnumber} und ${maxnumber} liegen.`,
      );
    }
  };

  function decrementNumber() {
    if (!iseditable) {
      return;
    }
    const inputAnswer = +answer;
    if (inputAnswer > minnumber) {
      updateAnswerState((inputAnswer - 1).toString());
    }
  }

  function incrementNumber() {
    if (!iseditable) {
      return;
    }
    const inputAnswer = +answer;
    if (inputAnswer < maxnumber) {
      updateAnswerState((inputAnswer + 1).toString());
    }
  }

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
        <div className="relative flex items-center max-w-[8rem]">
          <button
            type="button"
            id="decrement-button"
            onClick={decrementNumber}
            data-input-counter-decrement="quantity-input"
            className="bg-secondary hover:secondary rounded-s-lg p-3 h-11 focus:ring-secondary focus:ring-2 focus:outline-none"
          >
            <svg
              className="w-3 h-3 text-primary"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 2"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h16"
              />
            </svg>
          </button>
          <input
            type="text"
            id={questionid}
            name={questionid}
            disabled={!iseditable}
            aria-disabled={!iseditable}
            required={mandatory}
            data-input-counter
            className="bg-secondary border-x-0 border-primary h-11 text-center text-primary text-sm focus:ring-secondary focus:border-secondary block w-full py-2.5"
            onBlur={(event) =>
              saveNumberPickerAnswer(event.target.value, questionid)
            }
            onChange={handleChange}
            min={minnumber}
            max={maxnumber}
            value={answer}
          />
          <button
            type="button"
            id="increment-button"
            onClick={incrementNumber}
            data-input-counter-increment="quantity-input"
            className="bg-secondary hover:secondary rounded-e-lg p-3 h-11 focus:ring-secondary focus:ring-2 focus:outline-none"
          >
            <svg
              className="w-3 h-3 text-primary"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 1v16M1 9h16"
              />
            </svg>
          </button>
        </div>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default NumberPickerQuestionType;
