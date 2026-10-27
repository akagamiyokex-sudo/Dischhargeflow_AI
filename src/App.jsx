import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import TopNav from './components/layout/TopNav';
import ToastContainer from './components/common/ToastContainer';
import AccessDenied from './components/common/AccessDenied';
import PlaceholderPage from './components/common/PlaceholderPage';
import { getDefaultRouteForRole, isRouteAllowedForRole } from './config/rolesConfig';

// Core Authentication Screen
import LoginPage from './pages/LoginPage';

// 8 Role-Specific Landing Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import NurseDashboard from './pages/dashboards/NurseDashboard';
import DischargeDashboard from './pages/dashboards/DischargeDashboard';
import BillingDashboard from './pages/dashboards/BillingDashboard';
import PharmacyDashboard from './pages/dashboards/PharmacyDashboard';
import LabDashboard from './pages/dashboards/LabDashboard';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import FrontDeskDashboard from './pages/dashboards/FrontDeskDashboard';

// Front Desk Dedicated Pages
import FrontDeskPatientsPage from './pages/frontdesk/FrontDeskPatientsPage';
import FrontDeskAppointmentsPage from './pages/frontdesk/FrontDeskAppointmentsPage';
import FrontDeskAdmissionsPage from './pages/frontdesk/FrontDeskAdmissionsPage';
import FrontDeskProfilePage from './pages/frontdesk/FrontDeskProfilePage';

// Phase 2 Hospital Admin Workspace Pages
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminDepartmentsPage from './pages/admin/AdminDepartmentsPage';
import AdminOperationsPage from './pages/admin/AdminOperationsPage';
import AdminDischargeMonitoringPage from './pages/admin/AdminDischargeMonitoringPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Existing Functional Clinical & Administrative Workspaces (Preserved & Integrated)
import DashboardPage from './pages/DashboardPage';
import WorkflowTrackerPage from './pages/WorkflowTrackerPage';
import PatientDetailsPage from './pages/PatientDetailsPage';
import DischargeSummaryEditorPage from './pages/DischargeSummaryEditorPage';
import BillingWorkspacePage from './pages/BillingWorkspacePage';
import PatientPortalPage from './pages/PatientPortalPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { isAuthenticated, currentPage, currentUser, navigateTo, isRouteAllowed } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not logged in or on login page, show hospital login screen
  if (!isAuthenticated || currentPage === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  const defaultHomeRoute = getDefaultRouteForRole(currentUser.role);

  // Check frontend route guard
  if (!isRouteAllowed(currentPage)) {
    return (
      <div className="app-container">
        {sidebarOpen && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              zIndex: 35
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-wrapper">
          <TopNav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main>
            <AccessDenied
              attemptedPage={currentPage}
              userRole={currentUser.role}
              userName={currentUser.name}
              onReturnHome={() => navigateTo(defaultHomeRoute)}
            />
          </main>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // Render current view based on page ID
  const renderPage = () => {
    switch (currentPage) {
      // ----------------------------------------------------
      // 1. HOSPITAL ADMIN WORKSPACE (Phase 2 Complete)
      // ----------------------------------------------------
      case 'admin-overview':
        return <AdminDashboard />;
      case 'admin-users':
        return <AdminUsersPage />;
      case 'admin-departments':
        return <AdminDepartmentsPage />;
      case 'admin-operations':
        return <AdminOperationsPage />;
      case 'admin-discharges':
        return <AdminDischargeMonitoringPage />;
      case 'admin-reports':
        return <AdminReportsPage />;
      case 'admin-audit-logs':
        return <AdminAuditLogsPage />;
      case 'admin-settings':
        return <AdminSettingsPage />;

      // ----------------------------------------------------
      // 2. DOCTOR / CONSULTANT WORKSPACE
      // ----------------------------------------------------
      case 'doctor-dashboard':
        return <DoctorDashboard />;
      case 'doctor-patients':
        return (
          <PlaceholderPage 
            title="My Inpatient Roster"
            subtitle="Inpatients currently under your primary attending and consulting care."
            plannedFeatures={[
              'Active patient list with bed status and primary diagnosis',
              'Direct link to electronic clinical notes and telemetry',
              'Bedside rounding list with one-click handover notes',
              'Consultation request management'
            ]}
          />
        );
      case 'doctor-records':
        return <PatientDetailsPage />;
      case 'doctor-notes':
        return (
          <PlaceholderPage 
            title="Clinical Progress Notes"
            subtitle="Document daily progress notes, SOAP assessments, and ward rounding findings."
            plannedFeatures={[
              'Structured SOAP clinical note templates',
              'Voice-to-text clinical dictation module',
              'Multidisciplinary team handover notes',
              'Consultant co-signature workflow'
            ]}
          />
        );
      case 'doctor-prescriptions':
        return (
          <PlaceholderPage 
            title="Electronic Prescriptions & Medication Orders (CPOE)"
            subtitle="Order inpatient medications and compile take-home discharge prescription packs."
            plannedFeatures={[
              'Computerized physician order entry (CPOE)',
              'Real-time drug interaction and patient allergy checking',
              'Take-home discharge prescription builder',
              'Digital e-prescribing signature'
            ]}
          />
        );
      case 'doctor-summary':
        return <DischargeSummaryEditorPage />;
      case 'doctor-approvals':
        return (
          <PlaceholderPage 
            title="Pending Discharge Authorizations"
            subtitle="Electronic clinical discharge orders awaiting attending physician authorization."
            plannedFeatures={[
              'Batch review of clinical readiness orders',
              'Digital signature token issuance',
              'Return summary for correction with clinician notes',
              'Follow-up appointment requirement confirmation'
            ]}
          />
        );
      case 'doctor-appointments':
        return (
          <PlaceholderPage 
            title="Clinical Consultations & Outpatient Schedule"
            subtitle="Manage hospital clinic appointments, follow-ups, and outpatient sessions."
            plannedFeatures={[
              'Outpatient clinic schedule calendar',
              'Post-discharge follow-up booking',
              'Referrals to cardiology, surgery, and rehabilitation',
              'Automated reminders to caregivers'
            ]}
          />
        );

      // ----------------------------------------------------
      // 3. NURSE / WARD STAFF WORKSPACE
      // ----------------------------------------------------
      case 'nurse-dashboard':
        return <NurseDashboard />;
      case 'nurse-patients':
        return (
          <PlaceholderPage 
            title="Ward Patient Census & Bed Roster"
            subtitle="Bed-by-bed patient list, telemetry flags, and nursing care assignments."
            plannedFeatures={[
              'Interactive ward layout and bed map',
              'Patient care acuity scoring',
              'Allergy and fall risk alerts',
              'Nursing handover transfer documentation'
            ]}
          />
        );
      case 'nurse-observations':
        return (
          <PlaceholderPage 
            title="Patient Vital Signs & Observations"
            subtitle="Record and monitor vital sign trends, fluid balance, and clinical scores."
            plannedFeatures={[
              'Vital signs entry (BP, HR, SpO2, Temp, RR)',
              'National Early Warning Score (NEWS2) automatic calculation',
              'Intake/output fluid balance ledger',
              'Blood glucose monitoring chart'
            ]}
          />
        );
      case 'nurse-notes':
        return (
          <PlaceholderPage 
            title="Nursing Shift Notes & Handovers"
            subtitle="Document patient response to therapy, nursing diagnoses, and shift handovers."
            plannedFeatures={[
              'Shift handover summary generation',
              'Nursing care plan updates',
              'Wound care and drain output records',
              'Patient mobility and nutrition tracking'
            ]}
          />
        );
      case 'nurse-tasks':
        return (
          <PlaceholderPage 
            title="Ward Care Tasks & Medication Administration"
            subtitle="Execution checklist for shift tasks, IV line checks, and medication pass."
            plannedFeatures={[
              'Medication administration record (eMAR) verification',
              'IV line and catheter care tasks',
              'Bedside blood draw and specimen collection checklist',
              'Physical therapy mobility sessions'
            ]}
          />
        );
      case 'nurse-readiness':
        return (
          <PlaceholderPage 
            title="Discharge Readiness Verification"
            subtitle="Final bedside milestones before releasing patient to family/transport."
            plannedFeatures={[
              'IV cannula removal & puncture site verification',
              'Take-home medications received and verified with nurse',
              'Personal belongings and hospital badge return',
              'Discharge bag release token'
            ]}
          />
        );

      // ----------------------------------------------------
      // 4. DISCHARGE OPERATOR / MEDICAL RECORDS WORKSPACE
      // ----------------------------------------------------
      case 'discharge-overview':
        return <DischargeDashboard />;
      case 'discharge-register':
        return <DashboardPage />;
      case 'discharge-admissions':
        return (
          <PlaceholderPage 
            title="Hospital Admissions & Bed Board"
            subtitle="Manage admissions from Emergency, elective surgical bookings, and transfers."
            plannedFeatures={[
              'Inpatient bed availability by department',
              'Pending transfers from Emergency Department',
              'Elective surgery bed reservation tracker',
              'Direct admissions from outpatient clinics'
            ]}
          />
        );
      case 'discharge-queue':
        return <DashboardPage />;
      case 'discharge-records':
        return (
          <PlaceholderPage 
            title="Medical Records & Coding Reconciliation"
            subtitle="Health Information Management (HIM) coding, chart audits, and filing."
            plannedFeatures={[
              'ICD-10-CM diagnostic and procedural coding audit',
              'Missing consultant signatures tracker',
              'Collation of outside imaging and operative logs',
              'Release of information (ROI) authorizations'
            ]}
          />
        );
      case 'discharge-checklist':
        return (
          <PlaceholderPage 
            title="Discharge Document Checklist"
            subtitle="Cross-department compliance checklist required before patient release."
            plannedFeatures={[
              'Physician summary signature status',
              'Nursing discharge handover status',
              'Pharmacy take-home reconciliation status',
              'Billing clearance token verification'
            ]}
          />
        );
      case 'discharge-workflow':
        return <WorkflowTrackerPage />;

      // ----------------------------------------------------
      // 5. BILLING COUNTER WORKSPACE
      // ----------------------------------------------------
      case 'billing-overview':
        return <BillingDashboard />;
      case 'billing-bills':
        return (
          <PlaceholderPage 
            title="Patient Account Ledgers & Itemized Bills"
            subtitle="Review itemized inpatient charges, diagnostics, room fees, and pharmacy items."
            plannedFeatures={[
              'Itemized charge detail by departmental code',
              'Room accommodation and nursing fee breakdown',
              'Operating room and anesthesia fee audit',
              'Printable interim statement'
            ]}
          />
        );
      case 'billing-invoice':
        return (
          <PlaceholderPage 
            title="Generate Final Inpatient Invoice"
            subtitle="Generate regulatory hospital invoice and electronic claim submission."
            plannedFeatures={[
              'Electronic claim generation (EDI 837)',
              'Discharge invoice formatting with hospital tax ID',
              'Detailed itemized tax breakdown',
              'Export PDF receipt & billing summary'
            ]}
          />
        );
      case 'billing-payments':
        return (
          <PlaceholderPage 
            title="Payment Processing & Co-Pay Settlement"
            subtitle="Record patient co-pay settlements, card transactions, and cash receipts."
            plannedFeatures={[
              'Integrated credit/debit card terminal gateway',
              'Cash collection ledger with receipt generation',
              'Payment plan setup for uncovered balances',
              'Online payment link SMS to patient/family'
            ]}
          />
        );
      case 'billing-outstanding':
        return (
          <PlaceholderPage 
            title="Outstanding Claims & Insurer Inquiries"
            subtitle="Manage pending insurer pre-authorizations, audits, and disputes."
            plannedFeatures={[
              'Insurance pre-authorization claim status tracker',
              'Carrier dispute and additional documentation request',
              'Awaiting insurer final payment remittance',
              'Financial counseling assistance'
            ]}
          />
        );
      case 'billing-clearance':
        return <BillingWorkspacePage />;

      // ----------------------------------------------------
      // 6. PHARMACIST WORKSPACE
      // ----------------------------------------------------
      case 'pharmacy-overview':
        return <PharmacyDashboard />;
      case 'pharmacy-prescriptions':
        return (
          <PlaceholderPage 
            title="Inpatient & Discharge Prescriptions"
            subtitle="Review electronic physician take-home medication orders."
            plannedFeatures={[
              'Electronic prescription verification queue',
              'Drug-drug interaction and dosage check',
              'Substitution and formulary alternative suggestion',
              'Order clarification message with prescriber'
            ]}
          />
        );
      case 'pharmacy-dispensing':
        return (
          <PlaceholderPage 
            title="Medication Dispensing & Packaging"
            subtitle="Dispense, package, and barcode-label take-home medications."
            plannedFeatures={[
              'Barcode scanning for medication verification',
              'Compliance blister pack / organizer assembly',
              'Patient instruction label printing with warning icons',
              'Handover confirmation to ward nursing / patient'
            ]}
          />
        );
      case 'pharmacy-inventory':
        return (
          <PlaceholderPage 
            title="Medicine Inventory & Stock Control"
            subtitle="Hospital central dispensary inventory levels, reorders, and batch tracking."
            plannedFeatures={[
              'Real-time stock level monitoring with reorder points',
              'Batch and expiry date tracking',
              'Controlled substances electronic register (Schedule II-V)',
              'Automatic supplier purchase order generation'
            ]}
          />
        );
      case 'pharmacy-stock':
        return (
          <PlaceholderPage 
            title="Ward Stock Movements & Replenishment"
            subtitle="Track emergency ward drug kits, crash carts, and pharmacy transfers."
            plannedFeatures={[
              'Ward stock replenishment requests',
              'Automated dispensing cabinet (ADC) restocking',
              'Medication returns and credit reconciliation',
              'Disposal log of expired and damaged stock'
            ]}
          />
        );

      // ----------------------------------------------------
      // 7. LABORATORY STAFF WORKSPACE
      // ----------------------------------------------------
      case 'lab-overview':
        return <LabDashboard />;
      case 'lab-requests':
        return (
          <PlaceholderPage 
            title="Diagnostic Test Orders"
            subtitle="Incoming STAT pre-discharge laboratory and pathology requests."
            plannedFeatures={[
              'STAT order prioritization queue',
              'Order details with clinical indication and specimen type',
              'Phlebotomy collection dispatch tracker',
              'Automated analyzer test routing'
            ]}
          />
        );
      case 'lab-samples':
        return (
          <PlaceholderPage 
            title="Pending Specimen Accessioning"
            subtitle="Barcode intake, specimen centrifugation, and laboratory accessioning."
            plannedFeatures={[
              'Barcode scanning and specimen tube intake',
              'Sample rejection logging (hemolyzed, clotted, insufficient)',
              'Centrifugation and aliquot distribution',
              'Chain of custody tracking'
            ]}
          />
        );
      case 'lab-results':
        return (
          <PlaceholderPage 
            title="Enter & Verify Laboratory Results"
            subtitle="Input analyzer findings, abnormal value flags, and pathologist sign-off."
            plannedFeatures={[
              'Bidirectional analyzer data interface (ASTM/HL7)',
              'Delta checking with previous patient results',
              'Critical panic value alert dispatch to ward',
              'Pathologist digital signature'
            ]}
          />
        );
      case 'lab-completed':
        return (
          <PlaceholderPage 
            title="Completed Diagnostic Test Archives"
            subtitle="Historical lab results, cumulative reports, and quality control logs."
            plannedFeatures={[
              'Cumulative lab report viewer by patient MRN',
              'Analyzer quality control (Levey-Jennings charts)',
              'Departmental turnaround time analytics',
              'HL7 lab result transmission audit'
            ]}
          />
        );

      // ----------------------------------------------------
      // 8. PATIENT / CAREGIVER WORKSPACE
      // ----------------------------------------------------
      case 'patient-home':
        return <PatientDashboard />;
      case 'patient-appointments':
        return (
          <PlaceholderPage 
            title="My Doctor Appointments"
            subtitle="View and manage scheduled outpatient consultations and follow-up visits."
            plannedFeatures={[
              'Interactive appointment calendar',
              'Doctor specialty details and clinic room directions',
              'Reschedule request with care team',
              'SMS and email appointment reminders'
            ]}
          />
        );
      case 'patient-test-results':
        return (
          <PlaceholderPage 
            title="My Diagnostic & Lab Results"
            subtitle="Review laboratory and imaging results authorized by your doctor."
            plannedFeatures={[
              'Plain-language explanation of blood tests and vitals',
              'Doctor interpretation notes',
              'Historical trend charts',
              'Download PDF lab report'
            ]}
          />
        );
      case 'patient-prescriptions':
        return (
          <PlaceholderPage 
            title="My Home Prescriptions"
            subtitle="Your prescribed discharge medication routine with daily times and guidance."
            plannedFeatures={[
              'Visual medication schedule (Morning, Noon, Evening, Bedtime)',
              'Color-coded pill images with dosage instructions',
              'Potential side effects and what to do',
              'Local pharmacy prescription refill request'
            ]}
          />
        );
      case 'patient-documents':
        return <PatientPortalPage />;
      case 'patient-followup':
        return (
          <PlaceholderPage 
            title="My Recovery & Follow-up Care Plan"
            subtitle="Personalized recovery instructions, diet, exercise, and wound care."
            plannedFeatures={[
              'Post-discharge physical activity limits',
              'Dietary and hydration guidelines',
              'Incision / catheter wound dressing instructions',
              'Recovery milestone checklist'
            ]}
          />
        );
      case 'patient-notifications':
        return (
          <PlaceholderPage 
            title="Care Team Notifications"
            subtitle="Updates from your attending doctor, ward nurse, and pharmacist."
            plannedFeatures={[
              'Discharge readiness milestones updates',
              'Medication packaging ready notifications',
              'Care team follow-up messages',
              '24/7 ward nurse helpline link'
            ]}
          />
        );

      // ----------------------------------------------------
      // 9. FRONT DESK ROLE WORKSPACE
      // ----------------------------------------------------
      case 'front-desk-dashboard':
        return <FrontDeskDashboard />;
      case 'front-desk-patients':
        return <FrontDeskPatientsPage />;
      case 'front-desk-appointments':
        return <FrontDeskAppointmentsPage />;
      case 'front-desk-admissions':
        return <FrontDeskAdmissionsPage />;
      case 'front-desk-profile':
        return <FrontDeskProfilePage />;

      // Fallback
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Responsive mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 35
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Left Sidebar (Dynamic by Role) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Right Content Area */}
      <div className="main-wrapper">
        <TopNav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main>{renderPage()}</main>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
