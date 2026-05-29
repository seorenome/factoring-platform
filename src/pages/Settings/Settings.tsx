import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { User, Bell, Database, ChevronRight, Trash2, RefreshCw } from 'lucide-react';

export const Settings: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Налаштування сповіщень (зберігаються в localStorage)
  const [notifications, setNotifications] = useState({
    newRequests: true,
    statusChange: false,
    weeklyReport: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('user_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveNotifications = (key: keyof typeof notifications, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    localStorage.setItem('user_notifications', JSON.stringify(updated));
  };

  const clearCache = () => {
    if (confirm('Очистити кеш застосунку? Після оновлення сторінки дані будуть перезавантажені.')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Layout>
      <DashboardHeader>
        <Title>Налаштування</Title>
      </DashboardHeader>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Вкладка Профіль */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          border: '1px solid #e5e5e5',
          marginBottom: '1.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e5e5',
            background: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <User size={18} color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Профіль</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#111827' }}>Керування профілем</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Редагувати особисті дані, змінити пароль
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              Перейти <ChevronRight size={14} style={{ marginLeft: '0.25rem' }} />
            </Button>
          </div>
        </div>

        {/* Вкладка Сповіщення */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          border: '1px solid #e5e5e5',
          marginBottom: '1.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e5e5',
            background: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Bell size={18} color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Сповіщення</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#111827' }}>Нові заявки</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Отримувати сповіщення про нові заявки на факторинг</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input
                  type="checkbox"
                  checked={notifications.newRequests}
                  onChange={(e) => saveNotifications('newRequests', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: notifications.newRequests ? '#2563eb' : '#cbd5e1',
                  transition: '0.3s',
                  borderRadius: '24px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.3s',
                    borderRadius: '50%',
                    transform: notifications.newRequests ? 'translateX(20px)' : 'translateX(0)'
                  }} />
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#111827' }}>Зміна статусу</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Отримувати сповіщення про зміну статусу заявок</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input
                  type="checkbox"
                  checked={notifications.statusChange}
                  onChange={(e) => saveNotifications('statusChange', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: notifications.statusChange ? '#2563eb' : '#cbd5e1',
                  transition: '0.3s',
                  borderRadius: '24px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.3s',
                    borderRadius: '50%',
                    transform: notifications.statusChange ? 'translateX(20px)' : 'translateX(0)'
                  }} />
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#111827' }}>Щотижневий звіт</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Отримувати звіт на email щопонеділка</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input
                  type="checkbox"
                  checked={notifications.weeklyReport}
                  onChange={(e) => saveNotifications('weeklyReport', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: notifications.weeklyReport ? '#2563eb' : '#cbd5e1',
                  transition: '0.3s',
                  borderRadius: '24px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.3s',
                    borderRadius: '50%',
                    transform: notifications.weeklyReport ? 'translateX(20px)' : 'translateX(0)'
                  }} />
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Вкладка Система (тільки для factor/admin) */}
        {(user?.role === 'factor' || user?.role === 'admin') && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid #e5e5e5',
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e5e5e5',
              background: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Database size={18} color="#2563eb" />
              <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Система</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#111827' }}>Версія застосунку</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Поточна версія платформи</div>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>1.0.0</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#111827' }}>Очистити кеш</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Видалити локальні дані та перезавантажити</div>
                </div>
                <Button variant="outline" onClick={clearCache} icon={<RefreshCw size={14} />}>
                  Очистити
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};