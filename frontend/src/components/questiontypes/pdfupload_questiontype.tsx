"use client";

import React, { useEffect, useState } from "react";

import Logger from "@/logger/logger";
import { UpdateAnswer } from "@/store/slices/answerSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { downloadFile, storageSaveName } from "@/utils/helpers";

import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { AwaitingChild } from "../layout/awaiting";
import { SubmitButton } from "../submitButton";
import { saveAnswerClient } from "@/actions/answers/answers";
import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { deletePdfUploadAnswer } from "@/actions/answers/deleteUpload";

export interface PDFUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  maxfilesizeinmb: number;
}

export interface PdfAnswerResponse {
  answerid: string;
  pdfname: string;
}

const log = new Logger("PDFUploadQuestionType");

export async function savePdfUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  const file = formData.get(questionid) as File;
  const uploadFile = new File([file], storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = `pdf-${questionid}`;
  if (uploadFile) {
    const { answerid, reqtype } = await saveAnswerClient(questionid);
    const supabase = getSupabaseBrowserClient();
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("pdf_upload_answer_table")
        .insert({
          answerid: answerid,
          pdfname: uploadFile.name,
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
      const { data: oldPdfData, error: oldPdfError } = await supabase
        .from("pdf_upload_answer_table")
        .select("pdfname")
        .eq("answerid", answerid)
        .single();
      if (oldPdfError) {
        log.error(JSON.stringify(oldPdfError));
      }
      const { error: updatedImageError } = await supabase
        .from("pdf_upload_answer_table")
        .update({ pdfname: uploadFile.name })
        .eq("answerid", answerid);
      if (updatedImageError) {
        log.error(JSON.stringify(updatedImageError));
      }
      const { error: updatedBucketError } = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${oldPdfData?.pdfname}`,
          uploadFile,
        );
      if (updatedBucketError) {
        log.error(JSON.stringify(updatedBucketError));
      }
    }
  }
}

export async function fetchPdfUploadAnswer(questionid: string) {
  const supabase = getSupabaseBrowserClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    log.error(JSON.stringify(userError));
  }
  const user_id = userData.user!.id;

  const { data: pdfUploadData, error: pdfUploadError } = await supabase
    .rpc("fetch_pdf_upload_answer_table", {
      question_id: questionid,
      user_id: user_id,
    })
    .single<PdfAnswerResponse>();
  if (pdfUploadError) {
    if (pdfUploadError.code == "PGRST116") {
      return null;
    }
    log.error(JSON.stringify(pdfUploadError));
    return null;
  }
  return { ...pdfUploadData, userid: user_id };
}

const PDFUploadQuestionType: React.FC<PDFUploadQuestionTypeProps> = ({
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

  const validImgTypes = ["application/pdf"];

  useEffect(() => {
    async function loadAnswer() {
      setIsLoading(true);
      const fileInput = document.getElementById(questionid) as HTMLInputElement;
      if (fileInput && fileInput.value == "") {
        setTempAnswer("");
      }

      try {
        const savedAnswer = await fetchPdfUploadAnswer(questionid);
        if (savedAnswer?.pdfname != "") {
          const imageUploadBucketData = await downloadFile(
            `pdf-${questionid}`,
            `${savedAnswer!.userid}_${savedAnswer!.pdfname}`,
          );
          console.log(imageUploadBucketData);
          const url = URL.createObjectURL(imageUploadBucketData!);
          console.log(url);
          updateAnswerState(url || "");
          setWasUploaded(true);
        } else {
          updateAnswerState("");
          console.log("no pdf found");
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

  function set_pdf_for_upload(file: File) {
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
      alert(`Die PDF Datei darf maximal ${maxfilesizeinmb} MB groß sein!`);
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
      set_pdf_for_upload(file);
    }
  };

  const handleDeleteOnClick = () => {
    if (!iseditable) {
      return;
    }
    deletePdfUploadAnswer(questionid);
    setTempAnswer("");
    updateAnswerState("");
    setWasUploaded(false);
    setUploadedFile(null);

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
      await savePdfUploadAnswer(questionid, formData);
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
      set_pdf_for_upload(file);
    }
  };

  return (
    <QuestionTypes
      phasename={phasename}
      iseditable={iseditable}
      questionid={questionid}
      mandatory={mandatory}
      questiontext={questiontext}
      questionnote={questionnote}
      questionorder={questionorder}
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
                  <div className="mb-2 text-sm text-secondary text-center">
                    <p className="font-semibold">Zum Uploaden klicken</p>
                    <p>oder per Drag and Drop</p>
                  </div>
                  <p className="text-xs text-secondary">
                    PDF (MAX. {maxfilesizeinmb}MB)
                  </p>
                </div>
                <input
                  type="file"
                  id={questionid}
                  name={questionid}
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
                className="self-end text-red-600 mb-1"
                onClick={handleDeleteOnClick}
              >
                Löschen
              </button>
            )}
            <iframe
              src={tempAnswer || answer || undefined}
              width="100%"
              height="600px max-w-xs max-h-96 self-center"
              style={{ border: "none" }}
            />
            {!wasUploaded ? (
              <>
                <div className="italic">
                  Hinweis: Der Upload der ausgewählten PDF muss noch bestätigt
                  werden!
                </div>
                <SubmitButton text={"PDF hochladen"} expanded={false} />
              </>
            ) : (
              <div className="text-green-600">
                Der Upload der PDF war erfolgreich!
              </div>
            )}
          </div>
        </AwaitingChild>
      </form>
    </QuestionTypes>
  );
};

export default PDFUploadQuestionType;
