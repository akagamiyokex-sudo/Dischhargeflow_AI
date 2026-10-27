import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLES, ROLE_CONFIGS, getRoleConfig } from '../../config/rolesConfig';
import AddPatientModal from '../common/AddPatientModal';
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  Check, 
  User, 
  LogOut, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function TopNav({ onToggleSidebar }) {
  const { 
    currentPage, 
    navigateTo, 
    selectedPatient, 
    currentUser, 
    switchUser,
    sampleUsers,
    searchQuery, 
    setSearchQuery, 
    patients,
    notifications,
    markNotificationRead,
    logout,
    addPatient
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const roleMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setShowRoleMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter patients for instant search
  const filteredSearchPatients = searchQuery.trim() === '' ? [] : patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ward.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifications.filter(n => n.unread).length;
  const roleConfig = getRoleConfig(currentUser.role);

  // Dynamic breadcrumb generation
  const getBreadcrumb = () => {
    const navItem = roleConfig.navItems.find(i => i.id === currentPage);
    const pageLabel = navItem ? navItem.label : currentPage;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>{roleConfig.label}</span>
        <span style={{ color: 'var(--border-strong)' }}>/</span>
        <span className="current" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
          {pageLabel}
        </span>
      </div>
    );
  };

  return (
    <header className="top-header">
      {/* Left side: Hamburger and breadcrumbs */}
      <div className="header-left">
        <button 
          onClick={onToggleSidebar}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: 'var(--text-secondary)', 
            padding: '0.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
          className="mobile-only-btn"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumbs">
          {getBreadcrumb()}
        </div>
      </div>

      {/* Middle: Quick search bar */}
      <div className="search-box" ref={searchRef}>
        <Search size={15} />
        <input
          type="text"
          className="search-input"
          placeholder="Search patients, MRN, ward..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
        />

        {showSearchResults && filteredSearchPatients.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 60,
            maxHeight: '280px',
            overflowY: 'auto'
          }}>
            {filteredSearchPatients.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  const targetPage = currentUser.role === ROLES.DOCTOR ? 'doctor-records' : 'discharge-workflow';
                  navigateTo(targetPage, p.id);
                  setShowSearchResults(false);
                  setSearchQuery('');
                }}
                style={{
                  padding: '0.625rem 0.875rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {p.id} • {p.ward}
                  </div>
                </div>
                <span className={`badge badge-${p.statusType || 'neutral'}`} style={{ fontSize: '0.7rem' }}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right side: Actions, Notifications, Role Switcher, Profile */}
      <div className="header-right">
        {/* Admit Patient Quick Button for Clinical & Admin Staff */}
        {currentUser.role !== ROLES.PATIENT && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Admit patient"
          >
            <Plus size={13} />
            <span>+ Admit</span>
          </button>
        )}

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifMenuRef}>
          <button 
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                backgroundColor: '#dc2626',
                borderRadius: '50%'
              }} />
            )}
          </button>

          {showNotifMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              width: '320px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-modal)',
              zIndex: 70,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                  Notifications
                </span>
                <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>
                  {unreadCount} unread
                </span>
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78125rem' }}>
                    No pending alerts
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: n.unread ? 'var(--color-primary-light)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.78125rem', color: 'var(--text-main)' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                          {n.time}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Role Switcher Dropdown (Allows testing all 8 roles instantly) */}
        <div className="role-switcher-dropdown" ref={roleMenuRef} style={{ position: 'relative' }}>
          <button 
            className="role-badge-btn"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            title="Switch role"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.65rem',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--color-primary)' }} />
            <span>Role: <strong>{roleConfig.shortTitle}</strong></span>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showRoleMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 6px)',
              width: '320px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-modal)',
              zIndex: 70,
              padding: '0.5rem',
              maxHeight: '420px',
              overflowY: 'auto'
            }}>
              <div style={{
                padding: '0.4rem 0.6rem',
                fontSize: '0.725rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '0.35rem'
              }}>
                Switch Role
              </div>

              {sampleUsers.map(user => {
                const isSelected = currentUser.id === user.id;
                const userRoleCfg = ROLE_CONFIGS[user.role] || {};
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setShowRoleMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--color-primary-light)' : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '0.7rem', flexShrink: 0 }}>
                      {user.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          fontSize: '0.78125rem',
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? 'var(--color-primary-hover)' : 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {user.name}
                        </span>
                        <span className="badge badge-neutral" style={{ fontSize: '0.625rem', padding: '0.1rem 0.3rem' }}>
                          {userRoleCfg.shortTitle}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.title}
                      </div>
                    </div>
                    {isSelected && <Check size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User profile avatar & Sign out button */}
        <div className="user-profile-menu">
          <div className="user-avatar">
            {currentUser.avatar}
          </div>
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role-label">{currentUser.title}</span>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '0.25rem'
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addPatient}
      />
    </header>
  );
}
