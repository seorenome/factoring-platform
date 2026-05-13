import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
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
import { User, LogOut, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { role } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    setLocale(locale === 'uk' ? 'en' : 'uk');
  };

  const getUserInitials = () => {
    return 'ОП'; // В реальному проекті брати з даних користувача
  };

  const getUserName = () => {
    return 'Олена Петренко'; // В реальному проекті брати з даних користувача
  };

  const getUserRoleLabel = () => {
    return t.roles[role];
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

  return (
    <HeaderContainer>
      <Logo>FactorPlatform — Факторингова платформа</Logo>
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
              <DropdownItem onClick={() => console.log('Profile')}>
                <User size={16} />
                Мій профіль
              </DropdownItem>
              <DropdownItem onClick={() => console.log('Logout')}>
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