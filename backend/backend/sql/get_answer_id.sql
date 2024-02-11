select answerid
from application_table, answer_table, question_table
where application_table.applicationid = application_id_target and
      question_table.phaseid = phase_id_target and
      question_table.questionid = answer_table.questionid;