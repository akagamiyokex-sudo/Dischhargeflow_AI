import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLES, ROLE_CONFIGS } from '../../config/rolesConfig';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Eye, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  AlertCircle,
  Building2,
  Mail,
  Phone,
  Calendar,
  X,
  CheckCircle2
} from 'lucide-react';

export default function AdminUsersPage() {
  const { staffList, departments, addStaff, updateStaff, toggleStaffStatus, currentUser, navigateTo, addToast } = useApp();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [deactivatingStaff, setDeactivatingStaff] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Allowed staff roles (excluding Patient / Caregiver)
  const staffRoleOptions = [
    { id: ROLES.HOSPITAL_ADMIN, label: 'Hospital Admin' },
    { id: ROLES.FRONT_DESK, label: 'Front Desk' },
    { id: ROLES.DOCTOR, label: 'Doctor / Consultant' },
    { id: ROLES.NURSE, label: 'Nurse / Ward Staff' },
    { id: ROLES.DISCHARGE_OPERATOR, label: 'Discharge Operator / Medical Records' },
    { id: ROLES.BILLING_COUNTER, label: 'Billing Counter Staff' },
    { id: ROLES.PHARMACIST, label: 'Pharmacist' },
    { id: ROLES.LAB_STAFF, label: 'Laboratory Staff' }
  ];

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      // Search match
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || 
        s.name.toLowerCase().includes(term) ||
        s.staffId.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term);

      // Role filter
      const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;

      // Department filter
      const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;

      // Status filter
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

      return matchesSearch && matchesRole && matchesDept && matchesStatus;
    });
  }, [staffList, searchTerm, roleFilter, deptFilter, statusFilter]);

  // Handle Add Staff Form Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const form = e.target;
    const staffData = {
      name: form.name.value,
      staffId: form.staffId.value,
      email: form.email.value,
      phone: form.phone.value,
      role: form.role.value,
      department: form.department.value,
      designation: form.designation.value,
      status: form.status.value
    };

    try {
      addStaff(staffData);
      setShowAddModal(false);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Handle Edit Staff Form Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const form = e.target;
    const updatedData = {
      name: form.name.value,
      staffId: form.staffId.value,
      email: form.email.value,
      phone: form.phone.value,
      role: form.role.value,
      department: form.department.value,
      designation: form.designation.value,
      status: form.status.value
    };

    try {
      updateStaff(editingStaff.id, updatedData);
      setEditingStaff(null);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Handle Status Toggle Confirmation
  const confirmToggleStatus = () => {
    if (!deactivatingStaff) return;
    try {
      toggleStaffStatus(deactivatingStaff.id);
      setDeactivatingStaff(null);
    } catch (err) {
      alert(err.message);
      setDeactivatingStaff(null);
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>STAFF & USERS</h1>
        </div>

        <div className="page-header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => {
              setErrorMessage('');
              setShowAddModal(true);
            }}
          >
            <Plus size={15} />
            <span>+ Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search 
              size={15} 
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input
              type="text"
              placeholder="Search staff, ID, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          {/* Role Filter */}
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-control"
          >
            <option value="ALL">All Roles ({staffList.length})</option>
            {staffRoleOptions.map(r => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>

          {/* Department Filter */}
          <select 
            value={deptFilter} 
            onChange={(e) => setDeptFilter(e.target.value)}
            className="form-control"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
            <option value="Hospital Administration & Operations">Hospital Admin & Operations</option>
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active Accounts</option>
            <option value="Inactive">Deactivated Accounts</option>
          </select>

          {/* Reset Filters */}
          {(searchTerm || roleFilter !== 'ALL' || deptFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('ALL');
                setDeptFilter('ALL');
                setStatusFilter('ALL');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Staff Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Staff Directory ({filteredStaff.length})</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name & Designation</th>
                <th>Work Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Date Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No staff records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const roleCfg = ROLE_CONFIGS[staff.role] || {};
                  const isCurrentUser = currentUser?.id === staff.id;
                  const isDeactivated = staff.status === 'Inactive' || staff.status === 'Deactivated';

                  return (
                    <tr key={staff.id} style={{ opacity: isDeactivated ? 0.7 : 1 }}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.75rem' }}>
                          {staff.staffId}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div 
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: roleCfg.badgeColor || '#0f172a',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              flexShrink: 0
                            }}
                          >
                            {staff.avatar || 'ST'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                              {staff.name} {isCurrentUser && <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)' }}>(You)</span>}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                              {staff.designation || roleCfg.badge || 'Staff'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {staff.email}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="badge" 
                          style={{ 
                            fontSize: '0.6875rem', 
                            backgroundColor: `${roleCfg.badgeColor || '#0f172a'}15`, 
                            color: roleCfg.badgeColor || '#0f172a',
                            border: `1px solid ${roleCfg.badgeColor || '#0f172a'}30`
                          }}
                        >
                          {roleCfg.label || staff.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                          {staff.department}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${isDeactivated ? 'neutral' : 'success'}`} style={{ fontSize: '0.6875rem' }}>
                          {staff.status}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                          {staff.dateCreated || '2026-01-15'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          {/* View Details */}
                          <button 
                            className="btn btn-secondary btn-sm" 
                            title="View"
                            onClick={() => setViewingStaff(staff)}
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <Eye size={13} />
                          </button>

                          {/* Edit Details */}
                          <button 
                            className="btn btn-secondary btn-sm" 
                            title="Edit"
                            onClick={() => {
                              setErrorMessage('');
                              setEditingStaff(staff);
                            }}
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Activate / Deactivate Toggle */}
                          <button 
                            className={`btn btn-${isDeactivated ? 'secondary' : 'secondary'} btn-sm`} 
                            title={isDeactivated ? 'Activate' : 'Deactivate'}
                            onClick={() => setDeactivatingStaff(staff)}
                            style={{ 
                              padding: '0.25rem 0.5rem',
                              color: isDeactivated ? '#16a34a' : '#b91c1c'
                            }}
                          >
                            {isDeactivated ? <UserCheck size={13} /> : <UserX size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ADD STAFF MODAL                                          */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)} style={{ zIndex: 1100 }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Register New Staff Member</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Add a clinical or operational staff member to the hospital directory.
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary btn-icon" 
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {errorMessage && (
              <div style={{ margin: '0.75rem 0', padding: '0.625rem 0.75rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.75rem' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    placeholder="e.g. Dr. Jonathan Hayes"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Staff ID *</label>
                  <input 
                    name="staffId" 
                    type="text" 
                    required 
                    defaultValue={`EMP-STF-${Math.floor(100 + Math.random() * 900)}`}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Work Email *</label>
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="name@dischargeflow.internal"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Number (Optional)</label>
                  <input 
                    name="phone" 
                    type="tel" 
                    placeholder="+1 (555) 012-3456"
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Role Assignment *</label>
                  <select name="role" required className="form-control" defaultValue={ROLES.DOCTOR}>
                    {staffRoleOptions.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select name="department" required className="form-control">
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                    <option value="Hospital Administration & Operations">Hospital Administration & Operations</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Designation / Title (Optional)</label>
                  <input 
                    name="designation" 
                    type="text" 
                    placeholder="e.g. Senior Consultant / Ward Coordinator"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Status</label>
                  <select name="status" className="form-control" defaultValue="Active">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                * Patient and caregiver accounts are managed through the separate patient admission and portal workflow.
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT STAFF MODAL                                         */}
      {/* ======================================================== */}
      {editingStaff && (
        <div className="modal-backdrop" onClick={() => setEditingStaff(null)} style={{ zIndex: 1100 }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Edit Staff Details</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Editing record for {editingStaff.name} ({editingStaff.staffId})
                </p>
              </div>
              <button 
                onClick={() => setEditingStaff(null)}
                className="btn btn-secondary btn-icon" 
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {errorMessage && (
              <div style={{ margin: '0.75rem 0', padding: '0.625rem 0.75rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.75rem' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    defaultValue={editingStaff.name}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Staff ID *</label>
                  <input 
                    name="staffId" 
                    type="text" 
                    required 
                    defaultValue={editingStaff.staffId}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Work Email *</label>
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    defaultValue={editingStaff.email}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input 
                    name="phone" 
                    type="tel" 
                    defaultValue={editingStaff.phone || ''}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Role Assignment *</label>
                  <select name="role" required className="form-control" defaultValue={editingStaff.role}>
                    {staffRoleOptions.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select name="department" required className="form-control" defaultValue={editingStaff.department}>
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                    <option value="Hospital Administration & Operations">Hospital Administration & Operations</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Designation / Title</label>
                  <input 
                    name="designation" 
                    type="text" 
                    defaultValue={editingStaff.designation || ''}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Status</label>
                  <select name="status" className="form-control" defaultValue={editingStaff.status || 'Active'}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setEditingStaff(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW STAFF DETAILS MODAL                                 */}
      {/* ======================================================== */}
      {viewingStaff && (
        <div className="modal-backdrop" onClick={() => setViewingStaff(null)} style={{ zIndex: 1100 }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div 
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: ROLE_CONFIGS[viewingStaff.role]?.badgeColor || '#0f172a',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 700
                  }}
                >
                  {viewingStaff.avatar || 'ST'}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>{viewingStaff.name}</h2>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Staff ID: {viewingStaff.staffId} • {viewingStaff.designation || 'Staff'}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setViewingStaff(null)}
                className="btn btn-secondary btn-icon" 
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Assigned Role</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {ROLE_CONFIGS[viewingStaff.role]?.label || viewingStaff.role}
                  </div>
                </div>

                <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Department</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {viewingStaff.department}
                  </div>
                </div>

                <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Work Email</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {viewingStaff.email}
                  </div>
                </div>

                <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Contact Number</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {viewingStaff.phone || 'Not recorded'}
                  </div>
                </div>
              </div>

              <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Assigned Ward / Station</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                  {viewingStaff.assignedWard || `${viewingStaff.department} Station`}
                </div>
              </div>

              <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Account Status</div>
                <div style={{ marginTop: '0.25rem' }}>
                  <span className={`badge badge-${viewingStaff.status === 'Active' ? 'success' : 'neutral'}`}>
                    {viewingStaff.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    addToast(`Access credentials reset for ${viewingStaff.name}. Temporary passcode sent to ${viewingStaff.email}.`, 'success');
                  }}
                  title="Reset user access credentials"
                >
                  Reset Access
                </button>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setViewingStaff(null);
                    navigateTo('admin-audit-logs');
                  }}
                  title="View user audit trail"
                >
                  View Activity
                </button>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setViewingStaff(null)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRM STATUS TOGGLE MODAL                              */}
      {/* ======================================================== */}
      {deactivatingStaff && (
        <ConfirmationModal
          isOpen={true}
          title={deactivatingStaff.status === 'Active' ? 'Deactivate Staff Account?' : 'Reactivate Staff Account?'}
          message={
            deactivatingStaff.status === 'Active'
              ? `Are you sure you want to deactivate the account for ${deactivatingStaff.name} (${deactivatingStaff.staffId})? This will immediately prevent this demo user from signing into their workspace.`
              : `Reactivate access for ${deactivatingStaff.name} (${deactivatingStaff.staffId})? They will be able to sign in and access their role workspace again.`
          }
          confirmLabel={deactivatingStaff.status === 'Active' ? 'Deactivate Account' : 'Reactivate Account'}
          confirmVariant={deactivatingStaff.status === 'Active' ? 'danger' : 'primary'}
          onConfirm={confirmToggleStatus}
          onCancel={() => setDeactivatingStaff(null)}
        />
      )}
    </div>
  );
}
