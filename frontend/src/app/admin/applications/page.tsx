"use client";

import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ListItem {
  applicationid: string;
  email: string;
}

export default function Users() {
  const supabase = getSupabaseBrowserClient();
  const [users, setApplications] = useState<ListItem[]>([]);
  const [totalCount, setTotalCount] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  async function getTotalCount() {
    const { count, error } = await supabase
      .from("application_table")
      .select("*", { count: "exact", head: true });

    console.log(error);
    console.log(count);
    if (count) {
      setTotalCount(count);
    }
  }

  async function getUsers() {
    const { data, error } = await supabase.rpc("fetch_applications_paginated", {
      page_size: 20,
      page_number: 1,
    });

    console.log(error);

    console.log(data);
    if (data) {
      setApplications(data);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTotalCount();
    getUsers();
  }, []);

  if (isLoading) {
    return <>Loading</>;
  }

  return (
    <>
      <h1>Applications</h1>
      {totalCount}
      <ul>
        {users.map((u) => (
          <li key={u.applicationid}>
            <Link href={`/admin/applications/${u.applicationid}`}>
              {u.applicationid} {u.email}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
