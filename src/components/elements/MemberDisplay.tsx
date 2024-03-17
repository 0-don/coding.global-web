import { Component, createSignal, onMount } from "solid-js";
import { ResolvedMember, UnresolvedMember } from "../../types";
import { DiscordApi } from "../../utils/discord-api.client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface MemberDisplayProps {
  unresolvedMember: UnresolvedMember;
}

export const MemberDisplay: Component<MemberDisplayProps> = ({
  unresolvedMember: { description, id },
}) => {
  const [resolvedMember, setResolvedMember] = createSignal<ResolvedMember>();

  onMount(async () => {
    const member = await DiscordApi.getMemberInformation(id);
    setResolvedMember({ ...member, description });
  });

  return (
    <div class="">
      <Card class="">
        <CardHeader>
          <img
            src={resolvedMember()?.avatar.link}
            class="rounded-full"
            alt={resolvedMember()?.tag}
            height={100}
            width={100}
          />
          <CardDescription>
            {resolvedMember()?.description ?? ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardTitle>{resolvedMember()?.tag ?? ""}</CardTitle>
        </CardContent>
      </Card>
    </div>
  );
};
