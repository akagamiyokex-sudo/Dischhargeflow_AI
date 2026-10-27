import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { REPORT_BENCHMARKS } from '../data/mockData';
import { 
  BarChart3, 
  Clock, 
  Target, 
  AlertTriangle, 
  Filter, 
  Download, 
  TrendingUp, 
  Info,
  Calendar
} from 'lucide-react';

export default function ReportsPage() {
  const { addToast } = useApp();
  const [timeRange, setTimeRange] = useState('30days');
  const [department, setDepartment] = useState('All');

  const b = REPORT_BENCHMARKS;

  const handleExport = () => {
    addToast('Turnaround report exported as CSV.', 'success');
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Reports & Analytics</h1>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="filter-bar">
        <div className="filter-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <Calendar size={14} />
            <span>Period:</span>
          </div>

          <select 
            className="form-control"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="today">Today (12 cases)</option>
            <option value="7days">Last 7 Days (64 cases)</option>
            <option value="30days">Last 30 Days (148 cases)</option>
          </select>

          <select 
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="All">All Inpatient Wards</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Surgery">General Surgery</option>
            <option value="Orthopaedics">Orthopaedics</option>
            <option value="Neurology">Neurology</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Average Turnaround</span>
            <div className="metric-icon" style={{ color: 'var(--color-primary)' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="metric-value">{b.averageTurnaroundHours}h</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Median Turnaround</span>
            <div className="metric-icon" style={{ color: '#2563eb' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="metric-value">{b.medianTurnaroundHours}h</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Within 5h Target</span>
            <div className="metric-icon" style={{ color: '#16a34a' }}>
              <Target size={16} />
            </div>
          </div>
          <div className="metric-value">{b.targetMetPercent}%</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Sampled Discharges</span>
            <div className="metric-icon" style={{ color: '#475569' }}>
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="metric-value">{b.totalDischargesEvaluated}</div>
        </div>
      </div>

      {/* Stage Breakdown & Delay Reasons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* Time Spent at Each Stage */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Average Time per Stage</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {b.stageBreakdown.map((item, idx) => {
              const maxMinutes = 90;
              const actualPercent = Math.min(100, (item.averageMinutes / maxMinutes) * 100);
              const isOverTarget = item.averageMinutes > item.targetMinutes;

              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item.stage}</span>
                    <span style={{ color: isOverTarget ? '#b45309' : 'var(--text-secondary)', fontWeight: 600 }}>
                      {item.averageMinutes} min <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(target &lt; {item.targetMinutes}m)</span>
                    </span>
                  </div>

                  <div style={{ height: '7px', background: 'var(--bg-surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${actualPercent}%`,
                      backgroundColor: isOverTarget ? '#f59e0b' : 'var(--color-primary)',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Common Reasons for Delays */}
        <div className="card">
          <div className="card-header">
            <div>
              <span className="card-title">Root Causes of Discharge Delays</span>
            </div>
            <AlertTriangle size={16} style={{ color: '#d97706' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {b.delayReasons.map((reason, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '0.625rem 0.75rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface-secondary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.78125rem', color: 'var(--text-main)' }}>
                    {reason.reason}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                    {reason.percentage}%
                  </span>
                </div>
                <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${reason.percentage * 2}%`,
                    backgroundColor: idx === 0 ? '#dc2626' : (idx === 1 ? '#ea580c' : '#0d9488')
                  }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {reason.count} recorded instances
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
