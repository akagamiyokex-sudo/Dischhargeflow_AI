import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Bed, 
  Search, 
  UserPlus, 
  Eye, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import RegisterPatientModal from '../../components/frontdesk/RegisterPatientModal';
import EditPatientAdministrativeModal from '../../components/frontdesk/EditPatientAdministrativeModal';
import ViewPatientAdministrativeModal from '../../components/frontdesk/ViewPatientAdministrativeModal';

export default function FrontDeskAdmissionsPage() {
  const { patients } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [wardFilter, setWardFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);

  // Inpatients list
  const admittedPatients = useMemo(() => {
    return patients.filter(p => p.status !== 'Discharged');
  }, [patients]);

  // Statistics
  const stats = useMemo(() => {
    const totalAdmitted = admittedPatients.length;
    const emergencyCount = admittedPatients.filter(p => p.admissionType === 'Emergency').length;
    const electiveCount = admittedPatients.filter(p => p.admissionType === 'Elective').length;
    const availableBeds = 48;

    return { totalAdmitted, emergencyCount, electiveCount, availableBeds };
  }, [admittedPatients]);

  // Wards list
  const wards = ['All', 'Ward 4B (Cardiology)', 'Ward 3A (General Med)', 'Ward 2C (Surgical)', 'ICU Stepdown', 'Ward 5A (Neuro)'];

  // Filtered
  const filtered = useMemo(() => {
    return admittedPatients.filter(p => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.ward && p.ward.toLowerCase().includes(q));

      const matchesWard = wardFilter === 'All' || (p.ward && p.ward.includes(wardFilter.replace('All', '')));
      const matchesType = typeFilter === 'All' || p.admissionType === typeFilter;

      return matchesSearch && matchesWard && matchesType;
    });
  }, [admittedPatients, searchQuery, wardFilter, typeFilter]);

  return (
    <div className="page-container" style={{ padding: '1.5rem', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
            Admissions &amp; Bed Occupancy
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Inpatient intake tracking, ward assignments, and admission types
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsRegisterOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <UserPlus size={16} />
          + Admit / Register Patient
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Inpatients</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.totalAdmitted}</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--status-success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bed size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Available Beds</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.availableBeds}</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: 'var(--status-danger-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Emergency Admissions</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.emergencyCount}</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Elective / Planned</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.electiveCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search inpatient name or MRN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.8125rem' }}
          />
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ward:</span>
          <select
            className="form-control"
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            style={{ height: '36px', fontSize: '0.8125rem', width: 'auto' }}
          >
            {wards.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admission Type:</span>
          <select
            className="form-control"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ height: '36px', fontSize: '0.8125rem', width: 'auto' }}
          >
            <option value="All">All Types</option>
            <option value="Emergency">Emergency</option>
            <option value="Elective">Elective</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Admissions Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Patient</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>MRN</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Ward &amp; Bed</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Admission Date</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Type</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Attending Doctor</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(patient => (
                <tr key={patient.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{patient.name}</div>
                    <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                      {patient.age} yrs &bull; {patient.gender || 'M'}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-primary)' }}>
                    {patient.id}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{patient.ward}</div>
                    <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>{patient.bed || 'Bed Unassigned'}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                    {patient.admissionDate || patient.admitted || 'Active'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge ${
                      patient.admissionType === 'Emergency' ? 'badge-danger' :
                      patient.admissionType === 'Urgent' ? 'badge-warning' :
                      'badge-info'
                    }`} style={{ fontSize: '0.6875rem' }}>
                      {patient.admissionType || 'Elective'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>
                    {patient.attendingDoctor || 'Assigned Attending'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge ${
                      patient.status === 'Ready for Discharge' ? 'badge-success' :
                      patient.status === 'Discharged' ? 'badge-neutral' :
                      'badge-info'
                    }`} style={{ fontSize: '0.6875rem' }}>
                      {patient.status || 'Admitted'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewingPatient(patient)}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={12} style={{ marginRight: '0.2rem' }} />
                        View
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingPatient(patient)}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Edit3 size={12} style={{ marginRight: '0.2rem' }} />
                        Edit Bed
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <RegisterPatientModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegistered={(newPatient) => {
          setIsRegisterOpen(false);
          setViewingPatient(newPatient);
        }}
      />

      <EditPatientAdministrativeModal
        patient={editingPatient}
        isOpen={!!editingPatient}
        onClose={() => setEditingPatient(null)}
        onUpdated={() => setEditingPatient(null)}
      />

      <ViewPatientAdministrativeModal
        patient={viewingPatient}
        isOpen={!!viewingPatient}
        onClose={() => setViewingPatient(null)}
        onEdit={(p) => setEditingPatient(p)}
      />

    </div>
  );
}
