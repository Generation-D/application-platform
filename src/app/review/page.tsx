import InternalHeader from "@/components/layout/internalHeader";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <InternalHeader />
      <div>REVIEW DASHBOARD</div>
      <Link href="/review/applications">Bewerbungen</Link>
    </div>
  );
}
