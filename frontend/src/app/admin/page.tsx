import { fetchAllUsers } from "@/actions/admin";
import InternalHeader from "@/components/layout/internalHeader";
import UserList from "@/components/userslist";
import Link from "next/link";

export default async function Page() {
  const users = await fetchAllUsers();
  return (
    <div className="container mx-auto px-4 py-8">
      <InternalHeader />
      <h1 className="text-2xl font-bold mb-4">ADMIN DASHBOARD</h1>
      <Link
        href="/admin/evaluation"
        className="apl-button-fixed inline-block mb-8"
      >
        Bewertungsprozess öffnen
      </Link>
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <UserList users={users} />
    </div>
  );
}
