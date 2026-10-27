import React from 'react';
import { useApp } from '../../context/AppContext';
import { getRoleConfig, getDefaultRouteForRole } from '../../config/rolesConfig';
import { 
  Activity,
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  ShieldCheck,
  Settings,
  Stethoscope,
  FolderClock,
  FileText,
  Pill,
  Sparkles,
  CheckCircle2,
  Calendar,
  HeartPulse,
  HeartHandshake,
  CheckSquare,
  GitFork,
  UserPlus,
  Clock,
  FolderArchive,
  GitPullRequest,
  Receipt,
  FileSpreadsheet,
  FilePlus,
  CreditCard,
  AlertCircle,
  PackageCheck,
  Boxes,
  ArrowLeftRight,
  FlaskConical,
  ClipboardList,
  TestTube2,
  FileEdit,
  CalendarCheck,
  Bell,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';

// Icon Map Registry
const ICON_COMPONENTS = {
  LayoutDashboard,
  Users,
  User,
  Building2,
  Activity,
  BarChart3,
  ShieldCheck,
  Settings,
  Stethoscope,
  FolderClock,
  FileText,
  Pill,
  Sparkles,
  CheckCircle2,
  Calendar,
  HeartPulse,
  HeartHandshake,
  CheckSquare,
  GitFork,
  UserPlus,
  Clock,
  FolderArchive,
  GitPullRequest,
  Receipt,
  FileSpreadsheet,
  FilePlus,
  CreditCard,
  AlertCircle,
  PackageCheck,
  Boxes,
  ArrowLeftRight,
  FlaskConical,
  ClipboardList,
  TestTube2,
  FileEdit,
  CalendarCheck,
  Bell
};

export default function Sidebar({ isOpen, onClose }) {
  const { currentPage, navigateTo, currentUser, selectedPatient, logout } = useApp();
  const roleConfig = getRoleConfig(currentUser.role);
  const homeRoute = getDefaultRouteForRole(currentUser.role);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-badge" onClick={() => navigateTo(homeRoute)} style={{ cursor: 'pointer' }}>
          <div className="brand-icon-box">
            <Activity size={18} strokeWidth={2.4} />
          </div>
          <div className="brand-title">
            <span>DischargeFlow<span style={{ color: 'var(--color-primary)' }}> AI</span></span>
            <span className="brand-sub">Hospital Platform</span>
          </div>
        </div>
      </div>

      {/* Workspace Banner */}
      <div style={{
        padding: '0.625rem 0.875rem',
        margin: '0.5rem 0.75rem',
        background: 'var(--bg-surface-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)'
      }}>
        <div style={{ fontSize: '0.675rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', fontWeight: 700 }}>
          {roleConfig.label.toUpperCase()}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
          {currentUser.department || roleConfig.department}
        </div>
      </div>

      {/* Role-Specific Navigation List */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {roleConfig.navItems.map((item) => {
          const Icon = ICON_COMPONENTS[item.icon] || Activity;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                navigateTo(item.id);
                if (onClose) onClose();
              }}
              title={item.label}
            >
              <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
              {isActive && (
                <ChevronRight size={13} style={{ marginLeft: 'auto', color: 'var(--color-primary)' }} />
              )}
            </button>
          );
        })}

        {/* Selected Inpatient Context (shown if patient is selected and relevant) */}
        {selectedPatient && currentUser.role !== 'patient' && (
          <div style={{
            margin: 'auto 0 0.5rem 0',
            padding: '0.625rem 0.75rem',
            background: 'var(--bg-surface-secondary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, marginBottom: '0.15rem' }}>
              ACTIVE PATIENT
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8125rem' }}>
              {selectedPatient.name}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.1rem' }}>
              {selectedPatient.id} • {selectedPatient.department ? `${selectedPatient.department} · ` : ''}{selectedPatient.ward}
            </div>
          </div>
        )}
      </nav>

      {/* Footer Role Indicator & Sign Out */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
            <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem', flexShrink: 0 }}>
              {currentUser.avatar}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.1, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {currentUser.badge || roleConfig.shortTitle}
              </span>
            </div>
          </div>
          <button 
            onClick={logout}
            title="Sign Out" 
            style={{ 
              color: 'var(--text-muted)', 
              padding: '0.35rem', 
              borderRadius: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
