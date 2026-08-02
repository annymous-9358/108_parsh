import { redirect } from "next/navigation";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/languages";

export default function RootPage() {
  redirect(`/${DEFAULT_LANGUAGE}`);
}
