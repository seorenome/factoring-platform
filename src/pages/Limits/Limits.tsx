import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, Badge, ActionButton } from '../Requests/Requests.styled';
import { Search, Filter, MoreHorizontal, Edit2, Check, X, Loader2 } from 'lucide-react';
import { api, Limit } from '../../services/api';

export const Limits: React.FC = () => {
  const [limits, setLimits] = useState<Limit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  useEffect(() => {
    loadLimits();
  }, []);

  const loadLimits = async () => {
    try {
      const data = await api.getLimits();
      setLimits(data);
    } catch (error) {
      console.error('Failed to load limits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <Badge $status="approved">Активний</Badge>;
      case 'exceeded': return <Badge $status="rejected">Ліміт вичерпано</Badge>;
      case 'expired': return <Badge $status="pending">Прострочений</Badge>;
      default: return <Badge $status="pending">{status}</Badge>;
    }
  };

  const handleEdit = (limit: Limit) => {
    setEditingId(limit.id);
    setEditValue(limit.limitAmount);
  };

  const handleSave = async (id: number) => {
    // TODO: Implement update limit API
    console.log('Save limit', id, editValue);
    setEditingId(null);
  };

  const filteredLimits = limits.filter(limit =>
    limit.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    limit.debtorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Title>Управління лімітами</Title>
        <Button icon={<Edit2 size={16} />}>Створити ліміт</Button>
      </DashboardHeader>

      <FilterBar>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Пошук за постачальником або дебітором..." 
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
        <TableHeader>Всі ліміти ({filteredLimits.length})</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>Постачальник</Th>
              <Th>Дебітор</Th>
              <Th>Ліміт (грн)</Th>
              <Th>Використано</Th>
              <Th>Доступно</Th>
              <Th>Статус</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {filteredLimits.map(limit => (
              <tr key={limit.id}>
                <Td>
                  <div>
                    <div style={{ fontWeight: 500 }}>{limit.supplierName}</div>
                  </div>
                </Td>
                <Td>
                  <div>
                    <div style={{ fontWeight: 500 }}>{limit.debtorName}</div>
                  </div>
                </Td>
                <Td>
                  {editingId === limit.id ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(Number(e.target.value))}
                      style={{ width: '120px', padding: '0.25rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                    />
                  ) : (
                    `₴ ${limit.limitAmount.toLocaleString()}`
                  )}
                </Td>
                <Td>₴ {limit.usedAmount.toLocaleString()}</Td>
                <Td>₴ {limit.availableAmount.toLocaleString()}</Td>
                <Td>{getStatusBadge(limit.status)}</Td>
                <Td style={{ textAlign: 'right' }}>
                  {editingId === limit.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <ActionButton onClick={() => handleSave(limit.id)}><Check size={18} /></ActionButton>
                      <ActionButton onClick={() => setEditingId(null)}><X size={18} /></ActionButton>
                    </div>
                  ) : (
                    <ActionButton onClick={() => handleEdit(limit)}><MoreHorizontal size={18} /></ActionButton>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};