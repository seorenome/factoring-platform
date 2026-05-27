import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../contexts/AuthContext';
import { api, User } from '../../services/api';
import { Loader2, User as UserIcon, Mail, Shield, Calendar, Save, Edit2, X } from 'lucide-react';

export const Profile: React.FC = () => {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email
      });
      setLoading(false);
    }
  }, [user]);

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'factor': return t.roles.factor;
      case 'supplier': return t.roles.supplier;
      case 'debtor': return t.roles.debtor;
      case 'admin': return t.roles.admin;
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'factor': return '#2563eb';
      case 'supplier': return '#10b981';
      case 'debtor': return '#f59e0b';
      case 'admin': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }
    
    try {
      // Update user profile
      const response = await fetch('http://localhost:3001/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword || undefined
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Помилка оновлення');
      }
      
      setSuccess('Профіль успішно оновлено');
      setIsEditing(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getAvatarInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return '?';
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
        <Title>Мій профіль</Title>
        {!isEditing && (
          <Button icon={<Edit2 size={16} />} onClick={() => setIsEditing(true)}>
            Редагувати
          </Button>
        )}
      </DashboardHeader>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Avatar Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '1rem',
          border: '1px solid #e5e5e5'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: getRoleColor(user?.role || 'factor'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2.5rem',
            fontWeight: 600,
            color: 'white'
          }}>
            {getAvatarInitials()}
          </div>
          {!isEditing ? (
            <>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>{user?.name}</h2>
              <p style={{ margin: '0.5rem 0 0', color: getRoleColor(user?.role || 'factor'), fontWeight: 500 }}>
                {getRoleLabel(user?.role || 'factor')}
              </p>
            </>
          ) : (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                textAlign: 'center',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                width: '100%',
                marginBottom: '0.5rem'
              }}
            />
          )}
        </div>

        {/* Profile Info Card */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          border: '1px solid #e5e5e5',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
            Інформація профілю
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              <Mail size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Email
            </label>
            {!isEditing ? (
              <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}>{user?.email}</div>
            ) : (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            )}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              <Shield size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Роль
            </label>
            <div style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              backgroundColor: getRoleColor(user?.role || 'factor') + '20',
              color: getRoleColor(user?.role || 'factor'),
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              {getRoleLabel(user?.role || 'factor')}
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Дата реєстрації
            </label>
            <div style={{ fontSize: '0.875rem', color: '#111827' }}>
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Change Password Section (only in edit mode) */}
        {isEditing && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid #e5e5e5',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
              Зміна паролю
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                Поточний пароль
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                Новий пароль
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                Підтвердження паролю
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {success}
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setFormData({ ...formData, name: user?.name || '', email: user?.email || '', currentPassword: '', newPassword: '', confirmPassword: '' });
              setError('');
            }}>
              <X size={16} /> Скасувати
            </Button>
            <Button onClick={handleSave}>
              <Save size={16} /> Зберегти
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};