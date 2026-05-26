import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { FilterBar } from '../Requests/Requests.styled';
import { Button } from '../../components/Button/Button';
import { Search, Filter, Download, User, Building2, FileText, CheckCircle, XCircle, Edit2, Loader2 } from 'lucide-react';
import { api, AuditEntry } from '../../services/api';

export const AuditLog: React.FC = () => {
  const { t } = useI18n();
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    try {
      const data = await api.getAudit();
      setAudit(data);
    } catch (error) {
      console.error('Failed to load audit:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch(action) {
      case 'CREATE': return <CheckCircle size={16} color="#10b981" />;
      case 'UPDATE':
      case 'EDIT': return <Edit2 size={16} color="#f59e0b" />;
      case 'DELETE': return <XCircle size={16} color="#ef4444" />;
      case 'APPROVE':
      case 'SIGN': return <CheckCircle size={16} color="#10b981" />;
      case 'REJECT': return <XCircle size={16} color="#ef4444" />;
      case 'LOGIN': return <User size={16} color="#3b82f6" />;
      default: return <FileText size={16} color="#6b7280" />;
    }
  };

  const getEntityIcon = (type: string) => {
    switch(type) {
      case 'company': return <Building2 size={16} color="#6b7280" />;
      case 'user': return <User size={16} color="#6b7280" />;
      case 'request': return <FileText size={16} color="#6b7280" />;
      case 'auth': return <User size={16} color="#6b7280" />;
      default: return <FileText size={16} color="#6b7280" />;
    }
  };

  const filteredAudit = audit.filter(entry =>
    entry.userName.toLowerCase().includes(search.toLowerCase()) ||
    entry.entityName.toLowerCase().includes(search.toLowerCase()) ||
    entry.action.toLowerCase().includes(search.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['ID', 'Час', 'Користувач', 'Роль', 'Дія', 'Тип', 'Об\'єкт', 'Деталі', 'IP'];
    const rows = filteredAudit.map(entry => [
      entry.id, entry.createdAt, entry.userName, entry.userRole, entry.action,
      entry.entityType, entry.entityName, entry.details, entry.ipAddress
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().slice(0,19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <Title>Журнал аудиту</Title>
        <Button variant="outline" icon={<Download size={16} />} onClick={exportToCSV}>
          Експортувати CSV
        </Button>
      </DashboardHeader>

      <FilterBar>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Пошук за користувачем, об'єктом або дією..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        <TableHeader>Всього записів: {filteredAudit.length}</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>Час</Th>
              <Th>Користувач</Th>
              <Th>Дія</Th>
              <Th>Тип</Th>
              <Th>Об'єкт</Th>
              <Th>Деталі</Th>
              <Th>IP</Th>
            </tr>
          </thead>
          <tbody>
            {filteredAudit.map(entry => (
              <tr key={entry.id}>
                <Td style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(entry.createdAt).toLocaleString()}</Td>
                <Td>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{entry.userName}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{entry.userRole}</div>
                </Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getActionIcon(entry.action)}
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{entry.action}</span>
                  </div>
                </Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getEntityIcon(entry.entityType)}
                    <span style={{ fontSize: '0.875rem' }}>{entry.entityType}</span>
                  </div>
                </Td>
                <Td>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{entry.entityName}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{entry.entityId}</div>
                </Td>
                <Td style={{ fontSize: '0.875rem', color: '#374151' }}>{entry.details}</Td>
                <Td style={{ fontSize: '0.75rem', color: '#6b7280' }}>{entry.ipAddress}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};