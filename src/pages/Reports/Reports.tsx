import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, Grid } from '../Dashboard/Dashboard.styled';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { FilterBar } from '../Requests/Requests.styled';
import { Download, TrendingUp, TrendingDown, AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import { api, Request } from '../../services/api';

interface ReportData {
  month: string;
  totalFinanced: number;
  requestsCount: number;
  avgAmount: number;
  overdueAmount: number;
}

export const Reports: React.FC = () => {
  const [period, setPeriod] = useState('2026');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = (): ReportData[] => {
    const months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
    const currentYear = new Date().getFullYear();
    
    return months.slice(0, 5).map((month, index) => {
      const monthRequests = requests.filter(r => {
        const date = new Date(r.createdAt);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      });
      
      const totalFinanced = monthRequests.reduce((sum, r) => sum + r.financingAmount, 0);
      const requestsCount = monthRequests.length;
      const avgAmount = requestsCount > 0 ? totalFinanced / requestsCount : 0;
      
      return {
        month: `${month} ${currentYear}`,
        totalFinanced,
        requestsCount,
        avgAmount,
        overdueAmount: 0,
      };
    });
  };

  const report = generateReport();
  const totalFinanced = report.reduce((sum, m) => sum + m.totalFinanced, 0);
  const totalRequests = report.reduce((sum, m) => sum + m.requestsCount, 0);

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
        <Title>Фінансова звітність</Title>
        <Button variant="outline" icon={<Download size={16} />}>Експортувати звіт</Button>
      </DashboardHeader>

      <FilterBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="#6b7280" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
          >
            <option value="2025">2025 рік</option>
            <option value="2026">2026 рік</option>
          </select>
        </div>
      </FilterBar>

      <Grid>
        <Card
          title="Загальний обсяг фінансування"
          value={`₴ ${(totalFinanced / 1000000).toFixed(1)} млн`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <TrendingUp size={16} color="#10b981" />
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>За даними заявок</span>
          </div>
        </Card>
        <Card
          title="Кількість заявок"
          value={totalRequests}
        />
        <Card
          title="Активні заявки"
          value={requests.filter(r => r.status === 'pending').length}
        />
        <Card
          title="Схвалені заявки"
          value={requests.filter(r => r.status === 'approved').length}
        />
      </Grid>

      <TableContainer>
        <TableHeader>Динаміка за місяцями</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>Місяць</Th>
              <Th>Обсяг фінансування</Th>
              <Th>Кількість заявок</Th>
              <Th>Середня сума</Th>
              <Th>Прострочення</Th>
            </tr>
          </thead>
          <tbody>
            {report.map(row => (
              <tr key={row.month}>
                <Td style={{ fontWeight: 500 }}>{row.month}</Td>
                <Td>₴ {(row.totalFinanced / 1000000).toFixed(1)} млн</Td>
                <Td>{row.requestsCount}</Td>
                <Td>₴ {(row.avgAmount / 1000).toFixed(0)} тис</Td>
                <Td style={{ color: '#6b7280' }}>₴ {(row.overdueAmount / 1000).toFixed(0)} тис</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};