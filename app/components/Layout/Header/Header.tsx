"use client"
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Bell, 
  User, 
  Menu, 
  X, 
  Search,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted flag after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.profileSection}`)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you can implement actual dark mode logic
  };

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          {/* Left Section - Logo & Time */}
          <div className={styles.leftSection}>
            <div className={styles.logo}>
              <Calendar className={styles.logoIcon} />
              <div className={styles.logoText}>
                <span className={styles.brandName}>Queue</span>
                <span className={styles.brandSubtext}>Booking</span>
              </div>
            </div>

            <div className={styles.timeDisplay}>
              <Clock className={styles.timeIcon} />
              <div className={styles.timeInfo}>
                <div className={styles.time}>
                  {isMounted ? formatTime() : '--:--:--'}
                </div>
                <div className={styles.date}>
                  {isMounted ? formatDate() : 'Loading...'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className={styles.rightSection}>
            {/* Search */}
            <button className={styles.iconButton} title="Search">
              <Search className={styles.icon} />
            </button>

            {/* Dark Mode Toggle */}
            <button 
              className={styles.iconButton} 
              onClick={toggleDarkMode}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <Sun className={styles.icon} /> : <Moon className={styles.icon} />}
            </button>

            {/* Notifications */}
            <button className={styles.iconButton} title="Notifications">
              <Bell className={styles.icon} />
              {notifications > 0 && (
                <span className={styles.badge}>{notifications}</span>
              )}
            </button>

            {/* Help */}
            <button className={styles.iconButton} title="Help">
              <HelpCircle className={styles.icon} />
            </button>

            {/* Profile Dropdown */}
            <div className={styles.profileSection}>
              <button 
                className={styles.profileButton}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className={styles.avatar}>
                  <User className={styles.avatarIcon} />
                </div>
                <div className={styles.profileInfo}>
                  <span className={styles.userName}>John Doe</span>
                  <span className={styles.userRole}>User</span>
                </div>
              </button>

              {isProfileOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownAvatar}>
                      <User className={styles.dropdownAvatarIcon} />
                    </div>
                    <div className={styles.dropdownUserInfo}>
                      <span className={styles.dropdownUserName}>John Doe</span>
                      <span className={styles.dropdownUserEmail}>john.doe@email.com</span>
                    </div>
                  </div>
                  
                  <hr className={styles.divider} />
                  
                  <button className={styles.dropdownItem}>
                    <User className={styles.dropdownIcon} />
                    Profile
                  </button>
                  <button className={styles.dropdownItem}>
                    <Settings className={styles.dropdownIcon} />
                    Settings
                  </button>
                  <button className={styles.dropdownItem}>
                    <HelpCircle className={styles.dropdownIcon} />
                    Help & Support
                  </button>
                  
                  <hr className={styles.divider} />
                  
                  <button className={`${styles.dropdownItem} ${styles.logoutItem}`}>
                    <LogOut className={styles.dropdownIcon} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className={styles.icon} /> : <Menu className={styles.icon} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Online Queue Booking</h1>
              <p className={styles.subtitle}>
                Choose what you need - AI assistant available! 🤖
              </p>
            </div>

            
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <button className={styles.mobileMenuItem}>
            <Search className={styles.mobileMenuIcon} />
            Search
          </button>
          <button className={styles.mobileMenuItem}>
            <Bell className={styles.mobileMenuIcon} />
            Notifications
            {notifications > 0 && (
              <span className={styles.mobileBadge}>{notifications}</span>
            )}
          </button>
          <button className={styles.mobileMenuItem}>
            <HelpCircle className={styles.mobileMenuIcon} />
            Help
          </button>
          <button className={styles.mobileMenuItem}>
            <User className={styles.mobileMenuIcon} />
            Profile
          </button>
          <button className={styles.mobileMenuItem}>
            <Settings className={styles.mobileMenuIcon} />
            Settings
          </button>
          <hr className={styles.divider} />
          <button className={styles.mobileMenuItem}>
            <LogOut className={styles.mobileMenuIcon} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};