import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, TabsContainer, TabItem, Badge } from './Requests.styled';
import { Search, Filter, FilePlus, Loader2 } from 'lucide-react';
import { api, Request } from '../../services/api';

export const Requests: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await api.getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRequests = () => {
    let filtered = requests;

    if (activeTab === 'pending') {
      filtered = filtered.filter(req => req.status === 'pending');
    } else if (activeTab === 'approved') {
      filtered = filtered.filter(req => req.status === 'approved');
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.requestNumber.toLowerCase().includes(query) ||
        req.supplierName.toLowerCase().includes(query) ||
        req.debtorName.toLowerCase().includes(query)
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
      default: return status;
    }
  };

  const filteredRequests = getFilteredRequests();

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader2 size={32} className="animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardHeader>
        <Title>Заявки на факторинг</Title>
        <Button icon={<FilePlus size={16} />} onClick={() => navigate('/requests/create')}>
          Створити заявку
        </Button>
      </DashboardHeader>

      <TabsContainer>
        <TabItem $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          Всі заявки ({requests.length})
        </TabItem>
        <TabItem $active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
          На розгляді ({requests.filter(r => r.status === 'pending').length})
        </TabItem>
        <TabItem $active={activeTab === 'approved'} onClick={() => setActiveTab('approved')}>
          Схвалені ({requests.filter(r => r.status === 'approved').length})
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
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => (
              <tr 
                key={req.id} 
                onClick={() => navigate(`/requests/${req.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <Td style={{ fontWeight: 500, color: '#111827' }}>{req.requestNumber}</Td>
                <Td>{new Date(req.createdAt).toLocaleDateString()}</Td>
                <Td>{req.supplierName}</Td>
                <Td>{req.debtorName}</Td>
                <Td>₴ {req.amount.toLocaleString()}</Td>
                <Td><Badge $status={req.status}>{getStatusText(req.status)}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};