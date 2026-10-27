// Role configuration display data (used for Settings and role reference views)
export const DEMO_ROLES = [
  {
    id: 'hospital_admin',
    name: 'Hospital Administrator',
    title: 'Hospital Operations Director',
    department: 'Hospital Administration & Operations',
    avatar: 'HA',
    badge: 'Administrator',
    permissions: ['view_all', 'manage_staff', 'reports_full', 'system_config', 'audit_access']
  },
  {
    id: 'doctor',
    name: 'Doctor / Consultant',
    title: 'Attending Physician & Consultant',
    department: 'Clinical Medicine',
    avatar: 'DR',
    badge: 'Clinical Lead',
    permissions: ['view_all', 'edit_summary', 'approve_summary', 'clinical_orders', 'prescriptions']
  },
  {
    id: 'nurse',
    name: 'Nurse / Ward Staff',
    title: 'Charge Nurse & Ward Coordinator',
    department: 'Inpatient Nursing',
    avatar: 'RN',
    badge: 'Ward Nursing',
    permissions: ['view_ward', 'record_vitals', 'execute_tasks', 'discharge_readiness']
  },
  {
    id: 'discharge_operator',
    name: 'Discharge Coordinator',
    title: 'Discharge & Medical Records Operator',
    department: 'Care Continuity & Bed Management',
    avatar: 'DO',
    badge: 'Discharge Desk',
    permissions: ['view_all', 'update_workflow', 'initiate_discharge', 'audit_records']
  },
  {
    id: 'billing_counter',
    name: 'Billing Counter Staff',
    title: 'Patient Accounts Specialist',
    department: 'Patient Accounts & Insurance',
    avatar: 'BL',
    badge: 'Billing Counter',
    permissions: ['view_billing', 'update_billing', 'clear_billing', 'audit_charges']
  },
  {
    id: 'pharmacist',
    name: 'Pharmacist',
    title: 'Inpatient Pharmacist',
    department: 'Inpatient Pharmacy & Dispensary',
    avatar: 'PH',
    badge: 'Pharmacist',
    permissions: ['view_prescriptions', 'dispense_medication', 'manage_inventory', 'counseling']
  },
  {
    id: 'lab_staff',
    name: 'Laboratory Staff',
    title: 'Clinical Pathologist / Lab Scientist',
    department: 'Diagnostic Pathology & Clinical Chemistry',
    avatar: 'LB',
    badge: 'Lab Staff',
    permissions: ['view_lab_orders', 'intake_samples', 'enter_results', 'authorize_tests']
  },
  {
    id: 'patient',
    name: 'Patient / Caregiver',
    title: 'Patient & Family Portal',
    department: 'Patient Services',
    avatar: 'PT',
    badge: 'Patient Portal',
    permissions: ['view_patient_portal', 'view_approved_docs', 'confirm_transport']
  }
];

export const SAMPLE_PATIENTS = [
  {
    id: 'DF-2026-8841',
    name: 'Robert Chen',
    age: 68,
    gender: 'Male',
    ward: 'Cardiology - Ward 4B',
    bed: 'Bed 12',
    department: 'Cardiology',
    admissionDate: '2026-10-11',
    dischargeStarted: 'Today, 08:30 AM',
    dischargeStartedRaw: '2026-10-15T08:30:00',
    waitingTimeMinutes: 165, // 2h 45m
    attendingDoctor: 'Attending Physician, MD',
    assignedStaff: 'Attending Physician / Ward Nurse',
    stageNumber: 3,
    stageName: 'Doctor reviews the summary',
    status: 'Awaiting doctor review',
    statusType: 'warning', // warning, info, success, danger, neutral
    holdingUpReason: 'Clinical discharge summary draft prepared — waiting for Attending Physician review & formal sign-off.',
    holdingUpDepartment: 'Attending Physician (Cardiology)',
    estimatedDischargeTime: 'Today, 01:30 PM',
    targetMet: true,
    
    // Clinical Details
    reasonForAdmission: 'Acute central chest pain radiating to left jaw with diaphoresis, onset 2 hours prior to presentation.',
    confirmedDiagnosis: 'Acute Non-ST Elevation Myocardial Infarction (NSTEMI) — Post PCI',
    icd10: 'I21.4',
    secondaryDiagnoses: [
      'Essential Hypertension (I10)',
      'Type 2 Diabetes Mellitus without complications (E11.9)',
      'Hyperlipidemia (E78.5)'
    ],
    procedures: [
      'Coronary angiography with drug-eluting stent (DES) placement to proximal Left Anterior Descending (LAD) artery on 2026-10-11',
      'Bedside echocardiogram (LVEF 50-55%, mild anterior hypokinesis)'
    ],
    allergies: ['Penicillin (Moderate Rash)', 'Contrast dye (Mild nausea - pre-medicated)'],
    vitalsAtDischarge: {
      bp: '124/78 mmHg',
      hr: '68 bpm (Regular)',
      rr: '16 /min',
      spo2: '98% on room air',
      temp: '36.7 °C',
      weight: '74.2 kg'
    },
    conditionAtDischarge: 'Hemodynamically stable. Femoral puncture site clean, dry, and intact with no hematoma or bruit. Peripheral pulses palpable and symmetric. Mobilizing independently on the ward with no recurrent anginal symptoms.',
    investigations: 'Peak Troponin I: 4.8 ng/mL (trending down to 0.12 ng/mL). Serum creatinine: 1.02 mg/dL. Fasting blood glucose: 128 mg/dL. ECG prior to discharge: Normal sinus rhythm with resolution of T-wave inversions in V2-V4.',

    // Discharge Summary State
    summaryDraftGenerated: true,
    summaryApproved: false,
    summaryApprovedBy: null,
    summaryApprovedAt: null,
    summaryContent: {
      admissionReason: '68-year-old gentleman admitted via the Emergency Department on October 11, 2026 with retrosternal chest tightness radiating to the left arm, associated with mild diaphoresis.',
      confirmedDiagnosis: 'Acute Non-ST Elevation Myocardial Infarction (NSTEMI); successfully revascularized with single drug-eluting stent to proximal LAD.',
      treatmentSummary: 'Emergency cardiac catheterization revealed 90% stenosis in proximal LAD. Successful PCI with 3.5 x 18 mm Onyx DES. Dual antiplatelet therapy (DAPT) initiated. Post-procedure telemetry uneventful without malignant arrhythmias.',
      medications: [
        { name: 'Aspirin', dose: '81 mg', route: 'Oral', frequency: 'Once daily', duration: 'Indefinite', purpose: 'Cardioprotection' },
        { name: 'Ticagrelor (Brilinta)', dose: '90 mg', route: 'Oral', frequency: 'Twice daily', duration: '12 months', purpose: 'Stent thrombosis prevention' },
        { name: 'Atorvastatin', dose: '80 mg', route: 'Oral', frequency: 'Once daily at bedtime', duration: 'Indefinite', purpose: 'Lipid lowering / plaque stabilization' },
        { name: 'Metoprolol Tartrate', dose: '25 mg', route: 'Oral', frequency: 'Twice daily with meals', duration: 'Ongoing', purpose: 'Blood pressure and heart rate control' },
        { name: 'Metformin', dose: '500 mg', route: 'Oral', frequency: 'Twice daily with meals', duration: 'Ongoing', purpose: 'Blood sugar control' }
      ],
      dischargeCondition: 'Patient is ambulating without angina, dyspnea, or palpitations. Access site healed. Vitals stable.',
      followUpPlan: 'Cardiology outpatient review with Attending Physician in 2 weeks (October 29, 2026). Fasting lipid panel and renal panel to be drawn 3 days prior. Cardiac rehabilitation referral placed.',
      warningInstructions: 'Seek immediate emergency attention at the nearest ED if you experience recurrent chest pain, shortness of breath, unexplained dizziness, black tarry stools, or bleeding from the puncture site.'
    },

    // Billing & Insurance
    billing: {
      status: 'Pending Pharmacy Clearance', // Cleared, Pending Review, Pre-auth Requested, Disputed
      isCleared: false,
      clearedAt: null,
      clearedBy: null,
      payer: 'BlueCross BlueShield Comprehensive PPO',
      policyNumber: 'BCBS-9081244-A',
      preAuthNumber: 'PA-2026-44910',
      totalCharges: 14250.00,
      coveredAmount: 13900.00,
      patientCoPay: 350.00,
      paymentStatus: 'Co-pay Collected ($350.00)',
      assignedOfficer: 'Billing Officer',
      notes: 'Initial catheterization and hospital bed charges pre-authorized. Awaiting final pharmacy take-home pack audit before release.'
    },

    // Portal & Caregiver details
    portal: {
      caregiverName: 'David Chen (Son)',
      caregiverContact: '+1 (555) 234-8901',
      transportStatus: 'Family private vehicle confirmed for 01:30 PM pickup',
      patientNotificationsSent: 2
    },

    // 6-Stage Workflow Tasks
    stages: [
      {
        id: 1,
        name: 'Discharge initiated',
        department: 'Attending Clinician / Bed Management',
        status: 'completed', // completed, in-progress, pending, delayed
        completedAt: '08:45 AM',
        tasks: [
          { id: '1.1', title: 'Attending doctor confirms clinical readiness for discharge', status: 'completed', assignedTo: 'Attending Physician' },
          { id: '1.2', title: 'Bed management and ward charge nurse notified', status: 'completed', assignedTo: 'Ward Nurse' }
        ]
      },
      {
        id: 2,
        name: 'Documentation prepared',
        department: 'Ward Nursing & Care Coordination',
        status: 'completed',
        completedAt: '09:30 AM',
        tasks: [
          { id: '2.1', title: 'Nursing discharge summary & vital sign trend recorded', status: 'completed', assignedTo: 'Ward Nurse' },
          { id: '2.2', title: 'Cardiac rehab and dietary consultation notes filed', status: 'completed', assignedTo: 'Ward Nurse' },
          { id: '2.3', title: 'Preliminary medication reconciliation compiled', status: 'completed', assignedTo: 'Ward Nurse' }
        ]
      },
      {
        id: 3,
        name: 'Doctor reviews the summary',
        department: 'Attending Physician',
        status: 'in-progress',
        completedAt: null,
        tasks: [
          { id: '3.1', title: 'Attending doctor reviews structured discharge summary draft', status: 'in-progress', assignedTo: 'Attending Physician' },
          { id: '3.2', title: 'Doctor signs and authorizes final clinical release orders', status: 'pending', assignedTo: 'Attending Physician' }
        ]
      },
      {
        id: 4,
        name: 'Medical records checked',
        department: 'Health Information Management (HIM)',
        status: 'pending',
        completedAt: null,
        tasks: [
          { id: '4.1', title: 'Diagnostic reports, angiogram logs & lab results collated', status: 'pending', assignedTo: 'HIM Records Specialist' },
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
          { id: '5.1', title: 'Final take-home pharmacy reconciliation posted to ledger', status: 'pending', assignedTo: 'Billing Officer' },
          { id: '5.2', title: 'Insurance final authorization and financial clearance token generated', status: 'pending', assignedTo: 'Billing Officer' }
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
  },
  {
    id: 'DF-2026-9023',
    name: 'Maria Santos',
    age: 54,
    gender: 'Female',
    ward: 'General Surgery - Ward 2A',
    bed: 'Bed 04',
    department: 'General Surgery',
    admissionDate: '2026-10-12',
    dischargeStarted: 'Today, 09:15 AM',
    dischargeStartedRaw: '2026-10-15T09:15:00',
    waitingTimeMinutes: 120, // 2h 00m
    attendingDoctor: 'Attending Surgeon, MD',
    assignedStaff: 'Attending Surgeon / Billing Officer',
    stageNumber: 5,
    stageName: 'Billing clearance',
    status: 'Billing pending',
    statusType: 'warning',
    holdingUpReason: 'Awaiting final surgical mesh invoice verification from insurance coordinator.',
    holdingUpDepartment: 'Finance & Patient Accounts',
    estimatedDischargeTime: 'Today, 02:00 PM',
    targetMet: true,
    reasonForAdmission: 'Symptomatic incarcerated umbilical hernia requiring laparoscopic repair.',
    confirmedDiagnosis: 'Incarcerated Umbilical Hernia without gangrene',
    icd10: 'K42.0',
    secondaryDiagnoses: ['Mild Asthma (J45.20)'],
    procedures: ['Laparoscopic umbilical hernia repair with composite mesh fixation (2026-10-12)'],
    allergies: ['Sulfa drugs (Hives)'],
    vitalsAtDischarge: {
      bp: '118/72 mmHg',
      hr: '72 bpm',
      rr: '14 /min',
      spo2: '99% on room air',
      temp: '36.8 °C',
      weight: '68.0 kg'
    },
    conditionAtDischarge: 'Tolerating regular soft diet. Bowel sounds active. Laparoscopic port sites clean and dry. Pain well controlled with oral analgesia.',
    investigations: 'Post-op CBC: WBC 7.2 x10^9/L, Hemoglobin 13.1 g/dL. Electrolytes within normal limits.',
    summaryDraftGenerated: true,
    summaryApproved: true,
    summaryApprovedBy: 'Attending Surgeon, MD',
    summaryApprovedAt: 'Today, 10:45 AM',
    summaryContent: {
      admissionReason: '54-year-old female with acute umbilical pain and irreducible swelling.',
      confirmedDiagnosis: 'Incarcerated umbilical hernia without ischemic compromise.',
      treatmentSummary: 'Elective-converted laparoscopic repair with Parietex mesh. Smooth post-operative course with early ambulation.',
      medications: [
        { name: 'Acetaminophen', dose: '1000 mg', route: 'Oral', frequency: 'Every 6 hours as needed for mild pain', duration: '5 days', purpose: 'Pain relief' },
        { name: 'Ibuprofen', dose: '400 mg', route: 'Oral', frequency: 'Every 8 hours with meals as needed', duration: '5 days', purpose: 'Anti-inflammatory' },
        { name: 'Docusate Sodium', dose: '100 mg', route: 'Oral', frequency: 'Twice daily', duration: '7 days', purpose: 'Stool softener' }
      ],
      dischargeCondition: 'Incisions clean, dry. No peritoneal signs. Patient ambulatory.',
      followUpPlan: 'Surgical clinic appointment with Dr. Mendez in 3 weeks (November 5, 2026). Avoid lifting objects > 5 kg for 6 weeks.',
      warningInstructions: 'Contact surgical triage if you develop fever > 38.5°C, increasing wound redness, wound fluid drainage, or severe vomiting.'
    },
    billing: {
      status: 'Pending Insurance Clarification',
      isCleared: false,
      clearedAt: null,
      clearedBy: null,
      payer: 'Aetna Health Care Choice',
      policyNumber: 'AET-7832109',
      preAuthNumber: 'PA-2026-99302',
      totalCharges: 8940.00,
      coveredAmount: 8200.00,
      patientCoPay: 740.00,
      paymentStatus: 'Co-pay Authorized',
      assignedOfficer: 'Billing Officer',
      notes: 'Itemized implant invoice sent to Aetna adjustor. Verbal confirmation received, awaiting electronic clearance token.'
    },
    portal: {
      caregiverName: 'Luis Santos (Husband)',
      caregiverContact: '+1 (555) 345-6789',
      transportStatus: 'Husband arriving at 02:00 PM',
      patientNotificationsSent: 3
    },
    stages: [
      { id: 1, name: 'Discharge initiated', department: 'Attending Clinician', status: 'completed', completedAt: '09:20 AM', tasks: [{ id: '1.1', title: 'Clinician confirmed readiness', status: 'completed', assignedTo: 'Dr. Mendez' }] },
      { id: 2, name: 'Documentation prepared', department: 'Ward Nursing', status: 'completed', completedAt: '10:00 AM', tasks: [{ id: '2.1', title: 'Wound care nursing documentation completed', status: 'completed', assignedTo: 'Nurse Kelly' }] },
      { id: 3, name: 'Doctor reviews the summary', department: 'Attending Physician', status: 'completed', completedAt: '10:45 AM', tasks: [{ id: '3.1', title: 'Summary reviewed and signed', status: 'completed', assignedTo: 'Dr. Mendez' }] },
      { id: 4, name: 'Medical records checked', department: 'HIM Staff', status: 'completed', completedAt: '11:15 AM', tasks: [{ id: '4.1', title: 'Operative notes and surgical logs reconciled', status: 'completed', assignedTo: 'Medical Records Officer' }] },
      { id: 5, name: 'Billing clearance', department: 'Billing Staff', status: 'in-progress', completedAt: null, tasks: [{ id: '5.1', title: 'Verify surgical implant itemization and finalize insurer claim', status: 'in-progress', assignedTo: 'Billing Officer' }] },
      { id: 6, name: 'Final discharge approval and release', department: 'Ward Nursing', status: 'pending', completedAt: null, tasks: [{ id: '6.1', title: 'Wound dressing kit release and final patient checkout', status: 'pending', assignedTo: 'Nurse Kelly' }] }
    ]
  },
  {
    id: 'DF-2026-7712',
    name: 'James Wilson',
    age: 72,
    gender: 'Male',
    ward: 'Orthopaedics - Ward 3C',
    bed: 'Bed 18',
    department: 'Orthopaedics',
    admissionDate: '2026-10-09',
    dischargeStarted: 'Today, 07:45 AM',
    dischargeStartedRaw: '2026-10-15T07:45:00',
    waitingTimeMinutes: 210, // 3h 30m
    attendingDoctor: 'Attending Physician, MD',
    assignedStaff: 'Ward Nurse / Physical Therapy Team',
    stageNumber: 6,
    stageName: 'Final discharge approval and release',
    status: 'Ready for discharge',
    statusType: 'success',
    holdingUpReason: 'All clinical and billing steps completed. Awaiting scheduled family transport pickup at 11:30 AM.',
    holdingUpDepartment: 'Patient Logistics & Family Pickup',
    estimatedDischargeTime: 'Today, 11:30 AM',
    targetMet: true,
    reasonForAdmission: 'Severe osteoarthritis of right knee undergoing scheduled total knee arthroplasty (TKA).',
    confirmedDiagnosis: 'Primary unilateral osteoarthritis, right knee',
    icd10: 'M17.11',
    secondaryDiagnoses: ['Controlled Hypertension (I10)'],
    procedures: ['Right total knee arthroplasty (cemented prosthesis) on 2026-10-09'],
    allergies: ['No Known Drug Allergies (NKDA)'],
    vitalsAtDischarge: {
      bp: '128/80 mmHg',
      hr: '70 bpm',
      rr: '16 /min',
      spo2: '98% on room air',
      temp: '36.6 °C',
      weight: '82.5 kg'
    },
    conditionAtDischarge: 'Surgical wound clean with staples intact. Right knee flexion > 90 degrees, extension 0 degrees. Ambulating 150 ft with rolling walker with minimal assistance.',
    investigations: 'Post-op plain radiograph: Prosthesis in anatomic alignment without loosening. Hemoglobin stable at 11.8 g/dL.',
    summaryDraftGenerated: true,
    summaryApproved: true,
    summaryApprovedBy: 'Attending Physician, MD',
    summaryApprovedAt: 'Today, 09:30 AM',
    summaryContent: {
      admissionReason: '72-year-old gentleman admitted for elective right total knee arthroplasty.',
      confirmedDiagnosis: 'End-stage tricompartmental osteoarthritis of right knee.',
      treatmentSummary: 'Right TKA performed on Oct 9. Inpatient physical therapy completed twice daily. DVT prophylaxis administered.',
      medications: [
        { name: 'Enoxaparin (Lovenox)', dose: '40 mg', route: 'Subcutaneous injection', frequency: 'Once daily in evening', duration: '14 days total', purpose: 'Blood clot (DVT) prevention' },
        { name: 'Oxycodone', dose: '5 mg', route: 'Oral', frequency: 'Every 6 hours as needed for severe breakthrough pain', duration: '5 days max', purpose: 'Analgesia' },
        { name: 'Celecoxib', dose: '200 mg', route: 'Oral', frequency: 'Once daily with food', duration: '14 days', purpose: 'Anti-inflammatory pain control' }
      ],
      dischargeCondition: 'Independent with front-wheeled walker, safely cleared 3 stairs under PT supervision.',
      followUpPlan: 'Orthopaedic clinic visit for staple removal in 12 days (October 27, 2026). Outpatient physical therapy begins October 20.',
      warningInstructions: 'Notify clinic immediately if you experience calf swelling or tenderness, sudden chest tightness, fever > 38.3°C, or drainage from knee incision.'
    },
    billing: {
      status: 'Cleared',
      isCleared: true,
      clearedAt: 'Today, 10:15 AM',
      clearedBy: 'Billing Officer',
      payer: 'Medicare Part A & Supplemental Plan G',
      policyNumber: 'MED-9920148-W',
      preAuthNumber: 'PA-2026-11883',
      totalCharges: 21500.00,
      coveredAmount: 21300.00,
      patientCoPay: 200.00,
      paymentStatus: 'Paid in Full ($200.00)',
      assignedOfficer: 'Billing Officer',
      notes: 'Cleared in full. Zero patient balance remaining.'
    },
    portal: {
      caregiverName: 'Mary Wilson (Spouse)',
      caregiverContact: '+1 (555) 456-7890',
      transportStatus: 'Spouse en route with wheelchair accessible vehicle',
      patientNotificationsSent: 4
    },
    stages: [
      { id: 1, name: 'Discharge initiated', department: 'Attending Clinician', status: 'completed', completedAt: '08:00 AM', tasks: [{ id: '1.1', title: 'Clinician signed discharge intent', status: 'completed', assignedTo: 'Attending Physician' }] },
      { id: 2, name: 'Documentation prepared', department: 'Physical Therapy & Nursing', status: 'completed', completedAt: '08:45 AM', tasks: [{ id: '2.1', title: 'PT stair clearance & home safety checklist signed', status: 'completed', assignedTo: 'PT Davis' }] },
      { id: 3, name: 'Doctor reviews the summary', department: 'Attending Physician', status: 'completed', completedAt: '09:30 AM', tasks: [{ id: '3.1', title: 'Summary approved and prescription printed', status: 'completed', assignedTo: 'Attending Physician' }] },
      { id: 4, name: 'Medical records checked', department: 'HIM Staff', status: 'completed', completedAt: '09:50 AM', tasks: [{ id: '4.1', title: 'Implant serial registry and op log filed', status: 'completed', assignedTo: 'Medical Records Officer' }] },
      { id: 5, name: 'Billing clearance', department: 'Billing Staff', status: 'completed', completedAt: '10:15 AM', tasks: [{ id: '5.1', title: 'Medicare bundle verification and clearance issued', status: 'completed', assignedTo: 'Billing Officer' }] },
      { id: 6, name: 'Final discharge approval and release', department: 'Ward Nursing', status: 'in-progress', completedAt: null, tasks: [{ id: '6.1', title: 'Bedside discharge nurse finalizing packaging', status: 'in-progress', assignedTo: 'Ward Nurse' }] }
    ]
  },
  {
    id: 'DF-2026-9310',
    name: 'Priya Patel',
    age: 39,
    gender: 'Female',
    ward: 'General Medicine - Ward 5A',
    bed: 'Bed 07',
    department: 'General Medicine',
    admissionDate: '2026-10-13',
    dischargeStarted: 'Today, 10:00 AM',
    dischargeStartedRaw: '2026-10-15T10:00:00',
    waitingTimeMinutes: 75, // 1h 15m
    attendingDoctor: 'Attending Physician, MD',
    assignedStaff: 'Attending Physician / Ward Nurse',
    stageNumber: 2,
    stageName: 'Documentation prepared',
    status: 'Documentation in progress',
    statusType: 'info',
    holdingUpReason: 'Final nursing observation chart and repeat serum potassium lab verification in progress.',
    holdingUpDepartment: 'Ward Nursing & Central Lab',
    estimatedDischargeTime: 'Today, 03:00 PM',
    targetMet: true,
    reasonForAdmission: 'Acute pyelonephritis with dehydration and nausea.',
    confirmedDiagnosis: 'Acute Pyelonephritis (Escherichia coli, pansensitive)',
    icd10: 'N10',
    secondaryDiagnoses: ['None'],
    procedures: ['Renal ultrasound: No hydronephrosis or perinephric fluid collection.'],
    allergies: ['Ciprofloxacin (Tendonitis)'],
    vitalsAtDischarge: {
      bp: '116/74 mmHg',
      hr: '74 bpm',
      rr: '15 /min',
      spo2: '99% on room air',
      temp: '37.0 °C',
      weight: '59.0 kg'
    },
    conditionAtDischarge: 'Afebrile for 36 hours. Flank tenderness resolved. Tolerating oral fluids and diet comfortably.',
    investigations: 'Urine culture: E. coli > 100,000 CFU/mL. Sensitive to Cephalexin and Nitrofurantoin. Repeat potassium: 4.1 mEq/L (normal).',
    summaryDraftGenerated: false,
    summaryApproved: false,
    summaryApprovedBy: null,
    summaryApprovedAt: null,
    summaryContent: null,
    billing: {
      status: 'Pending Clinical Wrap-up',
      isCleared: false,
      clearedAt: null,
      clearedBy: null,
      payer: 'UnitedHealthcare Choice Plus',
      policyNumber: 'UHC-4409121',
      preAuthNumber: 'PA-2026-55912',
      totalCharges: 4200.00,
      coveredAmount: 3950.00,
      patientCoPay: 250.00,
      paymentStatus: 'Pending Final Review',
      assignedOfficer: 'Billing Officer',
      notes: 'Standard medical admission tier. Awaiting doctor order and summary generation.'
    },
    portal: {
      caregiverName: 'Self (Assisted by Sister: Ananya)',
      caregiverContact: '+1 (555) 789-0123',
      transportStatus: 'Sister will pick up at 03:00 PM',
      patientNotificationsSent: 1
    },
    stages: [
      { id: 1, name: 'Discharge initiated', department: 'Attending Clinician', status: 'completed', completedAt: '10:15 AM', tasks: [{ id: '1.1', title: 'Clinician confirmed patient afebrile and ready for oral therapy', status: 'completed', assignedTo: 'Dr. Thorne' }] },
      { id: 2, name: 'Documentation prepared', department: 'Ward Nursing', status: 'in-progress', completedAt: null, tasks: [{ id: '2.1', title: 'Nursing discharge assessment and oral hydration log', status: 'in-progress', assignedTo: 'Ward Nurse' }] },
      { id: 3, name: 'Doctor reviews the summary', department: 'Attending Physician', status: 'pending', completedAt: null, tasks: [{ id: '3.1', title: 'Summary drafting and oral antibiotic script authorization', status: 'pending', assignedTo: 'Dr. Thorne' }] },
      { id: 4, name: 'Medical records checked', department: 'HIM Staff', status: 'pending', completedAt: null, tasks: [{ id: '4.1', title: 'Lab culture sensitivities cross-referenced', status: 'pending', assignedTo: 'Medical Records Officer' }] },
      { id: 5, name: 'Billing clearance', department: 'Billing Staff', status: 'pending', completedAt: null, tasks: [{ id: '5.1', title: 'Inpatient stay calculation', status: 'pending', assignedTo: 'Billing Officer' }] },
      { id: 6, name: 'Final discharge approval and release', department: 'Ward Nursing', status: 'pending', completedAt: null, tasks: [{ id: '6.1', title: 'Oral Cephalexin handover and outpatient appointment schedule', status: 'pending', assignedTo: 'Ward Nurse' }] }
    ]
  },
  {
    id: 'DF-2026-6549',
    name: 'Arthur Pendelton',
    age: 81,
    gender: 'Male',
    ward: 'Neurology - Ward 1B',
    bed: 'Bed 22',
    department: 'Neurology',
    admissionDate: '2026-10-08',
    dischargeStarted: 'Today, 06:30 AM',
    dischargeStartedRaw: '2026-10-15T06:30:00',
    waitingTimeMinutes: 285, // 4h 45m - Bottleneck delay alert!
    attendingDoctor: 'Dr. Anita Roy, MD',
    assignedStaff: 'Dr. Anita Roy / Medical Records Officer',
    stageNumber: 4,
    stageName: 'Medical records checked',
    status: 'Records pending',
    statusType: 'danger', // Delayed flag
    holdingUpReason: 'Awaiting reconciliation of outside neuro-imaging records from referring community clinic.',
    holdingUpDepartment: 'Health Information Management (HIM)',
    estimatedDischargeTime: 'Today, 02:45 PM',
    targetMet: false,
    reasonForAdmission: 'Transient ischemic attack (TIA) with right-sided upper extremity weakness, fully resolved.',
    confirmedDiagnosis: 'Transient Ischemic Attack, Left Hemisphere (Carotid Territory)',
    icd10: 'G45.9',
    secondaryDiagnoses: ['Atrial Fibrillation (I48.0)', 'Hyperlipidemia (E78.0)'],
    procedures: ['Brain MRI / MRA (no acute territorial infarct)', 'Carotid duplex ultrasound (40% left ICA stenosis)'],
    allergies: ['Codeine (Extreme dizziness)'],
    vitalsAtDischarge: {
      bp: '132/82 mmHg',
      hr: '76 bpm (Irregularly irregular)',
      rr: '16 /min',
      spo2: '97% on room air',
      temp: '36.8 °C',
      weight: '71.0 kg'
    },
    conditionAtDischarge: 'Neurologically intact with NIHSS score 0. Motor strength 5/5 in all extremities.',
    investigations: '24-hour Holter monitoring confirmed paroxysmal AF. Echocardiogram: Left atrial enlargement, no thrombus.',
    summaryDraftGenerated: true,
    summaryApproved: true,
    summaryApprovedBy: 'Dr. Anita Roy, MD',
    summaryApprovedAt: 'Today, 08:30 AM',
    summaryContent: {
      admissionReason: '81-year-old male with 25-minute episode of right hand weakness and speech slurring.',
      confirmedDiagnosis: 'Transient ischemic attack secondary to newly diagnosed paroxysmal atrial fibrillation.',
      treatmentSummary: 'Comprehensive stroke workup. Anticoagulation initiated with Apixaban after CT excluded hemorrhage.',
      medications: [
        { name: 'Apixaban (Eliquis)', dose: '5 mg', route: 'Oral', frequency: 'Twice daily', duration: 'Long-term', purpose: 'Stroke prevention in Atrial Fibrillation' },
        { name: 'Atorvastatin', dose: '40 mg', route: 'Oral', frequency: 'Once daily', duration: 'Ongoing', purpose: 'Vascular risk reduction' },
        { name: 'Lisinopril', dose: '10 mg', route: 'Oral', frequency: 'Once daily in morning', duration: 'Ongoing', purpose: 'Blood pressure control' }
      ],
      dischargeCondition: 'No focal neurological deficits. Gait stable with cane.',
      followUpPlan: 'Neurology clinic follow-up with Dr. Roy in 4 weeks. Repeat carotid duplex ultrasound in 6 months.',
      warningInstructions: 'Immediate FAST protocol: If you notice facial droop, arm weakness, or speech difficulty, call 911 immediately.'
    },
    billing: {
      status: 'Pending Records Clearance',
      isCleared: false,
      clearedAt: null,
      clearedBy: null,
      payer: 'Medicare Part B + Humana Advantage',
      policyNumber: 'HUM-8812903',
      preAuthNumber: 'PA-2026-77810',
      totalCharges: 11400.00,
      coveredAmount: 11150.00,
      patientCoPay: 250.00,
      paymentStatus: 'Pre-auth Verified',
      assignedOfficer: 'Billing Officer',
      notes: 'Cleared pending medical records closure of neuro registry paperwork.'
    },
    portal: {
      caregiverName: 'Susan Pendelton (Daughter)',
      caregiverContact: '+1 (555) 678-9012',
      transportStatus: 'Daughter waiting on ward for records sign-off',
      patientNotificationsSent: 3
    },
    stages: [
      { id: 1, name: 'Discharge initiated', department: 'Attending Clinician', status: 'completed', completedAt: '06:50 AM', tasks: [{ id: '1.1', title: 'Clinician confirmed neurological stability', status: 'completed', assignedTo: 'Dr. Roy' }] },
      { id: 2, name: 'Documentation prepared', department: 'Ward Nursing', status: 'completed', completedAt: '07:40 AM', tasks: [{ id: '2.1', title: 'Speech therapy & occupational therapy handover', status: 'completed', assignedTo: 'Nurse Miller' }] },
      { id: 3, name: 'Doctor reviews the summary', department: 'Attending Physician', status: 'completed', completedAt: '08:30 AM', tasks: [{ id: '3.1', title: 'Summary reviewed and Eliquis script authorized', status: 'completed', assignedTo: 'Dr. Roy' }] },
      { id: 4, name: 'Medical records checked', department: 'HIM Staff', status: 'in-progress', completedAt: null, tasks: [{ id: '4.1', title: 'Outside hospital PACS transfer import and stroke registry check', status: 'in-progress', assignedTo: 'Medical Records Officer' }] },
      { id: 5, name: 'Billing clearance', department: 'Billing Staff', status: 'pending', completedAt: null, tasks: [{ id: '5.1', title: 'Humana Advantage reconciliation', status: 'pending', assignedTo: 'Billing Officer' }] },
      { id: 6, name: 'Final discharge approval and release', department: 'Ward Nursing', status: 'pending', completedAt: null, tasks: [{ id: '6.1', title: 'Anticoagulation booklet handout and discharge badge removal', status: 'pending', assignedTo: 'Nurse Miller' }] }
    ]
  },
  {
    id: 'DF-2026-8104',
    name: 'Eleanor Hughes',
    age: 62,
    gender: 'Female',
    ward: 'Oncology - Ward 6C',
    bed: 'Bed 09',
    department: 'Oncology',
    admissionDate: '2026-10-10',
    dischargeStarted: 'Today, 06:00 AM',
    dischargeStartedRaw: '2026-10-15T06:00:00',
    waitingTimeMinutes: 180,
    attendingDoctor: 'Attending Oncologist, MD',
    assignedStaff: 'Attending Oncologist, MD / Billing Officer',
    stageNumber: 6,
    stageName: 'Completed',
    status: 'Completed',
    statusType: 'neutral',
    holdingUpReason: 'None. Discharge completed and patient discharged home safely.',
    holdingUpDepartment: 'Discharge Completed',
    estimatedDischargeTime: 'Completed at 09:00 AM',
    targetMet: true,
    reasonForAdmission: 'Cycle 3 adjuvant chemotherapy with febrile neutropenia, now fully resolved.',
    confirmedDiagnosis: 'Resolved Febrile Neutropenia post-chemotherapy',
    icd10: 'D70.1',
    secondaryDiagnoses: ['Breast Carcinoma (C50.9)'],
    procedures: ['Blood cultures x 2 (No growth)', 'Chest X-ray (Clear)'],
    allergies: ['Morphine (Severe pruritus)'],
    vitalsAtDischarge: {
      bp: '120/76 mmHg',
      hr: '72 bpm',
      rr: '16 /min',
      spo2: '99% on room air',
      temp: '36.7 °C',
      weight: '64.0 kg'
    },
    conditionAtDischarge: 'Afebrile > 48 hours. Absolute neutrophil count (ANC) recovered to 1,600/uL.',
    investigations: 'WBC 4.8 x10^9/L with ANC 1.6 x10^9/L. Platelets 180 x10^9/L. Liver function panel normal.',
    summaryDraftGenerated: true,
    summaryApproved: true,
    summaryApprovedBy: 'Attending Oncologist, MD',
    summaryApprovedAt: 'Today, 07:45 AM',
    summaryContent: {
      admissionReason: '62-year-old female presenting on Day 10 of TC chemotherapy with fever 38.6°C.',
      confirmedDiagnosis: 'Neutropenic fever, clinically recovered with G-CSF support.',
      treatmentSummary: 'IV Cefepime administered. Filgrastim injections given x 3 days. Rapid marrow recovery.',
      medications: [
        { name: 'Ciprofloxacin', dose: '500 mg', route: 'Oral', frequency: 'Twice daily', duration: 'Complete remaining 2 days', purpose: 'Oral antibiotic completion' },
        { name: 'Ondansetron', dose: '8 mg', route: 'Oral', frequency: 'Every 8 hours as needed', duration: '3 days', purpose: 'Anti-emetic' }
      ],
      dischargeCondition: 'Well, eating comfortably, afebrile, ANC normal.',
      followUpPlan: 'Oncology clinic visit with Attending Oncologist in 1 week (October 22, 2026) for pre-Cycle 4 assessment.',
      warningInstructions: 'Immediate emergency presentation if temperature rises to 38.0°C or above.'
    },
    billing: {
      status: 'Cleared',
      isCleared: true,
      clearedAt: 'Today, 08:30 AM',
      clearedBy: 'Billing Officer',
      payer: 'Cigna Health',
      policyNumber: 'CIG-991204',
      preAuthNumber: 'PA-2026-66120',
      totalCharges: 9800.00,
      coveredAmount: 9600.00,
      patientCoPay: 200.00,
      paymentStatus: 'Cleared and Settled',
      assignedOfficer: 'Billing Officer',
      notes: 'Cleared in full.'
    },
    portal: {
      caregiverName: 'Thomas Hughes (Husband)',
      caregiverContact: '+1 (555) 890-1234',
      transportStatus: 'Patient picked up and safely at home',
      patientNotificationsSent: 5
    },
    stages: [
      { id: 1, name: 'Discharge initiated', department: 'Attending Clinician', status: 'completed', completedAt: '06:15 AM', tasks: [{ id: '1.1', title: 'Confirmed ANC recovery', status: 'completed', assignedTo: 'Attending Oncologist' }] },
      { id: 2, name: 'Documentation prepared', department: 'Ward Nursing', status: 'completed', completedAt: '07:00 AM', tasks: [{ id: '2.1', title: 'Oncology nursing care notes signed', status: 'completed', assignedTo: 'Nurse Adams' }] },
      { id: 3, name: 'Doctor reviews the summary', department: 'Attending Physician', status: 'completed', completedAt: '07:45 AM', tasks: [{ id: '3.1', title: 'Chemotherapy cycle 4 schedule filed', status: 'completed', assignedTo: 'Attending Oncologist' }] },
      { id: 4, name: 'Medical records checked', department: 'HIM Staff', status: 'completed', completedAt: '08:15 AM', tasks: [{ id: '4.1', title: 'Oncology registry coding verified', status: 'completed', assignedTo: 'Medical Records Officer' }] },
      { id: 5, name: 'Billing clearance', department: 'Billing Staff', status: 'completed', completedAt: '08:30 AM', tasks: [{ id: '5.1', title: 'Filgrastim drug pre-auth reconciliation complete', status: 'completed', assignedTo: 'Billing Officer' }] },
      { id: 6, name: 'Final discharge approval and release', department: 'Ward Nursing', status: 'completed', completedAt: '09:00 AM', tasks: [{ id: '6.1', title: 'Patient signed handover and discharged', status: 'completed', assignedTo: 'Nurse Adams' }] }
    ]
  },
  {
    id: 'DF-2026-9452',
    name: 'David Kim',
    age: 47,
    gender: 'Male',
    ward: 'Cardiology - Ward 4B',
    bed: 'Bed 15',
    department: 'Cardiology',
    admissionDate: '2026-10-14',
    dischargeStarted: 'Today, 10:30 AM',
    dischargeStartedRaw: '2026-10-15T10:30:00',
    waitingTimeMinutes: 45,
    attendingDoctor: 'Attending Physician, MD',
    assignedStaff: 'Attending Physician / Ward Nurse',
    stageNumber: 1,
    stageName: 'Discharge initiated',
    status: 'Documentation in progress',
    statusType: 'info',
    holdingUpReason: 'Initial discharge order placed. Nursing compiling admission-to-discharge summary.',
    holdingUpDepartment: 'Ward 4B Nursing Team',
    estimatedDischargeTime: 'Today, 04:00 PM',
    targetMet: true,
    reasonForAdmission: 'Hypertensive urgency with headache and blurry vision.',
    confirmedDiagnosis: 'Severe Uncontrolled Essential Hypertension',
    icd10: 'I10',
    secondaryDiagnoses: ['Obstructive Sleep Apnea (G47.33)'],
    procedures: ['Continuous arterial line BP monitoring', 'Renal artery Doppler (negative for stenosis)'],
    allergies: ['Lisinopril (Intractable dry cough)'],
    vitalsAtDischarge: {
      bp: '136/86 mmHg',
      hr: '74 bpm',
      rr: '15 /min',
      spo2: '98% on room air',
      temp: '36.6 °C',
      weight: '89.0 kg'
    },
    conditionAtDischarge: 'Headache completely resolved. Neurologic exam normal. BP safely down from 210/120 to 136/86 with oral agents.',
    investigations: 'Urinalysis: Trace proteinuria, no hematuria. Serum creatinine: 1.1 mg/dL. ECG: Left ventricular hypertrophy by voltage criteria.',
    summaryDraftGenerated: false,
    summaryApproved: false,
    summaryApprovedBy: null,
    summaryApprovedAt: null,
    summaryContent: null,
    billing: {
      status: 'Pending Clinical Documentation',
      isCleared: false,
      clearedAt: null,
      clearedBy: null,
      payer: 'Kaiser Permanente Senior Advantage',
      policyNumber: 'KP-3391024',
      preAuthNumber: 'PA-2026-88192',
      totalCharges: 5100.00,
      coveredAmount: 4850.00,
      patientCoPay: 250.00,
      paymentStatus: 'Pending Final Audit',
      assignedOfficer: 'Billing Officer',
      notes: 'Standard 24-hr observational admission.'
    },
    portal: {
      caregiverName: 'Grace Kim (Spouse)',
      caregiverContact: '+1 (555) 901-2345',
      transportStatus: 'Spouse arriving around 04:00 PM',
      patientNotificationsSent: 1
    },
    stages: [
      { id: 1, name: 'Discharge initiated', department: 'Attending Clinician', status: 'in-progress', completedAt: null, tasks: [{ id: '1.1', title: 'Clinician confirmed BP stability on oral Amlodipine + Losartan', status: 'completed', assignedTo: 'Attending Physician' }, { id: '1.2', title: 'Discharge order transmitted to pharmacy', status: 'in-progress', assignedTo: 'Ward Nurse' }] },
      { id: 2, name: 'Documentation prepared', department: 'Ward Nursing', status: 'pending', completedAt: null, tasks: [{ id: '2.1', title: 'Nursing care plan completed', status: 'pending', assignedTo: 'Ward Nurse' }] },
      { id: 3, name: 'Doctor reviews the summary', department: 'Attending Physician', status: 'pending', completedAt: null, tasks: [{ id: '3.1', title: 'Summary drafted and signed', status: 'pending', assignedTo: 'Attending Physician' }] },
      { id: 4, name: 'Medical records checked', department: 'HIM Staff', status: 'pending', completedAt: null, tasks: [{ id: '4.1', title: 'Diagnostic reports verified', status: 'pending', assignedTo: 'Medical Records Officer' }] },
      { id: 5, name: 'Billing clearance', department: 'Billing Staff', status: 'pending', completedAt: null, tasks: [{ id: '5.1', title: 'Kaiser co-pay processing', status: 'pending', assignedTo: 'Billing Officer' }] },
      { id: 6, name: 'Final discharge approval and release', department: 'Ward Nursing', status: 'pending', completedAt: null, tasks: [{ id: '6.1', title: 'Patient education on home blood pressure log', status: 'pending', assignedTo: 'Ward Nurse' }] }
    ]
  },
  {
    id: 'DF-2026-7231',
    name: 'Beatrice Walker',
    age: 76,
    gender: 'Female',
    ward: 'General Medicine - Ward 3A',
    bed: 'Bed 11',
    department: 'General Medicine',
    admissionDate: '2026-10-11',
    dischargeStarted: 'Today, 05:45 AM',
    dischargeStartedRaw: '2026-10-15T05:45:00',
    waitingTimeMinutes: 150,
    attendingDoctor: 'Attending Physician, MD',
    assignedStaff: 'Attending Physician / Ward Nurse',
    stageNumber: 6,
    stageName: 'Completed',
    status: 'Completed',
    statusType: 'neutral',
    holdingUpReason: 'None. Successfully discharged to home with visiting nurse service.',
    holdingUpDepartment: 'Discharge Completed',
    estimatedDischargeTime: 'Completed at 08:15 AM',
    targetMet: true,
    reasonForAdmission: 'Community-acquired bacterial pneumonia with productive cough.',
    confirmedDiagnosis: 'Bacterial Pneumonia, Left Lower Lobe (Streptococcus pneumoniae)',
    icd10: 'J13',
    secondaryDiagnoses: ['Chronic Kidney Disease Stage 3a (N18.31)'],
    procedures: ['Chest X-ray: Dense left lower lobe consolidation.'],
    allergies: ['No Known Drug Allergies (NKDA)'],
    vitalsAtDischarge: {
      bp: '122/70 mmHg',
      hr: '68 bpm',
      rr: '16 /min',
      spo2: '97% on room air',
      temp: '36.5 °C',
      weight: '61.0 kg'
    },
    conditionAtDischarge: 'Lungs clear to auscultation bilaterally with faint bibasilar crackles. Supplemental oxygen weaned. Ambulating to bathroom independently.',
    investigations: 'Repeat CXR shows significant clearing of consolidation. CRP decreased from 142 mg/L to 18 mg/L.',
    summaryDraftGenerated: true,
    summaryApproved: true,
    summaryApprovedBy: 'Attending Physician, MD',
    summaryApprovedAt: 'Today, 07:15 AM',
    summaryContent: {
      admissionReason: '76-year-old female admitted with fever, cough with rust-colored sputum, and dyspnea.',
      confirmedDiagnosis: 'Left lower lobe community-acquired pneumonia.',
      treatmentSummary: 'Initial IV Ceftriaxone and Azithromycin for 3 days. De-escalated to oral Amoxicillin-Clavulanate upon clinical improvement.',
      medications: [
        { name: 'Amoxicillin-Clavulanate (Augmentin)', dose: '875/125 mg', route: 'Oral', frequency: 'Twice daily with meals', duration: 'Complete 4 more days', purpose: 'Oral antibiotic course' }
      ],
      dischargeCondition: 'Afebrile, eating well, oxygen saturation normal on ambient air.',
      followUpPlan: 'Primary care physician review in 10 days. Repeat chest radiograph in 6 weeks.',
      warningInstructions: 'Report increased breathlessness, hemoptysis, or fever > 38.0°C to home nurse or urgent care.'
    },
    billing: {
      status: 'Cleared',
      isCleared: true,
      clearedAt: 'Today, 07:50 AM',
      clearedBy: 'Billing Officer',
      payer: 'Medicare Part A',
      policyNumber: 'MED-7718902',
      preAuthNumber: 'PA-2026-33912',
      totalCharges: 6450.00,
      coveredAmount: 6450.00,
      patientCoPay: 0.00,
      paymentStatus: 'Paid in Full',
      assignedOfficer: 'Billing Officer',
      notes: 'Cleared without co-pay.'
    },
    portal: {
      caregiverName: 'Edward Walker (Son)',
      caregiverContact: '+1 (555) 012-3456',
      transportStatus: 'Discharged safely with visiting nurse service scheduled',
      patientNotificationsSent: 4
    },
    stages: [
      { id: 1, name: 'Discharge initiated', department: 'Attending Clinician', status: 'completed', completedAt: '06:00 AM', tasks: [{ id: '1.1', title: 'Confirmed clinical recovery', status: 'completed', assignedTo: 'Dr. Thorne' }] },
      { id: 2, name: 'Documentation prepared', department: 'Ward Nursing', status: 'completed', completedAt: '06:45 AM', tasks: [{ id: '2.1', title: 'Home health nursing referral signed', status: 'completed', assignedTo: 'Ward Nurse' }] },
      { id: 3, name: 'Doctor reviews the summary', department: 'Attending Physician', status: 'completed', completedAt: '07:15 AM', tasks: [{ id: '3.1', title: 'Summary approved', status: 'completed', assignedTo: 'Dr. Thorne' }] },
      { id: 4, name: 'Medical records checked', department: 'HIM Staff', status: 'completed', completedAt: '07:35 AM', tasks: [{ id: '4.1', title: 'Coding and audit logs cleared', status: 'completed', assignedTo: 'Medical Records Officer' }] },
      { id: 5, name: 'Billing clearance', department: 'Billing Staff', status: 'completed', completedAt: '07:50 AM', tasks: [{ id: '5.1', title: 'Medicare claim finalized', status: 'completed', assignedTo: 'Billing Officer' }] },
      { id: 6, name: 'Final discharge approval and release', department: 'Ward Nursing', status: 'completed', completedAt: '08:15 AM', tasks: [{ id: '6.1', title: 'Medications handed over and patient accompanied to vehicle', status: 'completed', assignedTo: 'Ward Nurse' }] }
    ]
  }
];

export const INITIAL_PATIENTS = [];

/**
 * SAMPLE_NOTIFICATIONS is intentionally empty.
 * Notifications are generated by real user actions within the system.
 */
export const SAMPLE_NOTIFICATIONS = [];

export const MOCK_NOTIFICATIONS = [];

export const REPORT_BENCHMARKS = {
  averageTurnaroundHours: 4.2,
  medianTurnaroundHours: 3.8,
  targetHours: 5.0,
  targetMetPercent: 78.5,
  totalDischargesEvaluated: 148,
  stageBreakdown: [
    { stage: '1. Discharge Initiated', averageMinutes: 32, targetMinutes: 30, bottleneckScore: 'Low' },
    { stage: '2. Documentation Prepared', averageMinutes: 48, targetMinutes: 45, bottleneckScore: 'Moderate' },
    { stage: '3. Doctor Summary Review', averageMinutes: 58, targetMinutes: 45, bottleneckScore: 'High' },
    { stage: '4. Medical Records Checked', averageMinutes: 34, targetMinutes: 30, bottleneckScore: 'Low' },
    { stage: '5. Billing & Pharmacy Clearance', averageMinutes: 66, targetMinutes: 45, bottleneckScore: 'Highest' },
    { stage: '6. Final Release & Handover', averageMinutes: 28, targetMinutes: 30, bottleneckScore: 'Low' }
  ],
  delayReasons: [
    { reason: 'Insurance Pre-authorization / Co-pay Processing', percentage: 38, count: 56 },
    { reason: 'Attending Clinician on Ward Rounds / Clinical Emergencies', percentage: 28, count: 41 },
    { reason: 'Take-home Pharmacy Dispensing Queue', percentage: 18, count: 27 },
    { reason: 'Patient Family Transport / Pickup Delay', percentage: 11, count: 16 },
    { reason: 'Outside Medical Records / Incomplete HIM Signatures', percentage: 5, count: 8 }
  ]
};
