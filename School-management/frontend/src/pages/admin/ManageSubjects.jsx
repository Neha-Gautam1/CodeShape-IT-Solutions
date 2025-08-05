import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageSubjects = () => {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState(null);

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/classes/all', { withCredentials: true });
      setClasses(res.data);
      if (res.data.length > 0) setSelectedClass(res.data[0]._id);
    } catch (err) {
      console.error('Error fetching classes', err);
    }
  };

  // Fetch subjects
  const fetchSubjects = async (classId) => {
    try {
      const res = await axios.get(`http://localhost:5002/api/subjects/class/${classId}`, {
        withCredentials: true,
      });
      setSubjects(res.data);
    } catch (err) {
      console.error('Error fetching subjects', err);
    }
  };

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/users/all', {
        withCredentials: true,
      });
      const onlyTeachers = res.data.teachers || [];
      setTeachers(onlyTeachers);
    } catch (err) {
      console.error('Error fetching teachers', err);
    }
  };

  const handleSaveSubject = async () => {
    if (!subject || !selectedClass || !selectedTeacher) return alert('All fields are required');

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:5002/api/subjects/update/${editSubjectId}`,
          { name: subject, teacherId: selectedTeacher },
          { withCredentials: true }
        );
        toast.success('Subject updated successfully!');
      } else {
        await axios.post(
          'http://localhost:5002/api/subjects/add',
          { name: subject, classId: selectedClass, teacherId: selectedTeacher },
          { withCredentials: true }
        );
        toast.success('Subject added successfully!');
      }
      fetchSubjects(selectedClass);
      closeForm();
    } catch (err) {
      console.error('Error saving subject', err);
      toast.error('Failed to save subject');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5002/api/subjects/delete/${id}`, {
        withCredentials: true,
      });
      fetchSubjects(selectedClass);
      toast.success('Subject deleted successfully');
    } catch (err) {
      toast.error('Failed to delete subject');
    }
  };

  const handleEdit = (subj) => {
    setSubject(subj.name);
    setSelectedTeacher(subj.teacherId?._id || '');
    setEditSubjectId(subj._id);
    setEditMode(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSubject('');
    setSelectedTeacher('');
    setEditMode(false);
    setEditSubjectId(null);
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchSubjects(selectedClass);
  }, [selectedClass]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-8 pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">Manage Subjects</h2>

        {/* Class Dropdown */}
        <div className="mb-6">
          <label className="text-lg font-medium text-gray-700 mr-4">Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Subject
        </button>

        {/* Subjects Table */}
        <table className="w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-blue-100 text-blue-800 font-semibold">
              <th className="p-3 border">Subject</th>
              <th className="p-3 border">Teacher</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 p-4">
                  No subjects found.
                </td>
              </tr>
            ) : (
              subjects.map((subj) => (
                <tr key={subj._id}>
                  <td className="p-3 border text-gray-800">{subj.name}</td>
                  <td className="p-3 border text-gray-800">{subj.teacherId?.name || 'N/A'}</td>
                  <td className="p-3 border space-x-3">
                    <button className="text-blue-600" onClick={() => handleEdit(subj)}>Edit</button>
                    <button className="text-red-600" onClick={() => handleDelete(subj._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md">
              <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                {editMode ? 'Edit Subject' : 'Add Subject'}
              </h3>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject Name"
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800 mb-4"
              />

              <div className="mb-6">
                <label className="text-gray-700 font-medium block mb-1">Assign Teacher</label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handleSaveSubject}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button onClick={closeForm} className="text-gray-600 hover:underline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSubjects;
