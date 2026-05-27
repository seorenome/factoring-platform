import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Header } from '../Header/Header';
import {
  LayoutContainer,
  Sidebar,
  SidebarLogo,
  LogoImage,
  NavList,
  NavItem,
  MainContent,
  PageContainer,
} from './Layout.styled';
import logo from '../../assets/logo.svg';
import { 
  LayoutDashboard, 
  FileText, 
  FileSignature, 
  Building2, 
  Users, 
  Settings, 
  ClipboardList,
  Bell,
  BarChart3,
  History
} from 'lucide-react';

interface NavItemType {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useI18n();
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItemType[] = [
    { path: '/dashboard', label: t.common.dashboard, icon: <LayoutDashboard size={20} />, roles: ['factor', 'supplier', 'debtor', 'admin'] },
    { path: '/requests', label: t.common.requests, icon: <FileSignature size={20} />, roles: ['factor', 'supplier', 'admin'] },
    { path: '/documents', label: t.common.documents, icon: <FileText size={20} />, roles: ['factor', 'supplier', 'debtor', 'admin'] },
    { path: '/companies', label: t.common.companies, icon: <Building2 size={20} />, roles: ['factor', 'admin'] },
    { path: '/users', label: t.common.users, icon: <Users size={20} />, roles: ['factor', 'admin'] },
    { path: '/limits', label: t.common.limits, icon: <ClipboardList size={20} />, roles: ['factor', 'admin'] },
    { path: '/audit', label: t.common.audit, icon: <History size={20} />, roles: ['factor', 'admin'] },
    { path: '/notifications', label: t.common.notifications, icon: <Bell size={20} />, roles: ['factor', 'supplier', 'debtor', 'admin'] },
    { path: '/reports', label: t.common.reports, icon: <BarChart3 size={20} />, roles: ['factor', 'admin'] },
    { path: '/settings', label: t.common.settings, icon: <Settings size={20} />, roles: ['factor', 'supplier', 'debtor', 'admin'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarLogo>
          <LogoImage src={logo} alt="FinFactor" />
          <span>FinFactor</span>
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
        <Header />
        <PageContainer>{children}</PageContainer>
      </MainContent>
    </LayoutContainer>
  );
};