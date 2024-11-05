import { useAuth } from "@solid-mediakit/auth/client";
import { FaBrandsDiscord } from "solid-icons/fa";
import { Show, createSignal } from "solid-js";
import { ChatHook } from "~/components/hook/chat-hook";
import { useLanguage } from "~/components/provider/language-provider";
import { Button } from "~/components/ui/button";
import { Grid } from "~/components/ui/grid";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

interface CreateMessageProps {
  class?: string;
}

export default function CreateMessage(props: CreateMessageProps) {
  const { t } = useLanguage();
  const { commentAdd } = ChatHook();
  const [content, setContent] = createSignal("");
  const auth = useAuth();

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    await commentAdd.mutateAsync({ content: content() });

    setContent("");
  };

  return (
    <form onSubmit={onSubmit} class={props.class}>
      <Show when={auth.session()}>
        <Grid class="gap-1">
          <TextFieldRoot class="w-full" validationState="invalid">
            <TextFieldLabel class="sr-only" for="content">
              {t("CHAT.COMMENT")}
            </TextFieldLabel>
            <TextField
              class="bg-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700"
              value={content()}
              onInput={(e) => setContent(e.currentTarget.value)}
              id="content"
              type="text"
              placeholder="write your comment"
            />
          </TextFieldRoot>
        </Grid>
      </Show>
      <Show when={!auth.session()}>
        <Button
          type="button"
          onClick={() => auth.signIn("discord")}
          class="w-full rounded-md bg-discord px-2 py-1 text-2xl font-black hover:bg-discord hover:opacity-90"
        >
          <div class="flex items-center text-white">
            <FaBrandsDiscord class="mr-1" />
            <span>{t("CHAT.DISCORD_LOGIN")}</span>
          </div>
        </Button>
      </Show>
    </form>
  );
}
