import styled from 'styled-components';

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  letter-spacing: -0.01em;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const TableContainer = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;

export const TableHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 600;
  color: #111827;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  
  tbody tr {
    transition: background-color 0.15s;
    &:hover {
      background-color: #f9fafb;
    }
  }
`;

export const Th = styled.th`
  padding: 0.875rem 1.5rem;
  background-color: #ffffff;
  font-weight: 500;
  color: #6b7280;
  font-size: 0.8125rem;
  border-bottom: 1px solid #e5e5e5;
`;

export const Td = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  color: #374151;
  font-size: 0.875rem;
`;
