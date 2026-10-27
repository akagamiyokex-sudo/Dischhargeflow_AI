import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Filter, 
  Eye, 
  Edit3, 
  Phone, 
  Mail, 
  Building2, 
  Calendar,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import RegisterPatientModal from '../../components/frontdesk/RegisterPatientModal';
import EditPatientAdministrativeModal from '../../components/frontdesk/EditPatientAdministrativeModal';
import ViewPatientAdministrativeModal from '../../components/frontdesk/ViewPatientAdministrativeModal';

export default function FrontDeskPatientsPage() {
  const { patients } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [admissionFilter, setAdmissionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);

  // Departments list
  const departments = ['All', 'Cardiology', 'General Medicine', 'Orthopedics', 'Neurology', 'Pulmonology', 'Oncology'];

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // Search query (Name, MRN, Phone)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        patient.name.toLowerCase().includes(q) ||
        patient.id.toLowerCase().includes(q) ||
        (patient.phone && patient.phone.toLowerCase().includes(q));

      // Department filter
      const matchesDept = departmentFilter === 'All' || patient.department === departmentFilter;

      // Admission filter
      const matchesAdmission = admissionFilter === 'All' || 
        (patient.admissionType && patient.admissionType.toLowerCase() === admissionFilter.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;

      return matchesSearch && matchesDept && matchesAdmission && matchesStatus;
    });
  }, [patients, searchQuery, departmentFilter, admissionFilter, statusFilter]);

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
            Patient Directory
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Hospital Master Patient Index (MPI) &bull; {filteredPatients.length} records matching criteria
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
          + Register Patient
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, MRN (DF-2026-...), or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '38px', fontSize: '0.8125rem' }}
          />
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Department Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dept:</span>
          <select
            className="form-control"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{ height: '38px', fontSize: '0.8125rem', width: 'auto' }}
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Admission Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type:</span>
          <select
            className="form-control"
            value={admissionFilter}
            onChange={(e) => setAdmissionFilter(e.target.value)}
            style={{ height: '38px', fontSize: '0.8125rem', width: 'auto' }}
          >
            <option value="All">All Types</option>
            <option value="Emergency">Emergency</option>
            <option value="Elective">Elective</option>
            <option value="Urgent">Urgent</option>
            <option value="Transfer">Transfer</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '38px', fontSize: '0.8125rem', width: 'auto' }}
          >
            <option value="All">All Statuses</option>
            <option value="Admitted">Admitted</option>
            <option value="Ready for Discharge">Ready for Discharge</option>
            <option value="Discharged">Discharged</option>
            <option value="Pending Admission">Pending Admission</option>
          </select>
        </div>

        {(searchQuery || departmentFilter !== 'All' || admissionFilter !== 'All' || statusFilter !== 'All') && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchQuery('');
              setDepartmentFilter('All');
              setAdmissionFilter('All');
              setStatusFilter('All');
            }}
            style={{ height: '38px', fontSize: '0.75rem' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Patients Table */}
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
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Department</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Doctor</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Contact Phone</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Admission</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No patients match your current search or filters.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr 
                    key={patient.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }}
                  >
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
                      <div style={{ color: 'var(--text-main)' }}>{patient.department || 'General Medicine'}</div>
                      <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>{patient.ward}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>
                      {patient.attendingDoctor || 'Assigned Attending'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                      {patient.phone || '—'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{patient.admissionType || 'Elective'}</div>
                      <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>{patient.admissionDate || patient.admitted || 'Active'}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${
                        patient.status === 'Ready for Discharge' ? 'badge-success' :
                        patient.status === 'Discharged' ? 'badge-neutral' :
                        patient.status === 'Pending Admission' ? 'badge-warning' :
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
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
