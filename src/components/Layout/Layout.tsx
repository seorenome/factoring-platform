import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import {
  LayoutContainer,
  Sidebar,
  SidebarLogo,
  NavList,
  NavItem,
  MainContent,
  Header,
  LanguageSwitch,
  PageContainer,
} from './Layout.styled';
import { Button } from '../Button/Button';
import { 
  LayoutDashboard, 
  FileText, 
  FileSignature, 
  Building2, 
  Users, 
  Settings, 
  LogOut,
  Wallet,
  ClipboardList,
  Bell,
  BarChart3
} from 'lucide-react';

interface NavItemType {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, locale, setLocale } = useI18n();
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLocale(locale === 'uk' ? 'en' : 'uk');
  };

  const navItems: NavItemType[] = [
    { path: '/dashboard', label: t.common.dashboard, icon: <LayoutDashboard size={20} />, roles: ['factor', 'supplier', 'debtor', 'admin'] },
    { path: '/requests', label: t.common.requests, icon: <FileSignature size={20} />, roles: ['factor', 'supplier', 'admin'] },
    { path: '/documents', label: t.common.documents, icon: <FileText size={20} />, roles: ['factor', 'supplier', 'debtor', 'admin'] },
    { path: '/companies', label: t.common.companies, icon: <Building2 size={20} />, roles: ['factor', 'admin'] },
    { path: '/users', label: t.common.users, icon: <Users size={20} />, roles: ['factor', 'admin'] },
    { path: '/limits', label: 'Ліміти', icon: <ClipboardList size={20} />, roles: ['factor', 'admin'] },
    { path: '/notifications', label: 'Повідомлення', icon: <Bell size={20} />, roles: ['factor', 'supplier', 'debtor', 'admin'] },
    { path: '/reports', label: 'Звіти', icon: <BarChart3 size={20} />, roles: ['factor', 'admin'] },
    { path: '/settings', label: t.common.settings, icon: <Settings size={20} />, roles: ['factor', 'supplier', 'debtor', 'admin'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarLogo>
          <Wallet size={28} color="#2563eb" />
          <span>FactorPlatform</span>
        </SidebarLogo>
        <NavList>
          {visibleNavItems.map((item) => (
            <NavItem 
              key={item.path} 
              $active={location.pathname.startsWith(item.path)}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </NavItem>
          ))}
        </NavList>
      </Sidebar>
      <MainContent>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: 'auto' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Роль: {t.roles[role]}
            </span>
          </div>
          <LanguageSwitch onClick={toggleLanguage}>
            {locale === 'uk' ? 'EN' : 'UA'}
          </LanguageSwitch>
          <Button variant="outline" icon={<LogOut size={16} />}>
            {t.common.logout}
          </Button>
        </Header>
        <PageContainer>{children}</PageContainer>
      </MainContent>
    </LayoutContainer>
  );
};