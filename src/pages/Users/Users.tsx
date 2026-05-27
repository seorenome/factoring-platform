import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, Badge, ActionButton } from '../Requests/Requests.styled';
import { Search, Filter, MoreHorizontal, Plus, UserPlus, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'factor' | 'supplier' | 'debtor' | 'admin';
  createdAt: string;
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // TODO: Add backend endpoint for users
      // For now, use mock data from auth demo users
      const mockUsers: User[] = [
        { id: 1, email: 'factor@finfactor.com', name: 'Олена Петренко', role: 'factor', createdAt: '2026-01-15' },
        { id: 2, email: 'supplier@finfactor.com', name: 'Іван Коваленко', role: 'supplier', createdAt: '2026-02-10' },
        { id: 3, email: 'debtor@finfactor.com', name: 'Андрій Мельник', role: 'debtor', createdAt: '2026-03-05' },
        { id: 4, email: 'admin@finfactor.com', name: 'Адміністратор', role: 'admin', createdAt: '2026-01-01' },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: User['role']) => {
    switch(role) {
      case 'factor': return <Badge $status="approved">Фактор</Badge>;
      case 'supplier': return <Badge $status="pending">Постачальник</Badge>;
      case 'debtor': return <Badge $status="approved">Дебітор</Badge>;
      case 'admin': return <Badge $status="approved">Адміністратор</Badge>;
      default: return <Badge $status="pending">{role}</Badge>;
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Title>Користувачі</Title>
        <Button icon={<UserPlus size={16} />}>Запросити користувача</Button>
      </DashboardHeader>

      <FilterBar>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Пошук за іменем або email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.625rem 1rem 0.625rem 2.5rem', 
              borderRadius: '0.5rem', 
              border: '1px solid #d1d5db',
              fontSize: '0.875rem'
            }} 
          />
        </div>
        <Button variant="outline" icon={<Filter size={16} />}>Фільтри</Button>
      </FilterBar>

      <TableContainer>
        <TableHeader>Всі користувачі ({filteredUsers.length})</TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>Ім'я</Th>
              <Th>Email</Th>
              <Th>Роль</Th>
              <Th>Дата реєстрації</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <Td style={{ fontWeight: 500, color: '#111827' }}>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{getRoleBadge(user.role)}</Td>
                <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                <Td style={{ textAlign: 'right' }}>
                  <ActionButton>
                    <MoreHorizontal size={18} />
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};