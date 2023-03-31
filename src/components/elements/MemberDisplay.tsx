import { Component, createSignal, onMount } from 'solid-js';
import { ResolvedMember, UnresolvedMember } from '../../types';
import { DiscordApi } from '../../utils/discord-api.client';

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
    <div
      class={`mt-10 flex flex-col items-center ${
        !resolvedMember() ? 'animate-pulse' : ''
      }`}
    >
      <div class='perspective group h-[150px] w-[150px] rounded-full bg-black text-xs text-white'>
        <div class='preserve-3d group-hover:my-rotate-y-180 relative duration-1000'>
          <div class='backface-hidden absolute'>
            {!resolvedMember() ? (
              <div class='h-[150px] w-24 rounded-full bg-gray-300'></div>
            ) : (
              <img
                src={resolvedMember()?.avatar.link}
                class='h-[150px] w-[150px] rounded-full'
                alt={resolvedMember()?.tag}
                height={100}
                width={100}
              />
            )}
          </div>
          <div class='my-rotate-y-180 backface-hidden flex h-[150px] items-center justify-center rounded-full px-4'>
            {resolvedMember()?.description ?? ''}
          </div>
        </div>
      </div>
      {resolvedMember()?.tag ?? (
        <div class='mt-[14px] h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600'></div>
      )}
    </div>
  );
};
