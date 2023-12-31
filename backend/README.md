

## Application ER-Diagram

### Top Level Overview
```mermaid
erDiagram
    AUTHENTICATION-TABLE ||--|{ APPLICATION-TABLE : has
    AUTHENTICATION-TABLE ||--|{ USER-PROFILES-TABLE : has
    USER-PROFILES-TABLE ||--|{ USER-ROLES-TABLE : has
    APPLICATION-TABLE ||--|{ ANSWER-TABLE : has
    QUESTION-TABLE ||--|| PHASE-TABLE : is_divided_in
    QUESTION-TABLE }|--|| ANSWER-TABLE : answers

    %% default Supabase Authentication Table
    AUTHENTICATION-TABLE {
        string userid PK
        string email
        string password
        datetime lastlogin
        datetime lastupdated
        datetime created
        boolean emailverified
    }
    
    USER-PROFILES-TABLE {
        string userid PK
        int userrole FK
        boolean isactive
    }

    USER-ROLES-TABLE {
        string userroleid PK
        string userrolename
    }

    APPLICATION-TABLE {
        string applicationid PK
        string userid FK
    }

    PHASE-TABLE {
        int phaseid PK
        string phasename
        string phaselabel
        int phaseorder
        datetime startdate
        datetime enddate
    }

    QUESTION-TABLE {
        string questionid PK
        string questiontype
        int questionorder
        string phaseid FK
        boolean mandatory
        string questiontext
        string questionnote
    }

    ANSWER-TABLE {
        string answerid PK
        string questionid FK
        string applicationid FK
        datetime created
        datetime lastupdated
    }
```


### Questions
```mermaid
erDiagram
    QUESTION-TABLE ||--|{ SHORT-TEXT-QUESTION-TABLE : is_type
    QUESTION-TABLE ||--|{ LONG-TEXT-QUESTION-TABLE : is_type
    QUESTION-TABLE ||--|{ MULTIPLE-CHOICE-QUESTION-TABLE : is_type
    QUESTION-TABLE ||--|{ CHECKBOX-QUESTION-TABLE : is_type
    QUESTION-TABLE ||--|{ VIDEO-UPLOAD-QUESTION-TABLE : is_type
    QUESTION-TABLE ||--|{ DATE-PICKER-QUESTION-TABLE : is_type
    QUESTION-TABLE ||--|{ DATETIME-PICKER-QUESTION-TABLE : is_type
    QUESTION-TABLE ||--|{ NUMBER-PICKER-QUESTION-TABLE : is_type
    QUESTION-TABLE ||--|{ DROPDOWN-QUESTION-TABLE : is_type
    QUESTION-TABLE ||--|{ PDF-UPLOAD-QUESTION-TABLE : is_type
    QUESTION-TABLE ||--|{ IMAGE-UPLOAD-QUESTION-TABLE : is_type
    DROPDOWN-QUESTION-TABLE ||--|{ DROPDOWN-QUESTION-OPTION-TABLE : has
    MULTIPLE-CHOICE-QUESTION-TABLE ||--|{ MULTIPLE-CHOICE-QUESTION-CHOICES-TABLE : has

    QUESTION-TABLE {
        string questionid PK
        string questiontype
        int questionorder
        string phaseid FK
        boolean mandatory
        string questiontext
    }

    SHORT-TEXT-QUESTION-TABLE {
        string questionid FK
    }

    LONG-TEXT-QUESTION-TABLE {
        string questionid FK
    }

    MULTIPLE-CHOICE-QUESTION-TABLE {
        string questionid FK
        int minanswers
        int maxanswers
        boolean userinput
    }

    MULTIPLE-CHOICE-QUESTION-TABLE {
        string questionid FK
    }

    MULTIPLE-CHOICE-QUESTION-CHOICES-TABLE {
        string choiceid PK
        string questionid FK
        string choicetext
    }

    VIDEO-UPLOAD-QUESTION-TABLE {
        string questionid FK
        double maxfilesizeinmb
    }

    DATE-PICKER-QUESTION-TABLE {
        string questionid FK
        date mindate
        data maxdate
    }

    DATETIME-PICKER-QUESTION-TABLE {
        string questionid FK
        datetime mindatetime
        datatime maxdatetime
    }

    NUMBER-PICKER-QUESTION-TABLE {
        string questionid FK
        int minnumber
        int maxnumber
    }

    DROPDOWN-QUESTION-TABLE {
        string questionid FK
        integer minanswers
        integer maxanswers
        boolean userinput
    }

    DROPDOWN-QUESTION-OPTION-TABLE {
        string optionid PK
        string questionid FK
        string optiontext
    }

    PDF-UPLOAD-QUESTION-TABLE {
        string questionid FK
        double maxfilesizeinmb
    }

    IMAGE-UPLOAD-QUESTION-TABLE {
        string questionid FK
        double maxfilesizeinmb
        string[] allowedfiletypes
    }
```

### Answers
```mermaid
erDiagram
    ANSWER-TABLE ||--|{ SHORT-TEXT-ANSWER-TABLE : is_type
    ANSWER-TABLE ||--|{ LONG-TEXT-ANSWER-TABLE : is_type
    ANSWER-TABLE ||--|{ MULTIPLE-CHOICE-ANSWER-TABLE : is_type
    ANSWER-TABLE ||--|{ CHECKBOX-ANSWER-TABLE : is_type
    ANSWER-TABLE ||--|{ VIDEO-UPLOAD-ANSWER-TABLE : is_type
    ANSWER-TABLE ||--|{ DATE-PICKER-ANSWER-TABLE : is_type
    ANSWER-TABLE ||--|{ DATETIME-PICKER-ANSWER-TABLE : is_type
    ANSWER-TABLE ||--|{ NUMBER-PICKER-ANSWER-TABLE : is_type
    ANSWER-TABLE ||--|{ DROPDOWN-ANSWER-TABLE : is_type
    ANSWER-TABLE ||--|{ PDF-UPLOAD-ANSWER-TABLE : is_type
    ANSWER-TABLE ||--|{ IMAGE-UPLOAD-ANSWER-TABLE : is_type

    ANSWER-TABLE {
        string answerid PK
        string questionid FK
        string applicationid FK
        string timestamp
    }

    SHORT-TEXT-ANSWER-TABLE {
        string answerid FK
        string answertext
    }

    LONG-TEXT-ANSWER-TABLE {
        string answerid FK
        string answertext
    }

    MULTIPLE-CHOICE-ANSWER-TABLE {
        string answerid FK
        string[] selectedchoice
    }

    CHECKBOX-ANSWER-TABLE {
        string answerid FK
        boolean checked
    }

    VIDEO-UPLOAD-ANSWER-TABLE {
        string answerid FK
        string videourl
    }

    DATE-PICKER-ANSWER-TABLE {
        string answerid FK
        date pickeddate
    }

    DATETIME-PICKER-ANSWER-TABLE {
        string answerid FK
        datetime pickeddatetime
    }

    NUMBER-PICKER-ANSWER-TABLE {
        string answerid FK
        integer pickednumber
    }

    DROPDOWN-ANSWER-TABLE {
        string answerid FK
        string[] selectedoptions
    }

    PDF-UPLOAD-ANSWER-TABLE {
        string answerid FK
        string pdfurl
    }

    IMAGE-UPLOAD-ANSWER-TABLE {
        string answerid FK
        string imageurl
    }
```