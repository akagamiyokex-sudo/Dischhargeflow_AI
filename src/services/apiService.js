/**
 * DischargeFlow AI — Service Layer (API Abstraction)
 * 
 * Future FastAPI Endpoints:
 * - GET  /api/v1/patients                -> getPatients()
 * - GET  /api/v1/patients/{id}           -> getPatientById(id)
 * - PUT  /api/v1/patients/{id}/workflow  -> updateWorkflowTask(...)
 * - POST /api/v1/summary/generate-draft  -> generateAIDraftSummary(...)
 * - PUT  /api/v1/summary/{patientId}     -> saveDischargeSummary(...)
 * - POST /api/v1/summary/{patientId}/sign-> approveDischargeSummary(...)
 * - POST /api/v1/billing/{patientId}/clear -> updateBillingStatus(...)
 * - GET  /api/v1/analytics/turnaround    -> getReportData(...)
 * 
 * For this prototype, all methods operate on local state persisted to localStorage.
 */

import { SAMPLE_PATIENTS, REPORT_BENCHMARKS } from '../data/mockData';

const STORAGE_KEY_PATIENTS = 'dischargeflow_patients_v2';

export const apiService = {
  // Initialize or fetch all patients
  async getPatients() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PATIENTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage read error, falling back to mock data', e);
    }
    // Fallback to initial mock data
    localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(SAMPLE_PATIENTS));
    return SAMPLE_PATIENTS;
  },

  // Get specific patient by ID
  async getPatientById(patientId) {
    const patients = await this.getPatients();
    return patients.find(p => p.id === patientId) || null;
  },

  // Save updated patients list
  _savePatients(patients) {
    try {
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  },

  // Update a task status in the 6-stage workflow
  async updateWorkflowTask(patientId, stageId, taskId, newStatus) {
    const patients = await this.getPatients();
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex === -1) throw new Error('Patient not found');

    const patient = { ...patients[patientIndex] };
    const stage = patient.stages.find(s => s.id === stageId);
    if (!stage) throw new Error('Stage not found');

    const task = stage.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');

    task.status = newStatus;

    // Check if all tasks in stage are completed
    const allCompleted = stage.tasks.every(t => t.status === 'completed');
    if (allCompleted) {
      stage.status = 'completed';
      stage.completedAt = 'Just now';

      // Advance next stage to in-progress if currently pending
      const nextStage = patient.stages.find(s => s.id === stageId + 1);
      if (nextStage && nextStage.status === 'pending') {
        nextStage.status = 'in-progress';
      }
    } else {
      stage.status = 'in-progress';
      stage.completedAt = null;
    }

    // Recalculate patient overall stage & status
    const completedStages = patient.stages.filter(s => s.status === 'completed').length;
    if (completedStages === 6) {
      patient.status = 'Completed';
      patient.statusType = 'neutral';
      patient.stageNumber = 6;
      patient.stageName = 'Completed';
      patient.holdingUpReason = 'Discharge complete. All clinical, administrative, and pharmacy releases finished.';
      patient.holdingUpDepartment = 'Discharge Completed';
    } else {
      // Find current active stage
      const currentActive = patient.stages.find(s => s.status === 'in-progress') || patient.stages.find(s => s.status === 'pending');
      if (currentActive) {
        patient.stageNumber = currentActive.id;
        patient.stageName = currentActive.name;
        
        // Derive clinical status label
        switch (currentActive.id) {
          case 1:
          case 2:
            patient.status = 'Documentation in progress';
            patient.statusType = 'info';
            patient.holdingUpReason = 'Nursing and clinical handover documentation in progress.';
            patient.holdingUpDepartment = currentActive.department;
            break;
          case 3:
            patient.status = patient.summaryApproved ? 'Doctor review completed' : 'Awaiting doctor review';
            patient.statusType = patient.summaryApproved ? 'info' : 'warning';
            patient.holdingUpReason = patient.summaryApproved ? 'Doctor signed. Proceeding to HIM records reconciliation.' : 'Discharge summary draft requires attending physician sign-off.';
            patient.holdingUpDepartment = 'Attending Physician';
            break;
          case 4:
            patient.status = 'Records pending';
            patient.statusType = 'warning';
            patient.holdingUpReason = 'Medical records and coding reconciliation pending.';
            patient.holdingUpDepartment = 'Health Information Management (HIM)';
            break;
          case 5:
            patient.status = patient.billing.isCleared ? 'Billing cleared' : 'Billing pending';
            patient.statusType = patient.billing.isCleared ? 'info' : 'warning';
            patient.holdingUpReason = patient.billing.isCleared ? 'Billing cleared. Awaiting final pharmacy packaging.' : 'Financial clearance and insurer pre-authorization verification required.';
            patient.holdingUpDepartment = 'Patient Accounts & Billing';
            break;
          case 6:
            patient.status = 'Ready for discharge';
            patient.statusType = 'success';
            patient.holdingUpReason = 'All clearances approved. Patient waiting for final medication handover / transport.';
            patient.holdingUpDepartment = 'Ward Nursing & Family Transport';
            break;
          default:
            break;
        }
      }
    }

    patients[patientIndex] = patient;
    this._savePatients(patients);
    return patient;
  },

  // Generates structured draft from EHR data with "Needs confirmation" for missing fields
  async generateAIDraftSummary(patientId) {
    const patient = await this.getPatientById(patientId);
    if (!patient) throw new Error('Patient not found');

    // Emulate structured synthesis from patient record
    const draftContent = {
      admissionReason: patient.reasonForAdmission || 'Needs confirmation: Admission indication missing from intake note.',
      confirmedDiagnosis: `${patient.confirmedDiagnosis} (ICD-10: ${patient.icd10 || 'Needs confirmation: ICD coding pending'})`,
      treatmentSummary: patient.procedures && patient.procedures.length > 0
        ? patient.procedures.join('. ')
        : 'Needs confirmation: Specific procedural notes not found in record.',
      medications: (patient.summaryContent && patient.summaryContent.medications) || [
        { name: 'Discharge Medications', dose: 'As ordered', route: 'Oral', frequency: 'Daily', duration: 'Needs confirmation by attending clinician', purpose: 'Ongoing medical therapy' }
      ],
      dischargeCondition: patient.conditionAtDischarge || 'Needs confirmation: Final bedside vital exam required before release.',
      followUpPlan: (patient.summaryContent && patient.summaryContent.followUpPlan) || `Outpatient follow-up with ${patient.attendingDoctor} in 2–3 weeks. Routine lab work prior to appointment.`,
      warningInstructions: (patient.summaryContent && patient.summaryContent.warningInstructions) || 'Contact hospital emergency services immediately if you develop high fever, sudden breathlessness, severe pain, or bleeding.'
    };

    const updatedPatient = {
      ...patient,
      summaryDraftGenerated: true,
      summaryContent: draftContent
    };

    const patients = await this.getPatients();
    const idx = patients.findIndex(p => p.id === patientId);
    patients[idx] = updatedPatient;
    this._savePatients(patients);

    return updatedPatient;
  },

  // Save edited discharge summary draft
  async saveDischargeSummary(patientId, summaryContent) {
    const patients = await this.getPatients();
    const idx = patients.findIndex(p => p.id === patientId);
    if (idx === -1) throw new Error('Patient not found');

    patients[idx].summaryContent = { ...summaryContent };
    this._savePatients(patients);
    return patients[idx];
  },

  // Doctor approves the clinical discharge summary
  async approveDischargeSummary(patientId, clinicianName) {
    const patients = await this.getPatients();
    const idx = patients.findIndex(p => p.id === patientId);
    if (idx === -1) throw new Error('Patient not found');

    const patient = patients[idx];
    patient.summaryApproved = true;
    patient.summaryApprovedBy = clinicianName;
    patient.summaryApprovedAt = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Mark Stage 3 tasks as completed
    const stage3 = patient.stages.find(s => s.id === 3);
    if (stage3) {
      stage3.status = 'completed';
      stage3.completedAt = 'Just now';
      stage3.tasks.forEach(t => t.status = 'completed');

      // Advance stage 4 to in-progress if pending
      const stage4 = patient.stages.find(s => s.id === 4);
      if (stage4 && stage4.status === 'pending') {
        stage4.status = 'in-progress';
      }
    }

    // Update overall patient status
    patient.stageNumber = 4;
    patient.stageName = 'Medical records checked';
    patient.status = 'Records pending';
    patient.statusType = 'info';
    patient.holdingUpReason = 'Clinical summary approved. Records team verifying diagnostic coding and lab filings.';
    patient.holdingUpDepartment = 'Health Information Management (HIM)';

    patients[idx] = patient;
    this._savePatients(patients);
    return patient;
  },

  // Return summary for correction (with reason note)
  async returnSummaryForCorrection(patientId, correctionNote) {
    const patients = await this.getPatients();
    const idx = patients.findIndex(p => p.id === patientId);
    if (idx === -1) throw new Error('Patient not found');

    const patient = patients[idx];
    patient.summaryApproved = false;
    patient.status = 'Documentation in progress';
    patient.statusType = 'warning';
    patient.holdingUpReason = `Summary returned for correction: ${correctionNote}`;
    patient.holdingUpDepartment = 'Care Coordination';

    const stage3 = patient.stages.find(s => s.id === 3);
    if (stage3) {
      stage3.status = 'in-progress';
    }

    patients[idx] = patient;
    this._savePatients(patients);
    return patient;
  },

  // Billing Clearance Update
  async updateBillingStatus(patientId, newStatus, staffName, notes = '') {
    const patients = await this.getPatients();
    const idx = patients.findIndex(p => p.id === patientId);
    if (idx === -1) throw new Error('Patient not found');

    const patient = patients[idx];
    patient.billing.status = newStatus;
    patient.billing.notes = notes || patient.billing.notes;

    if (newStatus === 'Cleared') {
      patient.billing.isCleared = true;
      patient.billing.clearedAt = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      patient.billing.clearedBy = staffName;

      // Complete stage 5 if all prior stages done
      const stage5 = patient.stages.find(s => s.id === 5);
      if (stage5) {
        stage5.status = 'completed';
        stage5.completedAt = 'Just now';
        stage5.tasks.forEach(t => t.status = 'completed');

        // Advance to Stage 6
        const stage6 = patient.stages.find(s => s.id === 6);
        if (stage6 && stage6.status === 'pending') {
          stage6.status = 'in-progress';
          patient.stageNumber = 6;
          patient.stageName = 'Final discharge approval and release';
          patient.status = 'Ready for discharge';
          patient.statusType = 'success';
          patient.holdingUpReason = 'Billing cleared. Patient ready for final nursing medication handover and pickup.';
          patient.holdingUpDepartment = 'Ward Nursing';
        }
      }
    } else {
      patient.billing.isCleared = false;
    }

    patients[idx] = patient;
    this._savePatients(patients);
    return patient;
  },

  // Analytics & Reports
  async getReportMetrics() {
    return REPORT_BENCHMARKS;
  },

  // Add a new patient record with initialized 6-stage workflow
  async addPatient(data) {
    const patients = await this.getPatients();
    const id = data.id || `DF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTimeStr = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const estTimeStr = 'Today, ' + new Date(Date.now() + 4.5 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPatient = {
      id,
      name: data.name || 'New Inpatient',
      dob: data.dob || '',
      age: parseInt(data.age, 10) || 45,
      gender: data.gender || 'Male',
      phone: data.phone || '+1 (555) 012-7890',
      email: data.email || '',
      address: data.address || '',
      emergencyContact: data.emergencyContact || {
        name: data.emergencyContactName || '',
        relationship: data.emergencyRelationship || '',
        phone: data.emergencyPhone || ''
      },
      ward: data.ward || 'General Medicine - Ward 3A',
      bed: data.bed || 'Bed 01',
      department: data.department || 'General Medicine',
      admissionType: data.admissionType || 'Elective',
      admissionDate: data.admissionDate || new Date().toISOString().split('T')[0],
      dischargeStarted: nowTimeStr,
      dischargeStartedRaw: new Date().toISOString(),
      waitingTimeMinutes: 5,
      attendingDoctor: data.attendingDoctor || 'Attending Physician',
      assignedStaff: data.attendingDoctor || 'Attending Physician',
      stageNumber: 1,
      stageName: 'Discharge initiated',
      status: 'Admitted',
      statusType: 'info',
      holdingUpReason: 'Admitted. Routine inpatient nursing and documentation in progress.',
      holdingUpDepartment: 'Attending Clinician / Bed Management',
      estimatedDischargeTime: estTimeStr,
      targetMet: true,
      registeredBy: data.registeredBy || 'Front Desk',
      dateCreated: new Date().toISOString(),

      // Clinical Details
      reasonForAdmission: data.reasonForAdmission || 'Admitted for active medical management and clinical observation.',
      confirmedDiagnosis: data.confirmedDiagnosis || 'Clinical condition under active evaluation',
      icd10: data.icd10 || 'R69',
      secondaryDiagnoses: data.secondaryDiagnoses || [],
      procedures: data.procedures && data.procedures.length > 0 ? data.procedures : ['Routine inpatient medical care'],
      allergies: data.allergies && data.allergies.length > 0 ? data.allergies : ['No Known Drug Allergies (NKDA)'],
      vitalsAtDischarge: {
        bp: data.bp || '120/80 mmHg',
        hr: data.hr || '72 bpm (Regular)',
        rr: '16 /min',
        spo2: '99% on room air',
        temp: '36.8 °C',
        weight: data.weight || '70 kg'
      },
      conditionAtDischarge: data.conditionAtDischarge || 'Hemodynamically stable. Vitals within acceptable baseline parameters.',
      investigations: data.investigations || 'Routine laboratory and diagnostic workups completed and reconciled.',

      // Discharge Summary State
      summaryDraftGenerated: false,
      summaryApproved: false,
      summaryApprovedBy: null,
      summaryApprovedAt: null,
      summaryContent: null,

      // Billing & Insurance
      billing: {
        status: 'Pending Review',
        isCleared: false,
        clearedAt: null,
        clearedBy: null,
        payer: data.insuranceProvider || data.payer || 'Standard Health Insurance PPO',
        policyNumber: data.policyNumber || `POL-${Math.floor(100000 + Math.random() * 900000)}`,
        preAuthNumber: `PA-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        totalCharges: parseFloat(data.totalCharges) || 3500.00,
        coveredAmount: parseFloat(data.coveredAmount) || 3150.00,
        patientCoPay: parseFloat(data.patientCoPay) || 350.00,
        paymentStatus: 'Co-pay Pending',
        assignedOfficer: 'Billing Counter Staff',
        notes: 'Initial charges pending clinical sign-off and final pharmacy reconciliation.'
      },

      // Portal & Caregiver details
      portal: {
        caregiverName: data.emergencyContactName || data.caregiverName || 'Primary Family Contact',
        caregiverContact: data.emergencyPhone || data.caregiverContact || '+1 (555) 012-3456',
        transportStatus: 'Pending pickup confirmation',
        patientNotificationsSent: 0
      },

      // 6-Stage Workflow Tasks
      stages: [
        {
          id: 1,
          name: 'Discharge initiated',
          department: 'Attending Clinician / Bed Management',
          status: 'in-progress',
          completedAt: null,
          tasks: [
            { id: '1.1', title: 'Attending doctor confirms clinical readiness for discharge', status: 'in-progress', assignedTo: data.attendingDoctor || 'Attending Physician' },
            { id: '1.2', title: 'Bed management and ward charge nurse notified', status: 'pending', assignedTo: 'Ward Charge Nurse' }
          ]
        },
        {
          id: 2,
          name: 'Documentation prepared',
          department: 'Ward Nursing & Care Coordination',
          status: 'pending',
          completedAt: null,
          tasks: [
            { id: '2.1', title: 'Nursing discharge summary & vital sign trend recorded', status: 'pending', assignedTo: 'Ward Nurse' },
            { id: '2.2', title: 'Consultation notes and clinical handover filed', status: 'pending', assignedTo: 'Ward Nursing' },
            { id: '2.3', title: 'Preliminary medication reconciliation compiled', status: 'pending', assignedTo: 'Ward Nurse' }
          ]
        },
        {
          id: 3,
          name: 'Doctor reviews the summary',
          department: 'Attending Physician',
          status: 'pending',
          completedAt: null,
          tasks: [
            { id: '3.1', title: 'Attending doctor reviews structured discharge summary draft', status: 'pending', assignedTo: data.attendingDoctor || 'Attending Physician' },
            { id: '3.2', title: 'Doctor signs and authorizes final clinical release orders', status: 'pending', assignedTo: data.attendingDoctor || 'Attending Physician' }
          ]
        },
        {
          id: 4,
          name: 'Medical records checked',
          department: 'Health Information Management (HIM)',
          status: 'pending',
          completedAt: null,
          tasks: [
            { id: '4.1', title: 'Diagnostic reports, imaging logs & lab results collated', status: 'pending', assignedTo: 'HIM Specialist' },
            { id: '4.2', title: 'Electronic medical record coding & compliance check', status: 'pending', assignedTo: 'Medical Records Officer' }
          ]
        },
        {
          id: 5,
          name: 'Billing clearance',
          department: 'Patient Accounts & Billing',
          status: 'pending',
          completedAt: null,
          tasks: [
            { id: '5.1', title: 'Final take-home pharmacy reconciliation posted to ledger', status: 'pending', assignedTo: 'Billing Counter Staff' },
            { id: '5.2', title: 'Insurance final authorization and financial clearance token generated', status: 'pending', assignedTo: 'Billing Counter Staff' }
          ]
        },
        {
          id: 6,
          name: 'Final discharge approval and release',
          department: 'Ward Nursing & Pharmacy',
          status: 'pending',
          completedAt: null,
          tasks: [
            { id: '6.1', title: 'Take-home medications dispensed and bedside patient counseling completed', status: 'pending', assignedTo: 'Inpatient Pharmacist' },
            { id: '6.2', title: 'Follow-up appointment slips handed to patient, IV cannula removed, discharge bag released', status: 'pending', assignedTo: 'Ward Nurse' }
          ]
        }
      ]
    };

    patients.unshift(newPatient);
    this._savePatients(patients);
    return newPatient;
  },

  // Update administrative and registration details (used by Front Desk and Admin)
  async updatePatientAdministrative(patientId, adminData) {
    const patients = await this.getPatients();
    const idx = patients.findIndex(p => p.id === patientId);
    if (idx === -1) throw new Error('Patient record not found.');

    const patient = { ...patients[idx] };

    // Update administrative/demographic information safely
    if (adminData.name !== undefined) patient.name = adminData.name.trim();
    if (adminData.dob !== undefined) patient.dob = adminData.dob;
    if (adminData.age !== undefined) patient.age = parseInt(adminData.age, 10) || patient.age;
    if (adminData.gender !== undefined) patient.gender = adminData.gender;
    if (adminData.phone !== undefined) patient.phone = adminData.phone.trim();
    if (adminData.email !== undefined) patient.email = adminData.email.trim();
    if (adminData.address !== undefined) patient.address = adminData.address.trim();

    // Emergency Contact
    if (adminData.emergencyContact !== undefined) {
      patient.emergencyContact = {
        ...patient.emergencyContact,
        ...adminData.emergencyContact
      };
    } else if (adminData.emergencyContactName !== undefined || adminData.emergencyRelationship !== undefined || adminData.emergencyPhone !== undefined) {
      patient.emergencyContact = {
        name: adminData.emergencyContactName !== undefined ? adminData.emergencyContactName.trim() : (patient.emergencyContact?.name || ''),
        relationship: adminData.emergencyRelationship !== undefined ? adminData.emergencyRelationship.trim() : (patient.emergencyContact?.relationship || ''),
        phone: adminData.emergencyPhone !== undefined ? adminData.emergencyPhone.trim() : (patient.emergencyContact?.phone || '')
      };
    }

    // Hospital / Admission Information
    if (adminData.department !== undefined) patient.department = adminData.department;
    if (adminData.attendingDoctor !== undefined) patient.attendingDoctor = adminData.attendingDoctor;
    if (adminData.admissionType !== undefined) patient.admissionType = adminData.admissionType;
    if (adminData.admissionDate !== undefined) patient.admissionDate = adminData.admissionDate;
    if (adminData.ward !== undefined) patient.ward = adminData.ward;
    if (adminData.bed !== undefined) patient.bed = adminData.bed;

    // Insurance / Payer information
    if (adminData.insuranceProvider !== undefined || adminData.payer !== undefined) {
      const payerVal = adminData.insuranceProvider || adminData.payer;
      patient.billing = {
        ...patient.billing,
        payer: payerVal ? payerVal.trim() : patient.billing?.payer
      };
    }
    if (adminData.policyNumber !== undefined) {
      patient.billing = {
        ...patient.billing,
        policyNumber: adminData.policyNumber.trim()
      };
    }

    patient.lastUpdated = new Date().toISOString();
    patient.updatedBy = adminData.updatedBy || 'Front Desk';

    patients[idx] = patient;
    this._savePatients(patients);
    return patient;
  },

  // Delete a patient record
  async deletePatient(patientId) {
    const patients = await this.getPatients();
    const updated = patients.filter(p => p.id !== patientId);
    this._savePatients(updated);
    return updated;
  },

  // Clear all patient records (empty slate)
  async clearAllPatients() {
    this._savePatients([]);
    return [];
  },

  // Restore sample demo dataset
  async restoreSampleData() {
    this._savePatients(SAMPLE_PATIENTS);
    return SAMPLE_PATIENTS;
  },

  // Reset demo data to empty
  async resetDemoData() {
    return this.clearAllPatients();
  }
};
