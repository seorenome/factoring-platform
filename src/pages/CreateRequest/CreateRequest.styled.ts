import styled from 'styled-components';

export const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid #e5e5e5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  overflow: hidden;
`;

export const FormHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e5e5e5;
  background-color: #fcfcfc;
`;

export const StepsProgress = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e5e5e5;
    z-index: 1;
  }
`;

export const StepIndicator = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
  flex: 1;
`;

export const StepDot = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ $active, $completed }) => 
    $completed ? '#111827' : $active ? '#2563eb' : '#ffffff'};
  border: 2px solid ${({ $active, $completed }) => 
    $completed ? '#111827' : $active ? '#2563eb' : '#d1d5db'};
  color: ${({ $active, $completed }) => 
    $completed || $active ? '#ffffff' : '#4b5563'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
`;

export const StepLabel = styled.span<{ $active: boolean }>`
  font-size: 0.75rem;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? '#111827' : '#6b7280')};
`;

export const FormBody = styled.div`
  padding: 2.5rem 2rem;
`;

export const FormFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e5e5;
  background-color: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DocumentCard = styled.div<{ $selected: boolean }>`
  border: 1px solid ${({ $selected }) => ($selected ? '#2563eb' : '#e5e5e5')};
  background-color: ${({ $selected }) => ($selected ? '#f0f7ff' : '#ffffff')};
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? '#2563eb' : '#cbd5e1')};
  }
`;

export const DocumentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

export const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const FormInput = styled.input`
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;

export const FormSelect = styled.select`
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  background-color: white;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;

export const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
`;

export const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const ChoiceButton = styled.button<{ $selected: boolean }>`
  padding: 1rem;
  border: 1px solid ${({ $selected }) => ($selected ? '#2563eb' : '#e5e5e5')};
  background-color: ${({ $selected }) => ($selected ? '#f0f7ff' : '#ffffff')};
  color: ${({ $selected }) => ($selected ? '#2563eb' : '#374151')};
  font-weight: 500;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    border-color: #2563eb;
  }
`;

export const FactoringTypeCard = styled.div<{ $selected: boolean }>`
  border: 1px solid ${({ $selected }) => ($selected ? '#2563eb' : '#e5e5e5')};
  background-color: ${({ $selected }) => ($selected ? '#f0f7ff' : '#ffffff')};
  padding: 1.25rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:hover {
    border-color: #2563eb;
  }
`;

export const FactoringTypeTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

export const FactoringTypeDesc = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: #4b5563;
  line-height: 1.4;
`;

export const CalcCard = styled.div`
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

export const CalcRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: ${({ $bold }) => ($bold ? '1rem' : '0.875rem')};
  font-weight: ${({ $bold }) => ($bold ? '600' : '400')};
  color: ${({ $bold }) => ($bold ? '#0f172a' : '#475569')};
  border-top: ${({ $bold }) => ($bold ? '1px solid #e2e8f0' : 'none')};
  margin-top: ${({ $bold }) => ($bold ? '0.5rem' : '0')};
  padding-top: ${({ $bold }) => ($bold ? '0.75rem' : '0.5rem')};
`;

export const SummarySection = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1.5rem;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

export const SummaryTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 154px 1fr;
  gap: 0.75rem;
  font-size: 0.875rem;
`;

export const SummaryLabel = styled.span`
  color: #64748b;
  font-weight: 500;
`;

export const SummaryValue = styled.span`
  color: #0f172a;
  font-weight: 600;
`;