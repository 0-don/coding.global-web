import { Component } from 'solid-js';
import { Meta, Title } from 'solid-start';

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
