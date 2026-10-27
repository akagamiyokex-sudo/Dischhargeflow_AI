import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { WARD_CAPACITY_DATA } from '../../data/adminInitialData';
import { 
  Activity, 
  Building2, 
  Bed, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function AdminOperationsPage() {
  const { departments, staffList, patients, navigateTo } = useApp();

  const [deptFilter, setDeptFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('Today');

  // Compute live hospital-wide operations metrics
  const opsMetrics = useMemo(() => {
    const totalBeds = departments.reduce((acc, d) => acc + (d.totalBeds || 30), 0);
    const activePatients = patients.filter(p => p.status !== 'Completed');
    const occupiedBeds = activePatients.length > 0 ? Math.min(totalBeds, Math.round(totalBeds * 0.84) + activePatients.length) : 0;
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
    const dischargesInProgress = patients.filter(p => p.status !== 'Completed' && (p.stageNumber || 1) >= 1).length;
    const pendingTasks = patients.filter(p => p.holdingUpReason && p.status !== 'Completed').length;
    const staffOnDuty = staffList.filter(s => s.status === 'Active').length;

    return {
      totalBeds,
      occupiedBeds,
      occupancyRate,
      dischargesInProgress,
      pendingTasks,
      staffOnDuty
    };
  }, [departments, patients, staffList]);

  // Ward capacity list (merged with live department state and filters)
  const wardList = useMemo(() => {
    return WARD_CAPACITY_DATA.filter(w => {
      return deptFilter === 'ALL' || w.dept.toLowerCase() === deptFilter.toLowerCase();
    });
  }, [deptFilter]);

  // Department-wise workload breakdown
  const departmentWorkload = useMemo(() => {
    return departments
      .filter(d => deptFilter === 'ALL' || d.name.toLowerCase() === deptFilter.toLowerCase())
      .map(dept => {
        const deptPatients = patients.filter(p => p.department?.toLowerCase() === dept.name?.toLowerCase());
        const inpatients = deptPatients.filter(p => p.status !== 'Completed').length;
        const activeDischarges = deptPatients.filter(p => p.status !== 'Completed' && (p.stageNumber || 1) >= 1).length;
        const pendingBottlenecks = deptPatients.filter(p => p.holdingUpReason && p.status !== 'Completed').length;
        const assignedStaff = staffList.filter(s => s.department === dept.name && s.status === 'Active').length;
        const estOccupancy = Math.min(100, Math.round(((dept.totalBeds * 0.8 + inpatients) / dept.totalBeds) * 100));

        return {
          ...dept,
          inpatients,
          activeDischarges,
          pendingBottlenecks,
          assignedStaff,
          estOccupancy
        };
      });
  }, [departments, patients, staffList, deptFilter]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Operations</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => navigateTo('admin-departments')}>
            <Building2 size={15} />
            <span>Departments</span>
          </button>
          <button className="btn btn-primary" onClick={() => navigateTo('admin-discharges')}>
            <Clock size={15} />
            <span>Discharges</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>Filter:</span>

            <select 
              value={deptFilter} 
              onChange={(e) => setDeptFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto' }}
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Status: <strong style={{ color: '#16a34a' }}>Normal</strong>
          </div>
        </div>
      </div>

      {/* Operational Summary Metrics Cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">BED OCCUPANCY</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <Bed size={15} />
            </div>
          </div>
          <div className="metric-value">{opsMetrics.occupancyRate}%</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">AVAILABLE BEDS</span>
            <div className="metric-icon" style={{ color: '#16a34a' }}>
              <Building2 size={15} />
            </div>
          </div>
          <div className="metric-value">{Math.max(0, opsMetrics.totalBeds - opsMetrics.occupiedBeds)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">IN DISCHARGE</span>
            <div className="metric-icon" style={{ color: '#d97706' }}>
              <Clock size={15} />
            </div>
          </div>
          <div className="metric-value">{opsMetrics.dischargesInProgress}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">PENDING TASKS</span>
            <div className="metric-icon" style={{ color: '#b91c1c' }}>
              <AlertTriangle size={15} />
            </div>
          </div>
          <div className="metric-value">{opsMetrics.pendingTasks}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">STAFF ON DUTY</span>
            <div className="metric-icon" style={{ color: '#2563eb' }}>
              <Users size={15} />
            </div>
          </div>
          <div className="metric-value">{opsMetrics.staffOnDuty}</div>
        </div>
      </div>

      {/* Ward Occupancy & Bed Allocation Table */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <span className="card-title">Ward Occupancy & Bed Capacity ({wardList.length})</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Ward / Station</th>
                <th>Department</th>
                <th>Licensed Beds</th>
                <th>Occupied</th>
                <th>Available</th>
                <th style={{ width: '180px' }}>Capacity Utilization</th>
                <th>Planned Discharges</th>
                <th>Nurse Ratio</th>
              </tr>
            </thead>
            <tbody>
              {wardList.map((w, idx) => {
                const percent = Math.round((w.occupied / w.totalBeds) * 100);
                const isHigh = percent >= 90;
                return (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                        {w.ward}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78125rem', color: 'var(--text-main)' }}>
                        {w.dept}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {w.totalBeds}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                        {w.occupied}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge badge-${w.available <= 3 ? 'warning' : 'success'}`} style={{ fontSize: '0.7rem' }}>
                        {w.available} beds
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div 
                          style={{
                            flex: 1,
                            height: '6px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}
                        >
                          <div 
                            style={{
                              width: `${percent}%`,
                              height: '100%',
                              backgroundColor: isHigh ? '#b91c1c' : percent > 75 ? '#d97706' : '#0d9488'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.71875rem', fontWeight: 600, color: isHigh ? '#b91c1c' : 'var(--text-main)', minWidth: '32px' }}>
                          {percent}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                        {w.plannedOut} today
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {w.nurseRatio}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department-Wise Workload Breakdown */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Department Workload</span>
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('admin-users')}>
            Staff
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Unit Head</th>
                <th>Active Inpatients</th>
                <th>Active Discharges</th>
                <th>Pending Bottlenecks</th>
                <th>Staff on Duty</th>
                <th>Bed Utilization</th>
                <th>Operational Status</th>
              </tr>
            </thead>
            <tbody>
              {departmentWorkload.map((dept) => (
                <tr key={dept.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                      {dept.name}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      Code: {dept.code}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
                      {dept.head}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.8125rem' }}>{dept.inpatients}</strong>
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {dept.activeDischarges} active
                    </span>
                  </td>
                  <td>
                    {dept.pendingBottlenecks > 0 ? (
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                        {dept.pendingBottlenecks} tasks
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      {dept.assignedStaff} staff
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78125rem', fontWeight: 600 }}>
                      ~{dept.estOccupancy}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${dept.status === 'Active' ? 'success' : 'neutral'}`} style={{ fontSize: '0.6875rem' }}>
                      {dept.status === 'Active' ? 'Normal Intake' : 'Restricted'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
