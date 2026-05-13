import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, Badge, ActionButton } from '../Requests/Requests.styled';
import { Search, Filter, MoreHorizontal, Upload, FileText } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  supplier: string;
  status: 'verified' | 'pending' | 'rejected';
}

const MOCK_DOCS: Document[] = [
  { id: 'DOC-101', name: 'Рахунок-фактура №142.pdf', type: 'Рахунок-фактура', date: '2026-05-08', supplier: 'ТОВ "Постач-Пром"', status: 'verified' },
  { id: 'DOC-102', name: 'Видаткова_накладна_ВН-88.pdf', type: 'Видаткова накладна', date: '2026-05-08', supplier: 'ТОВ "Постач-Пром"', status: 'pending' },
  { id: 'DOC-103', name: 'Договір_поставки_12-А.pdf', type: 'Договір', date: '2026-05-01', supplier: 'ФОП Коваленко', status: 'verified' },
];

export const Documents: React.FC = () => {
  const { t } = useI18n();

  const getStatusBadge = (status: Document['status']) => {
    switch(status) {
      case 'verified': return <Badge $status="approved">Перевірено</Badge>;
      case 'pending': return <Badge $status="pending">На перевірці</Badge>;
      case 'rejected': return <Badge $status="rejected">Відхилено</Badge>;
    }
  };

  return (
    <Layout>
      <DashboardHeader>
        <Title>{t.common.documents}</Title>
        <Button icon={<Upload size={16} />}>Завантажити документ</Button>
      </DashboardHeader>

      <FilterBar>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Пошук за назвою або ID..." 
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
        <TableHeader style={{ fontSize: '0.875rem' }}>Всі документи ({MOCK_DOCS.length})</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>Назва</Th>
              <Th>Тип</Th>
              <Th>Дата</Th>
              <Th>Контрагент</Th>
              <Th>Статус</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DOCS.map(doc => (
              <tr key={doc.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, color: '#111827' }}>
                    <FileText size={18} color="#6b7280" />
                    {doc.name}
                  </div>
                </Td>
                <Td>{doc.type}</Td>
                <Td>{doc.date}</Td>
                <Td>{doc.supplier}</Td>
                <Td>{getStatusBadge(doc.status)}</Td>
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
