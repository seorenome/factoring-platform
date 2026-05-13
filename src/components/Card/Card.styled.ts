import styled from 'styled-components';

export const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 1rem; /* 16px */
  border: 1px solid #e5e5e5;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
`;

export const CardValue = styled.p`
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #111827;
`;
