import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, TabsContainer, TabItem, Badge, ActionButton } from './Requests.styled';
import { Search, Filter, MoreHorizontal, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Request {
  id: string;
  date: string;
  supplier: string;
  debtor: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
}

const MOCK_REQUESTS: Request[] = [
  { id: 'REQ-001', date: '2026-05-08', supplier: 'ТОВ "Постач-Пром"', debtor: 'ТОВ "Рітейл Груп"', amount: 250000, status: 'pending' },
  { id: 'REQ-002', date: '2026-05-07', supplier: 'ФОП Коваленко', debtor: 'ТОВ "Еко-Маркет"', amount: 120000, status: 'approved' },
  { id: 'REQ-003', date: '2026-05-05', supplier: 'ТОВ "Західбуд"', debtor: 'ПрАТ "Київміськбуд"', amount: 840000, status: 'rejected' },
  { id: 'REQ-004', date: '2026-05-08', supplier: 'ТОВ "Торг-Майстер"', debtor: 'ТОВ "Агроінвест"', amount: 45000, status: 'draft' },
  { id: 'REQ-005', date: '2026-05-10', supplier: 'ТОВ "Постач-Пром"', debtor: 'ТОВ "Рітейл Груп"', amount: 180000, status: 'pending' },
  { id: 'REQ-006', date: '2026-05-09', supplier: 'ФОП Коваленко', debtor: 'ТОВ "Еко-Маркет"', amount: 95000, status: 'approved' },
];

export const Requests: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredRequests = () => {
    let filtered = MOCK_REQUESTS;

    if (activeTab === 'pending') {
      filtered = filtered.filter(req => req.status === 'pending');
    } else if (activeTab === 'approved') {
      filtered = filtered.filter(req => req.status === 'approved');
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.id.toLowerCase().includes(query) ||
        req.supplier.toLowerCase().includes(query) ||
        req.debtor.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getStatusText = (status: Request['status']) => {
    switch(status) {
      case 'pending': return 'На розгляді';
      case 'approved': return 'Схвалено';
      case 'rejected': return 'Відхилено';
      case 'draft': return 'Чернетка';
    }
  };

  const filteredRequests = getFilteredRequests();

  return (
    <Layout>
      <DashboardHeader>
        <Title>{t.common.requests}</Title>
        <Button icon={<FilePlus size={16} />} onClick={() => navigate('/requests/create')}>
          Створити заявку
        </Button>
      </DashboardHeader>

      <TabsContainer>
        <TabItem $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          Всі заявки ({MOCK_REQUESTS.length})
        </TabItem>
        <TabItem $active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
          На розгляді ({MOCK_REQUESTS.filter(r => r.status === 'pending').length})
        </TabItem>
        <TabItem $active={activeTab === 'approved'} onClick={() => setActiveTab('approved')}>
          Схвалені ({MOCK_REQUESTS.filter(r => r.status === 'approved').length})
        </TabItem>
      </TabsContainer>

      <FilterBar>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Пошук за ID, постачальником або дебітором..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <TableHeader>Знайдено: {filteredRequests.length}</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>ID Заявки</Th>
              <Th>Дата</Th>
              <Th>Постачальник</Th>
              <Th>Дебітор</Th>
              <Th>Сума</Th>
              <Th>Статус</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => (
              <tr 
                key={req.id} 
                onClick={() => navigate(`/requests/${req.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <Td style={{ fontWeight: 500, color: '#111827' }}>{req.id}</Td>
                <Td>{req.date}</Td>
                <Td>{req.supplier}</Td>
                <Td>{req.debtor}</Td>
                <Td>₴ {req.amount.toLocaleString()}</Td>
                <Td><Badge $status={req.status}>{getStatusText(req.status)}</Badge></Td>
                <Td style={{ textAlign: 'right' }}>
                  <ActionButton onClick={(e) => { e.stopPropagation(); }}>
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