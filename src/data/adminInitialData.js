/**
 * DischargeFlow AI — Phase 2 Admin Initial & Demo Data
 * 
 * Provides mock baseline data for:
 * 1. Hospital Departments (with codes, bed counts, ward locations, heads)
 * 2. Staff Directory (excluding patients/caregivers, includes statuses, phone, date created)
 * 3. Audit Logs (HIPAA/EHR compliance trail demo events)
 * 4. Hospital Profile & System Settings
 * 5. Ward Occupancy and Capacity metrics
 */

import { ROLES } from '../config/rolesConfig';

export const INITIAL_DEPARTMENTS = [
  {
    id: 'dept-card',
    name: 'Cardiology',
    code: 'CARD',
    head: 'Unassigned',
    location: 'Building A, Ward 4B & CCU',
    totalBeds: 36,
    description: 'Coronary care unit, invasive electrophysiology, structural heart intervention, and acute telemetry.',
    status: 'Active',
    dateCreated: '2025-01-10'
  },
  {
    id: 'dept-surg',
    name: 'General Surgery',
    code: 'SURG',
    head: 'Unassigned',
    location: 'Building B, Ward 2A & Surgical Suites',
    totalBeds: 42,
    description: 'Elective gastrointestinal, oncologic, laparoscopy, and emergency abdominal surgery inpatient unit.',
    status: 'Active',
    dateCreated: '2025-01-10'
  },
  {
    id: 'dept-gmed',
    name: 'General Medicine',
    code: 'GMED',
    head: 'Unassigned',
    location: 'Building A, Ward 3B & 3C',
    totalBeds: 48,
    description: 'Acute internal medicine, geriatric step-down, chronic disease exacerbation, and multi-morbidity care.',
    status: 'Active',
    dateCreated: '2025-01-10'
  },
  {
    id: 'dept-orth',
    name: 'Orthopaedics',
    code: 'ORTH',
    head: 'Unassigned',
    location: 'Building C, Ward 5A',
    totalBeds: 30,
    description: 'Total joint arthroplasty, acute polytrauma stabilization, spinal surgery, and mobility rehab.',
    status: 'Active',
    dateCreated: '2025-02-01'
  },
  {
    id: 'dept-paed',
    name: 'Paediatrics',
    code: 'PAED',
    head: 'Unassigned',
    location: 'Children Wing, Ward 1C & PICU',
    totalBeds: 24,
    description: 'Neonatal intermediate care, pediatric medicine, surgical convalescence, and family-centered rooms.',
    status: 'Active',
    dateCreated: '2025-02-15'
  },
  {
    id: 'dept-neur',
    name: 'Neurology',
    code: 'NEUR',
    head: 'Unassigned',
    location: 'Building A, Ward 4A',
    totalBeds: 28,
    description: 'Hyperacute stroke unit, post-thrombectomy monitoring, status epilepticus, and neuro-rehabilitation.',
    status: 'Active',
    dateCreated: '2025-03-01'
  },
  {
    id: 'dept-emer',
    name: 'Emergency',
    code: 'EMER',
    head: 'Unassigned',
    location: 'Ground Floor, Acute Trauma Bay & CDU',
    totalBeds: 35,
    description: 'Level-1 triage, acute resuscitation bays, rapid diagnostics, and clinical decision observation unit.',
    status: 'Active',
    dateCreated: '2025-01-05'
  }
];

export const INITIAL_STAFF = [
  {
    id: 'usr-adm-01',
    staffId: 'EMP-ADM-101',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@hospital.com',
    role: ROLES.HOSPITAL_ADMIN,
    department: 'Hospital Administration & Operations',
    designation: 'Operations Director',
    phone: '+1 (555) 012-3401',
    mobile: '+1 (555) 012-3401',
    status: 'Active',
    dateCreated: '2025-01-10',
    avatar: 'SJ',
    assignedWard: 'Executive Operations Suite'
  },
  {
    id: 'usr-doc-01',
    staffId: 'EMP-DOC-401',
    name: 'Dr. Rachel Vance, MD',
    email: 'doctor@hospital.com',
    role: ROLES.DOCTOR,
    department: 'Cardiology',
    designation: 'Senior Consultant Cardiologist',
    phone: '+1 (555) 012-4011',
    mobile: '+1 (555) 012-4011',
    status: 'Active',
    dateCreated: '2025-02-01',
    avatar: 'RV',
    assignedWard: 'Cardiology Ward 4B & ICU'
  },
  {
    id: 'usr-nur-01',
    staffId: 'EMP-NUR-201',
    name: 'Marcus Tan, RN',
    email: 'nurse@hospital.com',
    role: ROLES.NURSE,
    department: 'Cardiology',
    designation: 'Charge Nurse & Ward Coordinator',
    phone: '+1 (555) 012-2011',
    mobile: '+1 (555) 012-2011',
    status: 'Active',
    dateCreated: '2025-01-15',
    avatar: 'MT',
    assignedWard: 'Cardiology Ward 4B'
  },
  {
    id: 'usr-fd-01',
    staffId: 'EMP-REC-101',
    name: 'Priya Kumar',
    email: 'frontdesk@hospital.com',
    role: ROLES.FRONT_DESK,
    department: 'Reception & Admissions',
    designation: 'Front Desk Officer',
    phone: '+1 (555) 012-1050',
    mobile: '+1 (555) 012-1050',
    status: 'Active',
    dateCreated: '2025-01-12',
    avatar: 'PK',
    assignedWard: 'Central Reception Desk'
  }
];

/**
 * INITIAL_AUDIT_LOGS is intentionally empty.
 * Audit entries are generated automatically by real user actions
 * within the DischargeFlow AI system.
 */
export const INITIAL_AUDIT_LOGS = [];

export const INITIAL_HOSPITAL_SETTINGS = {
  // Hospital Profile
  hospitalName: 'Metropolitan General Hospital',
  hospitalCode: 'MGH-METRO-01',
  contactEmail: 'administration@metropolitan-health.internal',
  contactPhone: '+1 (555) 019-2830',
  address: '742 Healthcare Parkway, Medical District, Suite 100, Metro City',
  licenseNumber: 'HOSP-LIC-2026-9941-A',

  // Discharge Workflow Configuration
  targetTurnaroundHours: 5,
  delayWarningThresholdHours: 4,
  requiredStages: [
    { id: 1, name: 'Doctor marks patient ready for discharge', department: 'Clinical / Ward' },
    { id: 2, name: 'Discharge summary draft generated', department: 'Medical Records' },
    { id: 3, name: 'Doctor reviews and signs summary', department: 'Attending Physician' },
    { id: 4, name: 'Discharge medications prepared', department: 'Inpatient Pharmacy' },
    { id: 5, name: 'Billing and insurance clearance', department: 'Billing Counter' },
    { id: 6, name: 'Final departure and handover', department: 'Ward Nursing & Transport' }
  ],

  // User and Access Policy
  sessionTimeoutMinutes: 60,
  enforceMFA: true,
  allowLocumDelegation: true,

  // Notifications
  emailAlerts: true,
  delayEscalations: true,
  criticalLabSms: false,

  // Demo Environment
  isDemoEnvironment: false,
  environmentLabel: 'Production'
};

export const WARD_CAPACITY_DATA = [
  { ward: 'Ward 4B (Cardiology)', dept: 'Cardiology', totalBeds: 36, occupied: 31, available: 5, plannedOut: 4, nurseRatio: '1:4' },
  { ward: 'Ward 2A (General Surgery)', dept: 'General Surgery', totalBeds: 42, occupied: 37, available: 5, plannedOut: 6, nurseRatio: '1:5' },
  { ward: 'Ward 3B (Acute Medicine)', dept: 'General Medicine', totalBeds: 48, occupied: 43, available: 5, plannedOut: 5, nurseRatio: '1:5' },
  { ward: 'Ward 5A (Orthopaedics)', dept: 'Orthopaedics', totalBeds: 30, occupied: 24, available: 6, plannedOut: 3, nurseRatio: '1:4' },
  { ward: 'Ward 1C (Paediatrics)', dept: 'Paediatrics', totalBeds: 24, occupied: 18, available: 6, plannedOut: 2, nurseRatio: '1:3' },
  { ward: 'Ward 4A (Neurology / Stroke)', dept: 'Neurology', totalBeds: 28, occupied: 25, available: 3, plannedOut: 2, nurseRatio: '1:4' },
  { ward: 'Acute CDU (Emergency)', dept: 'Emergency', totalBeds: 35, occupied: 30, available: 5, plannedOut: 7, nurseRatio: '1:3' }
];
