import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader } from '../Dashboard/Dashboard.styled';
import { Badge } from '../Requests/Requests.styled';
import { Bell, CheckCircle, AlertCircle, FileText, DollarSign, Loader2 } from 'lucide-react';
import { api, Request } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Notification {
  id: string;
  type: 'request' | 'document' | 'payment' | 'kyc';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotifications = (): Notification[] => {
    const notifs: Notification[] = [];
    
    // Notifications for new pending requests (for factor)
    if (user?.role === 'factor') {
      const pendingRequests = requests.filter(r => r.status === 'pending');
      pendingRequests.forEach(req => {
        notifs.push({
          id: `req-${req.id}`,
          type: 'request',
          title: 'Нова заявка на факторинг',
          message: `Постачальник ${req.supplierName} створив заявку на суму ₴ ${req.amount.toLocaleString()}`,
          date: new Date(req.createdAt).toLocaleString(),
          read: readIds.has(`req-${req.id}`),
        });
      });
    }
    
    // Notifications for approved requests (for supplier)
    if (user?.role === 'supplier') {
      const approvedRequests = requests.filter(r => r.status === 'approved');
      approvedRequests.forEach(req => {
        notifs.push({
          id: `approved-${req.id}`,
          type: 'payment',
          title: 'Заявку схвалено',
          message: `Вашу заявку ${req.requestNumber} схвалено. Сума фінансування: ₴ ${req.financingAmount.toLocaleString()}`,
          date: new Date(req.createdAt).toLocaleString(),
          read: readIds.has(`approved-${req.id}`),
        });
      });
    }
    
    return notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getIcon = (type: Notification['type']) => {
    switch(type) {
      case 'request': return <FileText size={20} color="#2563eb" />;
      case 'document': return <CheckCircle size={20} color="#10b981" />;
      case 'payment': return <DollarSign size={20} color="#f59e0b" />;
      case 'kyc': return <AlertCircle size={20} color="#8b5cf6" />;
    }
  };

  const notifications = getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set(prev).add(id));
  };

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadIds(allIds);
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
          {notifications.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
              Немає повідомлень
            </div>
          ) : (
            notifications.map(notif => (
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
            ))
          )}
        </div>
      </TableContainer>
    </Layout>
  );
};