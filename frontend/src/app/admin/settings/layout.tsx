import { checkAccessRights } from "@/actions/checkAccessRights";

export default async function SubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAccessRights("/admin/settings")
  return <section>{children}</section>
}
