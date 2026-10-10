import Apl_Header from "@/components/layout/header";
import PaginationControls from "@/components/paginationControls";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import Link from "next/link";

interface SearchParams {
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const pageSize = 50;

export default async function Applications({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const supabase = await getSupabaseCookiesUtilClient();

  const pageNumber = Number(page) || 1;

  const [countResult, applicationsResult] = await Promise.all([
    supabase.rpc("count_reviewable_applications"),
    supabase.rpc("fetch_applications_paginated", {
      page_size: pageSize,
      page_number: pageNumber,
    }),
  ]);

  if (countResult.error || applicationsResult.error) {
    throw new Error(
      "Bewerbungen konnten nicht geladen werden. Bitte versuche es erneut oder melde den Fehler der Administration.",
    );
  }

  const count = countResult.data ?? 0;
  const applications = applicationsResult.data ?? [];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / pageSize));

  return (
    <>
      <Apl_Header />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Bewerbungen</h1>
        <h2 className="text-xl mb-4">Insgesamt: {count ?? 0}</h2>
        <div className="border border-gray-200 rounded-lg overflow-x-auto shadow-sm mb-6">
          <div className="grid min-w-[680px] grid-cols-3 gap-4 bg-gray-50 p-4 font-semibold text-gray-700 border-b border-gray-200 text-sm">
            <div>Bewerbungs ID</div>
            <div>Teamname</div>
            <div>E-Mail</div>
          </div>
          <div className="divide-y divide-gray-200 bg-white">
            {applications.map((application) => (
              <Link
                key={application.applicationid}
                href={`/review/applications/${application.applicationid}`}
                className="grid min-w-[680px] grid-cols-3 gap-4 p-4 text-sm text-secondary hover:bg-gray-50 transition-colors items-center"
              >
                <div
                  className="font-medium text-secondary hover:underline"
                  title={application.applicationid}
                >
                  {application.applicationid.slice(0, 8)}
                </div>
                <div className="truncate">
                  {application.team_name?.trim() || "Kein Teamname"}
                </div>
                <div className="truncate">{application.email}</div>
              </Link>
            ))}
          </div>
        </div>
        <PaginationControls currentPage={pageNumber} totalPages={totalPages} />
      </div>
    </>
  );
}
