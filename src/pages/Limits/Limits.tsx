import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, Badge, ActionButton } from '../Requests/Requests.styled';
import { Search, Filter, MoreHorizontal, Edit2, Check, X } from 'lucide-react';

interface Limit {
  id: string;
  supplierName: string;
  supplierEdrpou: string;
  debtorName: string;
  debtorEdrpou: string;
  limitAmount: number;
  usedAmount: number;
  availableAmount: number;
  status: 'active' | 'exceeded' | 'expired';
}

const MOCK_LIMITS: Limit[] = [
  { id: 'LIM-001', supplierName: 'ТОВ "Постач-Пром"', supplierEdrpou: '12345678', debtorName: 'ТОВ "Рітейл Груп"', debtorEdrpou: '87654321', limitAmount: 1000000, usedAmount: 250000, availableAmount: 750000, status: 'active' },
  { id: 'LIM-002', supplierName: 'ФОП Коваленко', supplierEdrpou: '32165498', debtorName: 'ТОВ "Еко-Маркет"', debtorEdrpou: '55555555', limitAmount: 500000, usedAmount: 500000, availableAmount: 0, status: 'exceeded' },
  { id: 'LIM-003', supplierName: 'ТОВ "Західбуд"', supplierEdrpou: '99988877', debtorName: 'ПрАТ "Київміськбуд"', debtorEdrpou: '44444444', limitAmount: 2000000, usedAmount: 840000, availableAmount: 1160000, status: 'active' },
];

export const Limits: React.FC = () => {
  const { t } = useI18n();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const getStatusBadge = (status: Limit['status']) => {
    switch(status) {
      case 'active': return <Badge $status="approved">Активний</Badge>;
      case 'exceeded': return <Badge $status="rejected">Ліміт вичерпано</Badge>;
      case 'expired': return <Badge $status="pending">Прострочений</Badge>;
    }
  };

  const handleEdit = (limit: Limit) => {
    setEditingId(limit.id);
    setEditValue(limit.limitAmount);
  };

  const handleSave = (id: string) => {
    console.log('Save limit', id, editValue);
    setEditingId(null);
  };

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
        <TableHeader>Всі ліміти ({MOCK_LIMITS.length})</TableHeader>
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
            {MOCK_LIMITS.map(limit => (
              <tr key={limit.id}>
                <Td>
                  <div>
                    <div style={{ fontWeight: 500 }}>{limit.supplierName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{limit.supplierEdrpou}</div>
                  </div>
                </Td>
                <Td>
                  <div>
                    <div style={{ fontWeight: 500 }}>{limit.debtorName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{limit.debtorEdrpou}</div>
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