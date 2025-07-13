"use client";

import React, { useEffect, useState } from "react";

import Logger from "@/logger/logger";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { downloadFile, storageSaveName } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../layout/awaiting";
import { SubmitButton } from "../submitButton";
import { fetchUploadAnswer, saveUploadAnswer } from "@/utils/uploadHelpers";
import { deleteVideoUploadAnswer } from "@/actions/answers/deleteUpload";

const log = new Logger("VideoUploadQuestionType");

export interface VideoAnswerResponse {
  answerid: string;
  videoname: string;
}

export interface VideoUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  maxfilesizeinmb: number;
}

export async function saveVideoUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  return saveUploadAnswer(questionid, formData, {
    table: "video_upload_answer_table",
    fileName: "videoname",
    bucketPrefix: "video",
    validTypes: ["video/mp4"],
    maxfilesizeinmb: 100, // or pass as prop if needed
    storageSaveName,
  });
}

export async function fetchVideoUploadAnswer(questionid: string) {
  return fetchUploadAnswer<VideoAnswerResponse>(questionid, {
    rpcName: "fetch_video_upload_answer_table",
    fileName: "videoname",
  });
}

const VideoUploadQuestionType: React.FC<VideoUploadQuestionTypeProps> = ({
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
  const dispatch = useAppDispatch();

  const answer = useAppSelector<string>(
    (state) => (state.answerReducer[questionid]?.answervalue as string) || "",
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [tempAnswer, setTempAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [wasUploaded, setWasUploaded] = useState(false);

  const validImgTypes = ["video/mp4"];

  useEffect(() => {
    async function loadAnswer() {
      setIsLoading(true);
      const fileInput = document.getElementById(questionid) as HTMLInputElement;
      if (fileInput && fileInput.value == "") {
        setTempAnswer("");
      }
      try {
        const savedAnswer = await fetchVideoUploadAnswer(questionid);
        if (savedAnswer && savedAnswer?.videoname != "") {
          const VideoUploadBucketData = await downloadFile(
            `video-${questionid}`,
            `${savedAnswer!.userid}_${savedAnswer!.videoname}`,
          );
          const url = URL.createObjectURL(VideoUploadBucketData!);
          updateAnswerState(url || "");
          setWasUploaded(true);
        } else {
          updateAnswerState("");
        }
        setTempAnswer("");
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

  function set_video_for_upload(file: File) {
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
      alert(`Die Videodatei darf maximal ${maxfilesizeinmb} MB groß sein!`);
      return;
    }
    setUploadedFile(file);
    setTempAnswer(URL.createObjectURL(file));
    setWasUploaded(false);
  }

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!iseditable) {
      return;
    }
    if (event.target.files) {
      const file = event.target.files[0];
      set_video_for_upload(file);
    }
  };

  const handleDeleteOnClick = () => {
    if (!iseditable) {
      return;
    }
    deleteVideoUploadAnswer(questionid);
    setTempAnswer("");
    setUploadedFile(null);
    updateAnswerState("");
    setWasUploaded(false);
    const fileInput = document.getElementById(questionid) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!iseditable) {
      return;
    }
    const formData = new FormData();
    formData.append(questionid, uploadedFile!);
    setIsLoading(true);
    try {
      await saveVideoUploadAnswer(questionid, formData);
      // Handle success (e.g., showing a success message, resetting states)
    } catch (error) {
      log.error(JSON.stringify(error));
    }
    updateAnswerState(tempAnswer);
    setTempAnswer("");
    setUploadedFile(null);
    setWasUploaded(true);
    setIsLoading(false);
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
      set_video_for_upload(file);
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
      <form onSubmit={handleSubmit}>
        <AwaitingChild isLoading={isLoading}>
          <div className={`mt-1 ${(tempAnswer || answer) && "hidden"}`}>
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
                    <span className="font-semibold">Zum Uploaden klicken</span>{" "}
                    oder per Drag and Drop
                  </p>
                  <p className="text-xs text-secondary">
                    MP4 (MAX. {maxfilesizeinmb}MB)
                  </p>
                </div>
                <input
                  type="file"
                  name={questionid}
                  id={questionid}
                  disabled={!iseditable}
                  aria-disabled={!iseditable}
                  accept={validImgTypes.join(", ")}
                  required={mandatory && uploadedFile == null}
                  className="hidden"
                  onChange={(event) => handleUploadChange(event)}
                />
              </label>
            </div>
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
            {(tempAnswer || answer) && (
              <video
                width="100%"
                height="100%"
                style={{ border: "none" }}
                controls
                className="max-w-xs max-h-96"
              >
                <source src={tempAnswer || answer} type="video/mp4" />
                Dein Browser supported diese Darstellung leider nicht
              </video>
            )}
            {!wasUploaded ? (
              <>
                <div className="italic">
                  Hinweis: Der Upload des ausgewählten Videos muss noch
                  bestätigt werden!
                </div>
                <SubmitButton text={"Video hochladen"} expanded={false} />
              </>
            ) : (
              <div className="text-green-600">
                Der Upload des Videos war erfolgreich!
              </div>
            )}
          </div>
        </AwaitingChild>
      </form>
    </QuestionTypes>
  );
};

export default VideoUploadQuestionType;
