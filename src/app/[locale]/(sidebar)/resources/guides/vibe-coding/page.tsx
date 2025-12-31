import { TOCLayout } from "@/components/layout/resources/toc";
import {
  VibeCoding,
  vibeCodingTOC,
} from "@/components/pages/resources/guides/vibe-coding";
import { getTweet } from "react-tweet/api";

export default async function VibeCodingPage() {
  const tweet = await getTweet("1886192184808149383");

  return (
    <TOCLayout toc={vibeCodingTOC}>
      <VibeCoding tweet={tweet} />
    </TOCLayout>
  );
}
