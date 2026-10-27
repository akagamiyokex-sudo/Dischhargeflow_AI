import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { INITIAL_APPOINTMENTS } from '../data/mockRoleData';
import { 
  INITIAL_DEPARTMENTS, 
  INITIAL_STAFF, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_HOSPITAL_SETTINGS 
} from '../data/adminInitialData';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { ROLES, ROLE_CONFIGS, getDefaultRouteForRole, isRouteAllowedForRole } from '../config/rolesConfig';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Current authenticated user identity (persisted via authService)
  const [currentUser, setCurrentUser] = useState(() => {
    return authService.getCurrentUser();
  });

  // Track session authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('dischargeflow_active_session_v2') !== null;
  });

  // Current active page / route
  const [currentPage, setCurrentPage] = useState(() => {
    const hasSession = localStorage.getItem('dischargeflow_active_session_v2') !== null;
    if (!hasSession) return 'login';
    const user = authService.getCurrentUser();
    if (!user) return 'login';
    return getDefaultRouteForRole(user.role);
  });

  // ----------------------------------------------------
  // SHARED HOSPITAL STATE (Phase 2 Hospital Admin Foundation)
  // ----------------------------------------------------
  const [departments, setDepartments] = useState(() => {
    try {
      const stored = localStorage.getItem('dischargeflow_departments_v1');
      return stored ? JSON.parse(stored) : INITIAL_DEPARTMENTS;
    } catch (e) {
      return INITIAL_DEPARTMENTS;
    }
  });

  const [staffList, setStaffList] = useState(() => {
    try {
      const stored = localStorage.getItem('dischargeflow_staff_list_v1');
      return stored ? JSON.parse(stored) : INITIAL_STAFF;
    } catch (e) {
      return INITIAL_STAFF;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const stored = localStorage.getItem('dischargeflow_audit_logs_v1');
      return stored ? JSON.parse(stored) : INITIAL_AUDIT_LOGS;
    } catch (e) {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [hospitalSettings, setHospitalSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('dischargeflow_hospital_settings_v1');
      return stored ? JSON.parse(stored) : INITIAL_HOSPITAL_SETTINGS;
    } catch (e) {
      return INITIAL_HOSPITAL_SETTINGS;
    }
  });

  const [appointments, setAppointments] = useState(() => {
    try {
      const stored = localStorage.getItem('dischargeflow_appointments_v1');
      return stored ? JSON.parse(stored) : INITIAL_APPOINTMENTS;
    } catch (e) {
      return INITIAL_APPOINTMENTS;
    }
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('dischargeflow_departments_v1', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('dischargeflow_staff_list_v1', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('dischargeflow_audit_logs_v1', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('dischargeflow_hospital_settings_v1', JSON.stringify(hospitalSettings));
  }, [hospitalSettings]);

  useEffect(() => {
    localStorage.setItem('dischargeflow_appointments_v1', JSON.stringify(appointments));
  }, [appointments]);

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load patients on mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPatients();
      setPatients(data);
      if (data.length > 0) {
        setSelectedPatientId(prev => (prev && data.some(p => p.id === prev)) ? prev : data[0].id);
      } else {
        setSelectedPatientId(null);
      }
    } catch (e) {
      console.error('Failed to load patients', e);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // SHARED AUDIT LOGGING SERVICE
  // ----------------------------------------------------
  const logAuditEvent = ({ action, target, details, result = 'Success' }) => {
    const roleTitle = currentUser ? (ROLE_CONFIGS[currentUser.role]?.shortTitle || ROLE_CONFIGS[currentUser.role]?.label || currentUser.role) : 'System';
    const userName = currentUser ? currentUser.name : 'System Terminal';
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `${roleTitle} — ${userName}`,
      role: roleTitle,
      action,
      target: target || 'N/A',
      details: details || '',
      result
    };
    setAuditLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const addPatient = async (patientData) => {
    const roleTitle = currentUser ? (ROLE_CONFIGS[currentUser.role]?.shortTitle || currentUser.role) : 'Front Desk';
    const newPatient = await apiService.addPatient({
      ...patientData,
      registeredBy: currentUser ? `${roleTitle} — ${currentUser.name}` : 'Front Desk'
    });
    await loadPatients();
    setSelectedPatientId(newPatient.id);
    logAuditEvent({
      action: 'PATIENT_REGISTERED',
      target: `${newPatient.name} · ${newPatient.id}`,
      details: `Registered inpatient in ${newPatient.department} (${newPatient.ward}, ${newPatient.bed}). Emergency contact: ${newPatient.emergencyContact?.name || 'Provided'}.`
    });
    addToast(`Patient registered successfully. MRN: ${newPatient.id}`, 'success');
    return newPatient;
  };

  const updatePatientAdministrative = async (patientId, adminData) => {
    const roleTitle = currentUser ? (ROLE_CONFIGS[currentUser.role]?.shortTitle || currentUser.role) : 'Front Desk';
    const updated = await apiService.updatePatientAdministrative(patientId, {
      ...adminData,
      updatedBy: currentUser ? `${roleTitle} — ${currentUser.name}` : 'Front Desk'
    });
    await loadPatients();
    logAuditEvent({
      action: 'PATIENT_ADMIN_UPDATED',
      target: `${updated.name} · ${updated.id}`,
      details: `Updated patient registration, contact, and admission details.`
    });
    addToast(`Patient details updated for ${updated.name}.`, 'success');
    return updated;
  };

  const deletePatient = async (patientId) => {
    await apiService.deletePatient(patientId);
    await loadPatients();
    logAuditEvent({
      action: 'PATIENT_DELETED',
      target: patientId,
      details: `Patient record removed from active hospital database.`
    });
    addToast('Patient record removed.', 'info');
  };

  const clearAllPatients = async () => {
    await apiService.clearAllPatients();
    await loadPatients();
    logAuditEvent({
      action: 'PATIENTS_CLEARED',
      target: 'ALL_PATIENTS',
      details: `All patient records cleared.`
    });
    addToast('All patient records cleared.', 'info');
  };

  const restoreSampleData = async () => {
    await apiService.restoreSampleData();
    await loadPatients();
    logAuditEvent({
      action: 'PATIENTS_RESTORED',
      target: 'SAMPLE_DATA',
      details: `Sample patient cohort restored.`
    });
    addToast('Sample patient records restored.', 'success');
  };

  // ----------------------------------------------------
  // APPOINTMENT MANAGEMENT ACTIONS
  // ----------------------------------------------------
  const addAppointment = (appointmentData) => {
    const newApt = {
      id: `apt-${Date.now().toString(36)}-${Math.floor(100 + Math.random() * 900)}`,
      patientName: appointmentData.patientName,
      patientId: appointmentData.patientId || 'N/A',
      phone: appointmentData.phone || '',
      department: appointmentData.department || 'Outpatient Clinic',
      doctor: appointmentData.doctor || 'Attending Physician',
      date: appointmentData.date || 'Today',
      time: appointmentData.time || '10:00 AM',
      type: appointmentData.type || 'Consultation',
      status: appointmentData.status || 'Confirmed',
      notes: appointmentData.notes || '',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApt, ...prev]);
    logAuditEvent({
      action: 'APPOINTMENT_SCHEDULED',
      target: `${newApt.patientName} (${newApt.patientId})`,
      details: `Scheduled ${newApt.type} appointment with ${newApt.doctor} on ${newApt.date} at ${newApt.time}.`
    });
    addToast(`Appointment scheduled for ${newApt.patientName}.`, 'success');
    return newApt;
  };

  const updateAppointment = (id, updatedFields) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields } : a));
    logAuditEvent({
      action: 'APPOINTMENT_UPDATED',
      target: id,
      details: `Updated appointment details.`
    });
    addToast('Appointment updated.', 'success');
  };

  const cancelAppointment = (id) => {
    const target = appointments.find(a => a.id === id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    logAuditEvent({
      action: 'APPOINTMENT_CANCELLED',
      target: target ? `${target.patientName} (${target.patientId})` : id,
      details: `Appointment marked as cancelled.`
    });
    addToast('Appointment cancelled.', 'warning');
  };

  // ----------------------------------------------------
  // STAFF & USER MANAGEMENT ACTIONS
  // ----------------------------------------------------
  const addStaff = (staffData) => {
    if (!staffData.name || !staffData.staffId || !staffData.email || !staffData.role || !staffData.department) {
      throw new Error('Please fill in all required fields (Name, Staff ID, Email, Role, Department).');
    }

    const idExists = staffList.some(s => s.staffId.toLowerCase() === staffData.staffId.trim().toLowerCase());
    if (idExists) {
      throw new Error(`Staff ID "${staffData.staffId}" is already assigned to an existing personnel record.`);
    }

    const emailExists = staffList.some(s => s.email.toLowerCase() === staffData.email.trim().toLowerCase());
    if (emailExists) {
      throw new Error(`Work email "${staffData.email}" is already registered.`);
    }

    const initials = staffData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';

    const newStaff = {
      id: `usr-custom-${Date.now()}`,
      staffId: staffData.staffId.trim(),
      name: staffData.name.trim(),
      email: staffData.email.trim().toLowerCase(),
      role: staffData.role,
      department: staffData.department,
      designation: staffData.designation || ROLE_CONFIGS[staffData.role]?.badge || 'Hospital Staff',
      phone: staffData.phone || '',
      mobile: staffData.phone || '',
      status: staffData.status || 'Active',
      dateCreated: new Date().toISOString().substring(0, 10),
      avatar: initials,
      assignedWard: staffData.assignedWard || `${staffData.department} Unit`
    };

    setStaffList(prev => [newStaff, ...prev]);
    logAuditEvent({
      action: 'STAFF_MEMBER_CREATED',
      target: `${newStaff.staffId} (${newStaff.name})`,
      details: `Registered personnel with role: ${ROLE_CONFIGS[newStaff.role]?.label || newStaff.role} in ${newStaff.department}.`
    });
    addToast(`Staff member ${newStaff.name} registered successfully.`, 'success');
    return newStaff;
  };

  const updateStaff = (id, updatedFields) => {
    if (updatedFields.staffId) {
      const idConflict = staffList.some(s => s.id !== id && s.staffId.toLowerCase() === updatedFields.staffId.trim().toLowerCase());
      if (idConflict) {
        throw new Error(`Staff ID "${updatedFields.staffId}" is already used by another staff member.`);
      }
    }
    if (updatedFields.email) {
      const emailConflict = staffList.some(s => s.id !== id && s.email.toLowerCase() === updatedFields.email.trim().toLowerCase());
      if (emailConflict) {
        throw new Error(`Email "${updatedFields.email}" is already registered to another account.`);
      }
    }

    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          ...updatedFields,
          mobile: updatedFields.phone || updatedFields.mobile || s.mobile || s.phone
        };
      }
      return s;
    }));

    logAuditEvent({
      action: 'STAFF_MEMBER_UPDATED',
      target: updatedFields.staffId || id,
      details: `Administrative profile updates saved for staff record.`
    });
    addToast('Staff details updated successfully.', 'success');
  };

  const toggleStaffStatus = (id) => {
    const target = staffList.find(s => s.id === id);
    if (!target) return;

    // Safety rule: Never allow the final active administrator to deactivate their account
    if (target.role === ROLES.HOSPITAL_ADMIN && target.status === 'Active') {
      const activeAdmins = staffList.filter(s => s.role === ROLES.HOSPITAL_ADMIN && s.status === 'Active');
      if (activeAdmins.length <= 1) {
        throw new Error('Action blocked: Cannot deactivate the final active Hospital Administrator. At least one active admin account is required to govern the system.');
      }
    }

    const nextStatus = target.status === 'Active' ? 'Inactive' : 'Active';

    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: nextStatus };
      }
      return s;
    }));

    logAuditEvent({
      action: nextStatus === 'Inactive' ? 'ACCOUNT_DEACTIVATED' : 'ACCOUNT_ACTIVATED',
      target: `${target.staffId} (${target.name})`,
      details: `Account status toggled from ${target.status} to ${nextStatus}.`
    });

    addToast(`Staff account for ${target.name} is now ${nextStatus}.`, nextStatus === 'Active' ? 'success' : 'warning');
  };

  // ----------------------------------------------------
  // DEPARTMENT MANAGEMENT ACTIONS
  // ----------------------------------------------------
  const addDepartment = (deptData) => {
    if (!deptData.name || !deptData.code || !deptData.head) {
      throw new Error('Please fill in all required fields (Department Name, Code, Department Head).');
    }

    const cleanCode = deptData.code.trim().toUpperCase();
    const codeExists = departments.some(d => d.code.toUpperCase() === cleanCode);
    if (codeExists) {
      throw new Error(`Department code "${cleanCode}" is already in use.`);
    }

    const newDept = {
      id: `dept-${cleanCode.toLowerCase()}-${Date.now().toString(36)}`,
      name: deptData.name.trim(),
      code: cleanCode,
      head: deptData.head.trim(),
      location: deptData.location?.trim() || 'Main Hospital Complex',
      totalBeds: parseInt(deptData.totalBeds, 10) || 20,
      description: deptData.description?.trim() || '',
      status: deptData.status || 'Active',
      dateCreated: new Date().toISOString().substring(0, 10)
    };

    setDepartments(prev => [...prev, newDept]);
    logAuditEvent({
      action: 'DEPARTMENT_CREATED',
      target: `${newDept.code} - ${newDept.name}`,
      details: `Created new clinical unit under ${newDept.head} with ${newDept.totalBeds} licensed beds.`
    });
    addToast(`Department ${newDept.name} created successfully.`, 'success');
    return newDept;
  };

  const updateDepartment = (id, updatedFields) => {
    if (updatedFields.code) {
      const cleanCode = updatedFields.code.trim().toUpperCase();
      const codeConflict = departments.some(d => d.id !== id && d.code.toUpperCase() === cleanCode);
      if (codeConflict) {
        throw new Error(`Department code "${cleanCode}" is already in use.`);
      }
      updatedFields.code = cleanCode;
    }

    setDepartments(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, ...updatedFields };
      }
      return d;
    }));

    logAuditEvent({
      action: 'DEPARTMENT_UPDATED',
      target: id,
      details: `Updated department configurations and capacity.`
    });
    addToast('Department details updated.', 'success');
  };

  const toggleDepartmentStatus = (id) => {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;

    const nextStatus = dept.status === 'Active' ? 'Inactive' : 'Active';
    const activePatientsCount = patients.filter(p => p.department === dept.name && p.status !== 'Completed').length;
    const activeStaffCount = staffList.filter(s => s.department === dept.name && s.status === 'Active').length;

    setDepartments(prev => prev.map(d => d.id === id ? { ...d, status: nextStatus } : d));

    logAuditEvent({
      action: nextStatus === 'Inactive' ? 'DEPARTMENT_DEACTIVATED' : 'DEPARTMENT_ACTIVATED',
      target: `${dept.code} - ${dept.name}`,
      details: `Status set to ${nextStatus}. Associated records: ${activePatientsCount} patients, ${activeStaffCount} staff.`
    });

    if (nextStatus === 'Inactive' && (activePatientsCount > 0 || activeStaffCount > 0)) {
      addToast(`Department ${dept.name} deactivated. Existing ${activePatientsCount} patients and ${activeStaffCount} staff remain preserved.`, 'warning');
    } else {
      addToast(`Department ${dept.name} is now ${nextStatus}.`, nextStatus === 'Active' ? 'success' : 'info');
    }
  };

  // ----------------------------------------------------
  // SETTINGS & SYSTEM RESET
  // ----------------------------------------------------
  const updateHospitalSettings = (newSettings) => {
    setHospitalSettings(prev => ({ ...prev, ...newSettings }));
    logAuditEvent({
      action: 'SETTINGS_UPDATED',
      target: 'HOSPITAL_PROFILE_AND_WORKFLOW',
      details: 'Updated hospital administrative thresholds, contact records, and notification policies.'
    });
    addToast('System settings saved successfully.', 'success');
  };

  const resetHospitalDemoData = async () => {
    localStorage.removeItem('dischargeflow_departments_v1');
    localStorage.removeItem('dischargeflow_staff_list_v1');
    localStorage.removeItem('dischargeflow_audit_logs_v1');
    localStorage.removeItem('dischargeflow_hospital_settings_v1');

    setDepartments(INITIAL_DEPARTMENTS);
    setStaffList(INITIAL_STAFF);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setHospitalSettings(INITIAL_HOSPITAL_SETTINGS);

    await apiService.clearAllPatients();
    await loadPatients();

    logAuditEvent({
      action: 'SYSTEM_RESET',
      target: 'ALL_HOSPITAL_DATA',
      details: 'System data cleared and reset to clean baseline state.'
    });

    addToast('System data cleared and reset to clean state.', 'info');
  };

  // Standard Login via credentials (email address or registered mobile number)
  const login = async (identifier, password) => {
    const user = await authService.login(identifier, password);
    setCurrentUser(user);
    setIsAuthenticated(true);
    const targetRoute = getDefaultRouteForRole(user.role);
    setCurrentPage(targetRoute);
    const loginType = identifier.includes('@') ? 'email' : 'mobile';
    logAuditEvent({
      action: 'USER_LOGIN',
      target: user.email || user.phone || identifier,
      details: `User signed in successfully as ${user.name} (${user.role}) via ${loginType}.`
    });
    addToast(`Signed in as ${user.name} (${user.title || user.designation})`, 'success');
    return user;
  };

  // Login as a specific staff user by ID
  const loginAsUser = async (userId) => {
    const user = await authService.loginAsUser(userId);
    setCurrentUser(user);
    setIsAuthenticated(true);
    const targetRoute = getDefaultRouteForRole(user.role);
    setCurrentPage(targetRoute);
    logAuditEvent({
      action: 'USER_LOGIN',
      target: user.email || userId,
      details: `Session initialized as ${user.name} (${user.role}).`
    });
    addToast(`Signed in as ${user.name} (${user.title || user.designation})`, 'success');
    return user;
  };

  // Login by role ID
  const loginAsRole = async (roleId) => {
    const user = await authService.loginAsRole(roleId);
    setCurrentUser(user);
    setIsAuthenticated(true);
    const targetRoute = getDefaultRouteForRole(user.role);
    setCurrentPage(targetRoute);
    logAuditEvent({
      action: 'USER_LOGIN',
      target: roleId,
      details: `Session initialized as ${user.name} (${user.role}).`
    });
    addToast(`Signed in as ${user.name} (${user.title || user.designation})`, 'success');
    return user;
  };

  // Switch to another active staff user
  const switchUser = (userId) => {
    const allUsers = authService.getAllDemoUsers();
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      if (user.status === 'Inactive' || user.status === 'Deactivated') {
        addToast(`Cannot switch to deactivated account: ${user.name}.`, 'danger');
        return;
      }
      setCurrentUser(user);
      localStorage.setItem('dischargeflow_active_session_v2', JSON.stringify(user));
      const targetRoute = getDefaultRouteForRole(user.role);
      setCurrentPage(targetRoute);
      logAuditEvent({
        action: 'SESSION_SWITCHED',
        target: user.email || user.id,
        details: `Active session changed to ${user.name} (${user.role}).`
      });
      addToast(`Switched active session to ${user.name}`, 'info');
    }
  };

  // Switch by role
  const switchRole = (roleId) => {
    const allUsers = authService.getAllDemoUsers();
    const user = allUsers.find(u => u.role === roleId && u.status !== 'Inactive' && u.status !== 'Deactivated');
    if (user) {
      switchUser(user.id);
    }
  };

  const logout = () => {
    logAuditEvent({
      action: 'USER_LOGOUT',
      target: currentUser?.email || 'Active Session',
      details: `User signed out of session.`
    });
    authService.logout();
    setIsAuthenticated(false);
    setCurrentPage('login');
    addToast('Signed out of session', 'info');
  };

  const selectPatient = (patientId) => {
    setSelectedPatientId(patientId);
  };

  const navigateTo = (page, patientId = null) => {
    if (patientId) {
      setSelectedPatientId(patientId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRouteAllowed = (routeId) => {
    if (!currentUser || !currentUser.role) return false;
    return isRouteAllowedForRole(currentUser.role, routeId);
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const selectedPatient = (patients && patients.length > 0)
    ? (patients.find(p => p.id === selectedPatientId) || patients[0])
    : null;

  const value = {
    currentUser,
    switchRole,
    switchUser,
    sampleUsers: authService.getAllDemoUsers(),
    isAuthenticated,
    login,
    loginAsUser,
    loginAsRole,
    logout,
    currentPage,
    navigateTo,
    isRouteAllowed,
    patients,
    setPatients,
    loadPatients,
    addPatient,
    updatePatientAdministrative,
    deletePatient,
    clearAllPatients,
    restoreSampleData,
    selectedPatient,
    selectedPatientId,
    selectPatient,
    searchQuery,
    setSearchQuery,
    appointments,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    notifications,
    markNotificationRead,
    toasts,
    addToast,
    removeToast,
    loading,

    // Phase 2 Hospital Admin Foundation Exports
    departments,
    addDepartment,
    updateDepartment,
    toggleDepartmentStatus,
    staffList,
    addStaff,
    updateStaff,
    toggleStaffStatus,
    auditLogs,
    logAuditEvent,
    hospitalSettings,
    updateHospitalSettings,
    resetHospitalDemoData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
