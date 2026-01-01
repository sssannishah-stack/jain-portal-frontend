import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { Layout, Card, Button, Select, DatePicker, Spinner } from '../../components/Components';
import { Check, Calendar, Search } from 'lucide-react';

export function AdminAttendance() {
  const { t } = useTranslation();
  const { students, fetchStudents, adminMarkAttendance } = useApp();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [markingId, setMarkingId] = useState(null);
  
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchStudents();
      setIsLoading(false);
    };
    load();
  }, []);
  
  const handleMarkAttendance = async (studentId = null) => {
    const id = studentId || selectedStudent;
    if (!id || !selectedDate) return;
    
    if (studentId) {
      setMarkingId(studentId);
    } else {
      setSubmitting(true);
    }
    
    await adminMarkAttendance(id, selectedDate);
    
    if (studentId) {
      setMarkingId(null);
    } else {
      setSubmitting(false);
      setSelectedStudent('');
    }
  };
  
  const filteredStudents = (students || []).filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout title={t('attendance')} isAdmin>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mark Attendance Form */}
        <Card title={t('markAttendance')}>
          <div className="space-y-4">
            <DatePicker
              label={t('selectDate')}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
            
            <Select
              label={t('selectMember')}
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              options={(students || []).map(s => ({
                value: s._id,
                label: `${s.name} ${s.familyId?.name ? `(${s.familyId.name})` : ''}`
              }))}
              placeholder={t('selectMember')}
              required
            />
            
            <Button
              onClick={() => handleMarkAttendance()}
              loading={submitting}
              disabled={!selectedStudent || !selectedDate}
              className="w-full"
              icon={Check}
            >
              {t('markAttendance')}
            </Button>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Admin marked attendance is automatically approved
              </p>
            </div>
          </div>
        </Card>
        
        {/* Quick Mark for Students */}
        <Card title={t('students')}>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`${t('search')}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    {student.familyId?.name && (
                      <p className="text-sm text-gray-500">{student.familyId.name}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAttendance(student._id)}
                    loading={markingId === student._id}
                    icon={Calendar}
                  >
                    {t('mark')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

export default AdminAttendance;