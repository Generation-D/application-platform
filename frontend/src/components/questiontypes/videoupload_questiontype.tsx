"use client";

import React, { useEffect, useState } from "react";

import Logger from "@/logger/logger";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { downloadFile, storageSaveName } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../layout/awaiting";
import { SubmitButton } from "../submitButton";
import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { saveAnswerClient } from "@/actions/answers/answers";

export interface VideoAnswerResponse {
  answerid: string;
  videoname: string;
}

export interface VideoUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  maxfilesizeinmb: number;
}

export async function fetchVideoUploadAnswer(questionid: string) {
  const supabase = getSupabaseBrowserClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    log.error(JSON.stringify(userError));
  }
  const user_id = userData.user!.id;

  const { data: videoUploadData, error: videoUploadError } = await supabase
    .rpc("fetch_video_upload_answer_table", {
      question_id: questionid,
      user_id: user_id,
    })
    .single<VideoAnswerResponse>();

  if (videoUploadError) {
    if (videoUploadError.code == "PGRST116") {
      return null;
    }
    log.error(JSON.stringify(videoUploadError));
    return null;
  }
  return { ...videoUploadData, userid: user_id };
}

export async function saveVideoUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  const file = formData.get(questionid) as File;
  const uploadFile = new File([file], storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = `video-${questionid}`;
  if (uploadFile) {
    const { answerid, reqtype } = await saveAnswerClient(questionid);
    const supabase = getSupabaseBrowserClient();
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("video_upload_answer_table")
        .insert({
          answerid: answerid,
          videoname: uploadFile.name,
        });
      if (insertAnswerError) {
        log.error("insertAnswerError " + JSON.stringify(insertAnswerError));
      }
      const { error: bucketError } = await supabase.storage
        .from(bucket_name)
        .upload(
          `${(await supabase.auth.getUser()).data.user!.id}_${uploadFile.name}`,
          uploadFile,
        );
      if (bucketError) {
        log.error("bucketError: " + JSON.stringify(bucketError));
      }
    } else if (reqtype == "updated") {
      const { data: oldVideoData, error: oldVideoError } = await supabase
        .from("video_upload_answer_table")
        .select("videoname")
        .eq("answerid", answerid)
        .single();
      if (oldVideoError) {
        log.error("oldVideoError " + JSON.stringify(oldVideoError));
      }
      const { error: updatedVideoError } = await supabase
        .from("video_upload_answer_table")
        .update({ videoname: uploadFile.name })
        .eq("answerid", answerid);
      if (updatedVideoError) {
        log.error("updatedVideoError " + JSON.stringify(updatedVideoError));
      }
      const { error: updatedBucketError } = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${oldVideoData?.videoname}`,
          uploadFile,
        );
      if (updatedBucketError) {
        log.error("updatedBucketError " + JSON.stringify(updatedBucketError));
      }
    }
  }
}

const log = new Logger("VideoUploadQuestionType");

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
        if (savedAnswer?.videoname != "") {
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
                    <p className="font-semibold">Zum Uploaden klicken</p> oder
                    per Drag and Drop
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
