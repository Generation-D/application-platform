import { checkAccessRights } from "@/actions/checkAccessRights";

export default async function SubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAccessRights("/review")
  return <section>{children}</section>
}
