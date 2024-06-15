import { fetchAllApplicantsStatus, fetchAllUsers } from "@/actions/admin";
import { fetch_all_phases } from "@/actions/phase";
import { checkAccessRights } from "@/actions/checkAccessRights";
import ApplicantsList from "@/components/applicantslist";
import InternalHeader from "@/components/layout/internalHeader";
import UserList from "@/components/userslist";

export default async function Page() {
  await checkAccessRights("/admin")
  const users = await fetchAllUsers();
  const applicantsStatus = await fetchAllApplicantsStatus();
  const phases = await fetch_all_phases();
  return (
    <div className="container mx-auto px-4 py-8">
      <InternalHeader />
      <h1 className="text-2xl font-bold mb-4">ADMIN DASHBOARD</h1>
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <UserList users={users} />
      <h2 className="text-xl font-bold mb-4 mt-9">Applicants List</h2>
      <ApplicantsList
        users={users}
        phases={phases.sort((a, b) => a.phaseorder - b.phaseorder)}
        applicantsStatus={applicantsStatus}
      />
    </div>
  );
}
