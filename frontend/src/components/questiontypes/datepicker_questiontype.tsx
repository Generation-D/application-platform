import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';

export interface DatePickerQuestionTypeProps extends DefaultQuestionTypeProps {}

const DatePickerQuestionType: React.FC<DatePickerQuestionTypeProps> = ({ id, mandatory, question_text }) => {
  return (
    <QuestionTypes id={id} mandatory={mandatory} question_text={question_text}>
      <div className="mt-1">
        <input
          type="date"
          id={id}
          name={id}
          required={mandatory}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </QuestionTypes>
  );
};

export default DatePickerQuestionType;