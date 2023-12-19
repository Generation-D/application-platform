import React from "react";

export interface DefaultQuestionTypeProps {
  phasename: string;
  questionid: string;
  mandatory: boolean;
  questiontext: string;
  questionnote: string;
  questionorder: number;
  iseditable: boolean;
  selectedSection?: string | null;
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
  children,
}) => {
  console.log("Render Question"); // Keep to ensure it's rerendered

  return (
    <div className="mb-4">
      <label
        htmlFor={questionid}
        className="block font-semibold text-secondary py-3"
      >
        <h4 className="py-1 text-base">
          {questionorder}.{" "}
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
