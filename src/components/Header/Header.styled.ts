import styled from 'styled-components';

export const HeaderContainer = styled.header`
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
`;

export const Logo = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.01em;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const UserInfo = styled.div`
  text-align: left;
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
`;

export const UserRole = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
`;

export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #e5e5e5;
`;

export const LanguageSwitch = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.15s;

  &:hover {
    color: #111827;
    background-color: #f3f4f6;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 2rem;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
`;

export const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.15s;
  text-align: left;

  &:hover {
    background-color: #f3f4f6;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;