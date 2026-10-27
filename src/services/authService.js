/**
 * DischargeFlow AI — Authentication Service Abstraction
 *
 * Provides staff authentication and session persistence.
 *
 * Authentication is performed exclusively against the live staff list
 * managed by the Hospital Administrator via the Staff Management interface.
 *
 * BACKEND INTEGRATION BLUEPRINT:
 * In later phases, this service layer will connect directly to:
 * 1. Firebase Authentication: For hospital SSO, passwordless magic links, and token generation.
 * 2. FastAPI Backend (/api/v1/auth): For JWT verification and authoritative RBAC role claims.
 * 3. Cloud Firestore: For staff profiles, ward assignments, and audit trails.
 */

import { ROLES, getRoleConfig } from '../config/rolesConfig';

const SESSION_STORAGE_KEY = 'dischargeflow_active_session_v2';
const STAFF_STORAGE_KEY = 'dischargeflow_staff_list_v1';

export const DEFAULT_ADMIN_USER = {
  id: 'usr-adm-01',
  staffId: 'EMP-ADM-101',
  name: 'Dr. Sarah Jenkins',
  email: 'admin@hospital.com',
  aliases: ['admin', 'admin@hospital.com', 'admin@dischargeflow.internal', 'sarah.jenkins@dischargeflow.internal'],
  role: ROLES.HOSPITAL_ADMIN,
  department: 'Hospital Administration & Operations',
  designation: 'Hospital Operations Director',
  phone: '+1 (555) 012-3401',
  mobile: '+1 (555) 012-3401',
  status: 'Active',
  dateCreated: '2025-01-10',
  avatar: 'SJ',
  assignedWard: 'Executive Operations Suite'
};

export const SAMPLE_USERS = [
  DEFAULT_ADMIN_USER,
  {
    id: 'usr-fd-01',
    staffId: 'EMP-REC-101',
    name: 'Priya Kumar',
    email: 'frontdesk@hospital.com',
    aliases: ['frontdesk', 'reception', 'priya.kumar@hospital.com', 'priya.kumar@dischargeflow.internal'],
    role: ROLES.FRONT_DESK,
    department: 'Reception & Admissions',
    designation: 'Front Desk Officer',
    phone: '+1 (555) 012-1050',
    mobile: '+1 (555) 012-1050',
    status: 'Active',
    dateCreated: '2025-01-12',
    avatar: 'PK',
    assignedWard: 'Central Reception Desk'
  },
  {
    id: 'usr-doc-01',
    staffId: 'EMP-DOC-401',
    name: 'Dr. Rachel Vance, MD',
    email: 'doctor@hospital.com',
    aliases: ['doctor', 'rachel.vance@dischargeflow.internal'],
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
    aliases: ['nurse', 'marcus.tan@dischargeflow.internal'],
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
    id: 'usr-dis-01',
    staffId: 'EMP-DIS-310',
    name: 'Grace Chen',
    email: 'discharge@hospital.com',
    aliases: ['grace.chen@dischargeflow.internal'],
    role: ROLES.DISCHARGE_OPERATOR,
    department: 'Care Continuity & Bed Management',
    designation: 'Discharge Coordinator Lead',
    phone: '+1 (555) 012-3100',
    mobile: '+1 (555) 012-3100',
    status: 'Active',
    dateCreated: '2025-01-20',
    avatar: 'GC',
    assignedWard: 'Hospital Discharge Lounge'
  },
  {
    id: 'usr-bil-01',
    staffId: 'EMP-BIL-501',
    name: 'Elena Rostova',
    email: 'billing@hospital.com',
    aliases: ['elena.rostova@dischargeflow.internal'],
    role: ROLES.BILLING_COUNTER,
    department: 'Patient Accounts & Insurance Pre-Auth',
    designation: 'Senior Patient Accounts Specialist',
    phone: '+1 (555) 012-5011',
    mobile: '+1 (555) 012-5011',
    status: 'Active',
    dateCreated: '2025-02-18',
    avatar: 'ER',
    assignedWard: 'Main Billing Counter Desk 1'
  },
  {
    id: 'usr-phm-01',
    staffId: 'EMP-PHM-601',
    name: 'Dr. Amanda Wong, PharmD',
    email: 'pharmacy@hospital.com',
    aliases: ['amanda.wong@dischargeflow.internal'],
    role: ROLES.PHARMACIST,
    department: 'Inpatient Pharmacy & Dispensary',
    designation: 'Chief Inpatient Pharmacist',
    phone: '+1 (555) 012-6011',
    mobile: '+1 (555) 012-6011',
    status: 'Active',
    dateCreated: '2025-01-25',
    avatar: 'AW',
    assignedWard: 'Central Hospital Pharmacy'
  },
  {
    id: 'usr-lab-01',
    staffId: 'EMP-LAB-701',
    name: 'Dr. Tariq Al-Mansoor',
    email: 'lab@hospital.com',
    aliases: ['tariq.almansoor@dischargeflow.internal'],
    role: ROLES.LAB_STAFF,
    department: 'Diagnostic Pathology & Clinical Chemistry',
    designation: 'Senior Clinical Pathologist',
    phone: '+1 (555) 012-7011',
    mobile: '+1 (555) 012-7011',
    status: 'Active',
    dateCreated: '2025-01-18',
    avatar: 'TA',
    assignedWard: 'Central Pathology Laboratory'
  }
];

function getLiveStaffList() {
  try {
    const stored = localStorage.getItem(STAFF_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to parse stored staff list', e);
  }
  return null;
}

/**
 * Normalizes phone number by stripping all non-digit characters.
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '');
}

/**
 * Checks if the search input matches a candidate phone number.
 * Supports exact digits match, suffix/country code match, and literal match.
 */
export function matchesPhone(inputPhone, targetPhone) {
  if (!inputPhone || !targetPhone) return false;
  
  const cleanInput = normalizePhoneNumber(inputPhone);
  const cleanTarget = normalizePhoneNumber(targetPhone);

  if (cleanInput && cleanTarget) {
    if (cleanInput === cleanTarget) return true;
    // Handle country code differences (e.g. entered without +1 or target has +1)
    if (cleanInput.length >= 7 && cleanTarget.endsWith(cleanInput)) return true;
    if (cleanTarget.length >= 7 && cleanInput.endsWith(cleanTarget)) return true;
  }

  return inputPhone.trim().toLowerCase() === targetPhone.trim().toLowerCase();
}

/**
 * Validates whether a user record matches an email, username, staffId or phone identifier.
 */
export function userMatchesIdentifier(user, identifier) {
  if (!user || !identifier) return false;
  const trimmed = identifier.trim().toLowerCase();

  // 1. Direct aliases & keywords (e.g. 'admin', 'doctor')
  if (user.aliases && user.aliases.some(a => a.toLowerCase() === trimmed)) {
    return true;
  }

  // 2. Staff ID or Username
  if (user.staffId && user.staffId.trim().toLowerCase() === trimmed) {
    return true;
  }
  if (user.id && user.id.trim().toLowerCase() === trimmed) {
    return true;
  }

  // 3. Email check (case-insensitive)
  if (user.email && user.email.trim().toLowerCase() === trimmed) {
    return true;
  }

  // 4. Direct phone / mobile match on user object
  const userPhone = user.phone || user.mobile || user.mobileNumber || user.phoneNumber || user.contact;
  if (userPhone && matchesPhone(identifier, userPhone)) {
    return true;
  }

  return false;
}

export const authService = {
  /**
   * Retrieves active user session from localStorage.
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        if (user && user.role) {
          // Verify user is not deactivated in live staff list
          const staffList = getLiveStaffList();
          if (staffList) {
            const liveUser = staffList.find(s => s.id === user.id || (s.email && user.email && s.email.toLowerCase() === user.email.toLowerCase()));
            if (liveUser && (liveUser.status === 'Inactive' || liveUser.status === 'Deactivated')) {
              // Clear session if deactivated
              localStorage.removeItem(SESSION_STORAGE_KEY);
              return null;
            }
            if (liveUser) {
              return { ...user, ...liveUser };
            }
          }
          return user;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored session', e);
    }
    // No session — return null to force the login page
    return null;
  },

  /**
   * Updates the current active session in localStorage and staffList if present.
   */
  updateCurrentUser(updatedFields) {
    try {
      const current = this.getCurrentUser();
      if (!current) return null;
      const updated = { ...current, ...updatedFields };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));

      // Also sync to staffList if user is staff
      const staffList = getLiveStaffList();
      if (staffList && staffList.some(s => s.id === current.id)) {
        const nextStaff = staffList.map(s => s.id === current.id ? { ...s, ...updatedFields } : s);
        localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(nextStaff));
      }

      return updated;
    } catch (e) {
      console.warn('Failed to update active user session', e);
      return null;
    }
  },

  /**
   * Authentication by either registered email address or mobile number + password.
   */
  async login(identifier, password) {
    if (!identifier || !password) {
      throw new Error('Please enter both your registered email address or mobile number, and password.');
    }

    const trimmed = identifier.trim();
    if (!trimmed) {
      throw new Error('Please enter both your registered email address or mobile number, and password.');
    }

    const staffList = getLiveStaffList();
    
    // Check dynamic staff list first, then base sample users
    let foundUser = null;
    if (staffList) {
      foundUser = staffList.find(u => userMatchesIdentifier(u, trimmed));
    }
    if (!foundUser) {
      foundUser = SAMPLE_USERS.find(u => userMatchesIdentifier(u, trimmed));
    }

    if (foundUser) {
      if (foundUser.status === 'Inactive' || foundUser.status === 'Deactivated') {
        throw new Error(`The account for ${foundUser.name} has been deactivated by hospital administration. Access is restricted.`);
      }

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(foundUser));
      return foundUser;
    }

    throw new Error('Account not found in hospital directory. Please verify your registered email address or mobile number.');
  },

  /**
   * Login as a specific staff user by their ID (used by admin impersonation only).
   */
  async loginAsUser(userId) {
    const staffList = getLiveStaffList();
    let user = null;
    if (staffList) {
      user = staffList.find(u => u.id === userId);
    }

    if (!user) {
      throw new Error('Requested user account not found in the hospital directory.');
    }

    if (user.status === 'Inactive' || user.status === 'Deactivated') {
      throw new Error(`The account for ${user.name} has been deactivated by hospital administration. Access is restricted.`);
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  /**
   * Login as the first active user of a given role (for admin delegation).
   */
  async loginAsRole(roleId) {
    const staffList = getLiveStaffList();
    const candidates = staffList ? staffList.filter(u => u.role === roleId && u.status !== 'Inactive' && u.status !== 'Deactivated') : [];
    const user = candidates[0];
    if (!user) {
      throw new Error(`No active staff member found for role: ${roleId}.`);
    }
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  /**
   * Clears the current active session.
   */
  logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  /**
   * Returns all active staff users from the live staff list.
   */
  getAllDemoUsers() {
    const staffList = getLiveStaffList();
    if (!staffList || staffList.length === 0) return [];
    return staffList.map(s => ({
      ...s,
      title: s.designation || s.title || 'Staff Member',
      avatar: s.avatar || (s.name ? s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST')
    }));
  }
};
