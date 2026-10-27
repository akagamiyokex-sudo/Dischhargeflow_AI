import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit2, 
  Eye, 
  CheckCircle2, 
  Power, 
  AlertTriangle,
  Users, 
  Bed, 
  Clock, 
  X
} from 'lucide-react';

export default function AdminDepartmentsPage() {
  const { departments, staffList, patients, addDepartment, updateDepartment, toggleDepartmentStatus } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [viewingDept, setViewingDept] = useState(null);
  const [togglingDept, setTogglingDept] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Dynamically calculate metrics per department
  const enrichedDepartments = useMemo(() => {
    return departments.map(dept => {
      const assignedStaff = staffList.filter(s => s.department === dept.name && s.status === 'Active');
      const deptPatients = patients.filter(p => p.department?.toLowerCase() === dept.name?.toLowerCase());
      const admittedPatients = deptPatients.filter(p => p.status !== 'Completed');
      const activeDischarges = deptPatients.filter(p => p.status !== 'Completed' && (p.stageNumber || 1) >= 1);

      return {
        ...dept,
        staffCount: assignedStaff.length,
        admittedCount: admittedPatients.length,
        activeDischargesCount: activeDischarges.length
      };
    });
  }, [departments, staffList, patients]);

  // Filtered list
  const filteredDepartments = useMemo(() => {
    return enrichedDepartments.filter(d => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || 
        d.name.toLowerCase().includes(term) || 
        d.code.toLowerCase().includes(term) || 
        d.head.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enrichedDepartments, searchTerm, statusFilter]);

  // Handle Add Form Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const form = e.target;
    const deptData = {
      name: form.name.value,
      code: form.code.value,
      head: form.head.value,
      location: form.location.value,
      totalBeds: form.totalBeds.value,
      description: form.description.value,
      status: form.status.value
    };

    try {
      addDepartment(deptData);
      setShowAddModal(false);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Handle Edit Form Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const form = e.target;
    const updatedData = {
      name: form.name.value,
      code: form.code.value,
      head: form.head.value,
      location: form.location.value,
      totalBeds: form.totalBeds.value,
      description: form.description.value,
      status: form.status.value
    };

    try {
      updateDepartment(editingDept.id, updatedData);
      setEditingDept(null);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Confirm Status Toggle
  const confirmToggleStatus = () => {
    if (!togglingDept) return;
    try {
      toggleDepartmentStatus(togglingDept.id);
      setTogglingDept(null);
    } catch (err) {
      alert(err.message);
      setTogglingDept(null);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Departments</h1>
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
            <span>+ Add Department</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={15} 
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input
              type="text"
              placeholder="Search departments, code, head..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {(searchTerm || statusFilter !== 'ALL') && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Department Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Departments ({filteredDepartments.length})</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Department Name</th>
                <th>Department Head</th>
                <th>Ward / Location</th>
                <th>Assigned Staff</th>
                <th>Admitted Patients</th>
                <th>Active Discharges</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No departments match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept) => {
                  const isDeactivated = dept.status === 'Inactive';
                  return (
                    <tr key={dept.id} style={{ opacity: isDeactivated ? 0.7 : 1 }}>
                      <td>
                        <span className="badge badge-neutral" style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.75rem' }}>
                          {dept.code}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                          {dept.name}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                          Capacity: {dept.totalBeds || 20} licensed beds
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78125rem', color: 'var(--text-main)' }}>
                          {dept.head}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {dept.location || 'Main Hospital'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Users size={13} style={{ color: '#2563eb' }} />
                          <strong style={{ fontSize: '0.8125rem' }}>{dept.staffCount}</strong>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>staff</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Bed size={13} style={{ color: 'var(--color-primary)' }} />
                          <strong style={{ fontSize: '0.8125rem' }}>{dept.admittedCount}</strong>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>inpatient</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>
                          {dept.activeDischargesCount} in pipeline
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${isDeactivated ? 'neutral' : 'success'}`} style={{ fontSize: '0.6875rem' }}>
                          {dept.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button 
                            className="btn btn-secondary btn-sm"
                            title="View Department Details"
                            onClick={() => setViewingDept(dept)}
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <Eye size={13} />
                          </button>

                          <button 
                            className="btn btn-secondary btn-sm"
                            title="Edit Department"
                            onClick={() => {
                              setErrorMessage('');
                              setEditingDept(dept);
                            }}
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <Edit2 size={13} />
                          </button>

                          <button 
                            className="btn btn-secondary btn-sm"
                            title={isDeactivated ? 'Activate Department' : 'Deactivate Department'}
                            onClick={() => setTogglingDept(dept)}
                            style={{ 
                              padding: '0.25rem 0.5rem',
                              color: isDeactivated ? '#16a34a' : '#d97706'
                            }}
                          >
                            <Power size={13} />
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
      {/* ADD DEPARTMENT MODAL                                     */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)} style={{ zIndex: 1100 }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Add Hospital Department</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Create a new clinical department, ward unit, and bed allocation.
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
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Department Name *</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    placeholder="e.g. Intensive Care Unit"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department Code *</label>
                  <input 
                    name="code" 
                    type="text" 
                    required 
                    maxLength={6}
                    placeholder="e.g. ICU"
                    style={{ textTransform: 'uppercase' }}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Department Head *</label>
                  <input 
                    name="head" 
                    type="text" 
                    required 
                    placeholder="e.g. Dr. Samantha Brooks, MD"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Licensed Beds</label>
                  <input 
                    name="totalBeds" 
                    type="number" 
                    defaultValue={30}
                    min={1}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Ward Reference</label>
                <input 
                  name="location" 
                  type="text" 
                  placeholder="e.g. Building B, 3rd Floor, West Wing"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  name="description" 
                  rows={2} 
                  placeholder="Brief clinical scope and unit focus..."
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="form-control" defaultValue="Active">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT DEPARTMENT MODAL                                    */}
      {/* ======================================================== */}
      {editingDept && (
        <div className="modal-backdrop" onClick={() => setEditingDept(null)} style={{ zIndex: 1100 }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Edit Department</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Editing configurations for {editingDept.name} ({editingDept.code})
                </p>
              </div>
              <button 
                onClick={() => setEditingDept(null)}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Department Name *</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    defaultValue={editingDept.name}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department Code *</label>
                  <input 
                    name="code" 
                    type="text" 
                    required 
                    defaultValue={editingDept.code}
                    maxLength={6}
                    style={{ textTransform: 'uppercase' }}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Department Head *</label>
                  <input 
                    name="head" 
                    type="text" 
                    required 
                    defaultValue={editingDept.head}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Licensed Beds</label>
                  <input 
                    name="totalBeds" 
                    type="number" 
                    defaultValue={editingDept.totalBeds || 30}
                    min={1}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Ward Reference</label>
                <input 
                  name="location" 
                  type="text" 
                  defaultValue={editingDept.location || ''}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  name="description" 
                  rows={2} 
                  defaultValue={editingDept.description || ''}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="form-control" defaultValue={editingDept.status || 'Active'}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setEditingDept(null)}
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
      {/* VIEW DEPARTMENT DETAILS MODAL                            */}
      {/* ======================================================== */}
      {viewingDept && (
        <div className="modal-backdrop" onClick={() => setViewingDept(null)} style={{ zIndex: 1100 }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-neutral" style={{ fontFamily: 'monospace' }}>
                    {viewingDept.code}
                  </span>
                  <span className={`badge badge-${viewingDept.status === 'Active' ? 'success' : 'neutral'}`}>
                    {viewingDept.status}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{viewingDept.name}</h2>
              </div>
              <button 
                onClick={() => setViewingDept(null)}
                className="btn btn-secondary btn-icon" 
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
                <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Licensed Beds</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {viewingDept.totalBeds}
                  </div>
                </div>

                <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Active Staff</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {viewingDept.staffCount}
                  </div>
                </div>

                <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Inpatients</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {viewingDept.admittedCount}
                  </div>
                </div>
              </div>

              <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Department Head</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                  {viewingDept.head}
                </div>
              </div>

              <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Ward & Campus Location</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                  {viewingDept.location || 'Main Hospital Complex'}
                </div>
              </div>

              {viewingDept.description && (
                <div style={{ padding: '0.625rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Unit Scope & Description</div>
                  <div style={{ fontSize: '0.78125rem', color: 'var(--text-main)', marginTop: '0.15rem', lineHeight: 1.4 }}>
                    {viewingDept.description}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setViewingDept(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRM STATUS TOGGLE MODAL                              */}
      {/* ======================================================== */}
      {togglingDept && (
        <ConfirmationModal
          isOpen={true}
          title={togglingDept.status === 'Active' ? 'Deactivate Department?' : 'Reactivate Department?'}
          message={
            togglingDept.status === 'Active'
              ? `Are you sure you want to deactivate ${togglingDept.name} (${togglingDept.code})? It has ${togglingDept.admittedCount} admitted patients and ${togglingDept.staffCount} assigned staff. Deactivating will restrict new intakes while preserving existing records.`
              : `Reactivate ${togglingDept.name} (${togglingDept.code}) to resume normal intake and operational scheduling?`
          }
          confirmLabel={togglingDept.status === 'Active' ? 'Deactivate Department' : 'Reactivate Department'}
          confirmVariant={togglingDept.status === 'Active' ? 'warning' : 'primary'}
          onConfirm={confirmToggleStatus}
          onCancel={() => setTogglingDept(null)}
        />
      )}
    </div>
  );
}
