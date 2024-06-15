import { checkAccessRights } from "@/actions/checkAccessRights";

export default async function SubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAccessRights("/admin/login");
  return <section>{children}</section>;
}
