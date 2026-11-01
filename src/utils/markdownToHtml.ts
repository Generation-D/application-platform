import { remark } from "remark";
import html from "remark-html";

export default async function markdownToHtml(markdownText: string) {
  const result = await remark().use(html).process(markdownText);
  return result.toString();
}
