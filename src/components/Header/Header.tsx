import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import { useNavigate } from 'react-router-dom';
import {
  HeaderContainer,
  Logo,
  RightSection,
  UserButton,
  UserAvatar,
  UserInfo,
  UserName,
  UserRole,
  Divider,
  LanguageSwitch,
  DropdownMenu,
  DropdownItem,
} from './Header.styled';
import { User, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { role, user, logout } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    setLocale(locale === 'uk' ? 'en' : 'uk');
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.charAt(0);
    }
    return '?';
  };

  const getUserName = () => {
    return user?.name || 'Користувач';
  };

  const getUserRoleLabel = () => {
    if (role && t.roles[role]) {
      return t.roles[role];
    }
    return role || '';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

const handleProfile = () => {
  setIsDropdownOpen(false);
  navigate('/profile');
};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPlatformName = () => {
    return locale === 'uk' ? 'Факторингова платформа' : 'Factoring Platform';
  };

  return (
    <HeaderContainer>
      <Logo>{getPlatformName()}</Logo>
      <RightSection>
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <UserButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <UserAvatar>{getUserInitials()}</UserAvatar>
            <UserInfo>
              <UserName>{getUserName()}</UserName>
              <UserRole>{getUserRoleLabel()}</UserRole>
            </UserInfo>
          </UserButton>
          {isDropdownOpen && (
            <DropdownMenu>
              <DropdownItem onClick={handleProfile}>
                <User size={16} />
                {t.common.profile || 'Мій профіль'}
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                <LogOut size={16} />
                {t.common.logout}
              </DropdownItem>
            </DropdownMenu>
          )}
        </div>
        <Divider />
        <LanguageSwitch onClick={toggleLanguage}>
          {locale === 'uk' ? 'EN' : 'UA'}
        </LanguageSwitch>
      </RightSection>
    </HeaderContainer>
  );
};