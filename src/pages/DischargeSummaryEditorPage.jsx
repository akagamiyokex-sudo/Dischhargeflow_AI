import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { 
  FileEdit, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  Trash2,
  FileText,
  UserCheck
} from 'lucide-react';

export default function DischargeSummaryEditorPage() {
  const { selectedPatient, loadPatients, currentUser, addToast, navigateTo } = useApp();

  // Local form state
  const [formData, setFormData] = useState({
    admissionReason: '',
    confirmedDiagnosis: '',
    treatmentSummary: '',
    medications: [],
    dischargeCondition: '',
    followUpPlan: '',
    warningInstructions: ''
  });

  const [isDraftPrepared, setIsDraftPrepared] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Modals state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnNote, setReturnNote] = useState('');

  // Sync with selected patient
  useEffect(() => {
    if (selectedPatient) {
      if (selectedPatient.summaryContent) {
        setFormData({
          admissionReason: selectedPatient.summaryContent.admissionReason || '',
          confirmedDiagnosis: selectedPatient.summaryContent.confirmedDiagnosis || '',
          treatmentSummary: selectedPatient.summaryContent.treatmentSummary || '',
          medications: selectedPatient.summaryContent.medications || [],
          dischargeCondition: selectedPatient.summaryContent.dischargeCondition || '',
          followUpPlan: selectedPatient.summaryContent.followUpPlan || '',
          warningInstructions: selectedPatient.summaryContent.warningInstructions || ''
        });
        setIsDraftPrepared(true);
      } else {
        // Reset if no draft yet
        setFormData({
          admissionReason: '',
          confirmedDiagnosis: '',
          treatmentSummary: '',
          medications: [],
          dischargeCondition: '',
          followUpPlan: '',
          warningInstructions: ''
        });
        setIsDraftPrepared(false);
      }
      setIsApproved(selectedPatient.summaryApproved);
    }
  }, [selectedPatient]);

  if (!selectedPatient) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>No patient selected</h3>
          <p>Please select a patient to open their discharge summary workspace.</p>
          <button className="btn btn-primary" onClick={() => navigateTo('dashboard')}>
            Back to Overview
          </button>
        </div>
      </div>
    );
  }

  const p = selectedPatient;
  const isDoctorRole = currentUser.permissions.includes('approve_summary');

  // Trigger Prepare Draft
  const handlePrepareDraft = async () => {
    try {
      const updated = await apiService.generateAIDraftSummary(p.id);
      await loadPatients();
      setIsDraftPrepared(true);
      addToast('Draft prepared from clinical notes — review all details before clinical approval.', 'info');
    } catch (e) {
      addToast('Could not prepare draft. Please try again.', 'danger');
    }
  };

  // Save Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await apiService.saveDischargeSummary(p.id, formData);
      await loadPatients();
      addToast('Discharge summary draft saved successfully.', 'success');
    } catch (e) {
      addToast('Could not save draft. Please try again.', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  // Doctor Approval
  const handleConfirmApproval = async () => {
    setShowApproveModal(false);
    try {
      await apiService.approveDischargeSummary(p.id, currentUser.name);
      await loadPatients();
      setIsApproved(true);
      addToast(`Discharge summary officially approved and signed by ${currentUser.name}. Stage 3 marked completed!`, 'success');
    } catch (e) {
      addToast('Approval failed: ' + e.message, 'danger');
    }
  };

  // Return for correction
  const handleConfirmReturn = async () => {
    if (!returnNote.trim()) {
      addToast('Please enter a note explaining what needs correction.', 'warning');
      return;
    }
    setShowReturnModal(false);
    try {
      await apiService.returnSummaryForCorrection(p.id, returnNote);
      await loadPatients();
      setIsApproved(false);
      addToast('Summary returned for correction.', 'info');
      setReturnNote('');
    } catch (e) {
      addToast('Failed to return summary.', 'danger');
    }
  };

  // Medication handlers
  const handleMedChange = (index, field, value) => {
    const updated = [...formData.medications];
    updated[index][field] = value;
    setFormData({ ...formData, medications: updated });
  };

  const handleAddMed = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { name: '', dose: '', route: 'Oral', frequency: '', duration: '', purpose: '' }
      ]
    });
  };

  const handleRemoveMed = (index) => {
    const updated = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: updated });
  };

  return (
    <div className="page-container">
      {/* Workspace Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Clinical Discharge Summary Workspace</h1>
          <p>Attending physician document editor. Synthesizes intake records, clinical orders, and pharmacy instructions.</p>
        </div>

        <div className="page-header-actions">
          {!isDraftPrepared && !isApproved && (
            <button className="btn btn-secondary" onClick={handlePrepareDraft}>
              <Sparkles size={15} style={{ color: 'var(--color-primary)' }} />
              <span>Prepare Draft</span>
            </button>
          )}

          <button 
            className="btn btn-secondary" 
            onClick={handleSaveDraft}
            disabled={isSaving || isApproved}
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {!isApproved && (
            <button 
              className="btn btn-secondary"
              onClick={() => setShowReturnModal(true)}
              style={{ color: '#b45309' }}
            >
              <RotateCcw size={15} />
              <span>Return for Correction</span>
            </button>
          )}

          <button 
            className="btn btn-primary"
            onClick={() => {
              if (!isDoctorRole) {
                addToast('Only an Attending Physician or authorized clinician role can approve discharge summaries. Please switch role in top menu to test approval.', 'warning');
              } else {
                setShowApproveModal(true);
              }
            }}
            disabled={isApproved}
          >
            <CheckCircle2 size={15} />
            <span>{isApproved ? 'Summary Approved' : 'Approve Summary'}</span>
          </button>
        </div>
      </div>

      {/* Patient Synopsis Ribbon */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.875rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{p.name}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.78125rem', color: 'var(--text-muted)' }}>({p.id})</span>
              <span className={`badge ${isApproved ? 'badge-success' : (isDraftPrepared ? 'badge-warning' : 'badge-neutral')}`}>
                {isApproved ? 'Approved & Signed' : (isDraftPrepared ? 'Draft Under Review' : 'No Draft Yet')}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Ward: {p.ward} • Admitted: {p.admissionDate} • Attending: {p.attendingDoctor}
            </div>
          </div>

          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            <div>FastAPI Integration Ready: <code>PUT /api/v1/summary/{p.id}</code></div>
            {isApproved && <div style={{ color: 'var(--status-success-text)', fontWeight: 600 }}>Signed by: {p.summaryApprovedBy} ({p.summaryApprovedAt})</div>}
          </div>
        </div>
      </div>

      {/* Draft Notification Banner */}
      {isDraftPrepared && !isApproved && (
        <div style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Draft prepared from clinical notes — review all details before clinical approval. Fields requiring physician input are flagged with [Needs confirmation].
            </span>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handlePrepareDraft}
            title="Refresh draft with latest data"
          >
            Re-generate
          </button>
        </div>
      )}

      {/* Editor Body */}
      {!isDraftPrepared && !isApproved ? (
        <div className="empty-state">
          <FileEdit size={36} className="empty-state-icon" />
          <h3 className="empty-state-title">No discharge draft prepared yet</h3>
          <p className="empty-state-desc">
            Click "Prepare Draft" to synthesize admission notes, surgical records, and medication orders into a structured draft for clinical review.
          </p>
          <button className="btn btn-primary" onClick={handlePrepareDraft}>
            <Sparkles size={15} />
            <span>Prepare Draft</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Section 1: Reason for Admission & Diagnosis */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">1. Clinical Indications & Diagnosis</span>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Admission</label>
              <textarea
                className="form-control"
                rows={2}
                disabled={isApproved}
                value={formData.admissionReason}
                onChange={(e) => setFormData({ ...formData, admissionReason: e.target.value })}
                placeholder="Enter detailed clinical reason for hospital admission..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirmed Final Diagnosis</label>
              <textarea
                className="form-control"
                rows={2}
                disabled={isApproved}
                value={formData.confirmedDiagnosis}
                onChange={(e) => setFormData({ ...formData, confirmedDiagnosis: e.target.value })}
                placeholder="Enter confirmed primary diagnosis and ICD-10 code..."
              />
            </div>
          </div>

          {/* Section 2: Treatment & Procedures */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">2. Inpatient Treatment & Procedures Performed</span>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Summary of Hospital Course & Interventions</label>
              <textarea
                className="form-control"
                rows={3}
                disabled={isApproved}
                value={formData.treatmentSummary}
                onChange={(e) => setFormData({ ...formData, treatmentSummary: e.target.value })}
                placeholder="Detail procedures, catheterizations, surgeries, clinical therapies..."
              />
            </div>
          </div>

          {/* Section 3: Medication Instructions at Discharge */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">3. Take-Home Medication Orders</span>
              {!isApproved && (
                <button className="btn btn-secondary btn-sm" onClick={handleAddMed}>
                  <Plus size={14} />
                  <span>Add Medication</span>
                </button>
              )}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="hospital-table" style={{ fontSize: '0.78125rem' }}>
                <thead>
                  <tr>
                    <th>Medication Name</th>
                    <th>Dose</th>
                    <th>Route</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Indication / Purpose</th>
                    {!isApproved && <th style={{ width: '40px' }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {formData.medications && formData.medications.length > 0 ? (
                    formData.medications.map((med, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            disabled={isApproved}
                            value={med.name}
                            onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                            placeholder="e.g. Aspirin"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.78125rem' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            disabled={isApproved}
                            value={med.dose}
                            onChange={(e) => handleMedChange(idx, 'dose', e.target.value)}
                            placeholder="e.g. 81 mg"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.78125rem', width: '90px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            disabled={isApproved}
                            value={med.route}
                            onChange={(e) => handleMedChange(idx, 'route', e.target.value)}
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.78125rem', width: '80px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            disabled={isApproved}
                            value={med.frequency}
                            onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                            placeholder="e.g. Twice daily"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.78125rem' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            disabled={isApproved}
                            value={med.duration}
                            onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                            placeholder="e.g. 14 days"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.78125rem', width: '100px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            disabled={isApproved}
                            value={med.purpose}
                            onChange={(e) => handleMedChange(idx, 'purpose', e.target.value)}
                            placeholder="e.g. Blood pressure"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.78125rem' }}
                          />
                        </td>
                        {!isApproved && (
                          <td>
                            <button
                              onClick={() => handleRemoveMed(idx)}
                              style={{ color: '#ef4444', padding: '0.25rem' }}
                              title="Delete medication line"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No medications listed. Click "Add Medication" above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Condition, Follow-up & Red Flags */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">4. Discharge Condition, Follow-up Plan & Red Flag Signs</span>
            </div>

            <div className="form-group">
              <label className="form-label">Patient Condition at Discharge</label>
              <textarea
                className="form-control"
                rows={2}
                disabled={isApproved}
                value={formData.dischargeCondition}
                onChange={(e) => setFormData({ ...formData, dischargeCondition: e.target.value })}
                placeholder="Bedside examination findings, wound condition, mobility..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Follow-up Plan & Outpatient Appointments</label>
              <textarea
                className="form-control"
                rows={2}
                disabled={isApproved}
                value={formData.followUpPlan}
                onChange={(e) => setFormData({ ...formData, followUpPlan: e.target.value })}
                placeholder="Upcoming clinic appointments, rehabilitation, required blood tests..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Warning Signs & Emergency Instructions</label>
              <textarea
                className="form-control"
                rows={2}
                disabled={isApproved}
                value={formData.warningInstructions}
                onChange={(e) => setFormData({ ...formData, warningInstructions: e.target.value })}
                placeholder="Specific symptoms requiring immediate re-admission or emergency care..."
              />
            </div>
          </div>

          {/* Action Bar at bottom */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '2rem' }}>
            <button className="btn btn-secondary" onClick={() => navigateTo('workflow', p.id)}>
              Back to Workflow Tracker
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                if (!isDoctorRole) {
                  addToast('Only Attending Physicians can approve discharge summaries. Please log in with a Doctor account.', 'warning');
                } else {
                  setShowApproveModal(true);
                }
              }}
              disabled={isApproved}
            >
              <CheckCircle2 size={15} />
              <span>{isApproved ? 'Summary Officially Approved' : 'Authorize & Sign Summary'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Approval Confirmation Dialog */}
      <ConfirmationModal
        isOpen={showApproveModal}
        title="Confirm Clinical Approval of Discharge Summary"
        message={`Are you sure you want to approve and sign the discharge summary for ${p.name} (${p.id})? This will record your electronic clinical signature and advance Stage 3 to Completed.`}
        confirmText="Approve & Sign"
        cancelText="Review Details"
        onConfirm={handleConfirmApproval}
        onClose={() => setShowApproveModal(false)}
        details={`Attending Clinician: ${currentUser.name} • Timestamp: Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
      />

      {/* Return for Correction Dialog */}
      <ConfirmationModal
        isOpen={showReturnModal}
        title="Return Summary for Correction"
        message="Please provide specific feedback for the care coordinator or resident regarding what needs revision."
        confirmText="Submit Note"
        confirmVariant="danger"
        cancelText="Cancel"
        onConfirm={handleConfirmReturn}
        onClose={() => setShowReturnModal(false)}
        details={
          <div style={{ marginTop: '0.5rem' }}>
            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g. Please clarify exact dosage for Ticagrelor and recheck discharge serum potassium level."
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
            />
          </div>
        }
      />
    </div>
  );
}
