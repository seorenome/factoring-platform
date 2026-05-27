import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import {
  DashboardHeader,
  Title,
  Grid,
  TableContainer,
  TableHeader,
  Table,
  Th,
  Td,
} from './Dashboard.styled';
import { api, Request, Limit } from '../../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [limits, setLimits] = useState<Limit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsData, limitsData] = await Promise.all([
        api.getRequests(),
        api.getLimits()
      ]);
      setRequests(requestsData);
      setLimits(limitsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs
  const activeRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const totalPortfolio = approvedRequests.reduce((sum, r) => sum + r.financingAmount, 0);
  const totalUsedLimits = limits.reduce((sum, l) => sum + l.usedAmount, 0);
  const totalAvailableLimits = limits.reduce((sum, l) => sum + l.availableAmount, 0);
  
  // Overdue calculation (paymentDate < today)
  const today = new Date();
  const overdueRequests = requests.filter(r => {
    if (!r.paymentDate || r.status !== 'approved') return false;
    return new Date(r.paymentDate) < today;
  });
  const totalOverdue = overdueRequests.reduce((sum, r) => sum + r.financingAmount, 0);

  // Chart data: monthly financing trend
  const getMonthlyData = () => {
    const months = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
    const currentYear = new Date().getFullYear();
    
    return months.slice(0, 6).map((month, index) => {
      const monthRequests = requests.filter(r => {
        const date = new Date(r.createdAt);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      });
      const totalFinanced = monthRequests.reduce((sum, r) => sum + r.financingAmount, 0);
      
      return {
        month,
        financed: totalFinanced / 1000000,
      };
    });
  };

  // Pie chart data: factoring types distribution
  const getFactoringTypeData = () => {
    const classical = requests.filter(r => r.factoringType === 'classical').length;
    const reverse = requests.filter(r => r.factoringType === 'reverse').length;
    const closed = requests.filter(r => r.factoringType === 'closed').length;
    
    return [
      { name: 'Класичний', value: classical, color: '#2563eb' },
      { name: 'Реверсивний', value: reverse, color: '#10b981' },
      { name: 'Закритий', value: closed, color: '#f59e0b' },
    ];
  };

  // Top 5 debtors
  const getTopDebtors = () => {
    const debtorMap = new Map<string, number>();
    approvedRequests.forEach(r => {
      const current = debtorMap.get(r.debtorName) || 0;
      debtorMap.set(r.debtorName, current + r.financingAmount);
    });
    
    return Array.from(debtorMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const monthlyData = getMonthlyData();
  const factoringTypeData = getFactoringTypeData();
  const topDebtors = getTopDebtors();

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
        <Title>{t.dashboard.title}</Title>
        <Button onClick={() => navigate('/requests/create')}>Створити заявку</Button>
      </DashboardHeader>

      {/* KPI Cards */}
      <Grid>
        <Card title="Активні заявки" value={activeRequests.length}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Clock size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Очікують розгляду
            </span>
          </div>
        </Card>
        <Card title="Загальний портфель" value={`₴ ${(totalPortfolio / 1000000).toFixed(1)} млн`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <TrendingUp size={16} color="#10b981" />
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>
              {approvedRequests.length} схвалених заявок
            </span>
          </div>
        </Card>
        <Card title="Використані ліміти" value={`₴ ${(totalUsedLimits / 1000000).toFixed(1)} млн`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <TrendingDown size={16} color="#2563eb" />
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Доступно: ₴ {(totalAvailableLimits / 1000000).toFixed(1)} млн
            </span>
          </div>
        </Card>
        <Card title="Прострочення" value={`₴ ${(totalOverdue / 1000000).toFixed(1)} млн`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <AlertTriangle size={16} color={totalOverdue > 0 ? '#ef4444' : '#10b981'} />
            <span style={{ fontSize: '0.75rem', color: totalOverdue > 0 ? '#ef4444' : '#10b981', fontWeight: 500 }}>
              {overdueRequests.length} прострочених платежів
            </span>
          </div>
        </Card>
      </Grid>

{/* Charts Row */}
<Grid style={{ gridTemplateColumns: '1fr 1fr', minWidth: 0 }}>
  {/* Monthly Financing Chart */}
  <TableContainer>
    <TableHeader>Динаміка фінансування (млн ₴)</TableHeader>
    <div style={{ padding: '1rem', height: '280px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} млн ₴`, 'Фінансування']} />
          <Legend />
          <Line type="monotone" dataKey="financed" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </TableContainer>

  {/* Factoring Type Distribution */}
  <TableContainer>
    <TableHeader>Розподіл за типами факторингу</TableHeader>
    <div style={{ padding: '1rem', height: '280px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={factoringTypeData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {factoringTypeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </TableContainer>
</Grid>

      {/* Top 5 Debtors */}
      <TableContainer style={{ marginBottom: '2rem' }}>
        <TableHeader>Топ-5 дебіторів за обсягом фінансування</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>Дебітор</Th>
              <Th>Сума фінансування</Th>
              <Th>Частка</Th>
            </tr>
          </thead>
          <tbody>
            {topDebtors.length > 0 ? (
              topDebtors.map((debtor, index) => {
                const percentage = (debtor.amount / totalPortfolio) * 100;
                return (
                  <tr key={debtor.name}>
                    <Td style={{ fontWeight: 500 }}>
                      {index + 1}. {debtor.name}
                    </Td>
                    <Td>₴ {(debtor.amount / 1000000).toFixed(2)} млн</Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: '#e5e5e5', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{percentage.toFixed(0)}%</span>
                      </div>
                    </Td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <Td colSpan={3} style={{ textAlign: 'center', color: '#6b7280' }}>Немає даних</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>

      {/* Active Requests Table */}
      <TableContainer>
        <TableHeader>Активні заявки на факторинг ({activeRequests.length})</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Постачальник</Th>
              <Th>Дебітор</Th>
              <Th>Сума</Th>
              <Th>Тип</Th>
              <Th>Статус</Th>
            </tr>
          </thead>
          <tbody>
            {activeRequests.length > 0 ? (
              activeRequests.map(req => (
                <tr key={req.id} onClick={() => navigate(`/requests/${req.id}`)} style={{ cursor: 'pointer' }}>
                  <Td style={{ fontWeight: 500, color: '#2563eb' }}>{req.requestNumber}</Td>
                  <Td>{req.supplierName}</Td>
                  <Td>{req.debtorName}</Td>
                  <Td>₴ {(req.amount / 1000000).toFixed(2)} млн</Td>
                  <Td>
                    {req.factoringType === 'classical' && 'Класичний'}
                    {req.factoringType === 'reverse' && 'Реверсивний'}
                    {req.factoringType === 'closed' && 'Закритий'}
                  </Td>
                  <Td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, backgroundColor: '#fef3c7', color: '#92400e' }}>
                      <Clock size={12} />
                      На розгляді
                    </span>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <Td colSpan={6} style={{ textAlign: 'center', color: '#6b7280' }}>Немає активних заявок</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};