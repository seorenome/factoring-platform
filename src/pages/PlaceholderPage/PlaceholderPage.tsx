import React from 'react';
import { Layout } from '../../components/Layout/Layout';
import { Title, DashboardHeader } from '../Dashboard/Dashboard.styled';

export const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Layout>
      <DashboardHeader>
        <Title>{title}</Title>
      </DashboardHeader>
      <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>This page is coming soon.</div>
    </Layout>
  );
};
