import AdminLogin from "@/components/forms/adminSignIn-form";
import Image from "next/image";

export default function Home() {
  return (
    <main className="grid-cols-1 flex flex-col items-center justify-between space-y-6">
      <Image
        src="/logos/gend_img.png"
        width={80}
        height={80}
        alt="Generation-D Image Logo"
        className="max-w-50 max-h-50"
      />
      <h1 className="text-4xl text-secondary md:text-5xl text-center">
        Generation-D Internal Login
      </h1>
      <AdminLogin />
    </main>
  );
}
