import styled, { css } from 'styled-components';

export const StyledButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'outline' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem; /* modern roundedness */
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  ${({ $variant = 'primary' }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: #111827;
          color: #ffffff;
          &:hover {
            background-color: #374151;
          }
        `;
      case 'secondary':
        return css`
          background-color: #f3f4f6;
          color: #111827;
          border-color: #e5e5e5;
          &:hover {
            background-color: #e5e7eb;
          }
        `;
      case 'outline':
        return css`
          background-color: #ffffff;
          border-color: #d1d5db;
          color: #374151;
          &:hover {
            background-color: #f9fafb;
            color: #111827;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
