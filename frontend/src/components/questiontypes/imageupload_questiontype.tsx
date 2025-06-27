"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import {
  deleteImageUploadAnswer,
} from "@/actions/answers/imageUpload";
import Logger from "@/logger/logger";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { downloadFile, storageSaveName } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../layout/awaiting";
import { SubmitButton } from "../submitButton";
import { saveAnswerClient } from "@/actions/answers/answers";
import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";

export interface ImageUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  maxfilesizeinmb: number;
}

export interface ImageAnswerResponse {
  answerid: string;
  imagename: string;
}

const log = new Logger("ImageUploadQuestionType");

export async function saveImageUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  const file = formData.get(questionid) as File;
  const uploadFile = new File([file], storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = `image-${questionid}`;
  if (uploadFile) {
    const { answerid, reqtype } = await saveAnswerClient(questionid);
    const supabase = getSupabaseBrowserClient();
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("image_upload_answer_table")
        .insert({
          answerid: answerid,
          imagename: uploadFile.name,
        });
      if (insertAnswerError) {
        log.error(JSON.stringify(insertAnswerError));
      }
      const { error: bucketError } = await supabase.storage
        .from(bucket_name)
        .upload(
          `${(await supabase.auth.getUser()).data.user!.id}_${uploadFile.name}`,
          uploadFile,
        );
      if (bucketError) {
        log.error(JSON.stringify(bucketError));
      }
    } else if (reqtype == "updated") {
      const { data: oldImageData, error: oldImageError } = await supabase
        .from("image_upload_answer_table")
        .select("imagename")
        .eq("answerid", answerid)
        .single();
      if (oldImageError) {
        log.error(JSON.stringify(oldImageError));
      }
      const { error: updatedImageError } = await supabase
        .from("image_upload_answer_table")
        .update({ imagename: uploadFile.name })
        .eq("answerid", answerid);
      if (updatedImageError) {
        log.error(JSON.stringify(updatedImageError));
      }
      const { error: updatedBucketError } = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${oldImageData?.imagename}`,
          uploadFile,
        );
      if (updatedBucketError) {
        log.error(JSON.stringify(updatedBucketError));
      }
    }
  }
}

export async function fetchImageUploadAnswer(questionid: string) {
  const supabase = getSupabaseBrowserClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    log.error(JSON.stringify(userError));
  }
  const user_id = userData.user!.id;

  const { data: imageUploadData, error: imageUploadError } = await supabase
    .rpc("fetch_image_upload_answer_table", {
      question_id: questionid,
      user_id: user_id,
    })
    .single<ImageAnswerResponse>();

  if (imageUploadError) {
    if (imageUploadError.code == "PGRST116") {
      return null;
    }
    log.error(JSON.stringify(imageUploadError));
    return null;
  }
  return { ...imageUploadData, userid: user_id };
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
  const dispatch = useAppDispatch();

  const answer = useAppSelector<string>(
    (state) => (state.answerReducer[questionid]?.answervalue as string) || "",
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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
      set_image_for_upload(file);
    }
  };

  const handleDeleteOnClick = () => {
    if (!iseditable) {
      return;
    }
    deleteImageUploadAnswer(questionid);
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
      await saveImageUploadAnswer(questionid, formData);
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
                  Hinweis: Der Upload des ausgewählten Bildes muss noch
                  bestätigt werden!
                </div>
                <SubmitButton text={"Bild hochladen"} expanded={false} />
              </>
            ) : (
              <div className="text-green-600">
                Der Upload des Bildes war erfolgreich!
              </div>
            )}
          </div>
        </AwaitingChild>
      </form>
    </QuestionTypes>
  );
};

export default ImageUploadQuestionType;
