"use client";
import React, { useEffect, useState } from "react";

import {
  fetchDropdownAnswer,
  saveDropdownAnswer,
} from "@/actions/answers/dropdown";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { DropdownOption, DropdownOptionProps } from "./utils/dropdown_option";
import { AwaitingChild } from "../awaiting";

export interface DropdownQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  options: DropdownOptionProps[];
  minanswers: number;
  maxanswers: number;
  userinput: boolean;
}

const DropdownQuestionType: React.FC<DropdownQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  minanswers,
  maxanswers,
  userinput,
  options,
  selectedSection,
  selectedCondChoice,
  questionsuborder,
}) => {
  const dispatch = useAppDispatch();

  const singleAnswer = useAppSelector<string>(
    (state) => state.answerReducer[`${questionid}_single`]?.answervalue as string || "",
  );
  const multiAnswer = useAppSelector<string[]>(
    (state) => state.answerReducer[`${questionid}_multi`]?.answervalue as string[] || [],
  );
  const [isLoading, setIsLoading] = useState(true);
  console.log("Render Dropdown"); // Keep to ensure it's rerendered

  useEffect(() => {
    async function loadAnswer() {
      setIsLoading(true);
      try {
        const savedAnswer = await fetchDropdownAnswer(questionid);
        updateAnswerState(savedAnswer.selectedoptions, savedAnswer.answerid)
        if (maxanswers == 1) {
          updateAnswerState(savedAnswer.selectedoptions, savedAnswer.answerid);
        } else {
          updateAnswerState(savedAnswer.selectedoptions.split(",") || [], savedAnswer.answerid)
        }
      } catch (error) {
        console.error("Failed to fetch singleAnswer", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnswer();
  }, [questionid, maxanswers, selectedSection, selectedCondChoice]);

  const updateAnswerState = (answervalue: string | string[], answerid?: string) => {
    dispatch(
      UpdateAnswer({
        questionid: maxanswers == 1 ? `${questionid}_single` : `${questionid}_multi`,
        answervalue: answervalue,
        answerid: answerid || "",
      }),
    );
  };

  const handleSingleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!iseditable) {
      return;
    }
    const selectedOption =
      event.target.options[event.target.selectedIndex].text;
    saveDropdownAnswer(selectedOption, questionid);
    updateAnswerState(event.target.value);
  };

  const handleMultiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!iseditable) {
      return;
    }
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    ).filter((value) => value !== "empty");
    if (
      (!mandatory || (selectedOptions.length >= minanswers && mandatory)) &&
      selectedOptions.length <= maxanswers
    ) {
      saveDropdownAnswer(selectedOptions.toString(), questionid);
      updateAnswerState(selectedOptions);
    } else {
      updateAnswerState(selectedOptions);
      alert(
        "Du musst mindestens " +
          minanswers +
          " und kannst maximal " +
          maxanswers +
          " Antworten auswählen!",
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
        {maxanswers == 1 ? (
          <select
            id={questionid}
            name={questionid}
            required={mandatory}
            disabled={!iseditable}
            aria-disabled={!iseditable}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleSingleChange}
            value={singleAnswer}
          >
            {singleAnswer === "" && (
              <option
                key="invalid"
                value=""
                disabled
                aria-disabled={true}
                hidden
              >
                Bitte wähle eine Option
              </option>
            )}
            {!mandatory && <option key="empty" value="empty"></option>}
            {options.map((option) => (
              <DropdownOption
                key={option.optionid}
                optionid={option.optionid}
                optiontext={option.optiontext}
                iseditable={iseditable}
              />
            ))}
          </select>
        ) : (
          <>
            <span className="italic text-gray-500 text-sm">
              Um mehrere Optionen auszuwählen, bitte halte unter Windows die
              `&quot;`Alt`&quot;` und unter Mac die `&quot;`CMD`&quot;` Taste
              gedrückt.
            </span>
            <select
              multiple
              size={maxanswers}
              id={questionid}
              name={questionid}
              required={mandatory}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={handleMultiChange}
              value={multiAnswer}
            >
              {!mandatory && <option key="empty" value="empty"></option>}
              {options.map((option) => (
                <DropdownOption
                  key={option.optionid}
                  optionid={option.optionid}
                  optiontext={option.optiontext}
                  iseditable={iseditable}
                />
              ))}
            </select>
          </>
        )}
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default DropdownQuestionType;
