import React, { useState } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader } from '../Dashboard/Dashboard.styled';
import { Badge } from '../Requests/Requests.styled';
import { Bell, CheckCircle, AlertCircle, FileText, DollarSign } from 'lucide-react';

interface Notification {
  id: string;
  type: 'request' | 'document' | 'payment' | 'kyc';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'NOT-001', type: 'request', title: 'Нова заявка на факторинг', message: 'Постачальник ТОВ "Постач-Пром" створив нову заявку #REQ-005', date: '2026-05-13 10:30', read: false },
  { id: 'NOT-002', type: 'document', title: 'Документ потребує підпису', message: 'Договір факторингу #CONTR-012 очікує вашого підпису (КЕП)', date: '2026-05-13 09:15', read: false },
  { id: 'NOT-003', type: 'payment', title: 'Отримано оплату від дебітора', message: 'ТОВ "Рітейл Груп" здійснив оплату на суму ₴ 250,000', date: '2026-05-12 16:45', read: true },
  { id: 'NOT-004', type: 'kyc', title: 'KYC/AML перевірку завершено', message: 'Компанію ТОВ "Агроінвест" перевірено та схвалено', date: '2026-05-12 14:20', read: true },
  { id: 'NOT-005', type: 'request', title: 'Заявка відхилена', message: 'Заявку #REQ-003 відхилено фактором', date: '2026-05-11 11:00', read: true },
];

const getIcon = (type: Notification['type']) => {
  switch(type) {
    case 'request': return <FileText size={20} color="#2563eb" />;
    case 'document': return <CheckCircle size={20} color="#10b981" />;
    case 'payment': return <DollarSign size={20} color="#f59e0b" />;
    case 'kyc': return <AlertCircle size={20} color="#8b5cf6" />;
  }
};

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Layout>
      <DashboardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bell size={28} />
          <Title>Повідомлення</Title>
          {unreadCount > 0 && <Badge $status="pending">{unreadCount} непрочитаних</Badge>}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
          >
            Позначити всі як прочитані
          </button>
        )}
      </DashboardHeader>

      <TableContainer>
        <TableHeader>Історія повідомлень</TableHeader>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e5e5',
                backgroundColor: notif.read ? '#ffffff' : '#fefce8',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
            >
              <div style={{ flexShrink: 0 }}>{getIcon(notif.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{notif.title}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{notif.date}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      </TableContainer>
    </Layout>
  );
};