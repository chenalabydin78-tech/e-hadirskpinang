import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, Student, AbsenceRecord, Message, CalendarEvent, WarningRecord, SchoolClass, OfficialActivity } from '../types';
import { mockParents, mockTeachers, mockAdmin, mockStudents, mockAbsences, mockMessages, mockCalendar, mockWarnings, mockClasses, mockActivities } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  students: Student[];
  absences: AbsenceRecord[];
  messages: Message[];
  calendar: CalendarEvent[];
  warnings: WarningRecord[];
  classes: SchoolClass[];
  activities: OfficialActivity[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addAbsence: (absence: AbsenceRecord) => void;
  addMessage: (message: Message) => void;
  markMessageRead: (id: string) => void;
  updateStudentId: (studentId: string, newStudentId: string) => void;
  toggleStudentActive: (studentId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [absences, setAbsences] = useState<AbsenceRecord[]>(mockAbsences);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [calendar] = useState<CalendarEvent[]>(mockCalendar);
  const [warnings, setWarnings] = useState<WarningRecord[]>(mockWarnings);
  const [classes] = useState<SchoolClass[]>(mockClasses);
  const [activities] = useState<OfficialActivity[]>(mockActivities);

  const login = (email: string, password: string): boolean => {
    const allUsers = [...mockParents, ...mockTeachers, mockAdmin];
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addAbsence = (absence: AbsenceRecord) => {
    setAbsences(prev => [...prev, absence]);
    // Update warnings
    const studentAbsences = [...absences, absence].filter(a => a.studentId === absence.studentId);
    const dates = [...new Set(studentAbsences.map(a => a.date))].sort().reverse();
    let consecutive = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const d1 = new Date(dates[i]);
      const d2 = new Date(dates[i + 1]);
      const diff = (d1.getTime() - d2.getTime()) / 86400000;
      if (diff === 1) consecutive++;
      else break;
    }
    let status: WarningRecord['status'] = 'Normal';
    if (consecutive >= 3) status = 'Perhatian';
    if (consecutive >= 10) status = 'Amaran';
    if (consecutive >= 17) status = 'Tindakan Diperlukan';

    setWarnings(prev => {
      const existing = prev.find(w => w.studentId === absence.studentId);
      if (existing) {
        return prev.map(w => w.studentId === absence.studentId ? {
          ...w,
          consecutiveDays: consecutive,
          totalAbsences: studentAbsences.length,
          status,
          lastWarning: status !== 'Normal' ? `Status: ${status} — ${consecutive} hari berturut-turut` : undefined,
          timeline: [...w.timeline, { date: absence.date, event: `Ketidakhadiran - ${absence.reason}`, type: 'absence' as const }]
        } : w);
      }
      return [...prev, {
        studentId: absence.studentId,
        consecutiveDays: consecutive,
        totalAbsences: studentAbsences.length,
        status,
        timeline: [{ date: absence.date, event: `Ketidakhadiran - ${absence.reason}`, type: 'absence' as const }]
      }];
    });
  };

  const addMessage = (message: Message) => setMessages(prev => [...prev, message]);
  const markMessageRead = (id: string) => setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  const updateStudentId = (studentId: string, newStudentId: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, studentId: newStudentId } : s));
  };
  const toggleStudentActive = (studentId: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, active: !s.active } : s));
  };

  return (
    <AppContext.Provider value={{
      currentUser, students, absences, messages, calendar, warnings, classes, activities,
      login, logout, addAbsence, addMessage, markMessageRead, updateStudentId, toggleStudentActive
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
