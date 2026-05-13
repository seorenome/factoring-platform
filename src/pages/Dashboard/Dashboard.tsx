import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
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

export const Dashboard: React.FC = () => {
  const { t } = useI18n();

  return (
    <Layout>
      <DashboardHeader>
        <Title>{t.dashboard.title}</Title>
        <Button>{t.common.create} заявку</Button>
      </DashboardHeader>

      <Grid>
        <Card title={t.dashboard.activeRequests} value="12" />
        <Card title={t.dashboard.totalFinanced} value="₴ 4,500,000" />
        <Card title={t.dashboard.pendingDocuments} value="5" />
      </Grid>

      <TableContainer>
        <TableHeader>Останні заявки на факторинг</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Постачальник</Th>
              <Th>Дебітор</Th>
              <Th>Сума</Th>
              <Th>Статус</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>#REQ-001</Td>
              <Td>ТОВ "Постач-Пром"</Td>
              <Td>ТОВ "Рітейл Груп"</Td>
              <Td>₴ 250,000</Td>
              <Td>На розгляді</Td>
            </tr>
            <tr>
              <Td>#REQ-002</Td>
              <Td>ФОП Коваленко</Td>
              <Td>ТОВ "Еко-Маркет"</Td>
              <Td>₴ 120,000</Td>
              <Td>Схвалено</Td>
            </tr>
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};
