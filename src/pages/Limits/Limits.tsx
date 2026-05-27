import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, Badge } from '../Requests/Requests.styled';
import { Search, Filter, Plus, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import { api, Limit } from '../../services/api';

export const Limits: React.FC = () => {
  const { t } = useI18n();
  const [limits, setLimits] = useState<Limit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [newLimit, setNewLimit] = useState({
    supplierName: '',
    debtorName: '',
    limitAmount: 0
  });

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
    try {
      const limit = limits.find(l => l.id === id);
      if (!limit) return;
      
      await fetch(`http://localhost:3001/api/limits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          limitAmount: editValue,
          availableAmount: editValue - limit.usedAmount
        })
      });
      
      setEditingId(null);
      await loadLimits();
    } catch (error) {
      console.error('Failed to save limit:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей ліміт?')) return;
    
    try {
      await fetch(`http://localhost:3001/api/limits/${id}`, {
        method: 'DELETE'
      });
      await loadLimits();
    } catch (error) {
      console.error('Failed to delete limit:', error);
    }
  };

  const handleCreate = async () => {
    if (!newLimit.supplierName || !newLimit.debtorName || !newLimit.limitAmount) {
      alert('Заповніть всі поля');
      return;
    }
    
    try {
      await fetch('http://localhost:3001/api/limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: 999,
          supplierName: newLimit.supplierName,
          debtorId: 999,
          debtorName: newLimit.debtorName,
          limitAmount: newLimit.limitAmount,
          usedAmount: 0,
          availableAmount: newLimit.limitAmount
        })
      });
      
      setShowModal(false);
      setNewLimit({ supplierName: '', debtorName: '', limitAmount: 0 });
      await loadLimits();
    } catch (error) {
      console.error('Failed to create limit:', error);
    }
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
        <Button icon={<Plus size={16} />} onClick={() => setShowModal(true)}>
          Створити ліміт
        </Button>
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
                  <div style={{ fontWeight: 500 }}>{limit.supplierName}</div>
                </Td>
                <Td>
                  <div style={{ fontWeight: 500 }}>{limit.debtorName}</div>
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
                      <button onClick={() => handleSave(limit.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981' }}>
                        <Check size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(limit)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}>
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(limit.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {/* Modal for creating limit */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Створити новий ліміт</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Постачальник *</label>
              <input
                type="text"
                value={newLimit.supplierName}
                onChange={(e) => setNewLimit({ ...newLimit, supplierName: e.target.value })}
                placeholder="Назва компанії-постачальника"
                style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Дебітор *</label>
              <input
                type="text"
                value={newLimit.debtorName}
                onChange={(e) => setNewLimit({ ...newLimit, debtorName: e.target.value })}
                placeholder="Назва компанії-дебітора"
                style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Сума ліміту (грн) *</label>
              <input
                type="number"
                value={newLimit.limitAmount}
                onChange={(e) => setNewLimit({ ...newLimit, limitAmount: Number(e.target.value) })}
                placeholder="1000000"
                style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowModal(false)}>Скасувати</Button>
              <Button onClick={handleCreate}>Створити</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};