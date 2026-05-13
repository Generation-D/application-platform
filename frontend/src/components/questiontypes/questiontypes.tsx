import React from "react";

export interface DefaultQuestionTypeProps {
  phasename: string;
  questionid: string;
  mandatory: boolean;
  questiontext: string;
  questionnote: string;
  questionorder: number;
  iseditable: boolean;
  selectedSection?: string | null;
  selectedCondChoice?: string | null;
  questionsuborder?: string;
  applicationid: string;
}

interface QuestionTypesProps extends DefaultQuestionTypeProps {
  children: React.ReactNode;
}

const QuestionTypes: React.FC<QuestionTypesProps> = ({
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  questionsuborder,
  children,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={questionid}
        className="block font-semibold text-secondary py-3"
      >
        <h4 className="py-1 text-base">
          {questionsuborder
            ? `${questionorder} ${questionsuborder}) `
            : `${questionorder}. `}
          <span
            className="break-after-avoid"
            dangerouslySetInnerHTML={{ __html: questiontext }}
          ></span>
          {mandatory && <span className="text-red-500">*</span>}
        </h4>
        {questionnote && (
          <p className="italic text-gray-500 text-sm">{questionnote}</p>
        )}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
};

export default QuestionTypes;
