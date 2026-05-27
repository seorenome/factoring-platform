import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, Badge } from '../Requests/Requests.styled';
import { Search, Filter, Plus, Loader2 } from 'lucide-react';
import { api, Company } from '../../services/api';

export const Companies: React.FC = () => {
  const { t } = useI18n();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await api.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Company['kycStatus']) => {
    switch(status) {
      case 'approved': return <Badge $status="approved">{t.companies.kycApproved}</Badge>;
      case 'pending': return <Badge $status="pending">{t.companies.kycPending}</Badge>;
      case 'rejected': return <Badge $status="rejected">{t.companies.kycRejected}</Badge>;
      default: return <Badge $status="pending">{status}</Badge>;
    }
  };

  const getRoleLabel = (name: string, edrpou: string) => {
    if (edrpou === '87654321') return t.roles.debtor;
    if (edrpou === '12345678') return t.roles.supplier;
    if (edrpou === '55555555') return t.roles.debtor;
    if (edrpou === '32165498') return t.roles.supplier;
    return t.companies.role;
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.edrpou.includes(searchQuery)
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
        <Title>{t.companies.title}</Title>
        <Button icon={<Plus size={16} />}>{t.common.addCompany}</Button>
      </DashboardHeader>

      <FilterBar>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder={t.companies.searchPlaceholder}
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
        <TableHeader>{t.companies.title} ({filteredCompanies.length})</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>{t.companies.name}</Th>
              <Th>{t.companies.edrpou}</Th>
              <Th>{t.companies.role}</Th>
              <Th>{t.companies.kycStatus}</Th>
              <Th>{t.companies.registrationDate}</Th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map(company => (
              <tr key={company.id}>
                <Td style={{ fontWeight: 600, color: '#111827' }}>{company.name}</Td>
                <Td>{company.edrpou}</Td>
                <Td>{getRoleLabel(company.name, company.edrpou)}</Td>
                <Td>{getStatusBadge(company.kycStatus)}</Td>
                <Td>{new Date(company.createdAt).toLocaleDateString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};