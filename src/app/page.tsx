import { redirect } from "next/navigation";
import { LOCALES } from "../lib/config/constants";

// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
  redirect(`/${LOCALES[0]}`);
}
