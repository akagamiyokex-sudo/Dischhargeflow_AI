/**
 * DischargeFlow AI — Central Role & Navigation Configuration
 * 
 * Defines the 8 distinct hospital roles, their permitted routes,
 * sidebar navigation items, and default landing views.
 * 
 * IMPORTANT: This frontend role configuration manages navigation and UI visibility.
 * In production, FastAPI route dependencies and Cloud Firestore security rules
 * enforce authoritative role-based access control (RBAC).
 */

export const ROLES = {
  HOSPITAL_ADMIN: 'hospital_admin',
  FRONT_DESK: 'front_desk',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  DISCHARGE_OPERATOR: 'discharge_operator',
  BILLING_COUNTER: 'billing_counter',
  PHARMACIST: 'pharmacist',
  LAB_STAFF: 'lab_staff',
  PATIENT: 'patient'
};

export const ROLE_CONFIGS = {
  [ROLES.HOSPITAL_ADMIN]: {
    id: ROLES.HOSPITAL_ADMIN,
    label: 'Hospital Admin',
    shortTitle: 'Admin',
    department: 'Hospital Administration',
    defaultRoute: 'admin-overview',
    badge: 'Hospital Admin',
    badgeColor: '#0f172a',
    description: 'System administration, hospital-wide operations, audit oversight, and user management.',
    navItems: [
      { id: 'admin-overview', label: 'Dashboard', icon: 'LayoutDashboard', description: 'Overall hospital activity & discharge performance' },
      { id: 'admin-users', label: 'Staff', icon: 'Users', description: 'Hospital personnel accounts & credentials' },
      { id: 'admin-departments', label: 'Departments', icon: 'Building2', description: 'Wards, clinics, and unit configurations' },
      { id: 'admin-operations', label: 'Operations', icon: 'Activity', description: 'Bed capacity, throughput, and bed allocation' },
      { id: 'admin-discharges', label: 'Discharges', icon: 'Clock', description: 'Hospital-wide discharge pipeline and 5-hour target monitor' },
      { id: 'admin-reports', label: 'Reports', icon: 'BarChart3', description: 'Discharge turnaround & length-of-stay analytics' },
      { id: 'admin-audit-logs', label: 'Audit Logs', icon: 'ShieldCheck', description: 'HIPAA/EHR compliance & access trail' },
      { id: 'admin-settings', label: 'Settings', icon: 'Settings', description: 'System configurations & integration settings' }
    ]
  },

  [ROLES.FRONT_DESK]: {
    id: ROLES.FRONT_DESK,
    label: 'Front Desk',
    shortTitle: 'Front Desk',
    department: 'Reception & Admissions',
    defaultRoute: 'front-desk-dashboard',
    badge: 'Front Desk',
    badgeColor: '#0d9488',
    description: 'Patient registration, admission intake, appointment scheduling, and front desk operations.',
    navItems: [
      { id: 'front-desk-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', description: 'Front desk metrics and recent registrations' },
      { id: 'front-desk-patients', label: 'Patients', icon: 'Users', description: 'Hospital patient directory & administrative management' },
      { id: 'front-desk-appointments', label: 'Appointments', icon: 'Calendar', description: 'Schedule and manage patient appointments' },
      { id: 'front-desk-admissions', label: 'Admissions', icon: 'Building2', description: 'Inpatient admission intake and bed allocation' },
      { id: 'front-desk-profile', label: 'Profile', icon: 'User', description: 'Front desk officer profile and desk settings' }
    ]
  },

  [ROLES.DOCTOR]: {
    id: ROLES.DOCTOR,
    label: 'Doctor / Consultant',
    shortTitle: 'Physician',
    department: 'Clinical Medicine & Surgery',
    defaultRoute: 'doctor-dashboard',
    badge: 'Attending Physician',
    badgeColor: '#0d9488',
    description: 'Inpatient clinical oversight, discharge summary authorizations, and electronic orders.',
    navItems: [
      { id: 'doctor-dashboard', label: 'My Dashboard', icon: 'Stethoscope', description: 'Assigned patients, consultations, and review queue' },
      { id: 'doctor-patients', label: 'My Patients', icon: 'Users', description: 'Inpatients under your primary clinical care' },
      { id: 'doctor-records', label: 'Patient Clinical Records', icon: 'FolderClock', description: 'Comprehensive diagnostic and procedural history' },
      { id: 'doctor-notes', label: 'Clinical Notes', icon: 'FileText', description: 'Daily progress notes and clinical handovers' },
      { id: 'doctor-prescriptions', label: 'Prescriptions', icon: 'Pill', description: 'Inpatient medications and take-home Rx orders' },
      { id: 'doctor-summary', label: 'AI Discharge Summary', icon: 'Sparkles', description: 'AI-assisted draft review and digital sign-off' },
      { id: 'doctor-approvals', label: 'Pending Approvals', icon: 'CheckCircle2', description: 'Discharge authorizations awaiting clinical signature' },
      { id: 'doctor-appointments', label: 'Appointments', icon: 'Calendar', description: 'Follow-up consultations and outpatient schedule' }
    ]
  },

  [ROLES.NURSE]: {
    id: ROLES.NURSE,
    label: 'Nurse / Ward Staff',
    shortTitle: 'Ward Nursing',
    department: 'Inpatient Nursing & Patient Care',
    defaultRoute: 'nurse-dashboard',
    badge: 'Ward Staff',
    badgeColor: '#2563eb',
    description: 'Ward bedside care, vitals monitoring, care task execution, and discharge readiness coordination.',
    navItems: [
      { id: 'nurse-dashboard', label: 'Ward Dashboard', icon: 'HeartPulse', description: 'Ward occupancy, shift summary, and priority alerts' },
      { id: 'nurse-patients', label: 'Ward Patients', icon: 'Users', description: 'Bed-by-bed inpatient roster and vital signs' },
      { id: 'nurse-observations', label: 'Patient Observations', icon: 'Activity', description: 'Vital signs, telemetry, and clinical trends' },
      { id: 'nurse-notes', label: 'Nursing Notes', icon: 'FileEdit', description: 'Shift handovers, patient responses, and nursing plans' },
      { id: 'nurse-tasks', label: 'Care Tasks', icon: 'CheckSquare', description: 'Medication administration and routine care checklist' },
      { id: 'nurse-readiness', label: 'Discharge Readiness', icon: 'CheckCircle2', description: 'Cannula removal, packaging, and handover checklists' }
    ]
  },

  [ROLES.DISCHARGE_OPERATOR]: {
    id: ROLES.DISCHARGE_OPERATOR,
    label: 'Discharge Operator / Medical Records',
    shortTitle: 'Discharge Desk',
    department: 'Care Continuity & Health Information Management',
    defaultRoute: 'discharge-overview',
    badge: 'Discharge Coordinator',
    badgeColor: '#d97706',
    description: 'Multi-department discharge coordination, 6-stage workflow orchestration, and records reconciliation.',
    navItems: [
      { id: 'discharge-overview', label: 'Discharge Overview', icon: 'GitFork', description: 'Active hospital-wide discharge pipeline monitor' },
      { id: 'discharge-register', label: 'Register Patient', icon: 'UserPlus', description: 'Admit inpatient and initialize discharge tracking' },
      { id: 'discharge-admissions', label: 'Admissions', icon: 'Building2', description: 'Bed allocation and intake logging' },
      { id: 'discharge-queue', label: 'Discharge Queue', icon: 'Clock', description: 'Prioritized cases grouped by planned departure time' },
      { id: 'discharge-records', label: 'Medical Records', icon: 'FolderArchive', description: 'HIM chart completion and diagnostic coding (ICD-10)' },
      { id: 'discharge-checklist', label: 'Document Checklist', icon: 'CheckSquare', description: 'Cross-department sign-offs and regulatory release forms' },
      { id: 'discharge-workflow', label: 'Discharge Workflow', icon: 'GitPullRequest', description: 'Interactive 6-stage clinical discharge tracker' }
    ]
  },

  [ROLES.BILLING_COUNTER]: {
    id: ROLES.BILLING_COUNTER,
    label: 'Billing Counter Staff',
    shortTitle: 'Patient Accounts',
    department: 'Patient Accounts, Finance & Insurance',
    defaultRoute: 'billing-overview',
    badge: 'Billing Specialist',
    badgeColor: '#059669',
    description: 'Financial ledger verification, insurance pre-authorizations, co-pay settlement, and discharge release tokens.',
    navItems: [
      { id: 'billing-overview', label: 'Billing Overview', icon: 'Receipt', description: 'Discharge financial clearance queue and metrics' },
      { id: 'billing-bills', label: 'Patient Bills', icon: 'FileSpreadsheet', description: 'Itemized inpatient bed and procedure charges' },
      { id: 'billing-invoice', label: 'Create Invoice', icon: 'FilePlus', description: 'Generate final itemized statement' },
      { id: 'billing-payments', label: 'Payments', icon: 'CreditCard', description: 'Record co-pay, cash, and electronic transactions' },
      { id: 'billing-outstanding', label: 'Outstanding Balances', icon: 'AlertCircle', description: 'Unsettled claims and insurer pending approvals' },
      { id: 'billing-clearance', label: 'Billing Clearance', icon: 'ShieldCheck', description: 'Authorize electronic financial discharge release token' }
    ]
  },

  [ROLES.PHARMACIST]: {
    id: ROLES.PHARMACIST,
    label: 'Pharmacist',
    shortTitle: 'Pharmacy',
    department: 'Inpatient Pharmacy & Dispensary',
    defaultRoute: 'pharmacy-overview',
    badge: 'Clinical Pharmacist',
    badgeColor: '#7c3aed',
    description: 'Discharge medication reconciliation, take-home drug dispensing, and bedside patient counseling.',
    navItems: [
      { id: 'pharmacy-overview', label: 'Pharmacy Overview', icon: 'Pill', description: 'Discharge dispensing queue and stock alerts' },
      { id: 'pharmacy-prescriptions', label: 'Prescriptions', icon: 'FileText', description: 'Physician take-home drug orders for discharge' },
      { id: 'pharmacy-dispensing', label: 'Dispensing', icon: 'PackageCheck', description: 'Packaging, labeling, and delivery verification' },
      { id: 'pharmacy-inventory', label: 'Medicine Inventory', icon: 'Boxes', description: 'Hospital pharmacy stock levels and critical thresholds' },
      { id: 'pharmacy-stock', label: 'Stock Movements', icon: 'ArrowLeftRight', description: 'Ward replenishment and controlled drug register' }
    ]
  },

  [ROLES.LAB_STAFF]: {
    id: ROLES.LAB_STAFF,
    label: 'Laboratory Staff',
    shortTitle: 'Laboratory',
    department: 'Central Clinical Pathology & Diagnostics',
    defaultRoute: 'lab-overview',
    badge: 'Medical Lab Scientist',
    badgeColor: '#0284c7',
    description: 'Diagnostic specimen testing, STAT discharge bloodwork processing, and pathologist verification.',
    navItems: [
      { id: 'lab-overview', label: 'Laboratory Overview', icon: 'FlaskConical', description: 'Pending specimen queue and TAT benchmarks' },
      { id: 'lab-requests', label: 'Test Requests', icon: 'ClipboardList', description: 'Inpatient and discharge STAT diagnostic orders' },
      { id: 'lab-samples', label: 'Pending Samples', icon: 'TestTube2', description: 'Specimen barcoding, accessioning, and intake' },
      { id: 'lab-results', label: 'Enter Results', icon: 'FileEdit', description: 'Input analyzer findings and flag critical values' },
      { id: 'lab-completed', label: 'Completed Tests', icon: 'CheckCircle2', description: 'Authorized diagnostic reports filed to patient charts' }
    ]
  },

  [ROLES.PATIENT]: {
    id: ROLES.PATIENT,
    label: 'Patient / Caregiver',
    shortTitle: 'Patient Portal',
    department: 'Patient & Family Experience',
    defaultRoute: 'patient-home',
    badge: 'Patient Portal',
    badgeColor: '#0891b2',
    description: 'Transparent discharge steps, take-home medication routines, appointment schedule, and care instructions.',
    navItems: [
      { id: 'patient-home', label: 'My Home', icon: 'HeartHandshake', description: 'Discharge status, pickup schedule, and summary' },
      { id: 'patient-appointments', label: 'My Appointments', icon: 'Calendar', description: 'Post-discharge follow-ups with clinical team' },
      { id: 'patient-test-results', label: 'My Test Results', icon: 'Activity', description: 'Approved laboratory and diagnostic reports' },
      { id: 'patient-prescriptions', label: 'My Prescriptions', icon: 'Pill', description: 'Daily medication times, dosages, and instructions' },
      { id: 'patient-documents', label: 'My Discharge Documents', icon: 'FileText', description: 'Download approved clinical summary & instructions (PDF)' },
      { id: 'patient-followup', label: 'My Follow-up Plan', icon: 'CalendarCheck', description: 'Dietary guidance, activity limits, and wound care' },
      { id: 'patient-notifications', label: 'Notifications', icon: 'Bell', description: 'Care updates, readiness alerts, and pharmacist messages' }
    ]
  }
};

/**
 * Validates whether a given page route is permitted for a specific role.
 */
export function isRouteAllowedForRole(roleId, routeId) {
  if (!roleId || !routeId) return false;

  const roleConfig = ROLE_CONFIGS[roleId];
  if (!roleConfig) return false;

  // Check if route matches any nav item for the role
  return roleConfig.navItems.some(item => item.id === routeId);
}

/**
 * Returns the default landing route for a specific role.
 */
export function getDefaultRouteForRole(roleId) {
  const roleConfig = ROLE_CONFIGS[roleId];
  return roleConfig ? roleConfig.defaultRoute : 'login';
}

/**
 * Returns role metadata.
 */
export function getRoleConfig(roleId) {
  return ROLE_CONFIGS[roleId] || ROLE_CONFIGS[ROLES.DOCTOR];
}
