export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      answer_table: {
        Row: {
          answerid: string;
          applicationid: string;
          created: string;
          lastupdated: string;
          questionid: string;
        };
        Insert: {
          answerid?: string;
          applicationid: string;
          created: string;
          lastupdated: string;
          questionid: string;
        };
        Update: {
          answerid?: string;
          applicationid?: string;
          created?: string;
          lastupdated?: string;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "answer_table_applicationid_fkey";
            columns: ["applicationid"];
            isOneToOne: false;
            referencedRelation: "application_table";
            referencedColumns: ["applicationid"];
          },
          {
            foreignKeyName: "answer_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: false;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      application_table: {
        Row: {
          applicationid: string;
          userid: string;
        };
        Insert: {
          applicationid?: string;
          userid: string;
        };
        Update: {
          applicationid?: string;
          userid?: string;
        };
        Relationships: [];
      };
      checkbox_answer_table: {
        Row: {
          answerid: string;
          checked: boolean;
        };
        Insert: {
          answerid: string;
          checked: boolean;
        };
        Update: {
          answerid?: string;
          checked?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "checkbox_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      checkbox_question_table: {
        Row: {
          questionid: string;
        };
        Insert: {
          questionid?: string;
        };
        Update: {
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "checkbox_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      conditional_answer_table: {
        Row: {
          answerid: string;
          selectedchoice: string;
        };
        Insert: {
          answerid: string;
          selectedchoice: string;
        };
        Update: {
          answerid?: string;
          selectedchoice?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conditional_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      conditional_question_choice_table: {
        Row: {
          choiceid: string;
          choicevalue: string;
          questionid: string;
        };
        Insert: {
          choiceid?: string;
          choicevalue: string;
          questionid: string;
        };
        Update: {
          choiceid?: string;
          choicevalue?: string;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conditional_question_choice_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: false;
            referencedRelation: "conditional_question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      conditional_question_table: {
        Row: {
          questionid: string;
        };
        Insert: {
          questionid?: string;
        };
        Update: {
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conditional_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      date_picker_answer_table: {
        Row: {
          answerid: string;
          pickeddate: string;
        };
        Insert: {
          answerid: string;
          pickeddate: string;
        };
        Update: {
          answerid?: string;
          pickeddate?: string;
        };
        Relationships: [
          {
            foreignKeyName: "date_picker_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      date_picker_question_table: {
        Row: {
          maxdate: string;
          mindate: string;
          questionid: string;
        };
        Insert: {
          maxdate: string;
          mindate: string;
          questionid?: string;
        };
        Update: {
          maxdate?: string;
          mindate?: string;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "date_picker_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      datetime_picker_answer_table: {
        Row: {
          answerid: string;
          pickeddatetime: string;
        };
        Insert: {
          answerid: string;
          pickeddatetime: string;
        };
        Update: {
          answerid?: string;
          pickeddatetime?: string;
        };
        Relationships: [
          {
            foreignKeyName: "datetime_picker_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      datetime_picker_question_table: {
        Row: {
          maxdatetime: string;
          mindatetime: string;
          questionid: string;
        };
        Insert: {
          maxdatetime: string;
          mindatetime: string;
          questionid?: string;
        };
        Update: {
          maxdatetime?: string;
          mindatetime?: string;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "datetime_picker_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      dropdown_answer_table: {
        Row: {
          answerid: string;
          selectedoptions: string;
        };
        Insert: {
          answerid: string;
          selectedoptions: string;
        };
        Update: {
          answerid?: string;
          selectedoptions?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dropdown_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      dropdown_question_option_table: {
        Row: {
          optionid: string;
          optiontext: string;
          questionid: string;
        };
        Insert: {
          optionid?: string;
          optiontext: string;
          questionid: string;
        };
        Update: {
          optionid?: string;
          optiontext?: string;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dropdown_question_option_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: false;
            referencedRelation: "dropdown_question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      dropdown_question_table: {
        Row: {
          maxanswers: number;
          minanswers: number;
          questionid: string;
          userinput: boolean;
        };
        Insert: {
          maxanswers: number;
          minanswers: number;
          questionid?: string;
          userinput: boolean;
        };
        Update: {
          maxanswers?: number;
          minanswers?: number;
          questionid?: string;
          userinput?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "dropdown_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      image_upload_answer_table: {
        Row: {
          answerid: string;
          imagename: string;
        };
        Insert: {
          answerid: string;
          imagename: string;
        };
        Update: {
          answerid?: string;
          imagename?: string;
        };
        Relationships: [
          {
            foreignKeyName: "image_upload_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      image_upload_question_table: {
        Row: {
          maxfilesizeinmb: number;
          questionid: string;
        };
        Insert: {
          maxfilesizeinmb: number;
          questionid?: string;
        };
        Update: {
          maxfilesizeinmb?: number;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "image_upload_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      long_text_answer_table: {
        Row: {
          answerid: string;
          answertext: string;
        };
        Insert: {
          answerid: string;
          answertext: string;
        };
        Update: {
          answerid?: string;
          answertext?: string;
        };
        Relationships: [
          {
            foreignKeyName: "long_text_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      long_text_question_table: {
        Row: {
          maxtextlength: number;
          questionid: string;
        };
        Insert: {
          maxtextlength: number;
          questionid?: string;
        };
        Update: {
          maxtextlength?: number;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "long_text_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      multiple_choice_answer_table: {
        Row: {
          answerid: string;
          selectedchoice: string;
        };
        Insert: {
          answerid: string;
          selectedchoice: string;
        };
        Update: {
          answerid?: string;
          selectedchoice?: string;
        };
        Relationships: [
          {
            foreignKeyName: "multiple_choice_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      multiple_choice_question_choice_table: {
        Row: {
          choiceid: string;
          choicetext: string;
          questionid: string;
        };
        Insert: {
          choiceid?: string;
          choicetext: string;
          questionid: string;
        };
        Update: {
          choiceid?: string;
          choicetext?: string;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "multiple_choice_question_choice_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: false;
            referencedRelation: "multiple_choice_question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      multiple_choice_question_table: {
        Row: {
          maxanswers: number;
          minanswers: number;
          questionid: string;
          userinput: boolean;
        };
        Insert: {
          maxanswers: number;
          minanswers: number;
          questionid?: string;
          userinput: boolean;
        };
        Update: {
          maxanswers?: number;
          minanswers?: number;
          questionid?: string;
          userinput?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "multiple_choice_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      number_picker_answer_table: {
        Row: {
          answerid: string;
          pickednumber: number;
        };
        Insert: {
          answerid: string;
          pickednumber: number;
        };
        Update: {
          answerid?: string;
          pickednumber?: number;
        };
        Relationships: [
          {
            foreignKeyName: "number_picker_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      number_picker_question_table: {
        Row: {
          maxnumber: number;
          minnumber: number;
          questionid: string;
        };
        Insert: {
          maxnumber: number;
          minnumber: number;
          questionid?: string;
        };
        Update: {
          maxnumber?: number;
          minnumber?: number;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "number_picker_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      pdf_upload_answer_table: {
        Row: {
          answerid: string;
          pdfname: string;
        };
        Insert: {
          answerid: string;
          pdfname: string;
        };
        Update: {
          answerid?: string;
          pdfname?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pdf_upload_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      pdf_upload_question_table: {
        Row: {
          maxfilesizeinmb: number;
          questionid: string;
        };
        Insert: {
          maxfilesizeinmb: number;
          questionid?: string;
        };
        Update: {
          maxfilesizeinmb?: number;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pdf_upload_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      phase_assignment_table: {
        Row: {
          assignment_id: string;
          phase_id: string;
          user_role_1_id: string;
          user_role_2_id: string;
        };
        Insert: {
          assignment_id?: string;
          phase_id: string;
          user_role_1_id: string;
          user_role_2_id: string;
        };
        Update: {
          assignment_id?: string;
          phase_id?: string;
          user_role_1_id?: string;
          user_role_2_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "phase_assignment_table_phase_id_fkey";
            columns: ["phase_id"];
            isOneToOne: false;
            referencedRelation: "phase_table";
            referencedColumns: ["phaseid"];
          },
          {
            foreignKeyName: "phase_assignment_table_user_role_1_id_fkey";
            columns: ["user_role_1_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles_table";
            referencedColumns: ["userid"];
          },
          {
            foreignKeyName: "phase_assignment_table_user_role_2_id_fkey";
            columns: ["user_role_2_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles_table";
            referencedColumns: ["userid"];
          },
        ];
      };
      phase_outcome_table: {
        Row: {
          outcome: boolean;
          outcome_id: string;
          phase_id: string;
          review_date: string;
          reviewed_by: string;
          user_id: string;
        };
        Insert: {
          outcome: boolean;
          outcome_id?: string;
          phase_id: string;
          review_date?: string;
          reviewed_by: string;
          user_id: string;
        };
        Update: {
          outcome?: boolean;
          outcome_id?: string;
          phase_id?: string;
          review_date?: string;
          reviewed_by?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "phase_outcome_table_phase_id_fkey";
            columns: ["phase_id"];
            isOneToOne: false;
            referencedRelation: "phase_table";
            referencedColumns: ["phaseid"];
          },
          {
            foreignKeyName: "phase_outcome_table_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "user_profiles_table";
            referencedColumns: ["userid"];
          },
          {
            foreignKeyName: "phase_outcome_table_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles_table";
            referencedColumns: ["userid"];
          },
        ];
      };
      phase_table: {
        Row: {
          enddate: string;
          finished_evaluation: string | null;
          phaseid: string;
          phaselabel: string;
          phasename: string;
          phaseorder: number;
          sectionsenabled: boolean;
          startdate: string;
        };
        Insert: {
          enddate: string;
          finished_evaluation?: string | null;
          phaseid?: string;
          phaselabel: string;
          phasename: string;
          phaseorder: number;
          sectionsenabled: boolean;
          startdate: string;
        };
        Update: {
          enddate?: string;
          finished_evaluation?: string | null;
          phaseid?: string;
          phaselabel?: string;
          phasename?: string;
          phaseorder?: number;
          sectionsenabled?: boolean;
          startdate?: string;
        };
        Relationships: [];
      };
      question_table: {
        Row: {
          depends_on: string | null;
          mandatory: boolean;
          phaseid: string;
          postinformationbox: string | null;
          preinformationbox: string | null;
          questionid: string;
          questionnote: string | null;
          questionorder: number;
          questiontext: string;
          questiontype: string;
          sectionid: string | null;
        };
        Insert: {
          depends_on?: string | null;
          mandatory: boolean;
          phaseid: string;
          postinformationbox?: string | null;
          preinformationbox?: string | null;
          questionid?: string;
          questionnote?: string | null;
          questionorder: number;
          questiontext: string;
          questiontype: string;
          sectionid?: string | null;
        };
        Update: {
          depends_on?: string | null;
          mandatory?: boolean;
          phaseid?: string;
          postinformationbox?: string | null;
          preinformationbox?: string | null;
          questionid?: string;
          questionnote?: string | null;
          questionorder?: number;
          questiontext?: string;
          questiontype?: string;
          sectionid?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "question_table_phaseid_fkey";
            columns: ["phaseid"];
            isOneToOne: false;
            referencedRelation: "phase_table";
            referencedColumns: ["phaseid"];
          },
          {
            foreignKeyName: "question_table_sectionid_fkey";
            columns: ["sectionid"];
            isOneToOne: false;
            referencedRelation: "sections_table";
            referencedColumns: ["sectionid"];
          },
        ];
      };
      sections_table: {
        Row: {
          phaseid: string;
          sectiondescription: string;
          sectionid: string;
          sectionname: string;
          sectionorder: number;
        };
        Insert: {
          phaseid: string;
          sectiondescription: string;
          sectionid?: string;
          sectionname: string;
          sectionorder: number;
        };
        Update: {
          phaseid?: string;
          sectiondescription?: string;
          sectionid?: string;
          sectionname?: string;
          sectionorder?: number;
        };
        Relationships: [
          {
            foreignKeyName: "sections_table_phaseid_fkey";
            columns: ["phaseid"];
            isOneToOne: false;
            referencedRelation: "phase_table";
            referencedColumns: ["phaseid"];
          },
        ];
      };
      short_text_answer_table: {
        Row: {
          answerid: string;
          answertext: string;
        };
        Insert: {
          answerid: string;
          answertext: string;
        };
        Update: {
          answerid?: string;
          answertext?: string;
        };
        Relationships: [
          {
            foreignKeyName: "short_text_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      short_text_question_table: {
        Row: {
          formattingdescription: string | null;
          formattingregex: string | null;
          maxtextlength: number;
          questionid: string;
        };
        Insert: {
          formattingdescription?: string | null;
          formattingregex?: string | null;
          maxtextlength: number;
          questionid?: string;
        };
        Update: {
          formattingdescription?: string | null;
          formattingregex?: string | null;
          maxtextlength?: number;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "short_text_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
      user_profiles_table: {
        Row: {
          isactive: boolean | null;
          userid: string;
          userrole: number;
        };
        Insert: {
          isactive?: boolean | null;
          userid: string;
          userrole: number;
        };
        Update: {
          isactive?: boolean | null;
          userid?: string;
          userrole?: number;
        };
        Relationships: [];
      };
      user_roles_table: {
        Row: {
          userroleid: number;
          userrolename: string;
        };
        Insert: {
          userroleid?: number;
          userrolename: string;
        };
        Update: {
          userroleid?: number;
          userrolename?: string;
        };
        Relationships: [];
      };
      video_upload_answer_table: {
        Row: {
          answerid: string;
          videoname: string;
        };
        Insert: {
          answerid: string;
          videoname: string;
        };
        Update: {
          answerid?: string;
          videoname?: string;
        };
        Relationships: [
          {
            foreignKeyName: "video_upload_answer_table_answerid_fkey";
            columns: ["answerid"];
            isOneToOne: true;
            referencedRelation: "answer_table";
            referencedColumns: ["answerid"];
          },
        ];
      };
      video_upload_question_table: {
        Row: {
          maxfilesizeinmb: number;
          questionid: string;
        };
        Insert: {
          maxfilesizeinmb: number;
          questionid?: string;
        };
        Update: {
          maxfilesizeinmb?: number;
          questionid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "video_upload_question_table_questionid_fkey";
            columns: ["questionid"];
            isOneToOne: true;
            referencedRelation: "question_table";
            referencedColumns: ["questionid"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      fetch_checkbox_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          checked: boolean;
        }[];
      };
      fetch_conditional_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          selectedchoice: string;
        }[];
      };
      fetch_date_picker_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          pickeddate: string;
        }[];
      };
      fetch_datetime_picker_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          pickeddatetime: string;
        }[];
      };
      fetch_dropdown_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          selectedoptions: string;
        }[];
      };
      fetch_image_upload_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          imagename: string;
        }[];
      };
      fetch_long_text_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          answertext: string;
        }[];
      };
      fetch_multiple_choice_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          selectedchoice: string;
        }[];
      };
      fetch_number_picker_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          pickednumber: number;
        }[];
      };
      fetch_pdf_upload_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          pdfname: string;
        }[];
      };
      fetch_short_text_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          answertext: string;
        }[];
      };
      fetch_video_upload_answer_table: {
        Args: {
          question_id: string;
          user_id: string;
        };
        Returns: {
          answerid: string;
          videoname: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
