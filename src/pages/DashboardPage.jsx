import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import AddPatientModal from '../components/common/AddPatientModal';
import { 
  Users, 
  Stethoscope, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ArrowRight, 
  Search, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';

export default function DashboardPage() {
  const { patients, navigateTo, searchQuery, setSearchQuery, addPatient, deletePatient, restoreSampleData, selectedPatient } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today');

  // Compute summary metrics dynamically from live state
  const metrics = useMemo(() => {
    const active = patients.filter(p => p.status !== 'Completed').length;
    const waitingDoctor = patients.filter(p => p.status === 'Awaiting doctor review' || (p.stageNumber === 3 && !p.summaryApproved)).length;
    const waitingBilling = patients.filter(p => p.status === 'Billing pending' || (p.stageNumber === 5 && !p.billing.isCleared)).length;
    const completedToday = patients.filter(p => p.status === 'Completed').length;

    return { active, waitingDoctor, waitingBilling, completedToday };
  }, [patients]);

  // Extract unique departments for filter
  const departments = useMemo(() => {
    const deps = new Set(patients.map(p => p.department));
    return ['All', ...Array.from(deps)];
  }, [patients]);

  // Filtered patients table
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match = patient.name.toLowerCase().includes(q) ||
                      patient.id.toLowerCase().includes(q) ||
                      patient.ward.toLowerCase().includes(q) ||
                      patient.attendingDoctor.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Department filter
      if (departmentFilter !== 'All' && patient.department !== departmentFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Active' && patient.status === 'Completed') return false;
        if (statusFilter === 'Completed' && patient.status !== 'Completed') return false;
        if (statusFilter === 'Doctor Review' && !patient.status.includes('doctor')) return false;
        if (statusFilter === 'Billing' && !patient.status.includes('Billing')) return false;
        if (statusFilter === 'Delayed' && patient.targetMet !== false) return false;
      }

      return true;
    });
  }, [patients, searchQuery, departmentFilter, statusFilter]);

  const resetFilters = () => {
    setDepartmentFilter('All');
    setStatusFilter('All');
    setDateFilter('Today');
    setSearchQuery('');
  };

  const getStatusBadgeClass = (statusType) => {
    switch (statusType) {
      case 'success': return 'badge-success';
      case 'warning': return 'badge-warning';
      case 'danger': return 'badge-danger';
      case 'info': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const activePatientId = selectedPatient?.id || (patients.length > 0 ? patients[0].id : null);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Discharge Overview</h1>
        </div>
        <div className="page-header-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => navigateTo('reports')}
          >
            Metrics
          </button>
          {activePatientId && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => navigateTo('workflow', activePatientId)}
            >
              Workflow
            </button>
          )}
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={15} />
            <span>+ Admit</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="metrics-grid">
        {/* Metric 1 */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Discharges</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <Users size={16} />
            </div>
          </div>
          <div className="metric-value">{metrics.active}</div>
        </div>

        {/* Metric 2 */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Doctor Approval</span>
            <div className="metric-icon" style={{ color: '#d97706' }}>
              <Stethoscope size={16} />
            </div>
          </div>
          <div className="metric-value">{metrics.waitingDoctor}</div>
        </div>

        {/* Metric 3 */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Billing Clearance</span>
            <div className="metric-icon" style={{ color: '#2563eb' }}>
              <Receipt size={16} />
            </div>
          </div>
          <div className="metric-value">{metrics.waitingBilling}</div>
        </div>

        {/* Metric 4 */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Completed Today</span>
            <div className="metric-icon" style={{ color: '#16a34a' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="metric-value">{metrics.completedToday}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <Filter size={15} />
            <span>Filters:</span>
          </div>

          {/* Department Filter */}
          <select 
            className="form-control"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            {departments.map(d => (
              <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Doctor Review">Awaiting Doctor Review</option>
            <option value="Billing">Billing Pending</option>
            <option value="Delayed">Delayed Cases</option>
            <option value="Completed">Completed Today</option>
          </select>

          {/* Date Filter */}
          <select 
            className="form-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '120px' }}
          >
            <option value="Today">Today</option>
            <option value="Past24h">Past 24 hours</option>
            <option value="All">All Records</option>
          </select>

          {(departmentFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '') && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={resetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredPatients.length}</strong> of {patients.length} cases
        </div>
      </div>

      {/* Discharges Table */}
      {filteredPatients.length > 0 ? (
        <div className="table-wrapper">
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Patient ID</th>
                <th>Ward / Department</th>
                <th>Discharge Started</th>
                <th>Current Stage</th>
                <th>Waiting Time</th>
                <th>Assigned Staff</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => {
                const isDelayed = !patient.targetMet && patient.status !== 'Completed';
                return (
                  <tr 
                    key={patient.id} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigateTo('workflow', patient.id)}
                  >
                    <td>
                      <div className="patient-cell">
                        <span className="patient-name-text">{patient.name}</span>
                        <span className="patient-meta-text">{patient.age}y • {patient.gender}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '0.8125rem' }}>
                        {patient.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{patient.ward}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{patient.bed}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem' }}>{patient.dischargeStarted}</span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(patient.statusType)}`}>
                        <span className="badge-dot" />
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {isDelayed && <AlertTriangle size={13} style={{ color: '#dc2626' }} />}
                        <span style={{
                          fontWeight: isDelayed ? 600 : 400,
                          color: isDelayed ? '#b91c1c' : 'inherit'
                        }}>
                          {Math.floor(patient.waitingTimeMinutes / 60)}h {patient.waitingTimeMinutes % 60}m
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                        {patient.attendingDoctor.split(',')[0]}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigateTo('patient-details', patient.id)}
                          title="View clinical records and documents"
                        >
                          Details
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigateTo('workflow', patient.id)}
                          title="Open 6-stage workflow tracker"
                        >
                          Workflow
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => deletePatient(patient.id)}
                          title="Remove patient record"
                          style={{ color: 'var(--status-danger-text)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : patients.length === 0 ? (
        /* Zero Patients Empty State */
        <div className="empty-state" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <Users size={44} className="empty-state-icon" style={{ opacity: 0.6, marginBottom: '0.75rem' }} />
          <h3 className="empty-state-title">No Patients in Discharge Queue</h3>
          <p className="empty-state-desc" style={{ maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            All sample patient data has been cleared. Admit a real patient to start tracking their 6-stage clinical discharge and billing workflows.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={15} />
              <span>Admit New Patient</span>
            </button>
            <button className="btn btn-secondary" onClick={() => restoreSampleData()}>
              <RotateCcw size={15} />
              <span>Restore Sample Cases</span>
            </button>
          </div>
        </div>
      ) : (
        /* Search/Filter Empty State */
        <div className="empty-state">
          <Search size={36} className="empty-state-icon" />
          <h3 className="empty-state-title">No patients match these filters</h3>
          <p className="empty-state-desc">
            Try adjusting your department, status, or search query to find the relevant discharge case.
          </p>
          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}

      {/* Modal for Admitting New Patient */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addPatient}
      />
    </div>
  );
}
