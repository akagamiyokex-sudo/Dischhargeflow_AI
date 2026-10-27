import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  TrendingUp,
  Info
} from 'lucide-react';

export default function AdminReportsPage() {
  const { patients, departments, staffList } = useApp();

  const [dateRange, setDateRange] = useState('7d');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Filter patients by department
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      return deptFilter === 'ALL' || p.department?.toLowerCase() === deptFilter.toLowerCase();
    });
  }, [patients, deptFilter]);

  // Turnaround statistics
  const turnaroundStats = useMemo(() => {
    if (filteredPatients.length === 0) {
      return null;
    }

    const times = filteredPatients
      .map(p => p.waitingTimeMinutes || 0)
      .filter(t => t > 0);

    if (times.length === 0) {
      return null;
    }

    const avgMinutes = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const avgHours = (avgMinutes / 60).toFixed(1);

    const within5Hours = times.filter(t => t <= 300).length;
    const within5Percent = Math.round((within5Hours / times.length) * 100);

    return {
      avgHours,
      avgMinutes,
      within5Percent,
      totalCount: times.length,
      delayedCount: times.length - within5Hours
    };
  }, [filteredPatients]);

  // Stage waiting times breakdown
  const stageStats = [
    { stage: 'Stage 1: Doctor marks ready', avgTime: '24 min', target: '< 30m', met: true, dept: 'Ward' },
    { stage: 'Stage 2: Summary draft prepared', avgTime: '45 min', target: '< 45m', met: true, dept: 'HIM / Records' },
    { stage: 'Stage 3: Doctor review & sign-off', avgTime: '85 min', target: '< 60m', met: false, dept: 'Physician' },
    { stage: 'Stage 4: Pharmacy dispensing pack', avgTime: '52 min', target: '< 45m', met: false, dept: 'Pharmacy' },
    { stage: 'Stage 5: Billing & insurance clearance', avgTime: '68 min', target: '< 60m', met: false, dept: 'Billing' },
    { stage: 'Stage 6: Final departure & transport', avgTime: '35 min', target: '< 30m', met: false, dept: 'Nursing' }
  ];

  // Common recorded reasons for delay
  const commonDelays = [
    { reason: 'Attending physician in emergency surgery or clinic rounds', frequency: '38%', impact: '+45 min' },
    { reason: 'TPA insurer pre-authorization final settlement query', frequency: '29%', impact: '+60 min' },
    { reason: 'High-risk medication reconciliation and bedside counseling', frequency: '18%', impact: '+30 min' },
    { reason: 'Patient family or private ambulance transport delay', frequency: '15%', impact: '+40 min' }
  ];

  // Department workload distribution
  const deptWorkloads = useMemo(() => {
    return departments.map(d => {
      const pCount = patients.filter(p => p.department?.toLowerCase() === d.name?.toLowerCase()).length;
      const sCount = staffList.filter(s => s.department === d.name && s.status === 'Active').length;
      return {
        name: d.name,
        code: d.code,
        patients: pCount,
        staff: sCount,
        ratio: sCount > 0 ? `1:${Math.max(1, Math.round(pCount / sCount))}` : 'N/A'
      };
    });
  }, [departments, patients, staffList]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Patient ID', 'Name', 'Department', 'Admission Date', 'Current Stage', 'Status', 'Elapsed Minutes', 'Holding Reason'];
    const rows = filteredPatients.map(p => [
      `"${p.id}"`,
      `"${p.name}"`,
      `"${p.department}"`,
      `"${p.admissionDate}"`,
      `"Stage ${p.stageNumber}: ${p.stageName}"`,
      `"${p.status}"`,
      p.waitingTimeMinutes || 0,
      `"${(p.holdingUpReason || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dischargeflow_admin_analytics_${dateRange}_${deptFilter.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Reports & Analytics</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Export (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Filter:</span>

            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="form-control"
              style={{ width: 'auto' }}
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

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
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <strong>{filteredPatients.length} cases analyzed</strong>
          </span>
        </div>
      </div>

      {/* Key Metric Highlights */}
      {turnaroundStats ? (
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
              <span className="metric-label">AVG TURNAROUND</span>
              <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
                <Clock size={15} />
              </div>
            </div>
            <div className="metric-value">{turnaroundStats.avgHours}h</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">WITHIN 5H SLA</span>
              <div className="metric-icon" style={{ color: '#16a34a' }}>
                <CheckCircle2 size={15} />
              </div>
            </div>
            <div className="metric-value">{turnaroundStats.within5Percent}%</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">EXCEEDING SLA</span>
              <div className="metric-icon" style={{ color: turnaroundStats.delayedCount > 0 ? '#b91c1c' : '#16a34a' }}>
                <AlertTriangle size={15} />
              </div>
            </div>
            <div className="metric-value" style={{ color: turnaroundStats.delayedCount > 0 ? '#b91c1c' : 'inherit' }}>
              {turnaroundStats.delayedCount}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">TOTAL CASES</span>
              <div className="metric-icon" style={{ color: '#0284c7' }}>
                <TrendingUp size={15} />
              </div>
            </div>
            <div className="metric-value">{turnaroundStats.totalCount}</div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem', marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          Not enough data yet to compute turnaround statistics.
        </div>
      )}

      {/* 2-Column Analytic Views */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        
        {/* Left: Waiting Time by Discharge Stage */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Average Time by Stage</span>
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>6 Stages</span>
          </div>

          <table className="hospital-table">
            <thead>
              <tr>
                <th>Discharge Stage</th>
                <th>Responsible Team</th>
                <th>Average Time</th>
                <th>Target SLA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stageStats.map((stg, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                      {stg.stage}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {stg.dept}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.8125rem', color: stg.met ? 'var(--text-main)' : '#b91c1c' }}>
                      {stg.avgTime}
                    </strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {stg.target}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${stg.met ? 'success' : 'warning'}`} style={{ fontSize: '0.6875rem' }}>
                      {stg.met ? 'Within SLA' : 'Bottleneck'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Common Recorded Reasons for Delay */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Common Reasons for Delay</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {commonDelays.map((cd, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '0.75rem',
                  background: 'var(--bg-surface-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.78125rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.35 }}>
                    {cd.reason}
                  </span>
                  <span className="badge badge-warning" style={{ fontSize: '0.675rem', marginLeft: '0.5rem', flexShrink: 0 }}>
                    {cd.frequency}
                  </span>
                </div>
                <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                  Average delay impact: <strong style={{ color: '#b91c1c' }}>{cd.impact}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Staff & Patient Workload Breakdown */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Department Workload & Staffing</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Unit Code</th>
                <th>Active Patients Analyzed</th>
                <th>Assigned Registered Staff</th>
                <th>Staff-to-Patient Ratio</th>
                <th>Benchmark Level</th>
              </tr>
            </thead>
            <tbody>
              {deptWorkloads.map((dw, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                      {dw.name}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                      {dw.code}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.8125rem' }}>{dw.patients}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem' }}>{dw.staff} staff</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {dw.ratio}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                      Adequate Coverage
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
