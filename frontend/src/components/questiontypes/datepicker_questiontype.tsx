"use client";
import React, { useEffect, useState } from "react";

import {
  fetchDatePickerAnswer,
  saveDatePickerAnswer,
} from "@/actions/answers/datePicker";
import Logger from "@/logger/logger";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../layout/awaiting";

const log = new Logger("DatePickerQuestionType");

export interface DatePickerQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  mindate: Date | null;
  maxdate: Date | null;
}

const DatePickerQuestionType: React.FC<DatePickerQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  mindate,
  maxdate,
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
        const savedAnswer = await fetchDatePickerAnswer(questionid);
        updateAnswerState(savedAnswer.pickeddate, savedAnswer.answerid);
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
    updateAnswerState(event.target.value);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    if (event.target.value == "") {
      updateAnswerState("");
      saveDatePickerAnswer("", questionid);
      return;
    }
    const selectedDate = new Date(event.target.value);
    const minDate = mindate ? new Date(mindate) : null;
    const maxDate = maxdate ? new Date(maxdate) : null;
    if (
      (minDate === null || selectedDate >= minDate) &&
      (maxDate === null || selectedDate <= maxDate)
    ) {
      saveDatePickerAnswer(event.target.value, questionid);
    } else {
      updateAnswerState("");
      saveDatePickerAnswer("", questionid);
      alert(
        `Dein ausgewähltes Datum ${selectedDate.toDateString()} liegt nicht zwischen ${mindate} und ${maxdate}`,
      );
    }
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
        <div className="mt-1">
          <input
            type="date"
            disabled={!iseditable}
            aria-disabled={!iseditable}
            id={questionid}
            name={questionid}
            required={mandatory}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            onBlur={(e) => handleBlur(e)}
            onChange={handleChange}
            value={answer}
          />
        </div>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default DatePickerQuestionType;
