from backend.utils.utils_supabase import init_supabase
import csv
import argparse


def manage_application_outcomes(
    csv_mapping_file: str,
    approved_candidates_emails: list,
    current_phase_id: str,
    reviewer_id: str,
    env_file_path: str,
):
    """Process application outcomes for candidates in a specific phase.

    Reads candidate email-to-id mappings from CSV and updates the phase_outcome_table in Supabase.
    Approved candidates (in approved_candidates_emails list) get 'outcome: True',
    while all other candidates get 'outcome: False'.

    Args:
        csv_mapping_file: Path to CSV file containing email to user ID mappings
        approved_candidates_emails: List of approved candidate emails
        current_phase_id: UUID of the phase to process outcomes for
        reviewer_id: UUID of the reviewer processing the outcomes
    """
    # Convert emails to lowercase
    approved_candidates_emails = [email.lower() for email in approved_candidates_emails]

    # Load email to user_id mapping from CSV
    email_to_user_id_map = {}
    with open(csv_mapping_file, mode="r") as file:
        csv_reader = csv.reader(file, delimiter=',')
        header = next(csv_reader)  # Skip header
        assert "email" in header and "id" in header
        index_email, index_id = header.index("email"), header.index("id")
        for row in csv_reader:
            candidate_email = row[index_email].lower()
            candidate_id = row[index_id].lower()
            email_to_user_id_map[candidate_email] = candidate_id

    # Validate that all approved candidates exist in our mapping
    for approved_email in approved_candidates_emails:
        if approved_email not in email_to_user_id_map:
            raise ValueError(
                f"Approved candidate {approved_email} not found in the CSV mapping file"
            )

    # Initialize Supabase client
    supabase_client = init_supabase(env_file_path)

    # Process approved candidates (outcome = True)
    for approved_email in approved_candidates_emails:
        user_id = email_to_user_id_map[approved_email]
        supabase_client.table("phase_outcome_table").insert(
            {
                "phase_id": current_phase_id,
                "user_id": user_id,
                "outcome": True,
                "reviewed_by": reviewer_id,
            }
        ).execute()

    # Process all candidates (approved get skipped, others get outcome = False)
    for candidate_email, user_id in email_to_user_id_map.items():
        print(f"Processing candidate: {candidate_email}, ID: {user_id}")

        if candidate_email not in approved_candidates_emails:
            try:
                supabase_client.table("phase_outcome_table").insert(
                    {
                        "phase_id": current_phase_id,
                        "user_id": user_id,
                        "outcome": False,
                        "reviewed_by": reviewer_id,
                    }
                ).execute()
            except Exception as error:
                print(f"ERROR processing {candidate_email}: {error}")
        else:
            print(f"Candidate {candidate_email} already processed as approved")

    print("Application outcome processing completed")


def parse_args() -> argparse.Namespace:
    """Parse command line arguments for application outcome management."""
    parser = argparse.ArgumentParser(
        description="Process application outcomes for candidates in a specific phase"
    )

    parser.add_argument(
        "--csv-file",
        help="Path to CSV file containing email to user ID mappings",
        type=str,
        default="users_id.csv",
        dest="csv_mapping_file",
        required=False,
    )

    parser.add_argument(
        "--approved-emails",
        help="List of approved candidate emails (space-separated)",
        type=str,
        nargs="*",
        default=[],
        dest="approved_candidates_emails",
        required=False,
    )

    parser.add_argument(
        "--phase-id",
        help="UUID of the phase to process outcomes for",
        type=str,
        default="6ef165a5-4030-401e-a5e6-588902853118",
        dest="current_phase_id",
        required=False,
    )

    parser.add_argument(
        "--reviewer-id",
        help="UUID of the reviewer processing the outcomes",
        type=str,
        default="97b3088f-6adf-491f-a766-3cb6b662ec2c",
        dest="reviewer_id",
        required=False,
    )

    parser.add_argument(
        "--env_file",
        help="Path to the .env file",
        type=str,
        default=None,
        dest="env_file_path",
        required=False,
    )
    return parser.parse_args()



if __name__ == "__main__":
    # Parse command line arguments and execute the main function
    args = parse_args()
    manage_application_outcomes(**vars(args))
