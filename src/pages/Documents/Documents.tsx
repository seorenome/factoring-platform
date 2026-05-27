import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, Badge } from '../Requests/Requests.styled';
import { Search, Filter, Upload, FileText, Loader2, CheckCircle, Trash2 } from 'lucide-react';
import { api, Document } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export const Documents: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await api.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    switch(status) {
      case 'verified': return <Badge $status="approved">{t.documents.verified}</Badge>;
      case 'pending': return <Badge $status="pending">{t.documents.pending}</Badge>;
      case 'rejected': return <Badge $status="rejected">Відхилено</Badge>;
      default: return <Badge $status="pending">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'invoice': return t.documents.invoice;
      case 'act': return t.documents.act;
      case 'contract': return t.documents.contract;
      default: return type;
    }
  };

  const handleVerify = async (id: number) => {
    try {
      await api.verifyDocument(id);
      await loadDocuments();
    } catch (error) {
      console.error('Failed to verify document:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.users.deleteConfirm)) return;
    try {
      await api.deleteDocument(id);
      await loadDocuments();
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Title>{t.documents.title}</Title>
        <Button icon={<Upload size={16} />}>{t.common.uploadDocument}</Button>
      </DashboardHeader>

      <FilterBar>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder={t.documents.searchPlaceholder}
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
        <Button variant="outline" icon={<Filter size={16} />}>{t.common.filters}</Button>
      </FilterBar>

      <TableContainer>
        <TableHeader>{t.documents.title} ({filteredDocuments.length})</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>{t.documents.name}</Th>
              <Th>{t.documents.type}</Th>
              <Th>{t.requests.date}</Th>
              <Th>{t.documents.counterparty}</Th>
              <Th>{t.requests.status}</Th>
              <Th>{t.common.actions}</Th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map(doc => (
              <tr key={doc.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, color: '#111827' }}>
                    <FileText size={18} color="#6b7280" />
                    {doc.name}
                  </div>
                </Td>
                <Td>{getTypeLabel(doc.type)}</Td>
                <Td>{new Date(doc.createdAt).toLocaleDateString()}</Td>
                <Td>{doc.supplierName}</Td>
                <Td>{getStatusBadge(doc.status)}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {user?.role === 'factor' && doc.status === 'pending' && (
                      <button onClick={() => handleVerify(doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981' }}>
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};