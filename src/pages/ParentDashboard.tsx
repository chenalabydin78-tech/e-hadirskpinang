import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student, AbsenceReason } from '../types';
import { Users, AlertTriangle, Calendar, TrendingUp, Upload, Send, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export default function ParentDashboard({ page }: { page: string }) {
  const { currentUser, students, absences, warnings, calendar, messages, addAbsence, addMessage, markMessageRead } = useApp();

  if (page === 'dashboard') return <ParentHome />;
  if (page === 'children') return <ChildrenView />;
  if (page === 'absence') return <AbsenceForm />;
  if (page === 'calendar') return <CalendarView />;
  if (page === 'mail') return <MailInbox />;
  return <ParentHome />;

  function ParentHome() {
    const parent = currentUser!;
    const myStudents = students.filter(s => (parent as any).dependents?.includes(s.id));
    const today = new Date().toISOString().split('T')[0];
    const todayAbsences = absences.filter(a => a.date === today);
    const totalActive = students.filter(s => s.active).length;
    const todayAbsent = todayAbsences.length;
    const attendanceRate = ((totalActive - todayAbsent) / totalActive * 100).toFixed(2);

    const myWarnings = warnings.filter(w => myStudents.some(s => s.id === w.studentId));

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Selamat Datang, {parent.name}</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Kehadiran Hari Ini" value={`${attendanceRate}%`} subtitle={`${totalActive - todayAbsent}/${totalActive} pelajar`} icon={CheckCircle} color="text-green-600 bg-green-50" />
          <KPICard title="Tidak Hadir Hari Ini" value={String(todayAbsent)} subtitle="pelajar" icon={XCircle} color="text-red-600 bg-red-50" />
          <KPICard title="Kehadiran Bulanan" value="94.2%" subtitle="November 2026" icon={TrendingUp} color="text-blue-600 bg-blue-50" />
          <KPICard title="Kehadiran Tahunan" value="95.8%" subtitle="Tahun 2026" icon={TrendingUp} color="text-purple-600 bg-purple-50" />
        </div>

        {/* Warning Indicators */}
        {myWarnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" />
              Indicator Amaran
            </h3>
            {myWarnings.map(w => {
              const student = students.find(s => s.id === w.studentId);
              return (
                <div key={w.studentId} className="flex items-center gap-3 p-3 bg-white rounded-lg mb-2">
                  <div className={`w-3 h-3 rounded-full ${w.status === 'Perhatian' ? 'bg-yellow-500' : w.status === 'Amaran' ? 'bg-orange-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium text-gray-800">{student?.name}</p>
                    <p className="text-sm text-gray-600">{w.lastWarning || `Status: ${w.status}`}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Children Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            Anak Saya
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myStudents.map(student => {
              const studentAbsences = absences.filter(a => a.studentId === student.id);
              const warning = warnings.find(w => w.studentId === student.id);
              return (
                <div key={student.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{student.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      warning?.status === 'Perhatian' ? 'bg-yellow-100 text-yellow-800' :
                      warning?.status === 'Amaran' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {warning?.status || 'Normal'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                  <p className="text-sm text-gray-500">Jumlah Tidak Hadir: {studentAbsences.length} hari</p>
                  {warning && <p className="text-sm text-amber-600 mt-1">Berturut-turut: {warning.consecutiveDays} hari</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function ChildrenView() {
    const parent = currentUser!;
    const myStudents = students.filter(s => (parent as any).dependents?.includes(s.id));

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Anak Saya</h2>
        {myStudents.map(student => {
          const studentAbsences = absences.filter(a => a.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date));
          const warning = warnings.find(w => w.studentId === student.id);
          const classInfo = student.classId;

          return (
            <div key={student.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-500">ID Pelajar: {student.studentId}</p>
                  <p className="text-sm text-gray-500">Kelas: {classInfo}</p>
                  <p className="text-sm text-gray-500">Tarikh Lahir: {student.dob}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  warning?.status === 'Perhatian' ? 'bg-yellow-100 text-yellow-800' :
                  warning?.status === 'Amaran' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {warning?.status || 'Normal'}
                </span>
              </div>

              {warning && warning.timeline.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline Kehadiran:</h4>
                  <div className="space-y-2">
                    {warning.timeline.slice(-5).reverse().map((entry, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full ${entry.type === 'absence' ? 'bg-red-400' : entry.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                        <span className="text-gray-500 w-24">{entry.date}</span>
                        <span className="text-gray-700">{entry.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sejarah Ketidakhadiran:</h4>
                {studentAbsences.length === 0 ? (
                  <p className="text-sm text-gray-500">Tiada rekod ketidakhadiran.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">Tarikh</th>
                          <th className="text-left py-2 px-3">Sebab</th>
                          <th className="text-left py-2 px-3">MC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentAbsences.map(a => (
                          <tr key={a.id} className="border-b">
                            <td className="py-2 px-3">{a.date}</td>
                            <td className="py-2 px-3">{a.reason}</td>
                            <td className="py-2 px-3">{a.mcUploaded ? '✓' : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function AbsenceForm() {
    const parent = currentUser!;
    const myStudents = students.filter(s => (parent as any).dependents?.includes(s.id));
    const [selectedStudent, setSelectedStudent] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reason, setReason] = useState<AbsenceReason>('Sakit');
    const [mcUploaded, setMcUploaded] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const reasons: AbsenceReason[] = ['Sakit', 'Lewat Bangun', 'Urusan Keluarga', 'Kecemasan', 'Tiada Kenderaan'];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedStudent) return;
      addAbsence({
        id: `ar_${Date.now()}`,
        studentId: selectedStudent,
        date,
        reason,
        mcUploaded: reason === 'Sakit' ? mcUploaded : false,
        recordedBy: parent.id,
        recordedByRole: 'parent',
        timestamp: new Date().toISOString(),
      });
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setSelectedStudent(''); }, 3000);
    };

    return (
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar Ketidakhadiran</h2>

        {submitted && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Rekod ketidakhadiran berjaya disimpan.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Anak</label>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Pilih Anak --</option>
              {myStudents.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              MC boleh dimuat naik dalam tempoh 3 hari dari tarikh ketidakhadiran.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sebab</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value as AbsenceReason)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            >
              {reasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {reason === 'Sakit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sijil MC</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Muat naik sijil MC (dalam tempoh 3 hari)</p>
                <label className="mt-2 inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-100 transition text-sm font-medium">
                  <input type="file" className="hidden" onChange={() => setMcUploaded(true)} />
                  Pilih Fail
                </label>
                {mcUploaded && <p className="text-green-600 text-sm mt-2">✓ Fail dimuat naik</p>}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Hantar
          </button>
        </form>
      </div>
    );
  }

  function CalendarView() {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Kalendar Sekolah</h2>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function MailInbox() {
    const parent = currentUser!;
    const myMessages = messages.filter(m =>
      (m.senderId === parent.id) || (m.receiverId === parent.id)
    ).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
      if (!newMessage.trim() || !selectedTeacher) return;
      addMessage({
        id: `msg_${Date.now()}`,
        senderId: parent.id,
        senderRole: 'parent',
        receiverId: selectedTeacher,
        receiverRole: 'teacher',
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false,
      });
      setNewMessage('');
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Mail Inbox</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
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
                  const isSent = msg.senderId === parent.id;
                  return (
                    <div key={msg.id} className={`p-4 ${!msg.read && !isSent ? 'bg-blue-50' : ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${isSent ? 'text-blue-600' : 'text-gray-800'}`}>
                          {isSent ? 'Anda' : 'Guru Kelas'}
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

          {/* Compose */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Hantar Mesej</h3>
            <select
              value={selectedTeacher}
              onChange={e => setSelectedTeacher(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm"
            >
              <option value="">-- Pilih Guru --</option>
              <option value="t1">Puan Noraini (4 Bestari)</option>
              <option value="t2">Encik Mohd Faizal (5 Cemerlang)</option>
              <option value="t3">Puan Lim Mei Ling (6 Maju)</option>
            </select>
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Taip mesej anda..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-32 resize-none"
            />
            <button
              onClick={handleSend}
              className="w-full mt-3 bg-blue-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition flex items-center justify-center gap-2"
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

function KPICard({ title, value, subtitle, icon: Icon, color }: { title: string; value: string; subtitle: string; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{title}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
