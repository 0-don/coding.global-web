import { VibeCoding } from "@/components/pages/resources/guides/vibe-coding";
import { getTweet } from "react-tweet/api";

export default async function VibeCodingPage() {
  const tweet = await getTweet("1886192184808149383");

  return <VibeCoding tweet={tweet} />;
}
