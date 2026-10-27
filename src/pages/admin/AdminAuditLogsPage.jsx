import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { auditLogs, staffList } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');

  // Filtered audit events
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term ||
        log.action.toLowerCase().includes(term) ||
        log.target.toLowerCase().includes(term) ||
        log.user.toLowerCase().includes(term) ||
        (log.details && log.details.toLowerCase().includes(term));

      const matchesAction = actionFilter === 'ALL' || log.action.includes(actionFilter);
      const matchesUser = userFilter === 'ALL' || log.user.toLowerCase() === userFilter.toLowerCase();

      return matchesSearch && matchesAction && matchesUser;
    });
  }, [auditLogs, searchTerm, actionFilter, userFilter]);

  // Export audit logs as CSV
  const handleExportAuditCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Target Reference', 'Details', 'Result'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.action}"`,
      `"${(l.target || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      `"${l.result || 'Success'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dischargeflow_audit_trail_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Audit Logs</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleExportAuditCSV}>
            <Download size={15} />
            <span>Export (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={15} 
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input
              type="text"
              placeholder="Search action, target, user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          <select 
            value={actionFilter} 
            onChange={(e) => setActionFilter(e.target.value)}
            className="form-control"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">Logins</option>
            <option value="STAFF">Staff</option>
            <option value="DEPARTMENT">Departments</option>
            <option value="DISCHARGE">Discharges</option>
            <option value="SUMMARY">Summaries</option>
            <option value="INSURANCE">Billing</option>
            <option value="SETTINGS">Settings</option>
          </select>

          <select 
            value={userFilter} 
            onChange={(e) => setUserFilter(e.target.value)}
            className="form-control"
          >
            <option value="ALL">All Users</option>
            {Array.from(new Set(auditLogs.map(l => l.user))).map((userName, idx) => (
              <option key={idx} value={userName}>{userName}</option>
            ))}
          </select>

          {(searchTerm || actionFilter !== 'ALL' || userFilter !== 'ALL') && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setActionFilter('ALL');
                setUserFilter('ALL');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Audit Trail ({filteredLogs.length})</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Initiating User</th>
                <th>User Role</th>
                <th>Action Recorded</th>
                <th>Affected Record Reference</th>
                <th>Event Details</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No audit events match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isBlocked = log.result === 'Blocked';
                  return (
                    <tr key={log.id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {log.timestamp}
                        </span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                          {log.user}
                        </strong>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: '0.675rem' }}>
                          {log.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                          {log.target}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                          {log.details}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${isBlocked ? 'danger' : 'success'}`} style={{ fontSize: '0.675rem' }}>
                          {log.result || 'Success'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
