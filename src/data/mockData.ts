import { Parent, Teacher, Admin, Student, SchoolClass, AbsenceRecord, CalendarEvent, Message, WarningRecord, OfficialActivity } from '../types';

export const mockParents: Parent[] = [
  { id: 'p1', name: 'Ahmad bin Ismail', email: 'ahmad@email.com', phone: '0123456789', ic: '800101015123', role: 'parent', password: 'parent123', relationship: 'Bapa', dependents: ['s1', 's2'] },
  { id: 'p2', name: 'Siti Aminah binti Hassan', email: 'siti@email.com', phone: '0198765432', ic: '850202015456', role: 'parent', password: 'parent123', relationship: 'Ibu', dependents: ['s3'] },
  { id: 'p3', name: 'Raj Kumar a/l Muthu', email: 'raj@email.com', phone: '0112233445', ic: '780303015789', role: 'parent', password: 'parent123', relationship: 'Bapa', dependents: ['s4'] },
];

export const mockTeachers: Teacher[] = [
  { id: 't1', name: 'Puan Noraini binti Abdullah', email: 'noraini@school.edu.my', phone: '0134567890', ic: '820404015012', role: 'teacher', password: 'teacher123', assignedClass: 'c1' },
  { id: 't2', name: 'Encik Mohd Faizal bin Omar', email: 'faizal@school.edu.my', phone: '0145678901', ic: '840505015345', role: 'teacher', password: 'teacher123', assignedClass: 'c2' },
  { id: 't3', name: 'Puan Lim Mei Ling', email: 'meiling@school.edu.my', phone: '0156789012', ic: '860606015678', role: 'teacher', password: 'teacher123', assignedClass: 'c3' },
];

export const mockAdmin: Admin = {
  id: 'a1', name: 'Tuan Haji Razak bin Kamal', email: 'razak@school.edu.my', phone: '0167890123', ic: '750707015901', role: 'admin', password: 'admin123'
};

export const mockClasses: SchoolClass[] = [
  { id: 'c1', name: '4 Bestari', level: 'Tahun 4', teacherId: 't1' },
  { id: 'c2', name: '5 Cemerlang', level: 'Tahun 5', teacherId: 't2' },
  { id: 'c3', name: '6 Maju', level: 'Tahun 6', teacherId: 't3' },
];

export const mockStudents: Student[] = [
  { id: 's1', studentId: 'STD2024001', name: 'Nur Aisyah binti Ahmad', dob: '2014-03-15', classId: 'c1', parentId: 'p1', active: true },
  { id: 's2', studentId: 'STD2024002', name: 'Muhammad Haziq bin Ahmad', dob: '2016-07-22', classId: 'c1', parentId: 'p1', active: true },
  { id: 's3', studentId: 'STD2024003', name: 'Aminah binti Hassan', dob: '2014-11-08', classId: 'c2', parentId: 'p2', active: true },
  { id: 's4', studentId: 'STD2024004', name: 'Priya a/p Raj Kumar', dob: '2013-05-30', classId: 'c3', parentId: 'p3', active: true },
  { id: 's5', studentId: 'STD2024005', name: 'Tan Wei Ming', dob: '2014-09-12', classId: 'c1', parentId: 'p2', active: true },
  { id: 's6', studentId: 'STD2024006', name: 'Siti Nurhaliza binti Yusof', dob: '2014-01-25', classId: 'c1', parentId: 'p3', active: true },
  { id: 's7', studentId: 'STD2024007', name: 'Kumar a/l Subramaniam', dob: '2013-12-03', classId: 'c3', parentId: 'p1', active: true },
  { id: 's8', studentId: 'STD2024008', name: 'Fatimah binti Ali', dob: '2013-08-18', classId: 'c3', parentId: 'p2', active: true },
  { id: 's9', studentId: 'STD2024009', name: 'Lee Chong Wei', dob: '2014-06-10', classId: 'c1', parentId: 'p3', active: true },
  { id: 's10', studentId: 'STD2024010', name: 'Zainab binti Mohd', dob: '2013-04-20', classId: 'c3', parentId: 'p1', active: true },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
const fourDaysAgo = new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0];
const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0];

export const mockAbsences: AbsenceRecord[] = [
  { id: 'ar1', studentId: 's1', date: today, reason: 'Sakit', mcUploaded: true, recordedBy: 'p1', recordedByRole: 'parent', timestamp: new Date().toISOString() },
  { id: 'ar2', studentId: 's1', date: yesterday, reason: 'Sakit', mcUploaded: true, recordedBy: 'p1', recordedByRole: 'parent', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'ar3', studentId: 's1', date: twoDaysAgo, reason: 'Sakit', mcUploaded: false, recordedBy: 'p1', recordedByRole: 'parent', timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'ar4', studentId: 's4', date: today, reason: 'Lewat Bangun', mcUploaded: false, recordedBy: 'p3', recordedByRole: 'parent', timestamp: new Date().toISOString() },
  { id: 'ar5', studentId: 's4', date: yesterday, reason: 'Urusan Keluarga', mcUploaded: false, recordedBy: 't3', recordedByRole: 'teacher', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'ar6', studentId: 's7', date: today, reason: 'Kecemasan', mcUploaded: false, recordedBy: 'p1', recordedByRole: 'parent', timestamp: new Date().toISOString() },
  { id: 'ar7', studentId: 's5', date: threeDaysAgo, reason: 'Sakit', mcUploaded: true, recordedBy: 't1', recordedByRole: 'teacher', timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'ar8', studentId: 's6', date: fourDaysAgo, reason: 'Tiada Kenderaan', mcUploaded: false, recordedBy: 'p3', recordedByRole: 'parent', timestamp: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'ar9', studentId: 's3', date: today, reason: 'Sakit', mcUploaded: false, recordedBy: 'p2', recordedByRole: 'parent', timestamp: new Date().toISOString() },
];

export const mockActivities: OfficialActivity[] = [
  { id: 'oa1', studentId: 's3', date: today, type: 'Mewakili Sekolah', description: 'Pertandingan Pidato Peringkat Daerah' },
  { id: 'oa2', studentId: 's8', date: yesterday, type: 'Mewakili Daerah', description: 'Olahraga MSSD Negeri' },
];

export const mockCalendar: CalendarEvent[] = [
  { id: 'cal1', title: 'Cuti Hari Keputeraan YDP Agong', date: '2026-06-01', type: 'Cuti Umum' },
  { id: 'cal2', title: 'Cuti Pertengahan Penggal 1', date: '2026-03-14', type: 'Cuti Sekolah', description: '14-22 Mac 2026' },
  { id: 'cal3', title: 'Hari Sukan Tahunan', date: '2026-07-15', type: 'Program Sekolah', description: 'Dewan Sekolah' },
  { id: 'cal4', title: 'Cuti Hari Raya Aidilfitri', date: '2026-04-20', type: 'Cuti Umum', description: '20-21 April 2026' },
  { id: 'cal5', title: 'Peperiksaan Pertengahan Tahun', date: '2026-05-18', type: 'Program Sekolah', description: '18-22 Mei 2026' },
  { id: 'cal6', title: 'Majlis Anugerah Cemerlang', date: '2026-09-10', type: 'Program Sekolah' },
  { id: 'cal7', title: 'Cuti Deepavali', date: '2026-11-05', type: 'Cuti Umum' },
  { id: 'cal8', title: 'Cuti Akhir Tahun', date: '2026-12-05', type: 'Cuti Sekolah', description: '5 Dis - 4 Jan 2027' },
];

export const mockMessages: Message[] = [
  { id: 'm1', senderId: 'p1', senderRole: 'parent', receiverId: 't1', receiverRole: 'teacher', content: 'Assalamualaikum Puan, Aisyah tidak sihat hari ini. Saya telah muat naik sijil MC.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true, studentId: 's1' },
  { id: 'm2', senderId: 't1', senderRole: 'teacher', receiverId: 'p1', receiverRole: 'parent', content: 'Waalaikumussalam. Terima kasih makluman. Semoga Aisyah cepat sembuh.', timestamp: new Date(Date.now() - 1800000).toISOString(), read: true, studentId: 's1' },
  { id: 'm3', senderId: 'p2', senderRole: 'parent', receiverId: 't2', receiverRole: 'teacher', content: 'Selamat pagi Cikgu, Aminah akan hadir ke sekolah lewat sedikit hari ini kerana urusan doktor gigi.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: false, studentId: 's3' },
];

export const mockWarnings: WarningRecord[] = [
  {
    studentId: 's1',
    consecutiveDays: 3,
    totalAbsences: 3,
    status: 'Perhatian',
    lastWarning: 'Perhatian — anak anda telah mencapai 3 hari ketidakhadiran berturut-turut.',
    timeline: [
      { date: twoDaysAgo, event: 'Ketidakhadiran - Sakit', type: 'absence' },
      { date: yesterday, event: 'Ketidakhadiran - Sakit', type: 'absence' },
      { date: today, event: 'Ketidakhadiran - Sakit (MC dimuat naik)', type: 'absence' },
      { date: today, event: 'Amaran: 3 hari berturut-turut - Status Perhatian', type: 'warning' },
    ]
  },
  {
    studentId: 's4',
    consecutiveDays: 2,
    totalAbsences: 2,
    status: 'Normal',
    timeline: [
      { date: yesterday, event: 'Ketidakhadiran - Urusan Keluarga', type: 'absence' },
      { date: today, event: 'Ketidakhadiran - Lewat Bangun', type: 'absence' },
    ]
  },
  {
    studentId: 's7',
    consecutiveDays: 1,
    totalAbsences: 1,
    status: 'Normal',
    timeline: [
      { date: today, event: 'Ketidakhadiran - Kecemasan', type: 'absence' },
    ]
  },
];
