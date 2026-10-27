import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert, User, Phone, Mail, MapPin, Building2, Bed, Calendar, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function EditPatientAdministrativeModal({ patient, isOpen, onClose, onUpdated }) {
  const { updatePatientAdministrative, departments, staffList } = useApp();

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
    department: '',
    attendingDoctor: '',
    admissionType: 'Elective',
    admissionDate: '',
    ward: '',
    bed: '',
    insuranceProvider: '',
    policyNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        dob: patient.dob || '',
        age: patient.age || '',
        gender: patient.gender || 'Male',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        emergencyContactName: patient.emergencyContact?.name || patient.portal?.caregiverName || '',
        emergencyRelationship: patient.emergencyContact?.relationship || 'Spouse',
        emergencyPhone: patient.emergencyContact?.phone || patient.portal?.caregiverContact || '',
        department: patient.department || 'General Medicine',
        attendingDoctor: patient.attendingDoctor || '',
        admissionType: patient.admissionType || 'Elective',
        admissionDate: patient.admissionDate || '',
        ward: patient.ward || '',
        bed: patient.bed || '',
        insuranceProvider: patient.billing?.payer || '',
        policyNumber: patient.billing?.policyNumber || ''
      });
      setErrors({});
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const doctorsList = staffList?.filter(s => s.role === 'doctor' && s.status === 'Active') || [];

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
    if (!formData.name.trim()) newErrors.name = 'Patient name is required';
    if (!formData.age || isNaN(formData.age) || Number(formData.age) <= 0) newErrors.age = 'Valid age is required';
    if (!formData.phone.trim()) newErrors.phone = 'Patient phone number is required';
    if (!formData.ward.trim()) newErrors.ward = 'Ward is required';
    if (!formData.bed.trim()) newErrors.bed = 'Bed is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await updatePatientAdministrative(patient.id, {
        name: formData.name.trim(),
        dob: formData.dob,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        emergencyContact: {
          name: formData.emergencyContactName.trim(),
          relationship: formData.emergencyRelationship,
          phone: formData.emergencyPhone.trim()
        },
        department: formData.department,
        attendingDoctor: formData.attendingDoctor,
        admissionType: formData.admissionType,
        admissionDate: formData.admissionDate,
        ward: formData.ward.trim(),
        bed: formData.bed.trim(),
        insuranceProvider: formData.insuranceProvider.trim(),
        policyNumber: formData.policyNumber.trim()
      });

      if (onUpdated) {
        onUpdated(updated);
      }
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to update patient.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '680px', width: '92%', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.875rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-info" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                {patient.id}
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                Administrative Registration
              </span>
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              Edit Patient Details — {patient.name}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
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
                      onChange={handleChange}
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
                  <label className="form-label">Contact Name</label>
                  <input
                    name="emergencyContactName"
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship</label>
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
                  <label className="form-label">Contact Number</label>
                  <input
                    name="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Hospital & Bed Information */}
            <div>
              <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-subtle)' }}>
                Hospital &amp; Admission Information
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
                      value={formData.ward}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.ward && <span style={{ color: '#dc2626', fontSize: '0.7rem' }}>{errors.ward}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bed *</label>
                    <input
                      name="bed"
                      type="text"
                      required
                      value={formData.bed}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.bed && <span style={{ color: '#dc2626', fontSize: '0.7rem' }}>{errors.bed}</span>}
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
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Policy Number</label>
                  <input
                    name="policyNumber"
                    type="text"
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
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Save size={15} />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
