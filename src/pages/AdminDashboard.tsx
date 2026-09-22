import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AbsenceReason } from '../types';
import { Users, GraduationCap, BookOpen, AlertTriangle, Calendar, FileText, Settings, BarChart3, CheckCircle, XCircle, TrendingUp, Shield, Plus, Edit, Trash2, Activity } from 'lucide-react';

export default function AdminDashboard({ page }: { page: string }) {
  if (page === 'dashboard') return <AdminHome />;
  if (page === 'users') return <UsersManagement />;
  if (page === 'classes') return <ClassesManagement />;
  if (page === 'students') return <StudentsManagement />;
  if (page === 'absences') return <AbsencesManagement />;
  if (page === 'calendar') return <CalendarManagement />;
  if (page === 'reports') return <ReportsView />;
  if (page === 'activities') return <ActivitiesView />;
  if (page === 'settings') return <SettingsView />;
  return <AdminHome />;

  function AdminHome() {
    const { students, absences, classes, warnings } = useApp();
    const today = new Date().toISOString().split('T')[0];
    const todayAbsences = absences.filter(a => a.date === today);
    const totalActive = students.filter(s => s.active).length;
    const todayAbsent = todayAbsences.length;
    const present = totalActive - todayAbsent;
    const rate = totalActive > 0 ? ((present / totalActive) * 100).toFixed(2) : '0';

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard PK HEM</h2>
          <p className="text-gray-500">SK Demo — Pantauan Keseluruhan</p>
        </div>

        {/* Main KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Pelajar Aktif</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Users className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{totalActive}</p>
            <p className="text-xs text-gray-500 mt-1">daripada {students.length} keseluruhan</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Hadir Hari Ini</span>
              <div className="p-2 rounded-lg bg-green-50 text-green-600"><CheckCircle className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{present}</p>
            <p className="text-xs text-gray-500 mt-1">Kehadiran: {rate}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Tidak Hadir</span>
              <div className="p-2 rounded-lg bg-red-50 text-red-600"><XCircle className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{todayAbsent}</p>
            <p className="text-xs text-gray-500 mt-1">Ketidakhadiran: {(100 - parseFloat(rate)).toFixed(2)}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Amaran Aktif</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600"><AlertTriangle className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{warnings.filter(w => w.status !== 'Normal').length}</p>
            <p className="text-xs text-gray-500 mt-1">pelajar dalam perhatian</p>
          </div>
        </div>

        {/* By Class */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Kehadiran Mengikut Kelas — Hari Ini</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Kelas</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Guru</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Jumlah</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Hadir</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Tidak Hadir</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">% Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {classes.map(cls => {
                  const classStudents = students.filter(s => s.classId === cls.id && s.active);
                  const classAbsent = todayAbsences.filter(a => classStudents.some(s => s.id === a.studentId));
                  const classPresent = classStudents.length - classAbsent.length;
                  const classRate = classStudents.length > 0 ? ((classPresent / classStudents.length) * 100).toFixed(1) : '0';
                  return (
                    <tr key={cls.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">{cls.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{cls.level}</td>
                      <td className="py-3 px-4 text-sm text-center">{classStudents.length}</td>
                      <td className="py-3 px-4 text-sm text-center text-green-600">{classPresent}</td>
                      <td className="py-3 px-4 text-sm text-center text-red-600">{classAbsent.length}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-sm font-medium ${parseFloat(classRate) >= 95 ? 'text-green-600' : parseFloat(classRate) >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {classRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Prestasi Bulanan (2026)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'].map((month, i) => {
              const rates = [96.2, 95.8, 94.5, 93.1, 95.0, 96.5, 95.3, 94.8, 95.1, 96.0, 94.2, 0];
              const rate = rates[i];
              return (
                <div key={month} className="text-center p-3 border rounded-lg">
                  <p className="text-xs text-gray-500">{month}</p>
                  <p className={`text-lg font-bold ${rate === 0 ? 'text-gray-300' : rate >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {rate === 0 ? '-' : `${rate}%`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Warnings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Amaran Terkini</h3>
          <div className="space-y-2">
            {warnings.filter(w => w.status !== 'Normal').map(w => {
              const student = students.find(s => s.id === w.studentId);
              const cls = classes.find(c => c.id === student?.classId);
              return (
                <div key={w.studentId} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${w.status === 'Perhatian' ? 'bg-yellow-500' : w.status === 'Amaran' ? 'bg-orange-500' : 'bg-red-500'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{student?.name}</p>
                    <p className="text-xs text-gray-500">{cls?.name} — {w.consecutiveDays} hari berturut-turut</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    w.status === 'Perhatian' ? 'bg-yellow-100 text-yellow-800' :
                    w.status === 'Amaran' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>{w.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function UsersManagement() {
    const { students } = useApp();
    const [tab, setTab] = useState<'parents' | 'teachers'>('parents');

    const parents = [
      { id: 'p1', name: 'Ahmad bin Ismail', email: 'ahmad@email.com', phone: '0123456789', dependents: 2 },
      { id: 'p2', name: 'Siti Aminah binti Hassan', email: 'siti@email.com', phone: '0198765432', dependents: 1 },
      { id: 'p3', name: 'Raj Kumar a/l Muthu', email: 'raj@email.com', phone: '0112233445', dependents: 1 },
    ];

    const teachers = [
      { id: 't1', name: 'Puan Noraini binti Abdullah', email: 'noraini@school.edu.my', class: '4 Bestari' },
      { id: 't2', name: 'Encik Mohd Faizal bin Omar', email: 'faizal@school.edu.my', class: '5 Cemerlang' },
      { id: 't3', name: 'Puan Lim Mei Ling', email: 'meiling@school.edu.my', class: '6 Maju' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Pengurusan Pengguna</h2>
          <button className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Pengguna
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab('parents')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'parents' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
            Ibu Bapa ({parents.length})
          </button>
          <button onClick={() => setTab('teachers')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'teachers' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
            Guru ({teachers.length})
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {tab === 'parents' ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nama</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Emel</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Telefon</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Tanggungan</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {parents.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{p.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{p.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{p.phone}</td>
                    <td className="py-3 px-4 text-sm text-center">{p.dependents}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 text-sm hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nama</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Emel</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Kelas</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teachers.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{t.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{t.email}</td>
                    <td className="py-3 px-4 text-sm">{t.class}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 text-sm hover:underline mr-3">Edit</button>
                      <button className="text-purple-600 text-sm hover:underline">Tukar Kelas</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  function ClassesManagement() {
    const { classes } = useApp();
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Pengurusan Kelas</h2>
          <button className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Kelas
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map(cls => (
            <div key={cls.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{cls.name}</h3>
                  <p className="text-sm text-gray-500">{cls.level}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Guru Kelas: {cls.teacherId === 't1' ? 'Puan Noraini' : cls.teacherId === 't2' ? 'Encik Faizal' : 'Puan Lim'}</p>
              <div className="mt-4 flex gap-2">
                <button className="text-blue-600 text-sm hover:underline flex items-center gap-1"><Edit className="w-3 h-3" /> Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function StudentsManagement() {
    const { students, classes, toggleStudentActive } = useApp();
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Pengurusan Pelajar</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nama</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Kelas</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tarikh Lahir</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map(s => {
                  const cls = classes.find(c => c.id === s.classId);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-mono">{s.studentId}</td>
                      <td className="py-3 px-4 text-sm">{s.name}</td>
                      <td className="py-3 px-4 text-sm">{cls?.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{s.dob}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${s.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {s.active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button onClick={() => toggleStudentActive(s.id)} className={`text-sm ${s.active ? 'text-red-600' : 'text-green-600'} hover:underline`}>
                          {s.active ? 'Nyahaktif' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function AbsencesManagement() {
    const { students, absences, classes } = useApp();
    const sorted = [...absences].sort((a, b) => b.date.localeCompare(a.date));

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Semua Rekod Ketidakhadiran</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tarikh</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Pelajar</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Kelas</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sebab</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">MC</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Dicatat Oleh</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sorted.map(a => {
                  const student = students.find(s => s.id === a.studentId);
                  const cls = classes.find(c => c.id === student?.classId);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{a.date}</td>
                      <td className="py-3 px-4 text-sm">{student?.name}</td>
                      <td className="py-3 px-4 text-sm">{cls?.name}</td>
                      <td className="py-3 px-4 text-sm">{a.reason}</td>
                      <td className="py-3 px-4 text-sm text-center">{a.mcUploaded ? '✓' : '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{a.recordedByRole === 'parent' ? 'Ibu Bapa' : 'Guru'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function CalendarManagement() {
    const { calendar } = useApp();
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Kalendar Sekolah</h2>
          <button className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Event
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="space-y-3">
            {calendar.map(event => (
              <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold ${
                  event.type === 'Cuti Umum' ? 'bg-red-500' :
                  event.type === 'Cuti Sekolah' ? 'bg-blue-500' :
                  event.type === 'Program Sekolah' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}>
                  <span>{new Date(event.date).toLocaleDateString('ms-MY', { day: 'numeric' })}</span>
                  <span className="text-[10px]">{new Date(event.date).toLocaleDateString('ms-MY', { month: 'short' })}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{event.title}</h4>
                  <p className="text-sm text-gray-500">{event.type} {event.description && `— ${event.description}`}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 text-sm hover:underline"><Edit className="w-4 h-4" /></button>
                  <button className="text-red-600 text-sm hover:underline"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function ReportsView() {
    const { students, absences, classes } = useApp();
    const totalActive = students.filter(s => s.active).length;
    
    // By reason
    const byReason: Record<string, number> = {};
    absences.forEach(a => { byReason[a.reason] = (byReason[a.reason] || 0) + 1; });

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Laporan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">Jumlah Rekod</p>
            <p className="text-2xl font-bold text-gray-800">{absences.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">Kehadiran Tahunan</p>
            <p className="text-2xl font-bold text-gray-800">95.8%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">MC Disahkan</p>
            <p className="text-2xl font-bold text-gray-800">{absences.filter(a => a.mcUploaded).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Ketidakhadiran Mengikut Sebab</h3>
          <div className="space-y-3">
            {Object.entries(byReason).map(([reason, count]) => (
              <div key={reason} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 w-40">{reason}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${(count / absences.length) * 100}%` }}>
                    <span className="text-xs text-white font-medium">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Laporan Tersedia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Laporan Harian', 'Laporan Mingguan', 'Laporan Bulanan', 'Laporan Tahunan',
              'Mengikut Kelas', 'Mengikut Pelajar', 'Mengikut Sebab', 'MC / Dokumen',
              'Amaran Ketidakhadiran', 'Audit Log'
            ].map(report => (
              <div key={report} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-gray-700">{report}</span>
                <div className="flex gap-2">
                  <button className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100">PDF</button>
                  <button className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100">Excel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function ActivitiesView() {
    const { activities, students } = useApp();
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Aktiviti Rasmi</h2>
          <button className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Aktiviti
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Kategori Aktiviti</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Mewakili Sekolah', 'Mewakili Daerah', 'Mewakili Bahagian/Negeri', 'Aktiviti Rasmi Sekolah'].map(cat => (
              <div key={cat} className="p-3 border rounded-lg text-center">
                <Activity className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-gray-700">{cat}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tarikh</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Pelajar</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Jenis</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Keterangan</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {activities.map(a => {
                const student = students.find(s => s.id === a.studentId);
                return (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{a.date}</td>
                    <td className="py-3 px-4 text-sm">{student?.name}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{a.type}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{a.description}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 text-sm hover:underline">Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function SettingsView() {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Tetapan Sistem</h2>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Threshold Amaran</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Berturut-turut</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 w-40">Amaran Pertama:</label>
                  <input type="number" defaultValue={3} className="border rounded px-3 py-1 w-20 text-sm" />
                  <span className="text-sm text-gray-500">hari</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 w-40">Amaran Kedua:</label>
                  <input type="number" defaultValue={7} className="border rounded px-3 py-1 w-20 text-sm" />
                  <span className="text-sm text-gray-500">hari selepas</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 w-40">Amaran Terakhir:</label>
                  <input type="number" defaultValue={7} className="border rounded px-3 py-1 w-20 text-sm" />
                  <span className="text-sm text-gray-500">hari selepas</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 w-40">Buang Sekolah:</label>
                  <input type="number" defaultValue={14} className="border rounded px-3 py-1 w-20 text-sm" />
                  <span className="text-sm text-gray-500">hari selepas</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Berselang</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 w-40">Amaran Pertama:</label>
                  <input type="number" defaultValue={10} className="border rounded px-3 py-1 w-20 text-sm" />
                  <span className="text-sm text-gray-500">hari</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 w-40">Amaran Kedua:</label>
                  <input type="number" defaultValue={10} className="border rounded px-3 py-1 w-20 text-sm" />
                  <span className="text-sm text-gray-500">hari selepas</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 w-40">Amaran Terakhir:</label>
                  <input type="number" defaultValue={20} className="border rounded px-3 py-1 w-20 text-sm" />
                  <span className="text-sm text-gray-500">hari selepas</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 w-40">Buang Sekolah:</label>
                  <input type="number" defaultValue={20} className="border rounded px-3 py-1 w-20 text-sm" />
                  <span className="text-sm text-gray-500">hari selepas</span>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-6 bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-800">
            Simpan Tetapan
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Tempoh Muat Naik MC</h3>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Tempoh:</label>
            <input type="number" defaultValue={3} className="border rounded px-3 py-1 w-20 text-sm" />
            <span className="text-sm text-gray-500">hari dari tarikh ketidakhadiran</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Audit Log</h3>
          <div className="space-y-2">
            {[
              { time: '10:30', user: 'Ahmad bin Ismail', action: 'Daftar ketidakhadiran - Nur Aisyah (Sakit)' },
              { time: '09:15', user: 'Puan Noraini', action: 'Kemaskini ID Pelajar - STD2024005' },
              { time: '08:45', user: 'Siti Aminah', action: 'Muat naik MC - Aminah' },
              { time: '08:00', user: 'Sistem', action: 'Warning Engine: 3 hari berturut-turut - Nur Aisyah' },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-lg text-sm">
                <span className="text-gray-400 w-16">{log.time}</span>
                <span className="text-gray-700 font-medium w-40">{log.user}</span>
                <span className="text-gray-600">{log.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
