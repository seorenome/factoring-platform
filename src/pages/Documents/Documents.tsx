import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, Badge, ActionButton } from '../Requests/Requests.styled';
import { Search, Filter, MoreHorizontal, Upload, FileText, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  supplierName: string;
  status: 'verified' | 'pending' | 'rejected';
  fileUrl?: string;
}

export const Documents: React.FC = () => {
  const { t } = useI18n();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // TODO: Add backend endpoint for documents
      // For now, use mock data
      const mockDocuments: Document[] = [
        { id: 'DOC-101', name: 'Рахунок-фактура №142.pdf', type: 'Рахунок-фактура', date: '2026-05-08', supplierName: 'ТОВ "Постач-Пром"', status: 'verified' },
        { id: 'DOC-102', name: 'Видаткова_накладна_ВН-88.pdf', type: 'Видаткова накладна', date: '2026-05-08', supplierName: 'ТОВ "Постач-Пром"', status: 'pending' },
        { id: 'DOC-103', name: 'Договір_поставки_12-А.pdf', type: 'Договір', date: '2026-05-01', supplierName: 'ФОП Коваленко', status: 'verified' },
        { id: 'DOC-104', name: 'Рахунок-фактура №221.pdf', type: 'Рахунок-фактура', date: '2026-05-10', supplierName: 'ФОП Коваленко', status: 'pending' },
      ];
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    switch(status) {
      case 'verified': return <Badge $status="approved">Перевірено</Badge>;
      case 'pending': return <Badge $status="pending">На перевірці</Badge>;
      case 'rejected': return <Badge $status="rejected">Відхилено</Badge>;
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.id.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Title>{t.common.documents}</Title>
        <Button icon={<Upload size={16} />}>Завантажити документ</Button>
      </DashboardHeader>

      <FilterBar>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Пошук за назвою або ID..." 
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
        <TableHeader>Всі документи ({filteredDocuments.length})</TableHeader>
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
            {filteredDocuments.map(doc => (
              <tr key={doc.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, color: '#111827' }}>
                    <FileText size={18} color="#6b7280" />
                    {doc.name}
                  </div>
                </Td>
                <Td>{doc.type}</Td>
                <Td>{doc.date}</Td>
                <Td>{doc.supplierName}</Td>
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