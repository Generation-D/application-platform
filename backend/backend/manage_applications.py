from backend.utils.utils_supabase import init_supabase

import csv


def manage_users():
    csv_file = "users_id.csv"
    next_candidates_emails = []
    phase_id = "6ef165a5-4030-401e-a5e6-588902853118"
    reviewer = "97b3088f-6adf-491f-a766-3cb6b662ec2c"

    email_id_dict = {}

    with open(csv_file, mode='r') as file:
        reader = csv.reader(file)
        for row in reader:
            if "id" in row:
                continue
            email = row[0].lower()
            email_id_dict[email] = row[1].lower()

    for candidate in next_candidates_emails:
        if candidate not in email_id_dict:
            raise ValueError(f"{candidate} not in email_id_dict")

    supabase = init_supabase()
    for candidate in next_candidates_emails:
        cand_id = email_id_dict[candidate]
        supabase.table("phase_outcome_table").insert({
            "phase_id": phase_id,
            "user_id": cand_id,
            "outcome": True,
            "reviewed_by": reviewer
        }).execute()

    for cand_email, cand_id in email_id_dict.items():
        print(cand_email, cand_id)
        if cand_email.lower() not in next_candidates_emails:
            try:
                supabase.table("phase_outcome_table").insert({
                    "phase_id": phase_id,
                    "user_id": cand_id,
                    "outcome": False,
                    "reviewed_by": reviewer
                }).execute()
            except Exception as error_message:
                print("ERROR:", error_message)
        else:
            print(cand_email)
    print("Done")
