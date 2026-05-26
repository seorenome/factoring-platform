import styled from 'styled-components';

export const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  background: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e5e5;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 2rem;
`;

export const TabItem = styled.div<{ $active?: boolean }>`
  padding: 0.75rem 0;
  font-weight: 500;
  font-size: 0.875rem;
  color: ${({ $active }) => ($active ? '#111827' : '#6b7280')};
  border-bottom: 2px solid ${({ $active }) => ($active ? '#2563eb' : 'transparent')};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: #111827;
  }
`;

export const Badge = styled.span<{ $status: 'pending' | 'approved' | 'rejected' | 'draft' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ $status }) => {
    switch ($status) {
      case 'pending':
        return 'background-color: #fef3c7; color: #92400e;';
      case 'approved':
        return 'background-color: #d1fae5; color: #065f46;';
      case 'rejected':
        return 'background-color: #fee2e2; color: #b91c1c;';
      case 'draft':
        return 'background-color: #f3f4f6; color: #374151;';
    }
  }}
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.15s;
  display: inline-flex;
  
  &:hover {
    color: #111827;
    background-color: #f3f4f6;
  }
`;