import csv

from backend.utils.utils_supabase import init_supabase

class SupabaseUser:
    
    def __init__(self, id, email, role=None, isactive=None, applicationid=None):
        self.id = id
        self.email = email
        self.role = role
        self.isactive = isactive
        self.applicationid = applicationid


TYPE_TO_TABLE = {
    "longText": "long_text_answer_table",
    "shortText": "short_text_answer_table",
    "multipleChoice": "multiple_choice_answer_table",
    "conditional": "conditional_answer_table",
    "checkBox": "checkbox_answer_table"
}


def fetch_questions():
    supabase = init_supabase()
    questions_response = supabase.table("question_table").select("*").execute()
    questions = questions_response.data
    sorted_questions = {}
    for question in questions:
        if question["questiontype"] in TYPE_TO_TABLE:
            sorted_questions[question["questionid"]] = question
    return sorted_questions


def fetch_users():
    supabase = init_supabase()
    users_response = supabase.table("users").select("*").execute()
    users = users_response.data
    filtered_users = {}
    for user in users:
        filtered_users[user["id"]] = SupabaseUser(user["id"], user["email"])

    user_profiles_response = supabase.table("user_profiles_table").select("*").execute()
    user_profiles = user_profiles_response.data
    sorted_user_profiles = {user["userid"]: [user["userrole"], user["isactive"]] for user in user_profiles}

    user_application_response = supabase.table("application_table").select("*").execute()
    user_application = user_application_response.data
    sorted_user_applications = {application["userid"]: application["applicationid"] for application in user_application}

    user: SupabaseUser
    for userid, user in filtered_users.items():
        user.role = sorted_user_profiles[userid][0]
        user.isactive = sorted_user_profiles[userid][1]
        user.applicationid = sorted_user_applications.get(userid, None)

    return filtered_users


def fetch_answers(table_name: str):
    supabase = init_supabase()
    answers_response = supabase.table(table_name).select("*").execute()
    answers = answers_response.data
    sorted_answers = {}
    for answer in answers:
        sorted_answers[answer["answerid"]] = answer

    return sorted_answers


def fetch_choices(table_name):
    supabase = init_supabase()
    answers_response = supabase.table(table_name).select("*").execute()
    answers = answers_response.data
    sorted_answers = {}
    for answer in answers:
        sorted_answers[answer["choiceid"]] = answer

    return sorted_answers


def run():
    #fetch_all_answers()
    all_users = fetch_users()
    all_questions = fetch_questions()
    print(all_questions)
    all_answers = fetch_answers("answer_table")
    all_long_text_answers = fetch_answers("long_text_answer_table")
    all_short_text_answers = fetch_answers("short_text_answer_table")
    all_multiple_choice_answers = fetch_answers("multiple_choice_answer_table")
    all_mc_choices = fetch_choices("multiple_choice_question_choice_table")
    all_conditional_answers = fetch_answers("conditional_answer_table")
    all_choice_conditions = fetch_choices("conditional_question_choice_table")
    all_checkbox_answers = fetch_answers("checkbox_answer_table")
    
    header = ["userid", "email"]
    for question in all_questions.values():
        header.append(question["questiontext"])
        
    print(header)
    print(all_mc_choices)
    
    with open("answer_export.csv", 'w', encoding="utf8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(header)
        user: SupabaseUser
        for user in all_users.values():
            new_row = [user.id, user.email]
            for questionid, question in all_questions.items():
                answer_for_this_question = ""
                for answerid, answer in all_answers.items():
                    if answer["applicationid"] == user.applicationid and answer["questionid"] == questionid:
                        if question["questiontype"] == "longText":
                            answer_for_this_question = all_long_text_answers[answerid]['answertext']
                        elif question["questiontype"] == "shortText":
                            answer_for_this_question = all_short_text_answers[answerid]['answertext']
                        elif question["questiontype"] == "multipleChoice":
                            selected_choice = all_multiple_choice_answers[answerid]["selectedchoice"]
                            answers = []
                            for choice in selected_choice.split(", "):
                                answers.append(all_mc_choices[choice]["choicetext"])
                            answer_for_this_question = answers
                        elif question["questiontype"] == "conditional":
                            selected_choice = all_conditional_answers[answerid]["selectedchoice"]
                            answer_for_this_question = all_choice_conditions[selected_choice]
                        elif question["questiontype"] == "checkBox":
                            answer_for_this_question = all_checkbox_answers[answerid]['checked']
                        else:
                            print(f"QUESTIONTYPE '{question['questiontype']}' IS MISSING!!!!")
                new_row.append(answer_for_this_question)
            writer.writerow(new_row)