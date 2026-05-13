import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const Sidebar = styled.aside`
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e5e5e5;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  padding: 0 0.5rem;
`;

export const LogoImage = styled.img`
  width: 28px;
  height: 28px;
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const NavItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border-radius: 0.5rem;
  color: ${({ $active }) => ($active ? '#111827' : '#6b7280')};
  background-color: ${({ $active }) => ($active ? '#f3f4f6' : 'transparent')};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#f3f4f6' : '#f9fafb')};
    color: #111827;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const PageContainer = styled.div`
  padding: 2.5rem;
  flex: 1;
  overflow-y: auto;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;