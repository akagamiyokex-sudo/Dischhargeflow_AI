import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  FileEdit, 
  Receipt, 
  User, 
  Info,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function WorkflowTrackerPage() {
  const { selectedPatient, loadPatients, navigateTo, addToast, currentUser } = useApp();
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  if (!selectedPatient) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>No patient selected</h3>
          <p>Please select a patient from the overview table to track their discharge workflow.</p>
          <button className="btn btn-primary" onClick={() => navigateTo('dashboard')}>
            Back to Overview
          </button>
        </div>
      </div>
    );
  }

  const p = selectedPatient;

  // Calculate progress percentage
  const completedStagesCount = p.stages.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedStagesCount / 6) * 100);

  // Handle task status update
  const handleTaskStatusChange = async (stageId, taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await apiService.updateWorkflowTask(p.id, stageId, taskId, newStatus);
      await loadPatients();
      addToast(`Task updated to ${newStatus}`, 'success');
    } catch (e) {
      addToast(e.message || 'Failed to update task', 'danger');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <div className="page-container">
      {/* Patient Workflow Header Card */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</h1>
              <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{p.id}</span>
              <span className={`badge badge-${p.statusType}`}>
                <span className="badge-dot" />
                {p.status}
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {p.ward} ({p.bed}) • Attending: {p.attendingDoctor} • Discharge Initiated: {p.dischargeStarted}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigateTo('patient-details', p.id)}
            >
              Patient Details
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigateTo('summary-editor', p.id)}
            >
              <FileEdit size={15} />
              <span>Discharge Summary</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Milestone Status */}
        <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', fontSize: '0.8125rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              Overall Progress: Stage {p.stageNumber} of 6 — {p.stageName}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
              {progressPercent}% Complete
            </span>
          </div>
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${progressPercent}%`, 
                backgroundColor: 'var(--color-primary)', 
                transition: 'width 300ms ease' 
              }} 
            />
          </div>
        </div>
      </div>

      {/* Bottleneck Hold-up Banner */}
      {p.holdingUpReason && p.status !== 'Completed' && (
        <div className="delay-banner">
          <AlertCircle size={20} style={{ color: '#b45309', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div className="delay-banner-title">Current Bottleneck / Holding Up Discharge Completion</div>
            <div className="delay-banner-desc">{p.holdingUpReason}</div>
            <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span>Action Owner: <strong>{p.holdingUpDepartment}</strong></span>
              <span>Elapsed Waiting Time: <strong>{Math.floor(p.waitingTimeMinutes / 60)}h {p.waitingTimeMinutes % 60}m</strong></span>
              <span>Estimated Release Target: <strong>{p.estimatedDischargeTime}</strong></span>
            </div>
          </div>
          {p.stageNumber === 3 && !p.summaryApproved && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => navigateTo('summary-editor', p.id)}
              style={{ alignSelf: 'center' }}
            >
              Review Draft
            </button>
          )}
          {p.stageNumber === 5 && !p.billing.isCleared && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => navigateTo('billing')}
              style={{ alignSelf: 'center' }}
            >
              Review Billing
            </button>
          )}
        </div>
      )}

      {/* 6 Stages Timeline & Interactive Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {p.stages.map((stage) => {
          const isCompleted = stage.status === 'completed';
          const isInProgress = stage.status === 'in-progress';
          const isPending = stage.status === 'pending';

          return (
            <div 
              key={stage.id} 
              className="card"
              style={{
                borderLeft: isInProgress ? '4px solid var(--color-primary)' : (isCompleted ? '4px solid #16a34a' : '4px solid var(--border-subtle)'),
                background: isInProgress ? '#fafdfe' : 'var(--bg-surface)'
              }}
            >
              {/* Stage Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isCompleted ? '#16a34a' : (isInProgress ? 'var(--color-primary)' : 'var(--bg-surface-secondary)'),
                    color: (isCompleted || isInProgress) ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {isCompleted ? <Check size={16} strokeWidth={2.5} /> : stage.id}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.975rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      Stage {stage.id}: {stage.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Responsible: {stage.department} {stage.completedAt && `• Completed: ${stage.completedAt}`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`badge ${isCompleted ? 'badge-success' : (isInProgress ? 'badge-info' : 'badge-neutral')}`}>
                    <span className="badge-dot" />
                    {isCompleted ? 'Completed' : (isInProgress ? 'In Progress' : 'Pending')}
                  </span>
                </div>
              </div>

              {/* Task Checklist for this stage */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '2.5rem' }}>
                {stage.tasks.map((task) => {
                  const taskDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        background: 'var(--bg-surface-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1 }}>
                        <div style={{
                          color: taskDone ? '#16a34a' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {taskDone ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: taskDone ? 'var(--text-secondary)' : 'var(--text-main)',
                            textDecoration: taskDone ? 'none' : 'none'
                          }}>
                            {task.title}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Assigned: {task.assignedTo}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Task Status Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select
                          className="form-control"
                          value={task.status}
                          disabled={updatingTaskId === task.id}
                          onChange={(e) => handleTaskStatusChange(stage.id, task.id, e.target.value)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            width: 'auto',
                            background: taskDone ? 'var(--status-success-bg)' : 'var(--bg-surface)',
                            borderColor: taskDone ? 'var(--status-success-border)' : 'var(--border-subtle)',
                            color: taskDone ? 'var(--status-success-text)' : 'inherit'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>

                        {task.status !== 'completed' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            disabled={updatingTaskId === task.id}
                            onClick={() => handleTaskStatusChange(stage.id, task.id, 'completed')}
                            title="Mark task as completed"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Guardrails note for clinical/billing stages */}
              {stage.id === 3 && (
                <div style={{
                  marginTop: '0.75rem',
                  marginLeft: '2.5rem',
                  fontSize: '0.725rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <ShieldCheck size={13} style={{ color: 'var(--color-primary)' }} />
                  <span>Attending clinician review required. System guardrails prevent bypassing clinical authorization.</span>
                </div>
              )}
              {stage.id === 5 && (
                <div style={{
                  marginTop: '0.75rem',
                  marginLeft: '2.5rem',
                  fontSize: '0.725rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <ShieldCheck size={13} style={{ color: 'var(--color-primary)' }} />
                  <span>Financial clearance requires billing staff verification. Billing clearance operates independently of clinical sign-off.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
