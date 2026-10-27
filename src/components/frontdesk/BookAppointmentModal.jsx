import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Building2, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BookAppointmentModal({ isOpen, onClose, existingAppointment = null, defaultPatient = null }) {
  const { patients, staffList, departments, addAppointment, updateAppointment, addToast } = useApp();

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    phone: '',
    department: 'General Medicine',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    type: 'Consultation',
    status: 'Confirmed',
    notes: ''
  });

  const doctorsList = staffList?.filter(s => s.role === 'doctor' && s.status === 'Active') || [];

  useEffect(() => {
    if (existingAppointment) {
      setFormData({
        patientId: existingAppointment.patientId || '',
        patientName: existingAppointment.patientName || '',
        phone: existingAppointment.phone || '',
        department: existingAppointment.department || 'General Medicine',
        doctor: existingAppointment.doctor || (doctorsList[0]?.name || ''),
        date: existingAppointment.date || new Date().toISOString().split('T')[0],
        time: existingAppointment.time || '10:00 AM',
        type: existingAppointment.type || 'Consultation',
        status: existingAppointment.status || 'Confirmed',
        notes: existingAppointment.notes || ''
      });
    } else if (defaultPatient) {
      setFormData(prev => ({
        ...prev,
        patientId: defaultPatient.id,
        patientName: defaultPatient.name,
        phone: defaultPatient.phone || '',
        department: defaultPatient.department || 'General Medicine',
        doctor: defaultPatient.attendingDoctor || (doctorsList[0]?.name || '')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        doctor: prev.doctor || (doctorsList[0]?.name || 'Dr. Rachel Vance, MD')
      }));
    }
  }, [existingAppointment, defaultPatient, isOpen]);

  if (!isOpen) return null;

  const handlePatientSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setFormData(prev => ({ ...prev, patientId: '', patientName: '', phone: '' }));
      return;
    }
    const found = patients.find(p => p.id === selectedId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        patientId: found.id,
        patientName: found.name,
        phone: found.phone || '',
        department: found.department || prev.department,
        doctor: found.attendingDoctor || prev.doctor
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName.trim()) {
      addToast('Patient name is required.', 'error');
      return;
    }

    if (existingAppointment) {
      updateAppointment(existingAppointment.id, formData);
      addToast(`Appointment updated for ${formData.patientName}`, 'success');
    } else {
      addAppointment(formData);
      addToast(`Appointment scheduled for ${formData.patientName}`, 'success');
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div 
        className="modal-container"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                {existingAppointment ? 'Update Appointment' : 'Schedule Outpatient Appointment'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                Front Desk Outpatient Scheduling
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Quick Select Existing Patient */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Registered Patient (Optional)</label>
              <select 
                className="form-control"
                value={formData.patientId}
                onChange={handlePatientSelect}
                style={{ fontSize: '0.8125rem' }}
              >
                <option value="">-- Choose from registered patients or enter below --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) &bull; {p.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Name and Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Patient Name *</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.patientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="e.g. Eleanor Vance"
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Contact Phone</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 012-4432"
                />
              </div>
            </div>

            {/* Department and Doctor */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Department *</label>
                <select 
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                >
                  {departments?.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  )) || (
                    <>
                      <option value="Cardiology">Cardiology</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Neurology">Neurology</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Physician / Consultant</label>
                <select 
                  className="form-control"
                  value={formData.doctor}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
                >
                  {doctorsList.map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name} ({doc.department})</option>
                  ))}
                  {doctorsList.length === 0 && (
                    <option value="Dr. Rachel Vance, MD">Dr. Rachel Vance, MD</option>
                  )}
                </select>
              </div>
            </div>

            {/* Date, Time, Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Date</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Time</label>
                <select 
                  className="form-control"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Type</label>
                <select 
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Pre-Admission">Pre-Admission</option>
                  <option value="Routine Check">Routine Check</option>
                </select>
              </div>
            </div>

            {/* Status & Notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Status</label>
                <select 
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-in">Checked-in</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Notes</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Fasting required, bring BP log"
                />
              </div>
            </div>

          </div>

          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-secondary)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem'
          }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {existingAppointment ? 'Save Changes' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
