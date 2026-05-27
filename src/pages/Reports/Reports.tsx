import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, Grid } from '../Dashboard/Dashboard.styled';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { FilterBar } from '../Requests/Requests.styled';
import { Download, TrendingUp, Calendar, Loader2, FileText, FileSpreadsheet } from 'lucide-react';
import { api, Request } from '../../services/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportData {
  month: string;
  totalFinanced: number;
  requestsCount: number;
  avgAmount: number;
  overdueAmount: number;
}

export const Reports: React.FC = () => {
  const { t } = useI18n();
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
    const months = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
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
  const activeRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;

  const exportToCSV = () => {
    const headers = [t.reports.month, t.reports.amount, t.reports.count, t.reports.average, t.reports.overdue];
    const rows = report.map(row => [
      row.month,
      row.totalFinanced,
      row.requestsCount,
      row.avgAmount,
      row.overdueAmount
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_report_${new Date().toISOString().slice(0,19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const data = report.map(row => ({
      [t.reports.month]: row.month,
      [t.reports.amount]: row.totalFinanced,
      [t.reports.count]: row.requestsCount,
      [t.reports.average]: row.avgAmount,
      [t.reports.overdue]: row.overdueAmount
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Financial Report');
    XLSX.writeFile(wb, `financial_report_${new Date().toISOString().slice(0,19)}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(t.reports.title, 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Дата: ${new Date().toLocaleDateString()}`, 14, 35);
    
    const tableData = report.map(row => [
      row.month,
      `${(row.totalFinanced / 1000000).toFixed(2)} млн ₴`,
      row.requestsCount.toString(),
      `${(row.avgAmount / 1000).toFixed(0)} тис ₴`,
      `${(row.overdueAmount / 1000).toFixed(0)} тис ₴`
    ]);
    
    (doc as any).autoTable({
      head: [[t.reports.month, t.reports.amount, t.reports.count, t.reports.average, t.reports.overdue]],
      body: tableData,
      startY: 50,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] }
    });
    
    doc.save(`financial_report_${new Date().toISOString().slice(0,19)}.pdf`);
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
        <Title>{t.reports.title}</Title>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" icon={<FileSpreadsheet size={16} />} onClick={exportToExcel}>
            Excel
          </Button>
          <Button variant="outline" icon={<FileText size={16} />} onClick={exportToPDF}>
            PDF
          </Button>
          <Button variant="outline" icon={<Download size={16} />} onClick={exportToCSV}>
            CSV
          </Button>
        </div>
      </DashboardHeader>

      <FilterBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="#6b7280" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
      </FilterBar>

      <Grid>
        <Card
          title={t.reports.totalFinanced}
          value={`₴ ${(totalFinanced / 1000000).toFixed(1)} млн`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <TrendingUp size={16} color="#10b981" />
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>{t.dashboard.totalFinanced}</span>
          </div>
        </Card>
        <Card
          title={t.reports.totalRequests}
          value={totalRequests}
        />
        <Card
          title={t.reports.activeRequests}
          value={activeRequests}
        />
        <Card
          title={t.reports.approvedRequests}
          value={approvedRequests}
        />
      </Grid>

      <TableContainer>
        <TableHeader>{t.reports.monthlyDynamics}</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>{t.reports.month}</Th>
              <Th>{t.reports.amount}</Th>
              <Th>{t.reports.count}</Th>
              <Th>{t.reports.average}</Th>
              <Th>{t.reports.overdue}</Th>
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