import React, { useState } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, Grid } from '../Dashboard/Dashboard.styled';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { FilterBar } from '../Requests/Requests.styled';
import { Download, TrendingUp, TrendingDown, AlertTriangle, Calendar } from 'lucide-react';

interface ReportData {
  month: string;
  totalFinanced: number;
  requestsCount: number;
  avgAmount: number;
  overdueAmount: number;
}

const MOCK_REPORT: ReportData[] = [
  { month: 'Січень 2026', totalFinanced: 3500000, requestsCount: 14, avgAmount: 250000, overdueAmount: 120000 },
  { month: 'Лютий 2026', totalFinanced: 4200000, requestsCount: 18, avgAmount: 233333, overdueAmount: 95000 },
  { month: 'Березень 2026', totalFinanced: 5100000, requestsCount: 22, avgAmount: 231818, overdueAmount: 145000 },
  { month: 'Квітень 2026', totalFinanced: 4800000, requestsCount: 20, avgAmount: 240000, overdueAmount: 110000 },
  { month: 'Травень 2026', totalFinanced: 2500000, requestsCount: 11, avgAmount: 227273, overdueAmount: 45000 },
];

export const Reports: React.FC = () => {
  const [period, setPeriod] = useState('2026');

  const totalFinanced = MOCK_REPORT.reduce((sum, m) => sum + m.totalFinanced, 0);
  const totalRequests = MOCK_REPORT.reduce((sum, m) => sum + m.requestsCount, 0);
  const totalOverdue = MOCK_REPORT.reduce((sum, m) => sum + m.overdueAmount, 0);
  const overduePercent = (totalOverdue / totalFinanced) * 100;

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
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>+8.5% до попереднього періоду</span>
          </div>
        </Card>
        <Card
          title="Кількість заявок"
          value={totalRequests}
        />
        <Card
          title="Прострочена заборгованість"
          value={`₴ ${(totalOverdue / 1000000).toFixed(2)} млн`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <AlertTriangle size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 500 }}>{overduePercent.toFixed(1)}% від обсягу</span>
          </div>
        </Card>
        <Card
          title="Ризик-профіль"
          value="Низький"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <TrendingDown size={16} color="#10b981" />
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Жодних санкційних ризиків</span>
          </div>
        </Card>
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
            {MOCK_REPORT.map(row => (
              <tr key={row.month}>
                <Td style={{ fontWeight: 500 }}>{row.month}</Td>
                <Td>₴ {(row.totalFinanced / 1000000).toFixed(1)} млн</Td>
                <Td>{row.requestsCount}</Td>
                <Td>₴ {(row.avgAmount / 1000).toFixed(0)} тис</Td>
                <Td style={{ color: row.overdueAmount > 100000 ? '#dc2626' : '#6b7280' }}>
                  ₴ {(row.overdueAmount / 1000).toFixed(0)} тис
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};