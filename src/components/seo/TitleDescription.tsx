import { Title, Meta } from '@solidjs/meta';
import { Component } from 'solid-js';

interface TitleDescriptionProps {
  title: string;
  description: string;
}

export const TitleDescription: Component<TitleDescriptionProps> = ({
  title,
  description,
}) => {
  return (
    <>
      <Title>{title}</Title>
      <Meta content={description} name='description' />
    </>
  );
};
