import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, Badge, ActionButton } from '../Requests/Requests.styled';
import { Search, Filter, MoreHorizontal, Plus } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  edrpou: string;
  role: 'Постачальник' | 'Дебітор' | 'Обидва';
  kycStatus: 'approved' | 'pending' | 'rejected';
  limit: number | null;
}

const MOCK_COMPANIES: Company[] = [
  { id: 'COMP-001', name: 'ТОВ "Постач-Пром"', edrpou: '12345678', role: 'Постачальник', kycStatus: 'approved', limit: 1000000 },
  { id: 'COMP-002', name: 'ТОВ "Рітейл Груп"', edrpou: '87654321', role: 'Дебітор', kycStatus: 'approved', limit: 5000000 },
  { id: 'COMP-003', name: 'ФОП Коваленко', edrpou: '32165498', role: 'Постачальник', kycStatus: 'pending', limit: null },
  { id: 'COMP-004', name: 'ТОВ "Агроінвест"', edrpou: '99887766', role: 'Обидва', kycStatus: 'approved', limit: 2500000 },
];

export const Companies: React.FC = () => {
  const { t } = useI18n();

  const getStatusBadge = (status: Company['kycStatus']) => {
    switch(status) {
      case 'approved': return <Badge $status="approved">KYC Пройдено</Badge>;
      case 'pending': return <Badge $status="pending">На перевірці</Badge>;
      case 'rejected': return <Badge $status="rejected">Відхилено</Badge>;
    }
  };

  return (
    <Layout>
      <DashboardHeader>
        <Title>{t.common.companies}</Title>
        <Button icon={<Plus size={16} />}>Додати компанію</Button>
      </DashboardHeader>

      <FilterBar>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Пошук за назвою або ЄДРПОУ..." 
            style={{ 
              width: '100%', 
              padding: '0.625rem 1rem 0.625rem 2.5rem', 
              borderRadius: '0.5rem', 
              border: '1px solid #d1d5db',
              fontSize: '0.875rem'
            }} 
          />
        </div>
        <Button variant="outline" icon={<Filter size={16} />}>Фільтри</Button>
      </FilterBar>

      <TableContainer>
        <TableHeader style={{ fontSize: '0.875rem' }}>Всі компанії ({MOCK_COMPANIES.length})</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>Назва</Th>
              <Th>ЄДРПОУ</Th>
              <Th>Роль</Th>
              <Th>Ліміт</Th>
              <Th>KYC / AML Статус</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COMPANIES.map(company => (
              <tr key={company.id}>
                <Td style={{ fontWeight: 600, color: '#111827' }}>{company.name}</Td>
                <Td>{company.edrpou}</Td>
                <Td>{company.role}</Td>
                <Td>{company.limit ? `₴ ${company.limit.toLocaleString()}` : '-'}</Td>
                <Td>{getStatusBadge(company.kycStatus)}</Td>
                <Td style={{ textAlign: 'right' }}>
                  <ActionButton>
                    <MoreHorizontal size={18} />
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};
