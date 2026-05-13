import React from 'react';
import { CardWrapper, CardTitle, CardValue } from './Card.styled';

interface CardProps {
  title: string;
  value: React.ReactNode;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, value, children }) => {
  return (
    <CardWrapper>
      <CardTitle>{title}</CardTitle>
      <CardValue>{value}</CardValue>
      {children}
    </CardWrapper>
  );
};
