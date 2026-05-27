import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title, TableContainer, TableHeader, Table, Th, Td } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { FilterBar, Badge } from '../Requests/Requests.styled';
import { Search, Filter, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { api, User } from '../../services/api';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) return;
    try {
      await api.deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
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
                  <button onClick={() => handleDelete(user.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={18} />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
};