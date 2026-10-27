import React, { useState } from 'react';
import { X, UserPlus, Stethoscope, Building2, ShieldCheck, Heart } from 'lucide-react';

export default function AddPatientModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    department: 'General Medicine',
    ward: 'General Medicine - Ward 3A',
    bed: 'Bed 01',
    attendingDoctor: '',
    reasonForAdmission: '',
    confirmedDiagnosis: '',
    icd10: '',
    payer: '',
    patientCoPay: '',
    totalCharges: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Patient name is required';
    if (!formData.age || isNaN(formData.age) || Number(formData.age) <= 0) newErrors.age = 'Valid age is required';
    if (!formData.reasonForAdmission.trim()) newErrors.reasonForAdmission = 'Admission reason is required';
    if (!formData.confirmedDiagnosis.trim()) newErrors.confirmedDiagnosis = 'Diagnosis is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({
      ...formData,
      age: parseInt(formData.age, 10),
      totalCharges: parseFloat(formData.totalCharges) || 3500,
      coveredAmount: (parseFloat(formData.totalCharges) || 3500) - (parseFloat(formData.patientCoPay) || 250),
      patientCoPay: parseFloat(formData.patientCoPay) || 250
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <UserPlus size={18} />
            </div>
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', display: 'block' }}>
                Admit New Patient
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Initialize discharge tracking workflow and clinical documentation
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '0.25rem', borderRadius: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: '1.25rem' }}>
          {/* Patient Core Info */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.78125rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Demographic Information
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Eleanor Rigby"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span style={{ color: 'var(--status-danger-text)', fontSize: '0.7rem' }}>{errors.name}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  name="age"
                  className="form-control"
                  placeholder="e.g. 58"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                />
                {errors.age && <span style={{ color: 'var(--status-danger-text)', fontSize: '0.7rem' }}>{errors.age}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Department, Ward & Doctor */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.78125rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Location & Care Team
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Department</label>
                <select
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => {
                    const dep = e.target.value;
                    let defWard = `${dep} - Ward 1A`;
                    if (dep === 'Cardiology') defWard = 'Cardiology - Ward 4B';
                    if (dep === 'General Surgery') defWard = 'General Surgery - Ward 2A';
                    if (dep === 'Orthopedics') defWard = 'Orthopedics - Ward 3C';
                    if (dep === 'Neurology') defWard = 'Neurology - Ward 5A';
                    setFormData(prev => ({ ...prev, department: dep, ward: defWard }));
                  }}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="General Surgery">General Surgery</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pulmonology">Pulmonology</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Attending Doctor</label>
                <input
                  type="text"
                  name="attendingDoctor"
                  className="form-control"
                  value={formData.attendingDoctor}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Smith, MD"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Ward</label>
                <input
                  type="text"
                  name="ward"
                  className="form-control"
                  value={formData.ward}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Bed</label>
                <input
                  type="text"
                  name="bed"
                  className="form-control"
                  placeholder="e.g. Bed 05"
                  value={formData.bed}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Clinical Details */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.78125rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Clinical Details
            </h4>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Reason for Admission / Presentation *</label>
              <textarea
                name="reasonForAdmission"
                className="form-control"
                rows="2"
                placeholder="Chief complaints, admission symptoms, timeline..."
                value={formData.reasonForAdmission}
                onChange={handleChange}
              />
              {errors.reasonForAdmission && <span style={{ color: 'var(--status-danger-text)', fontSize: '0.7rem' }}>{errors.reasonForAdmission}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirmed Clinical Diagnosis *</label>
                <input
                  type="text"
                  name="confirmedDiagnosis"
                  className="form-control"
                  placeholder="e.g. Acute Coronary Syndrome"
                  value={formData.confirmedDiagnosis}
                  onChange={handleChange}
                />
                {errors.confirmedDiagnosis && <span style={{ color: 'var(--status-danger-text)', fontSize: '0.7rem' }}>{errors.confirmedDiagnosis}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">ICD-10 Code</label>
                <input
                  type="text"
                  name="icd10"
                  className="form-control"
                  placeholder="e.g. I21.4"
                  value={formData.icd10}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Insurance & Billing */}
          <div>
            <h4 style={{ fontSize: '0.78125rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Insurance & Financial Estimates
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Primary Payer / Insurance</label>
                <input
                  type="text"
                  name="payer"
                  className="form-control"
                  value={formData.payer}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Est. Total ($)</label>
                <input
                  type="number"
                  name="totalCharges"
                  className="form-control"
                  value={formData.totalCharges}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Patient Co-Pay ($)</label>
                <input
                  type="number"
                  name="patientCoPay"
                  className="form-control"
                  value={formData.patientCoPay}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Admit Patient & Start Workflow
          </button>
        </div>
      </div>
    </div>
  );
}
