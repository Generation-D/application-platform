import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import moment from "moment-timezone";

export const getURL = () => {
  let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/"; // Set this to your site URL in production env.
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export function createCurrentTimestamp() {
  return moment().tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss.SSS");
}

export function setToPrefferedTimeZone(dateString: string) {
  if (dateString == "") {
    return "";
  }
  return moment(dateString)
    .tz("Europe/Berlin")
    .format("YYYY-MM-DDTHH:mm:ss.SSS");
}

export function transformReadableDate(dateString: string) {
  return moment(dateString).tz("Europe/Berlin").format("DD.MM.YYYY");
}

export function transformReadableDateTime(dateString: string) {
  return moment(dateString).tz("Europe/Berlin").format("DD.MM.YYYY HH:mm");
}

export async function downloadFile(bucket_name: string, filename: string) {
  const supabase = getSupabaseBrowserClient();

  const { data: fileUploadBucketData, error: fileUploadBucketError } =
    await supabase.storage.from(bucket_name).download(filename);
  if (fileUploadBucketError) {
    return;
  }
  // Can't return Blob from Server Component to Client Component!
  return fileUploadBucketData!;
}

export function calcPhaseStatus(phaseStart: string, phaseEnd: string) {
  const currentDate = new Date(createCurrentTimestamp());
  const startDate = new Date(phaseStart);
  const endDate = new Date(phaseEnd);

  if (currentDate < startDate) {
    return "UPCOMING";
  }
  if (currentDate < endDate) {
    return "ONGOING";
  }
  return "ENDED";
}

export function isValidPassword(password: string): boolean {
  const LengthRegex = /^.{8,72}$/;
  const upperCaseRegex = /[A-Z]/;
  const lowerCaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[^A-Za-z0-9]/;

  return (
    LengthRegex.test(password) &&
    upperCaseRegex.test(password) &&
    lowerCaseRegex.test(password) &&
    numberRegex.test(password) &&
    specialCharRegex.test(password)
  );
}

export function checkRegex(
  formattingregex: string,
  texttocheck: string,
): boolean {
  return new RegExp(formattingregex).test(texttocheck);
}

export function storageSaveName(name: string): string {
  // see Documentation: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
  return name.replace(/[^0-9a-zA-Z!\-_.\*'()]/g, "_");
}

export function numberToLetter(num: number): string {
  let result = "";
  while (num > 0) {
    num--; // Adjusting for 0-indexing
    result = String.fromCharCode(97 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
}
