"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import {
  deleteImageUploadAnswer,
  fetchImageUploadAnswer,
  saveImageUploadAnswer,
} from "@/actions/answers/imageUpload";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { downloadFile } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../awaiting";
import { SubmitButton } from "../submitButton";

export interface ImageUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  maxfilesizeinmb: number;
}

const ImageUploadQuestionType: React.FC<ImageUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  iseditable,
  maxfilesizeinmb,
  selectedSection,
  selectedCondChoice,
  questionsuborder,
}) => {
  const saveImageUploadAnswerWithId = saveImageUploadAnswer.bind(
    null,
    questionid,
  );
  const dispatch = useAppDispatch();

  const answer = useAppSelector<string>(
    (state) => (state.answerReducer[questionid]?.answervalue as string) || "",
  );
  const [tempAnswer, setTempAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [wasUploaded, setWasUploaded] = useState(false);

  const validImgTypes = ["image/png", "image/jpeg"];
  useEffect(() => {
    async function loadAnswer() {
      setIsLoading(true);
      const fileInput = document.getElementById(questionid) as HTMLInputElement;
      if (fileInput && fileInput.value == "") {
        setTempAnswer("");
      }
      try {
        const savedAnswer = await fetchImageUploadAnswer(questionid);
        if (savedAnswer?.imagename != "") {
          const imageUploadBucketData = await downloadFile(
            `image-${questionid}`,
            `${savedAnswer!.userid}_${savedAnswer!.imagename}`,
          );
          const url = URL.createObjectURL(imageUploadBucketData!);
          updateAnswerState(url || "");
          setWasUploaded(true);
        } else {
          updateAnswerState("");
        }
        setTempAnswer("");
      } catch (error) {
        console.error("Failed to fetch answer", error);
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

  function set_image_for_upload(file: File) {
    if (!iseditable) {
      return;
    }
    const fileSizeInMB = file.size / 1024 / 1024;
    if (!validImgTypes.includes(file.type)) {
      alert(
        `Es sind nur die folgenden Dateitypen erlaubt: ${validImgTypes.join(
          ", ",
        )}!`,
      );
      return;
    }
    if (fileSizeInMB > maxfilesizeinmb) {
      alert(`Die Bilddatei darf maximal ${maxfilesizeinmb} MB groß sein!`);
      return;
    }
    setTempAnswer(URL.createObjectURL(file));
    setWasUploaded(false);
  }
  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    if (event.target.files) {
      const file = event.target.files[0];
      set_image_for_upload(file);
    }
  };

  const handleDeleteOnClick = () => {
    if (!iseditable) {
      return;
    }
    deleteImageUploadAnswer(questionid);
    setTempAnswer("");
    updateAnswerState("");
    setWasUploaded(false);
    const fileInput = document.getElementById(questionid) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = () => {
    if (!iseditable) {
      return;
    }
    updateAnswerState(tempAnswer);
    setTempAnswer("");
    setWasUploaded(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    if (!iseditable) {
      return;
    }
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    if (!iseditable) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      set_image_for_upload(file);
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
      <form action={saveImageUploadAnswerWithId} onSubmit={handleSubmit}>
        <div className={`mt-1 ${(tempAnswer || answer) && "hidden"}`}>
          <AwaitingChild isLoading={isLoading}>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor={questionid}
                className="flex flex-col items-center justify-center w-full h-34 border-2 border-secondary border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-secondary"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-secondary text-center">
                    <p className="font-semibold">Zum Uploaden klicken</p> oder
                    per Drag and Drop
                  </p>
                  <p className="text-xs text-secondary">
                    PNG, JPG oder JPEG (MAX. {maxfilesizeinmb}MB)
                  </p>
                </div>
                <input
                  type="file"
                  disabled={!iseditable}
                  aria-disabled={!iseditable}
                  id={questionid}
                  name={questionid}
                  accept={validImgTypes.join(", ")}
                  required={mandatory}
                  className="hidden"
                  onChange={(event) => handleUploadChange(event)}
                />
              </label>
            </div>
          </AwaitingChild>
        </div>
        <div
          className={`mt-4 flex flex-col gap-y-2 max-w-xs max-h-96 ${
            !(tempAnswer || answer) && "hidden"
          }`}
        >
          {iseditable && (
            <button
              type="button"
              className="self-end text-red-600"
              onClick={handleDeleteOnClick}
            >
              Löschen
            </button>
          )}
          <Image
            alt="Preview"
            src={tempAnswer || answer}
            className="self-center max-w-xs max-h-96"
            id="imagePreview"
            width={100}
            height={100}
          />
          {!wasUploaded ? (
            <>
              <div className="italic">
                Hinweis: Der Upload des ausgewählten Bildes muss noch bestätigt
                werden!
              </div>
              <SubmitButton text={"Bild hochladen"} expanded={false} />
            </>
          ) : (
            <div className="text-green-600">
              Der Upload des Bildes war erfolgreich!
            </div>
          )}
        </div>
      </form>
    </QuestionTypes>
  );
};

export default ImageUploadQuestionType;
