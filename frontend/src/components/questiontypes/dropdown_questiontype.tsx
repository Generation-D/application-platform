"use client";
import React, { useCallback, useEffect, useState } from "react";

import {
  fetchDropdownAnswer,
  saveDropdownAnswer,
} from "@/actions/answers/dropdown";
import { createLogger } from "@/logger/logger";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { DropdownOption, DropdownOptionProps } from "./utils/dropdown_option";
import { AwaitingChild } from "../layout/awaiting";

const log = createLogger("components/questiontypes/dropdown_questiontype");

export interface DropdownQuestionTypeExtraProps {
  answerid: string | null;
  options: DropdownOptionProps[];
  minanswers: number;
  maxanswers: number;
  userinput: boolean;
}

export type DropdownQuestionTypeProps = DropdownQuestionTypeExtraProps & DefaultQuestionTypeProps;

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
  options,
  selectedSection,
  selectedCondChoice,
  questionsuborder,
  applicationid,
}) => {
  const dispatch = useAppDispatch();

  const answer = useAppSelector<string>(
    (state) => (state.answerReducer[questionid]?.answervalue as string) || "",
  );
  const [isLoading, setIsLoading] = useState(true);

  const updateAnswerState = useCallback((answervalue: string, answerid?: string) => {
    dispatch(
      UpdateAnswer({
        questionid: questionid,
        answervalue: answervalue,
        answerid: answerid || "",
      }),
    );
  }, [dispatch, questionid]);

  useEffect(() => {
    async function loadAnswer() {
      setIsLoading(true);
      try {
        const savedAnswer = await fetchDropdownAnswer(
          questionid,
          applicationid,
        );
        updateAnswerState(savedAnswer.selectedoptions, savedAnswer.answerid);
      } catch (error) {
        log.error(JSON.stringify(error));
      } finally {
        setIsLoading(false);
      }
    }
    loadAnswer();
  }, [questionid, maxanswers, selectedSection, selectedCondChoice, applicationid, updateAnswerState]);

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
      saveDropdownAnswer(selectedOptions.join(", "), questionid);
      updateAnswerState(selectedOptions.join(", "));
    } else {
      updateAnswerState(selectedOptions.join(", "));
      alert(
        `Du musst mindestens ${minanswers} und kannst maximal ${maxanswers} Antworten auswählen!`,
      );
    }
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
        {maxanswers == 1 ? (
          <select
            id={questionid}
            name={questionid}
            required={mandatory}
            disabled={!iseditable}
            aria-disabled={!iseditable}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleSingleChange}
            value={answer}
          >
            {answer === "" && (
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
              value={answer.split(", ")}
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
