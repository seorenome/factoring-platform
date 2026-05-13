import styled from 'styled-components';

export const DetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
`;

export const MainPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SidebarPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SectionCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e5e5;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.25rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
`;

export const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DataLabel = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
`;

export const DataValue = styled.span`
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
`;

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TimelineItem = styled.div<{ $active?: boolean }>`
  display: flex;
  gap: 1rem;
  position: relative;
  
  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 11px;
    top: 24px;
    bottom: -16px;
    width: 2px;
    background-color: ${({ $active }) => ($active ? '#111827' : '#e5e5e5')};
  }
`;

export const TimelineDot = styled.div<{ $active?: boolean; $completed?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ $active, $completed }) => ($completed || $active ? '#111827' : '#ffffff')};
  border: 2px solid ${({ $active, $completed }) => ($completed || $active ? '#111827' : '#e5e5e5')};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const TimelineContent = styled.div`
  flex: 1;
  padding-bottom: 0.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const Input = styled.input`
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #111827;
    box-shadow: 0 0 0 1px #111827;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;
