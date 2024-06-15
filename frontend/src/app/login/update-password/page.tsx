import Image from "next/image";

import UpdatePasswordForm from "@/components/forms/updatepassword-form";

export default function Login() {
  return (
    <main className="grid-cols-1 flex flex-col items-center justify-between space-y-6">
      <Image
        src="/logos/gend_img.png"
        width={80}
        height={80}
        alt="Generation-D Image Logo"
        className="max-w-50 max-h-50"
      />
      <h1 className="text-5xl text-secondary">Generation-D Bewerbung</h1>
      <div className="py-12 px-8 max-w-xl bg-[#FFFFFF] text-secondary space-y-4 rounded text-center">
        <div className="text-left">
          <UpdatePasswordForm />
        </div>
      </div>
    </main>
  );
}
