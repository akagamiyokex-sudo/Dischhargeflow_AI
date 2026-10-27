import React, { useState } from 'react';
import { X, UserPlus, Shield, User, Phone, Mail, MapPin, Building2, Bed, Calendar, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RegisterPatientModal({ isOpen, onClose, onRegistered }) {
  const { addPatient, departments, staffList } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyRelationship: 'Spouse',
    emergencyPhone: '',
    department: 'General Medicine',
    attendingDoctor: '',
    admissionType: 'Elective',
    admissionDate: new Date().toISOString().split('T')[0],
    ward: 'General Medicine - Ward 3A',
    bed: 'Bed 01',
    insuranceProvider: 'Blue Cross Blue Shield PPO',
    policyNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [generatedMrn, setGeneratedMrn] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Active doctors list for assignment dropdown
  const doctorsList = staffList?.filter(s => s.role === 'doctor' && s.status === 'Active') || [];

  const handleDobChange = (e) => {
    const dob = e.target.value;
    let computedAge = formData.age;
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age >= 0 && age <= 125) {
        computedAge = age;
      }
    }
    setFormData(prev => ({ ...prev, dob, age: computedAge }));
    if (errors.dob || errors.age) {
      setErrors(prev => ({ ...prev, dob: null, age: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Patient full name is required';
    if (!formData.age || isNaN(formData.age) || Number(formData.age) <= 0) newErrors.age = 'Valid age is required';
    if (!formData.phone.trim()) newErrors.phone = 'Patient phone number is required';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency contact number is required';
    if (!formData.ward.trim()) newErrors.ward = 'Ward is required';
    if (!formData.bed.trim()) newErrors.bed = 'Bed number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const newMrn = `DF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newPatient = await addPatient({
        ...formData,
        id: newMrn,
        age: parseInt(formData.age, 10),
        emergencyContact: {
          name: formData.emergencyContactName.trim(),
          relationship: formData.emergencyRelationship,
          phone: formData.emergencyPhone.trim()
        },
        billing: {
          payer: formData.insuranceProvider || 'Self-Pay / Cash',
          policyNumber: formData.policyNumber || `POL-${Math.floor(100000 + Math.random() * 900000)}`
        }
      });

      setGeneratedMrn(newMrn);
      if (onRegistered) {
        onRegistered(newPatient);
      }
    } catch (err) {
      setErrors({ form: err.message || 'Failed to register patient.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setGeneratedMrn(null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleResetAndClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '680px', width: '92%', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.875rem' }}>
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
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                Register Patient
              </h2>
            </div>
          </div>
          <button 
            onClick={handleResetAndClose}
            className="btn btn-secondary btn-icon"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Confirmation View */}
        {generatedMrn ? (
          <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <UserPlus size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
              Patient registered successfully
            </h3>

            <div style={{
              display: 'inline-block',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.625rem 1.25rem',
              margin: '0.75rem 0 1.5rem 0'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Generated MRN
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-primary)' }}>
                {generatedMrn}
              </span>
            </div>

            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <strong>{formData.name}</strong> has been admitted to <strong>{formData.department}</strong> ({formData.ward}, {formData.bed}).
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setGeneratedMrn(null);
                  setFormData({
                    name: '',
                    dob: '',
                    age: '',
                    gender: 'Male',
                    phone: '',
                    email: '',
                    address: '',
                    emergencyContactName: '',
                    emergencyRelationship: 'Spouse',
                    emergencyPhone: '',
                    department: 'General Medicine',
                    attendingDoctor: '',
                    admissionType: 'Elective',
                    admissionDate: new Date().toISOString().split('T')[0],
                    ward: 'General Medicine - Ward 3A',
                    bed: 'Bed 01',
                    insuranceProvider: 'Blue Cross Blue Shield PPO',
                    policyNumber: ''
                  });
                }}
              >
                + Register Another Patient
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleResetAndClose}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: '1.25rem 0' }}>
            {errors.form && (
              <div style={{ margin: '0 0 1rem 0', padding: '0.625rem 0.75rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.78125rem' }}>
                {errors.form}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* SECTION 1: Patient Information */}
              <div>
                <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  Patient Information
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.name && <span style={{ color: '#dc2626', fontSize: '0.7rem' }}>{errors.name}</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleDobChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Age *</label>
                      <input
                        name="age"
                        type="number"
                        min="0"
                        max="125"
                        required
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        className="form-control"
                      />
                      {errors.age && <span style={{ color: '#dc2626', fontSize: '0.7rem' }}>{errors.age}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gender *</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="form-control">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control"
                      />
                      {errors.phone && <span style={{ color: '#dc2626', fontSize: '0.7rem' }}>{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="patient@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Physical Address</label>
                    <input
                      name="address"
                      type="text"
                      placeholder="Street address, City, State, ZIP"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Emergency Contact */}
              <div>
                <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  Emergency Contact
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.2fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Contact Name *</label>
                    <input
                      name="emergencyContactName"
                      type="text"
                      required
                      placeholder="e.g. Thomas Vance"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.emergencyContactName && <span style={{ color: '#dc2626', fontSize: '0.7rem' }}>{errors.emergencyContactName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Relationship *</label>
                    <select 
                      name="emergencyRelationship" 
                      value={formData.emergencyRelationship} 
                      onChange={handleChange} 
                      className="form-control"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Number *</label>
                    <input
                      name="emergencyPhone"
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.emergencyPhone && <span style={{ color: '#dc2626', fontSize: '0.7rem' }}>{errors.emergencyPhone}</span>}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Hospital Information */}
              <div>
                <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  Hospital Information
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Department *</label>
                      <select 
                        name="department" 
                        value={formData.department} 
                        onChange={handleChange} 
                        className="form-control"
                      >
                        {departments?.map(d => (
                          <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Assigned Doctor</label>
                      <select 
                        name="attendingDoctor" 
                        value={formData.attendingDoctor} 
                        onChange={handleChange} 
                        className="form-control"
                      >
                        <option value="">Select Attending Physician</option>
                        {doctorsList.map(doc => (
                          <option key={doc.id} value={doc.name}>{doc.name} — {doc.department}</option>
                        ))}
                        <option value="Attending Physician On-Duty">Attending Physician On-Duty</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Admission Type</label>
                      <select 
                        name="admissionType" 
                        value={formData.admissionType} 
                        onChange={handleChange} 
                        className="form-control"
                      >
                        <option value="Elective">Elective</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Day Care">Day Care</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Admission Date *</label>
                      <input
                        name="admissionDate"
                        type="date"
                        required
                        value={formData.admissionDate}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ward *</label>
                      <input
                        name="ward"
                        type="text"
                        required
                        placeholder="e.g. Ward 3A"
                        value={formData.ward}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bed *</label>
                      <input
                        name="bed"
                        type="text"
                        required
                        placeholder="e.g. Bed 04"
                        value={formData.bed}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Insurance */}
              <div>
                <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  Insurance
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Insurance Provider</label>
                    <input
                      name="insuranceProvider"
                      type="text"
                      placeholder="e.g. Blue Cross Blue Shield PPO, Aetna, Self-Pay"
                      value={formData.insuranceProvider}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Policy / Member ID Number</label>
                    <input
                      name="policyNumber"
                      type="text"
                      placeholder="e.g. POL-894210"
                      value={formData.policyNumber}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleResetAndClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : '+ Register Patient'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
