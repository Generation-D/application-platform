import InternalHeader from "@/components/layout/internalHeader";
import PaginationControls from "@/components/paginationControls";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import Link from "next/link";

interface SearchParams {
  page?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const pageSize = 50

export default async function Applications({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const supabase = await getSupabaseCookiesUtilClient();

  const pageNumber = Number(page) || 1

  const { count, error } = await supabase
        .from("application_table")
        .select("*", { count: "exact", head: true });

      const { data } = await supabase.rpc("fetch_applications_paginated", {
        page_size: pageSize,
        page_number: pageNumber,
      });

    const applications = data ? data : [] 
    const totalPages = Math.ceil(count! / pageSize)

  return (
    <>
      <InternalHeader />
      {/* {count} */}
      <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Bewerbungen</h1>
      <h2 className="text-xl mb-4">Insgesamt: {count}</h2>

      {/* 2. Server-Rendered "Table" using CSS Grid Links */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
        <div className="grid grid-cols-2 bg-gray-50 p-4 font-semibold text-gray-700 border-b border-gray-200 text-sm">
          <div>Bewerbungs ID</div>
          <div>E-Mail</div>
        </div>

        {/* Rows (Each row is a real, clickable HTML link) */}
        <div className="divide-y divide-gray-200 bg-white">
          {applications.map((application) => (
            <Link
              key={application.applicationid}
              href={`/admin/applications/${application.applicationid}`}
              className="grid grid-cols-2 p-4 text-sm text-secondary hover:bg-gray-50 transition-colors items-center"
            >
              <div className="font-medium text-secondary hover:underline">{application.applicationid}</div>
              <div>
                {application.email}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <PaginationControls currentPage={pageNumber} totalPages={totalPages} /> 
    </div>
    </>
  );
}
