export type UserRole = 'parent' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  ic: string;
  role: UserRole;
  password: string;
}

export interface Parent extends User {
  role: 'parent';
  relationship: string;
  dependents: string[]; // student IDs
}

export interface Teacher extends User {
  role: 'teacher';
  assignedClass: string; // class ID
}

export interface Admin extends User {
  role: 'admin';
}

export interface Student {
  id: string;
  studentId: string; // ID Pelajar assigned by school
  name: string;
  dob: string;
  classId: string;
  parentId: string;
  active: boolean;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  teacherId: string;
}

export type AbsenceReason = 'Sakit' | 'Lewat Bangun' | 'Urusan Keluarga' | 'Kecemasan' | 'Tiada Kenderaan';

export interface AbsenceRecord {
  id: string;
  studentId: string;
  date: string;
  reason: AbsenceReason;
  mcUploaded: boolean;
  mcFile?: string;
  recordedBy: string; // user ID
  recordedByRole: UserRole;
  timestamp: string;
}

export type ActivityType = 'Mewakili Sekolah' | 'Mewakili Daerah' | 'Mewakili Bahagian/Negeri' | 'Aktiviti Rasmi Sekolah';

export interface OfficialActivity {
  id: string;
  studentId: string;
  date: string;
  type: ActivityType;
  description: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'Cuti Umum' | 'Cuti Sekolah' | 'Cuti Peristiwa' | 'Program Sekolah' | 'Hari Tidak Bersekolah';
  description?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderRole: UserRole;
  receiverId: string;
  receiverRole: UserRole;
  content: string;
  timestamp: string;
  read: boolean;
  studentId?: string;
}

export type WarningStatus = 'Normal' | 'Perhatian' | 'Amaran' | 'Tindakan Diperlukan';

export interface WarningRecord {
  studentId: string;
  consecutiveDays: number;
  totalAbsences: number;
  status: WarningStatus;
  lastWarning?: string;
  timeline: TimelineEntry[];
}

export interface TimelineEntry {
  date: string;
  event: string;
  type: 'absence' | 'warning' | 'action';
}

export interface KPI {
  totalStudents: number;
  present: number;
  absent: number;
  officialActivity: number;
  attendanceRate: number;
}
