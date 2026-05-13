import React, { ButtonHTMLAttributes } from 'react';
import { StyledButton } from './Button.styled';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', icon, children, ...props }) => {
  return (
    <StyledButton $variant={variant} {...props}>
      {icon}
      {children}
    </StyledButton>
  );
};
