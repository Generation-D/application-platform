"use client";

import React, { useEffect, useState } from "react";

import { ExtendedAnswerType, deleteAnswersOfQuestions } from "@/actions/answers/answers";
import {
  fetchConditionalAnswer,
  saveConditionalAnswer,
} from "@/actions/answers/conditional";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { numberToLetter } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { ConditionalChoice } from "./utils/conditional_choice";
import getQuestionComponent from "./utils/questiontype_selector";
import { AwaitingChild } from "../awaiting";
import { InformationBox } from "../informationBox";
import Popup from "../popup";
import { Question } from "../questions";
import { SubmitButton } from "../submitButton";

export interface conditionalChoicesProps {
  choiceid: string;
  choicevalue: string;
  questions: Question[];
}

export interface ConditionalQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  choices: conditionalChoicesProps[];
  phaseAnswers: ExtendedAnswerType[];
}

const ConditionalQuestionType: React.FC<ConditionalQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  selectedSection,
  selectedCondChoice,
  choices,
  phaseAnswers,
  questionsuborder,
}) => {
  const dispatch = useAppDispatch();

  const answer = useAppSelector<string>(
    (state) => (state.answerReducer[questionid]?.answervalue as string) || "",
  );
  const [choiceHelper, setChoiceHelper] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const dependingQuestions: { [key: string]: Question[] } = choices.reduce(
    (acc, curr) => {
      acc[curr.choiceid] = curr.questions;
      return acc;
    },
    {} as { [key: string]: Question[] },
  );
  useEffect(() => {
    async function loadAnswer() {
      setIsLoading(true);
      try {
        const savedAnswer = await fetchConditionalAnswer(questionid);
        updateAnswerState(savedAnswer.selectedchoice, savedAnswer.answerid);
      } catch (error) {
        console.log("Failed to fetch answer", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnswer();
  }, [questionid, selectedSection, selectedCondChoice, phaseAnswers]);

  const updateAnswerState = (answervalue: string, answerid?: string) => {
    dispatch(
      UpdateAnswer({
        questionid: questionid,
        answervalue: answervalue,
        answerid: answerid || "",
      }),
    );
  };

  const handleChange = (choice: conditionalChoicesProps) => {
    if (!iseditable) {
      return;
    }
    if (answer === "") {
      saveConditionalAnswer(choice.choiceid, questionid);
      updateAnswerState(choice.choiceid);
      return;
    }

    if (
      dependingQuestions[choice.choiceid].length == 0 &&
      answer === choice.choiceid
    ) {
      saveConditionalAnswer("", questionid);
      updateAnswerState("");
      return;
    }
    if (dependingQuestions[answer].length == 0) {
      saveConditionalAnswer(choice.choiceid, questionid);
      updateAnswerState(choice.choiceid);
      return;
    }
    if (answer === choice.choiceid) {
      setChoiceHelper("");
      setMessage(
        `Es sind ${
          dependingQuestions[choice.choiceid].length
        } Unterfragen von dieser Auswahl abhängig. Mit dem Abwählen dieser Option werden deine Antworten auf diese Unterfrage(-n) gelöscht. Trotzdem fortfahren?`,
      );
      setPopupOpen(true);
      return;
    }
    setChoiceHelper(choice.choiceid);

    setMessage(
      `Es sind ${dependingQuestions[answer].length} Unterfragen sind von dieser Auswahl abhängig. Mit dem Auswählen einer anderen Option werden deine Antworten auf diese Unterfrage(-n) gelöscht. Trotzdem fortfahren?`,
    );
    setPopupOpen(true);
  };

  const togglePopup = async () => {
    setPopupOpen(!isPopupOpen);
    await deleteAnswersOfQuestions(dependingQuestions[answer]);
    saveConditionalAnswer(choiceHelper, questionid);
    updateAnswerState(choiceHelper);
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
      {isPopupOpen && (
        <Popup onClose={() => setPopupOpen(!isPopupOpen)}>
          <form onSubmit={togglePopup} className="space-y-6">
            <h2>Vorsicht</h2>
            <div>{message}</div>
            <SubmitButton text="Bestätigen" expanded={false} />
          </form>
        </Popup>
      )}
      <AwaitingChild isLoading={isLoading}>
        <div role="group" aria-labelledby={questionid} className="mt-2">
          {choices.map((choice) => (
            <ConditionalChoice
              key={choice.choiceid}
              iseditable={iseditable}
              choiceid={choice.choiceid}
              choicevalue={choice.choicevalue}
              isSelected={answer === choice.choiceid}
              onChange={() => handleChange(choice)}
            />
          ))}
        </div>
      </AwaitingChild>
      <div className="mt-5">
        {choices.map((choice) =>
          [...choice.questions]
            .sort((a, b) => a.questionorder - b.questionorder)
            .map((condQuestion) => {
              const QuestionComponent = getQuestionComponent(
                condQuestion.questiontype,
              );
              if (!QuestionComponent) {
                console.log(
                  `Unknown question type: ${condQuestion.questiontype}`,
                );
                return null;
              }
              const sub_order = numberToLetter(condQuestion.questionorder);
              return (
                <div
                  key={condQuestion.questionid}
                  className={`ml-8 ${
                    condQuestion.depends_on == choice.choiceid &&
                    choice.choiceid == answer
                      ? "visible"
                      : "hidden"
                  }`}
                >
                  {condQuestion.preinformationbox && (
                    <InformationBox
                      key={`${condQuestion.questionid}_pre_infobox`}
                      text={condQuestion.preinformationbox}
                    />
                  )}
                  <QuestionComponent
                    key={condQuestion.questionid}
                    phasename={phasename}
                    questionid={condQuestion.questionid}
                    mandatory={condQuestion.mandatory}
                    questiontext={condQuestion.questiontext}
                    questionnote={condQuestion.questionnote}
                    questionorder={questionorder}
                    iseditable={iseditable}
                    selectedSection={selectedSection}
                    answer={answer}
                    questionsuborder={sub_order}
                    answerid={
                      phaseAnswers.find(
                        (answer) =>
                          answer.questionid == condQuestion.questionid,
                      )?.answerid
                    }
                    {...condQuestion.params}
                  />
                  {condQuestion.postinformationbox && (
                    <InformationBox
                      key={`${condQuestion.questionid}_post_infobox`}
                      text={condQuestion.postinformationbox}
                    />
                  )}
                </div>
              );
            }),
        )}
      </div>
    </QuestionTypes>
  );
};

export default ConditionalQuestionType;
