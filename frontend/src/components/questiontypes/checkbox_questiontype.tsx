"use client";
import React, { useEffect, useState } from "react";

import {
  fetchCheckBoxAnswer,
  saveCheckBoxAnswer,
} from "@/actions/answers/checkBox";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../awaiting";

export interface CheckBoxQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
}

const CheckBoxQuestionType: React.FC<CheckBoxQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  selectedSection,
  selectedCondChoice,
  questionsuborder,
}) => {
  const dispatch = useAppDispatch();

  const answer = useAppSelector(
    (state) => state.answerReducer[questionid]?.answervalue || false,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      setIsLoading(true);
      try {
        const savedAnswer = await fetchCheckBoxAnswer(questionid);
        updateAnswerState(savedAnswer.checked, savedAnswer.answerid);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnswer();
  }, [questionid, selectedSection, selectedCondChoice]);

  const updateAnswerState = (answer: boolean, answerid?: string) => {
    dispatch(
      UpdateAnswer({
        questionid: questionid,
        answervalue: answer,
        answerid: answerid || "",
      }),
    );
  };

  const handleChange = () => {
    if (!iseditable) {
      return;
    }
    saveCheckBoxAnswer(!answer, questionid);
    updateAnswerState(!answer);
  };

  return (
    <div className="mb-4" key={questionid}>
      
        <label
          htmlFor={questionid}
          className="block font-semibold text-secondary py-3"
        >
          <h4 className="py-1 text-base">
            {questionsuborder
              ? `${questionorder}${questionsuborder})`
              : `${questionorder}. `}
            <AwaitingChild isLoading={isLoading}>
              <input
                id={questionid}
                name={questionid}
                disabled={!iseditable}
                aria-disabled={!iseditable}
                type="checkbox"
                checked={answer as boolean}
                onChange={handleChange}
                onClick={handleChange}
                className="w-5 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-secondary focus:ring-2"
              />
            </AwaitingChild>
            {mandatory && <span className="text-red-500">*</span>}
            <span
              className="break-after-avoid"
              dangerouslySetInnerHTML={{ __html: questiontext }}
            ></span>
          </h4>
          {questionnote && (
            <p className="italic text-gray-500 text-sm">{questionnote}</p>
          )}
        </label>
    </div>
  );
};

export default CheckBoxQuestionType;
