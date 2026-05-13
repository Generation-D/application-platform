"use client";

import React, { useEffect, useState } from "react";

import {
  fetchMultipleChoiceAnswer,
  saveMultipleChoiceAnswer,
} from "@/actions/answers/multipleChoice";
import Logger from "@/logger/logger";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { Choice, ChoiceProps } from "./utils/multiplechoice_choice";
import { AwaitingChild } from "../layout/awaiting";

export interface MultipleChoiceQuestionTypeProps
  extends DefaultQuestionTypeProps {
  answerid: string | null;
  choices: ChoiceProps[];
  minanswers: number;
  maxanswers: number;
  userinput: boolean;
}

const log = new Logger("MultipleChoiceQuestionType");

const MultipleChoiceQuestionType: React.FC<MultipleChoiceQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  choices,
  minanswers,
  maxanswers,
  userinput,
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
        const savedAnswer = await fetchMultipleChoiceAnswer(questionid, applicationid);
        updateAnswerState(savedAnswer.selectedchoice, savedAnswer.answerid);
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

  const handleSingleChange = async (choice: ChoiceProps) => {
    if (!iseditable) {
      return;
    }
    if (answer === choice.choiceid) {
      await saveMultipleChoiceAnswer("", questionid);
      updateAnswerState("");
    } else {
      await saveMultipleChoiceAnswer(choice.choiceid, questionid);
      updateAnswerState(choice.choiceid);
    }
  };

  const handleMultiChange = async (choice: ChoiceProps) => {
    if (!iseditable) {
      return;
    }
    const selectedChoices = answer.split(", ");
    if (!selectedChoices.includes(choice.choiceid)) {
      if (selectedChoices.length + 1 > maxanswers) {
        updateAnswerState(
          selectedChoices
            .filter((selected) => selected !== choice.choiceid)
            .join(", "),
        );
        alert(`Du kannst maximal ${maxanswers} auswählen!`);
        return;
      } /*else if (selectedChoices.length > 0 && selectedChoices.length - 1 < minanswers && mandatory) {
        setSelectedChoices(
          selectedChoices.filter((selected) => selected !== choice.choiceid),
        );
        alert(`Du musst mindestens {minanswers} auswählen!`);
        return;
      }*/
    }
    let newChoices;
    if (selectedChoices.includes(choice.choiceid)) {
      newChoices = selectedChoices.filter(
        (selected) => selected !== choice.choiceid,
      );
    } else {
      newChoices = [...selectedChoices, choice.choiceid].filter(
        (choice) => choice,
      );
    }
    await saveMultipleChoiceAnswer(newChoices.join(", "), questionid);
    updateAnswerState(newChoices.join(", "));
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
        <div role="group" aria-labelledby={questionid} className="mt-2">
          {choices.map((choice) => (
            <Choice
              key={choice.choiceid}
              iseditable={iseditable}
              choiceid={choice.choiceid}
              choicetext={choice.choicetext}
              isSelected={
                maxanswers == 1
                  ? answer === choice.choiceid
                  : answer.split(", ").includes(choice.choiceid)
              }
              minanswers={minanswers}
              maxanswers={maxanswers}
              onSingleChange={() => handleSingleChange(choice)}
              onMultiChange={() => handleMultiChange(choice)}
            />
          ))}
        </div>
      </AwaitingChild>
    </QuestionTypes>
  );
};

export default MultipleChoiceQuestionType;
