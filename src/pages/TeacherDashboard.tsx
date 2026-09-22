import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AbsenceReason } from '../types';
import { Users, AlertTriangle, CheckCircle, XCircle, FileText, MessageSquare, Send, Edit, UserCheck, UserX, TrendingUp, Calendar } from 'lucide-react';

export default function TeacherDashboard({ page }: { page: string }) {
  if (page === 'dashboard') return <TeacherHome />;
  if (page === 'students') return <StudentList />;
  if (page === 'absence') return <AbsenceManagement />;
  if (page === 'warnings') return <WarningView />;
  if (page === 'reports') return <ReportView />;
  if (page === 'mail') return <TeacherMail />;
  return <TeacherHome />;

  function TeacherHome() {
    const { currentUser, students, absences, classes, warnings } = useApp();
    const teacher = currentUser!;
    const myClass = classes.find(c => c.teacherId === teacher.id);
    const myStudents = students.filter(s => s.classId === myClass?.id && s.active);
    const today = new Date().toISOString().split('T')[0];
    const todayAbsences = absences.filter(a => a.date === today && myStudents.some(s => s.id === a.studentId));
    const total = myStudents.length;
    const absent = todayAbsences.length;
    const present = total - absent;
    const rate = total > 0 ? ((present / total) * 100).toFixed(2) : '0';

    const myWarnings = warnings.filter(w => myStudents.some(s => s.id === w.studentId));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Guru Kelas</h2>
            <p className="text-gray-500">Kelas: {myClass?.name} ({myClass?.level})</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Jumlah Pelajar</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Users className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
            <p className="text-xs text-gray-500 mt-1">pelajar aktif</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Hadir Hari Ini</span>
              <div className="p-2 rounded-lg bg-green-50 text-green-600"><CheckCircle className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{present}</p>
            <p className="text-xs text-gray-500 mt-1">pelajar</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Tidak Hadir</span>
              <div className="p-2 rounded-lg bg-red-50 text-red-600"><XCircle className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{absent}</p>
            <p className="text-xs text-gray-500 mt-1">pelajar</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">% Kehadiran</span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><TrendingUp className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{rate}%</p>
            <p className="text-xs text-gray-500 mt-1">hari ini</p>
          </div>
        </div>

        {/* Warning Alerts */}
        {myWarnings.filter(w => w.status !== 'Normal').length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" />
              Trigger Amaran
            </h3>
            {myWarnings.filter(w => w.status !== 'Normal').map(w => {
              const student = students.find(s => s.id === w.studentId);
              return (
                <div key={w.studentId} className="flex items-center gap-3 p-3 bg-white rounded-lg mb-2">
                  <div className={`w-3 h-3 rounded-full ${w.status === 'Perhatian' ? 'bg-yellow-500' : 'bg-orange-500'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{student?.name}</p>
                    <p className="text-sm text-gray-600">{w.consecutiveDays} hari berturut-turut | Status: {w.status}</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:underline">Lihat Profil</button>
                </div>
              );
            })}
          </div>
        )}

        {/* Today's Absences */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Ketidakhadiran Hari Ini</h3>
          {todayAbsences.length === 0 ? (
            <p className="text-gray-500 text-sm">Semua pelajar hadir hari ini.</p>
          ) : (
            <div className="space-y-2">
              {todayAbsences.map(a => {
                const student = students.find(s => s.id === a.studentId);
                return (
                  <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{student?.name}</p>
                      <p className="text-sm text-gray-500">{a.reason} {a.mcUploaded && '(MC ✓)'}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      Oleh: {a.recordedByRole === 'parent' ? 'Ibu Bapa' : 'Guru'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  function StudentList() {
    const { currentUser, students, classes, updateStudentId, toggleStudentActive } = useApp();
    const teacher = currentUser!;
    const myClass = classes.find(c => c.teacherId === teacher.id);
    const myStudents = students.filter(s => s.classId === myClass?.id);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newId, setNewId] = useState('');

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Senarai Pelajar — {myClass?.name}</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID Pelajar</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nama</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tarikh Lahir</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {editingId === student.id ? (
                        <div className="flex gap-2">
                          <input
                            value={newId}
                            onChange={e => setNewId(e.target.value)}
                            className="border rounded px-2 py-1 text-sm w-32"
                          />
                          <button onClick={() => { updateStudentId(student.id, newId); setEditingId(null); }} className="text-green-600 text-sm">✓</button>
                          <button onClick={() => setEditingId(null)} className="text-red-600 text-sm">✗</button>
                        </div>
                      ) : (
                        <span className="text-sm font-mono">{student.studentId}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">{student.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{student.dob}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${student.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {student.active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(student.id); setNewId(student.studentId); }} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                          <Edit className="w-3 h-3" /> ID
                        </button>
                        <button onClick={() => toggleStudentActive(student.id)} className={`text-sm flex items-center gap-1 ${student.active ? 'text-red-600' : 'text-green-600'}`}>
                          {student.active ? <><UserX className="w-3 h-3" /> Nyahaktif</> : <><UserCheck className="w-3 h-3" /> Aktifkan</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function AbsenceManagement() {
    const { currentUser, students, classes, absences, addAbsence } = useApp();
    const teacher = currentUser!;
    const myClass = classes.find(c => c.teacherId === teacher.id);
    const myStudents = students.filter(s => s.classId === myClass?.id && s.active);
    const myAbsences = absences.filter(a => myStudents.some(s => s.id === a.studentId)).sort((a, b) => b.date.localeCompare(a.date));
    const [showForm, setShowForm] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reason, setReason] = useState<AbsenceReason>('Sakit');
    const [mcUploaded, setMcUploaded] = useState(false);

    const reasons: AbsenceReason[] = ['Sakit', 'Lewat Bangun', 'Urusan Keluarga', 'Kecemasan', 'Tiada Kenderaan'];

    const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      addAbsence({
        id: `ar_${Date.now()}`,
        studentId,
        date,
        reason,
        mcUploaded,
        recordedBy: teacher.id,
        recordedByRole: 'teacher',
        timestamp: new Date().toISOString(),
      });
      setShowForm(false);
      setStudentId('');
      setMcUploaded(false);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Rekod Ketidakhadiran</h2>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition">
            + Tambah Rekod
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h3 className="font-semibold text-gray-800">Tambah Ketidakhadiran</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pelajar</label>
                <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required>
                  <option value="">-- Pilih --</option>
                  {myStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sebab</label>
                <select value={reason} onChange={e => setReason(e.target.value as AbsenceReason)} className="w-full border rounded-lg px-3 py-2 text-sm">
                  {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {reason === 'Sakit' && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="mc" checked={mcUploaded} onChange={e => setMcUploaded(e.target.checked)} className="rounded" />
                  <label htmlFor="mc" className="text-sm text-gray-700">MC Dimuat Naik</label>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">Batal</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tarikh</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Pelajar</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sebab</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">MC</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Dicatat Oleh</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myAbsences.map(a => {
                  const student = students.find(s => s.id === a.studentId);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{a.date}</td>
                      <td className="py-3 px-4 text-sm">{student?.name}</td>
                      <td className="py-3 px-4 text-sm">{a.reason}</td>
                      <td className="py-3 px-4 text-sm">{a.mcUploaded ? '✓ Ada' : '-'}</td>
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

  function WarningView() {
    const { currentUser, students, classes, warnings } = useApp();
    const teacher = currentUser!;
    const myClass = classes.find(c => c.teacherId === teacher.id);
    const myStudents = students.filter(s => s.classId === myClass?.id);
    const myWarnings = warnings.filter(w => myStudents.some(s => s.id === w.studentId));

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Amaran Ketidakhadiran</h2>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Threshold Amaran</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Berturut-turut</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Amaran Pertama: Hari ke-3</li>
                <li>• Amaran Kedua: +7 hari</li>
                <li>• Amaran Terakhir: +7 hari</li>
                <li>• Buang Sekolah: +14 hari</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Berselang</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Amaran Pertama: Hari ke-10</li>
                <li>• Amaran Kedua: +10 hari</li>
                <li>• Amaran Terakhir: +20 hari</li>
                <li>• Buang Sekolah: +20 hari</li>
              </ul>
            </div>
          </div>
        </div>

        {myWarnings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-500">
            Tiada amaran untuk kelas ini.
          </div>
        ) : (
          myWarnings.map(w => {
            const student = students.find(s => s.id === w.studentId);
            return (
              <div key={w.studentId} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{student?.name}</h3>
                    <p className="text-sm text-gray-500">ID: {student?.studentId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    w.status === 'Normal' ? 'bg-green-100 text-green-800' :
                    w.status === 'Perhatian' ? 'bg-yellow-100 text-yellow-800' :
                    w.status === 'Amaran' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {w.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Berturut-turut</p>
                    <p className="text-lg font-bold text-gray-800">{w.consecutiveDays} hari</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Jumlah Ketidakhadiran</p>
                    <p className="text-lg font-bold text-gray-800">{w.totalAbsences} hari</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline:</h4>
                  <div className="space-y-2">
                    {w.timeline.map((entry, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full ${entry.type === 'absence' ? 'bg-red-400' : entry.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                        <span className="text-gray-500 w-24 flex-shrink-0">{entry.date}</span>
                        <span className="text-gray-700">{entry.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }

  function ReportView() {
    const { currentUser, students, classes, absences } = useApp();
    const teacher = currentUser!;
    const myClass = classes.find(c => c.teacherId === teacher.id);
    const myStudents = students.filter(s => s.classId === myClass?.id);
    const myAbsences = absences.filter(a => myStudents.some(s => s.id === a.studentId));

    // Group by reason
    const byReason: Record<string, number> = {};
    myAbsences.forEach(a => { byReason[a.reason] = (byReason[a.reason] || 0) + 1; });

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Laporan Kelas — {myClass?.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">Jumlah Rekod</p>
            <p className="text-2xl font-bold text-gray-800">{myAbsences.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">Pelajar Terkesan</p>
            <p className="text-2xl font-bold text-gray-800">{new Set(myAbsences.map(a => a.studentId)).size}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">MC Dimuat Naik</p>
            <p className="text-2xl font-bold text-gray-800">{myAbsences.filter(a => a.mcUploaded).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Mengikut Sebab</h3>
          <div className="space-y-3">
            {Object.entries(byReason).map(([reason, count]) => (
              <div key={reason} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 w-40">{reason}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(count / myAbsences.length) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-800 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Eksport PDF
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Eksport Excel
          </button>
        </div>
      </div>
    );
  }

  function TeacherMail() {
    const { currentUser, messages, addMessage, markMessageRead } = useApp();
    const teacher = currentUser!;
    const myMessages = messages.filter(m =>
      (m.senderId === teacher.id) || (m.receiverId === teacher.id)
    ).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    const [selectedParent, setSelectedParent] = useState('');
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
      if (!newMessage.trim() || !selectedParent) return;
      addMessage({
        id: `msg_${Date.now()}`,
        senderId: teacher.id,
        senderRole: 'teacher',
        receiverId: selectedParent,
        receiverRole: 'parent',
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false,
      });
      setNewMessage('');
    };

    const unreadCount = myMessages.filter(m => m.receiverId === teacher.id && !m.read).length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Mail Inbox</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount} belum dibaca</span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Perbualan
              </h3>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {myMessages.length === 0 ? (
                <p className="p-6 text-center text-gray-500">Tiada mesej.</p>
              ) : (
                myMessages.map(msg => {
                  const isSent = msg.senderId === teacher.id;
                  return (
                    <div
                      key={msg.id}
                      className={`p-4 cursor-pointer ${!msg.read && !isSent ? 'bg-blue-50' : ''}`}
                      onClick={() => !msg.read && markMessageRead(msg.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${isSent ? 'text-green-600' : 'text-gray-800'}`}>
                          {isSent ? 'Anda' : 'Ibu Bapa'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleString('ms-MY')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{msg.content}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Balas Mesej</h3>
            <select
              value={selectedParent}
              onChange={e => setSelectedParent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm"
            >
              <option value="">-- Pilih Ibu Bapa --</option>
              <option value="p1">Ahmad bin Ismail</option>
              <option value="p2">Siti Aminah binti Hassan</option>
              <option value="p3">Raj Kumar a/l Muthu</option>
            </select>
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Taip balasan..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-32 resize-none"
            />
            <button
              onClick={handleSend}
              className="w-full mt-3 bg-green-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Hantar
            </button>
          </div>
        </div>
      </div>
    );
  }
}
