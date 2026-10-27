/**
 * DischargeFlow AI — Role-Specific Mock Operational Data
 * 
 * Fictional demonstration scenarios and live-feeling operational statistics
 * for each of the eight hospital user roles.
 */

// 1. Hospital Admin Data
export const ADMIN_DASHBOARD_DATA = {
  hospitalOverview: {
    totalBeds: 380,
    occupiedBeds: 324,
    occupancyRate: 85.3,
    activeStaffOnDuty: 78,
    dischargesPlannedToday: 32,
    dischargesCompletedToday: 18,
    averageTurnaroundHours: 4.2,
    targetTurnaroundHours: 5.0,
    targetMetPercent: 82.5
  },
  departments: [
    { name: 'Cardiology & Vascular', totalBeds: 45, occupiedBeds: 41, plannedDischarges: 6, avgTAT: '4.1 hrs', bottleneck: 'Doctor Rounds' },
    { name: 'General & GI Surgery', totalBeds: 50, occupiedBeds: 44, plannedDischarges: 8, avgTAT: '4.5 hrs', bottleneck: 'Pharmacy Pack' },
    { name: 'Internal Medicine', totalBeds: 70, occupiedBeds: 62, plannedDischarges: 9, avgTAT: '4.8 hrs', bottleneck: 'Records Coding' },
    { name: 'Orthopedics & Spine', totalBeds: 35, occupiedBeds: 29, plannedDischarges: 4, avgTAT: '3.8 hrs', bottleneck: 'Physio Clearance' },
    { name: 'Intensive Care (ICU/CCU)', totalBeds: 24, occupiedBeds: 21, plannedDischarges: 2, avgTAT: '3.4 hrs', bottleneck: 'Bed Step-Down' },
    { name: 'Neurology & Stroke Unit', totalBeds: 30, occupiedBeds: 26, plannedDischarges: 3, avgTAT: '4.6 hrs', bottleneck: 'Transport' }
  ],
  systemIntegrations: [
    { service: 'Hospital Information System (EHR)', status: 'Connected', latency: '42ms', lastSync: '1 min ago' },
    { service: 'FastAPI Microservice Engine', status: 'Online', latency: '18ms', lastSync: 'Real-time' },
    { service: 'Inpatient Pharmacy Dispensing Gateway', status: 'Connected', latency: '55ms', lastSync: 'Just now' },
    { service: 'Insurance Clearinghouse (EDI 837/835)', status: 'Active', latency: '120ms', lastSync: '3 min ago' },
    { service: 'Clinical Diagnostic Analyzers (LIS)', status: 'Connected', latency: '35ms', lastSync: 'Just now' }
  ],
  recentAuditLogs: [
    { time: '11:42 AM', user: 'Attending Physician', action: 'Approved clinical discharge summary', target: 'Patient DF-2026-8841', ip: '10.240.12.88' },
    { time: '11:28 AM', user: 'Billing Officer', action: 'Issued electronic financial release token', target: 'Patient DF-2026-9023', ip: '10.240.14.12' },
    { time: '11:15 AM', user: 'Ward Nurse', action: 'Completed vital signs observation set', target: 'Ward 4B Bed 12', ip: '10.240.18.45' },
    { time: '10:52 AM', user: 'Inpatient Pharmacist', action: 'Dispensed take-home cardiac medication pack', target: 'Patient DF-2026-8841', ip: '10.240.15.22' },
    { time: '10:30 AM', user: 'Duty Pathologist', action: 'Authorized STAT troponin laboratory result', target: 'Patient DF-2026-7712', ip: '10.240.20.10' }
  ]
};

// 2. Doctor Dashboard Data
export const DOCTOR_DASHBOARD_DATA = {
  stats: {
    assignedInpatients: 8,
    pendingSummaryApprovals: 2,
    consultationsToday: 6,
    criticalLabAlerts: 1
  },
  assignedPatients: [
    { id: 'DF-2026-8841', name: 'Robert Chen', age: 68, ward: 'Cardiology Ward 4B', bed: 'Bed 12', diagnosis: 'Acute NSTEMI (Post-PCI)', status: 'Awaiting Doctor Review', priority: 'High', summaryReady: true },
    { id: 'DF-2026-9023', name: 'Maria Santos', age: 54, ward: 'General Surgery 2A', bed: 'Bed 04', diagnosis: 'Laparoscopic Cholecystectomy', status: 'Doctor Signed', priority: 'Normal', summaryReady: true },
    { id: 'DF-2026-7712', name: 'James Wilson', age: 72, ward: 'Cardiology Ward 4B', bed: 'Bed 08', diagnosis: 'Heart Failure with Preserved EF', status: 'Inpatient Evaluation', priority: 'Normal', summaryReady: false },
    { id: 'DF-2026-9310', name: 'Amina Al-Mansoor', age: 41, ward: 'Internal Medicine 3A', bed: 'Bed 15', diagnosis: 'Acute Pyelonephritis', status: 'Documentation in progress', priority: 'Normal', summaryReady: false },
    { id: 'DF-2026-6549', name: 'Arthur Pendelton', age: 79, ward: 'Cardiology Ward 4B', bed: 'Bed 02', diagnosis: 'Atrial Fibrillation with RVR', status: 'Awaiting Doctor Review', priority: 'High', summaryReady: true }
  ],
  pendingApprovals: [
    {
      patientId: 'DF-2026-8841',
      patientName: 'Robert Chen',
      ward: 'Ward 4B Bed 12',
      diagnosis: 'Acute NSTEMI — Post PCI to LAD',
      submittedBy: 'Ward Charge Nurse',
      submittedAt: 'Today, 09:30 AM',
      waitingTime: '2h 15m',
      hasDraft: true
    },
    {
      patientId: 'DF-2026-6549',
      patientName: 'Arthur Pendelton',
      ward: 'Ward 4B Bed 02',
      diagnosis: 'Atrial Fibrillation with Rapid Ventricular Response',
      submittedBy: 'Ward Staff Nurse',
      submittedAt: 'Today, 10:45 AM',
      waitingTime: '1h 05m',
      hasDraft: true
    }
  ],
  todaySchedule: [
    { time: '09:00 AM – 10:30 AM', title: 'Ward 4B Morning Inpatient Rounds', location: 'Cardiology Ward 4B', type: 'Ward Rounds' },
    { time: '11:30 AM – 12:00 PM', title: 'Clinical Discharge Family Meeting (Robert Chen)', location: 'Consultation Room 3', type: 'Family Handover' },
    { time: '02:00 PM – 04:30 PM', title: 'Outpatient Cardiology Follow-up Clinic', location: 'Clinic 2, Suite B', type: 'Outpatient' }
  ],
  clinicalAlerts: [
    { id: 'alt-1', patient: 'Robert Chen (DF-2026-8841)', alert: 'Post-PCI Troponin I normalized from 4.8 to 0.12 ng/mL. Safe for clinical sign-off.', severity: 'info', time: '20 min ago' },
    { id: 'alt-2', patient: 'Arthur Pendelton (DF-2026-6549)', alert: 'Serum Potassium 3.4 mmol/L (Borderline low). Check discharge supplement order.', severity: 'warning', time: '45 min ago' }
  ]
};

// 3. Nurse / Ward Staff Data
export const NURSE_DASHBOARD_DATA = {
  wardName: 'Cardiology — Ward 4B',
  stats: {
    totalBeds: 20,
    occupiedBeds: 18,
    dischargesPlannedToday: 4,
    highPriorityObservations: 2,
    shiftHandoversPending: 1
  },
  wardPatients: [
    { bed: 'Bed 01', patient: 'Evelyn Taylor', age: 64, diagnosis: 'Hypertensive Emergency', vitals: 'BP 132/84 • HR 76', status: 'Stable', dischargeStatus: 'Inpatient Day 2' },
    { bed: 'Bed 02', patient: 'Arthur Pendelton', age: 79, diagnosis: 'Atrial Fibrillation', vitals: 'BP 118/74 • HR 82', status: 'Review Needed', dischargeStatus: 'Discharge Planned Today' },
    { bed: 'Bed 08', patient: 'James Wilson', age: 72, diagnosis: 'Heart Failure', vitals: 'BP 124/80 • HR 68', status: 'Stable', dischargeStatus: 'Inpatient Day 3' },
    { bed: 'Bed 12', patient: 'Robert Chen', age: 68, diagnosis: 'Acute NSTEMI (Post-PCI)', vitals: 'BP 124/78 • HR 68', status: 'Ready for Release', dischargeStatus: 'Discharge Stage 3' },
    { bed: 'Bed 14', patient: 'Samuel Osei', age: 58, diagnosis: 'Unstable Angina', vitals: 'BP 128/82 • HR 74', status: 'Stable', dischargeStatus: 'Inpatient Day 1' },
    { bed: 'Bed 15', patient: 'Margaret Vance', age: 83, diagnosis: 'Aortic Stenosis Follow-up', vitals: 'BP 136/86 • HR 70', status: 'Stable', dischargeStatus: 'Inpatient Day 4' }
  ],
  shiftTasks: [
    { id: 'task-1', time: '10:00 AM', task: 'Administer morning cardiovascular medications (Beds 01, 02, 08, 12)', completed: true, assignedTo: 'Ward Nurse' },
    { id: 'task-2', time: '11:15 AM', task: 'Bed 12 (Robert Chen): Access site dressing inspection & IV cannula removal', completed: false, assignedTo: 'Ward Nurse' },
    { id: 'task-3', time: '11:45 AM', task: 'Vital signs recheck for Bed 02 (Arthur Pendelton) post-antiarrhythmic', completed: false, assignedTo: 'Ward Nurse' },
    { id: 'task-4', time: '01:00 PM', task: 'Coordinate family handover & transport pickup at Ward 4B reception', completed: false, assignedTo: 'Ward Nurse' }
  ],
  dischargeChecklist: [
    { patient: 'Robert Chen (Bed 12)', cannulaRemoved: false, medsExplained: true, summaryHanded: false, transportConfirmed: true, status: 'Waiting for Doctor Sign-off' },
    { patient: 'Arthur Pendelton (Bed 02)', cannulaRemoved: false, medsExplained: false, summaryHanded: false, transportConfirmed: false, status: 'Documentation in progress' }
  ]
};

// 4. Discharge Operator / Medical Records Data
export const DISCHARGE_DASHBOARD_DATA = {
  stats: {
    activeDischarges: 8,
    casesOnTarget: 6,
    delayedCases: 2,
    readyForHandover: 2
  },
  bottleneckSummary: [
    { department: 'Attending Physician', count: 2, avgWait: '1h 45m', reason: 'Physician on ward rounds or clinic' },
    { department: 'Patient Accounts & Billing', count: 2, avgWait: '55m', reason: 'Insurance implant pre-authorization verification' },
    { department: 'Central Pharmacy', count: 2, avgWait: '40m', reason: 'Specialized take-home cardiac pack assembly' },
    { department: 'Health Information (HIM)', count: 1, avgWait: '30m', reason: 'ICD-10 secondary diagnosis coding audit' },
    { department: 'Ward Nursing & Transport', count: 1, avgWait: '20m', reason: 'Waiting for family private vehicle pickup' }
  ],
  pipelineCases: [
    { id: 'DF-2026-8841', name: 'Robert Chen', ward: 'Cardiology 4B (Bed 12)', stage: 3, stageName: 'Doctor reviews summary', waitingTime: '2h 15m', holdingDept: 'Attending Physician', targetMet: true },
    { id: 'DF-2026-9023', name: 'Maria Santos', ward: 'Surgery 2A (Bed 04)', stage: 5, stageName: 'Billing clearance', waitingTime: '2h 00m', holdingDept: 'Billing Counter', targetMet: true },
    { id: 'DF-2026-7712', name: 'James Wilson', ward: 'Cardiology 4B (Bed 08)', stage: 6, stageName: 'Final release and handover', waitingTime: '1h 15m', holdingDept: 'Ward Nursing', targetMet: true },
    { id: 'DF-2026-6549', name: 'Arthur Pendelton', ward: 'Cardiology 4B (Bed 02)', stage: 4, stageName: 'Medical records checked', waitingTime: '4h 45m', holdingDept: 'HIM Records', targetMet: false },
    { id: 'DF-2026-9310', name: 'Amina Al-Mansoor', ward: 'Internal Med 3A (Bed 15)', stage: 2, stageName: 'Documentation prepared', waitingTime: '1h 30m', holdingDept: 'Ward Nursing', targetMet: true }
  ],
  transportTracker: [
    { patient: 'James Wilson', ward: 'Ward 4B Bed 08', scheduledTime: '11:30 AM', vehicle: 'Family Car', contact: 'Sarah Wilson (+1 555-0182)', status: 'Lounge Ready' },
    { patient: 'Robert Chen', ward: 'Ward 4B Bed 12', scheduledTime: '01:30 PM', vehicle: 'Private Transport', contact: 'David Chen (+1 555-2348)', status: 'Confirmed' },
    { patient: 'Maria Santos', ward: 'Ward 2A Bed 04', scheduledTime: '02:00 PM', vehicle: 'Hospital Wheelchair Van', contact: 'Lucia Santos (+1 555-9012)', status: 'Requested' }
  ]
};

// 5. Billing Counter Data
export const BILLING_DASHBOARD_DATA = {
  stats: {
    pendingClearance: 4,
    clearedToday: 12,
    totalCopayCollected: '$4,850.00',
    outstandingPreAuths: 2
  },
  billingQueue: [
    { id: 'DF-2026-9023', patient: 'Maria Santos', ward: 'Surgery 2A', payer: 'Aetna Select Comprehensive', totalCharges: 8950.00, copay: 200.00, preAuth: 'PA-2026-55012', status: 'Pending Review', urgency: 'High' },
    { id: 'DF-2026-8841', patient: 'Robert Chen', ward: 'Cardiology 4B', payer: 'BlueCross BlueShield PPO', totalCharges: 14250.00, copay: 350.00, preAuth: 'PA-2026-44910', status: 'Pending Pharmacy Audit', urgency: 'Normal' },
    { id: 'DF-2026-9310', patient: 'Amina Al-Mansoor', ward: 'Internal Med 3A', payer: 'Cigna HealthSpring', totalCharges: 4200.00, copay: 150.00, preAuth: 'PA-2026-88129', status: 'Pre-auth Approved', urgency: 'Normal' },
    { id: 'DF-2026-6549', patient: 'Arthur Pendelton', ward: 'Cardiology 4B', payer: 'Medicare Part A & B Supplement', totalCharges: 11800.00, copay: 0.00, preAuth: 'MED-771294', status: 'Pending Review', urgency: 'Delayed' }
  ],
  insuranceAuthorizations: [
    { carrier: 'BlueCross BlueShield', policy: 'BCBS-9081244-A', patient: 'Robert Chen', status: 'Pre-Authorized', notes: 'PCI catheterization & bed charges authorized. Awaiting pharmacy reconciliation.' },
    { carrier: 'Aetna Health', policy: 'AET-449102-B', patient: 'Maria Santos', status: 'Verification Pending', notes: 'Surgical pack code under second tier insurance review.' },
    { carrier: 'Medicare Federal', policy: 'MED-88192-US', patient: 'James Wilson', status: 'Cleared', notes: 'Full inpatient stay covered under DRG 292.' }
  ],
  recentClearances: [
    { time: '11:15 AM', patient: 'James Wilson', mrn: 'DF-2026-7712', amount: '$3,800.00', token: 'FIN-CLEAR-7712', officer: 'Billing Officer' },
    { time: '10:40 AM', patient: 'Harold Miller', mrn: 'DF-2026-5412', amount: '$5,200.00', token: 'FIN-CLEAR-5412', officer: 'Billing Officer' },
    { time: '09:50 AM', patient: 'Claire Dubois', mrn: 'DF-2026-3391', amount: '$2,150.00', token: 'FIN-CLEAR-3391', officer: 'Billing Officer' }
  ]
};

// 6. Pharmacist Data
export const PHARMACY_DASHBOARD_DATA = {
  stats: {
    pendingDischargeRx: 5,
    dispensedToday: 14,
    criticalStockAlerts: 3,
    counselingCompleted: 9
  },
  dischargePrescriptionsQueue: [
    {
      id: 'rx-8841',
      patientId: 'DF-2026-8841',
      patientName: 'Robert Chen',
      ward: 'Ward 4B Bed 12',
      doctor: 'Attending Physician, MD',
      timeReceived: '10:15 AM',
      priority: 'STAT',
      items: [
        { name: 'Ticagrelor (Brilinta)', dose: '90 mg', freq: 'Twice daily', days: '30 days', status: 'Dispensed' },
        { name: 'Aspirin (Enteric Coated)', dose: '81 mg', freq: 'Once daily', days: '30 days', status: 'Dispensed' },
        { name: 'Atorvastatin', dose: '80 mg', freq: 'At bedtime', days: '30 days', status: 'In Packaging' },
        { name: 'Metoprolol Tartrate', dose: '25 mg', freq: 'Twice daily', days: '30 days', status: 'Ready for Labeling' }
      ],
      stage: 'Packaging & Pill Organizer Assembly'
    },
    {
      id: 'rx-9023',
      patientId: 'DF-2026-9023',
      patientName: 'Maria Santos',
      ward: 'Ward 2A Bed 04',
      doctor: 'Attending Surgeon, MD',
      timeReceived: '11:00 AM',
      priority: 'Routine',
      items: [
        { name: 'Amoxicillin/Clavulanate', dose: '875/125 mg', freq: 'Twice daily', days: '7 days', status: 'Checked' },
        { name: 'Paracetamol', dose: '1 g', freq: 'Every 6 hrs PRN', days: '5 days', status: 'Checked' }
      ],
      stage: 'Verification by Pharmacist'
    }
  ],
  stockAlerts: [
    { drug: 'Ticagrelor 90mg Tablets', currentStock: '42 tabs', minThreshold: '100 tabs', status: 'Critical Low', supplier: 'AstraZeneca Healthcare' },
    { drug: 'Enoxaparin Sodium 40mg/0.4mL Pre-filled Syringes', currentStock: '18 units', minThreshold: '50 units', status: 'Low Stock', supplier: 'Sanofi Clir' },
    { drug: 'Cefazolin 1g Injection Vials', currentStock: '30 vials', minThreshold: '40 vials', status: 'Reorder Triggered', supplier: 'Hikma Pharma' }
  ],
  recentCounseling: [
    { time: '11:20 AM', patient: 'James Wilson', caregiver: 'Sarah Wilson', pharmacist: 'Inpatient Pharmacist', topic: 'Furosemide fluid tracking & daily weight logs' },
    { time: '10:10 AM', patient: 'Harold Miller', caregiver: 'Self', pharmacist: 'Inpatient Pharmacist', topic: 'Insulin pen priming and hypoglycemia signs' }
  ]
};

// 7. Laboratory Staff Data
export const LAB_DASHBOARD_DATA = {
  stats: {
    totalTestsToday: 184,
    statDischargeOrders: 4,
    pendingSamplesInIntake: 8,
    awaitingPathologistReview: 3
  },
  statDischargeOrders: [
    {
      orderId: 'LAB-STAT-4491',
      patientId: 'DF-2026-8841',
      patientName: 'Robert Chen',
      ward: 'Cardiology 4B Bed 12',
      tests: ['Cardiac Troponin I (High Sensitivity)', 'Serum Creatinine', 'Electrolytes (Na, K, Cl)'],
      sampleReceivedAt: '09:40 AM',
      targetTurnaround: '45 mins',
      elapsedMinutes: 32,
      status: 'Analyzing on Cobas 8000',
      urgentFlag: true
    },
    {
      orderId: 'LAB-STAT-4498',
      patientId: 'DF-2026-6549',
      patientName: 'Arthur Pendelton',
      ward: 'Cardiology 4B Bed 02',
      tests: ['Serum Potassium (K+ Confirmation)', 'Coagulation Profile (PT/INR)'],
      sampleReceivedAt: '10:50 AM',
      targetTurnaround: '45 mins',
      elapsedMinutes: 20,
      status: 'Centrifugation Complete',
      urgentFlag: true
    },
    {
      orderId: 'LAB-STAT-4502',
      patientId: 'DF-2026-9023',
      patientName: 'Maria Santos',
      ward: 'Surgery 2A Bed 04',
      tests: ['Full Blood Count (WBC & Hb trend)'],
      sampleReceivedAt: '11:15 AM',
      targetTurnaround: '45 mins',
      elapsedMinutes: 10,
      status: 'Specimen Logged',
      urgentFlag: false
    }
  ],
  completedReviews: [
    { time: '11:10 AM', test: 'Troponin I HS', patient: 'Robert Chen', result: '0.12 ng/mL (Normal < 0.14)', flag: 'Normal Trend', verifiedBy: 'Duty Pathologist' },
    { time: '10:25 AM', test: 'Complete Blood Count', patient: 'James Wilson', result: 'Hb 12.8 g/dL, WBC 7.2 x 10^9/L', flag: 'Normal', verifiedBy: 'Lab Scientist' },
    { time: '09:45 AM', test: 'Serum Potassium', patient: 'Arthur Pendelton', result: '3.4 mmol/L (Normal 3.5 - 5.0)', flag: 'Borderline Low', verifiedBy: 'Duty Pathologist' }
  ]
};

// 8. Patient / Caregiver Portal Data
export const PATIENT_DASHBOARD_DATA = {
  patient: {
    name: 'Robert Chen',
    mrn: 'DF-2026-8841',
    ward: 'Cardiology Ward 4B',
    bed: 'Bed 12',
    attendingDoctor: 'Attending Physician, MD',
    caregiver: 'David Chen (Son)',
    estimatedDischargeTime: 'Today, 01:30 PM'
  },
  dischargeMilestones: [
    { step: 1, label: 'Doctor confirms clinical discharge', status: 'completed', time: '08:45 AM' },
    { step: 2, label: 'Nursing discharge documents compiled', status: 'completed', time: '09:30 AM' },
    { step: 3, label: 'Doctor reviews & signs clinical summary', status: 'current', time: 'In Progress' },
    { step: 4, label: 'Hospital records and billing cleared', status: 'pending', time: 'Est. 12:30 PM' },
    { step: 5, label: 'Take-home medications & counseling', status: 'pending', time: 'Est. 01:15 PM' }
  ],
  takeHomeMedications: [
    { name: 'Ticagrelor (Brilinta)', dose: '90 mg', instructions: 'Take 1 tablet twice a day (morning and evening) with a glass of water.', purpose: 'Prevents blood clots around your heart stent' },
    { name: 'Aspirin', dose: '81 mg', instructions: 'Take 1 tablet every morning with breakfast.', purpose: 'Protects blood vessels' },
    { name: 'Atorvastatin', dose: '80 mg', instructions: 'Take 1 tablet once a day at bedtime.', purpose: 'Controls cholesterol and stabilizes heart arteries' },
    { name: 'Metoprolol Tartrate', dose: '25 mg', instructions: 'Take 1 tablet twice a day with meals.', purpose: 'Keeps heart rate regular and controls blood pressure' }
  ],
  followUpAppointment: {
    doctor: 'Attending Physician, MD (Cardiology Specialist)',
    date: 'Wednesday, October 29, 2026',
    time: '10:30 AM',
    location: 'Hospital Outpatient Heart Center — Suite 3B',
    instructions: 'Please bring your blood pressure log and medication organizer. Fasting blood test to be completed 3 days prior.'
  },
  emergencySigns: [
    'Sudden chest pain, tightness, or pressure radiating to arm or jaw',
    'Severe shortness of breath when resting or lying flat',
    'Active bleeding, large bruising, or swelling around catheter insertion site in the groin',
    'Unexplained dizziness, lightheadedness, or fainting'
  ]
};

// 9. Front Desk Dashboard Data & Initial Appointments
export const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-01',
    patientName: 'Robert Chen',
    patientId: 'DF-2026-8841',
    phone: '+1 (555) 012-8841',
    department: 'Cardiology',
    doctor: 'Dr. Rachel Vance, MD',
    date: 'Today',
    time: '10:00 AM',
    type: 'Follow-up',
    status: 'Checked-in',
    notes: 'Post-PCI follow-up and telemetry review'
  },
  {
    id: 'apt-02',
    patientName: 'Arthur Pendelton',
    patientId: 'DF-2026-6549',
    phone: '+1 (555) 012-6549',
    department: 'Cardiology',
    doctor: 'Dr. Rachel Vance, MD',
    date: 'Today',
    time: '11:30 AM',
    type: 'Consultation',
    status: 'Confirmed',
    notes: 'Holter monitor reconciliation'
  },
  {
    id: 'apt-03',
    patientName: 'Maria Santos',
    patientId: 'DF-2026-9023',
    phone: '+1 (555) 012-9023',
    department: 'General Surgery',
    doctor: 'Dr. Stephen Clark',
    date: 'Today',
    time: '02:00 PM',
    type: 'Pre-Admission',
    status: 'Pending',
    notes: 'Laparoscopic post-op surgical wound check'
  },
  {
    id: 'apt-04',
    patientName: 'James Wilson',
    patientId: 'DF-2026-7712',
    phone: '+1 (555) 012-7712',
    department: 'Cardiology',
    doctor: 'Dr. Rachel Vance, MD',
    date: 'Tomorrow',
    time: '09:00 AM',
    type: 'Follow-up',
    status: 'Confirmed',
    notes: 'Heart failure echocardiography check'
  },
  {
    id: 'apt-05',
    patientName: 'Elena Gomez',
    patientId: 'DF-2026-5512',
    phone: '+1 (555) 012-5512',
    department: 'Orthopaedics',
    doctor: 'Dr. David Kim',
    date: 'Tomorrow',
    time: '11:00 AM',
    type: 'Consultation',
    status: 'Confirmed',
    notes: 'Total hip arthroplasty progress evaluation'
  }
];

export const FRONT_DESK_DASHBOARD_DATA = {
  stats: {
    newPatientsToday: 6,
    admissionsToday: 8,
    appointmentsToday: 14,
    pendingRegistration: 2
  }
};

