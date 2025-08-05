import { useEffect, useState } from 'react';
import axios from 'axios';
import TeacherSidebar from '../../components/TeacherSidebar';
import { useAuth } from '../../context/AuthProvider';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('grades');
  const [subjects, setSubjects] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [authUser] = useAuth();
  const [uploadedMaterials, setUploadedMaterials] = useState({});
const [announcements, setAnnouncements] = useState({});
  const [attendanceDate, setAttendanceDate] = useState('');
  const [materials, setMaterials] = useState({});
  const [announcementText, setAnnouncementText] = useState('');

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`http://localhost:5002/api/subjects/teacher/${authUser._id}`);
      setSubjects(res.data);

      const studentMap = {};
      const materialMap = {};
      const uploadedMap = {};
const announcementMap = {};


      for (const subj of res.data) {
        const classId = subj.classId._id;
        const stuRes = await axios.get(`http://localhost:5002/api/users/students/class/${classId}`, {
          withCredentials: true
        });

        studentMap[subj._id] = stuRes.data.map(student => ({
          ...student,
          marks: '',
          attendance: false,
          remarks: '',
          rollNumber: student.rollNumber || '',
          newRollNumber: ''
        }));

        materialMap[subj._id] = { title: '', file: null };

    // 🔹 Fetch materials
const matRes = await axios.get(`http://localhost:5002/api/materials/class/${classId}`);
uploadedMap[subj._id] = matRes.data.filter(m =>
  (typeof m.subjectId === 'object' ? m.subjectId._id : m.subjectId) === subj._id
);

// 🔹 Fetch announcements
const annRes = await axios.get(`http://localhost:5002/api/announcements/class/${classId}`);
announcementMap[subj._id] = annRes.data.filter(a =>
  (typeof a.subjectId === 'object' ? a.subjectId._id : a.subjectId) === subj._id
);


      }
 setUploadedMaterials(uploadedMap);
setAnnouncements(announcementMap);
      setStudentData(studentMap);
      setMaterials(materialMap);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  useEffect(() => {
    if (authUser?.role === 'teacher') {
      fetchSubjects();
    }
  }, [authUser]);

  const handleChange = (subjectId, studentId, field, value) => {
    setStudentData(prev => ({
      ...prev,
      [subjectId]: prev[subjectId].map(stu =>
        stu._id === studentId ? { ...stu, [field]: value } : stu
      )
    }));
  };

  const updateStudentRollNumber = async (subjectId, studentId, rollNumber) => {
    try {
      await axios.put(`http://localhost:5002/api/users/update-rollnumber/${studentId}`, {
        rollNumber
      }, { withCredentials: true });

      toast.success("Roll number updated!");

      setStudentData(prev => ({
        ...prev,
        [subjectId]: prev[subjectId].map(stu =>
          stu._id === studentId ? { ...stu, rollNumber, newRollNumber: '' } : stu
        )
      }));
    } catch (err) {
      console.error("Failed to update roll number", err);
      toast.error("Failed to update roll number");
    }
  };

  const handleSubmitGrades = async (subjectId, classId) => {
    const entries = studentData[subjectId];
    try {
      for (const stu of entries) {
        if (stu.marks || stu.attendance) {
          await axios.post('http://localhost:5002/api/performance/add', {
            studentId: stu._id,
            subjectId,
            classId,
            marks: stu.marks,
            attendance: stu.attendance,
            remarks: stu.remarks
          }, { withCredentials: true });
        }
      }
      toast.success('Grades submitted successfully!');
    } catch (err) {
      console.error('Failed to submit grades:', err);
      toast.error('Error submitting grades.');
    }
  };

  const handleSubmitAttendance = async (subjectId, classId) => {
    if (!attendanceDate) return toast.error("Please pick a date");

    const entries = studentData[subjectId];
    try {
      const records = entries.map(stu => ({
        studentId: stu._id,
        present: stu.attendance
      }));

      await axios.post('http://localhost:5002/api/attendance/mark', {
        date: attendanceDate,
        subjectId,
        records
      }, { withCredentials: true });

      toast.success('Attendance marked!');
    } catch (err) {
      console.error('Error submitting attendance:', err);
      toast.error('Failed to mark attendance');
    }
  };

 const handleMaterialUpload = async (subjectId, classId) => {
    const { title, file } = materials[subjectId];
    if (!file || !title) return toast.error("Please fill all fields");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('subjectId', subjectId);
    formData.append('classId', classId);
    formData.append('teacherId', authUser._id);

    try {
      await axios.post('http://localhost:5002/api/materials/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      toast.success('Material uploaded!');
      setMaterials(prev => ({
        ...prev,
        [subjectId]: { title: '', file: null }
      }));
    } catch (err) {
      toast.error('Upload failed');
      console.error(err);
    }
  };

  const handleAnnouncementSubmit = async (subjectId, classId) => {
    if (!announcementText.trim()) return;

    try {
      await axios.post('http://localhost:5002/api/announcements/add', {
        content: announcementText,
        subjectId,
        classId,
        teacherId: authUser._id
      });
      toast.success('Announcement sent!');
      setAnnouncementText('');
    } catch (err) {
      console.error('Failed to send announcement', err);
      toast.error('Failed to send announcement');
    }
  };

  // Update existing material
const handleMaterialUpdate = async (materialId, title, file) => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    if (file) formData.append('file', file);

    await axios.put(`http://localhost:5002/api/materials/update/${materialId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });

    toast.success("Material updated!");
    fetchSubjects(); // refresh
  } catch (err) {
    toast.error("Failed to update material");
    console.error(err);
  }
};

// Update announcement (if editing)
const handleAnnouncementUpdate = async (announcementId, content) => {
  try {
    await axios.put(`http://localhost:5002/api/announcements/update/${announcementId}`, { content }, {
      withCredentials: true,
    });
    toast.success("Announcement updated!");
    setAnnouncementText('');
    fetchSubjects();
  } catch (err) {
    toast.error("Failed to update announcement");
    console.error(err);
  }
};


  return (
    <div className="flex text-gray-900">
     
      <TeacherSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="ml-64 w-full min-h-screen p-8 pt-20 bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-3xl font-bold text-blue-800 mb-8">Teacher Dashboard</h1>

        {/* ✅ CLASSES TAB */}
        {activeTab === 'classes' && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-10">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Your Assigned Classes</h2>
            {subjects.map(subject => (
              <div key={subject._id} className="mb-8">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {subject.name} — {subject.classId?.name}
                </h3>
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Current Roll No</th>
                      <th className="p-2 border">New Roll No</th>
                      <th className="p-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData[subject._id]?.map(stu => (
                      <tr key={stu._id}>
                        <td className="p-2 border">{stu.name}</td>
                        <td className="p-2 border text-center">{stu.rollNumber || 'N/A'}</td>
                        <td className="p-2 border">
                          <input
                            type="number"
                            className="border rounded p-1 w-20"
                            value={stu.newRollNumber}
                            onChange={(e) => handleChange(subject._id, stu._id, 'newRollNumber', e.target.value)}
                          />
                        </td>
                        <td className="p-2 border text-center">
                          <button
                            onClick={() => updateStudentRollNumber(subject._id, stu._id, stu.newRollNumber)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                          >
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* ✅ GRADES TAB */}
        {activeTab === 'grades' && subjects.map(subject => (
          <div key={subject._id} className="bg-white p-6 rounded-xl shadow-md mb-10">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">{subject.name} — {subject.classId.name}</h2>
            <table className="w-full border text-sm">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Marks</th>
                  <th className="p-2 border">Attendance %</th>
                  <th className="p-2 border">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {studentData[subject._id]?.map((stu) => (
                  <tr key={stu._id}>
                    <td className="p-2 border">{stu.name}</td>
                    <td className="p-2 border">
                      <input type="number" value={stu.marks} onChange={(e) => handleChange(subject._id, stu._id, 'marks', e.target.value)} className="w-20 border rounded p-1" />
                    </td>
                    <td className="p-2 border">
                      <input type="number" value={stu.attendance} onChange={(e) => handleChange(subject._id, stu._id, 'attendance', e.target.value)} className="w-20 border rounded p-1" />
                    </td>
                    <td className="p-2 border">
                      <input type="text" value={stu.remarks} onChange={(e) => handleChange(subject._id, stu._id, 'remarks', e.target.value)} className="w-full border rounded p-1" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => handleSubmitGrades(subject._id, subject.classId._id)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Grades</button>
          </div>
        ))}

        {/* ✅ ATTENDANCE TAB */}
        {activeTab === 'attendance' && subjects.map(subject => (
          <div key={subject._id} className="bg-white p-6 rounded-xl shadow-md mb-10">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">{subject.name} — {subject.classId.name}</h2>
            <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="mb-4 border p-2 rounded" />
            <ul className="space-y-2">
              {studentData[subject._id]?.map(stu => (
                <li key={stu._id} className="flex justify-between bg-gray-50 p-2 rounded">
                  <span>{stu.name}</span>
                  <input type="checkbox" checked={stu.attendance} onChange={(e) => handleChange(subject._id, stu._id, 'attendance', e.target.checked)} />
                </li>
              ))}
            </ul>
            <button onClick={() => handleSubmitAttendance(subject._id, subject.classId._id)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit Attendance</button>
          </div>
        ))}

       {activeTab === 'materials' && subjects.map(subject => (
  <div key={subject._id} className="bg-white p-6 rounded-xl shadow-md mb-10">
    <h2 className="text-xl font-semibold text-blue-700 mb-4">{subject.name} — {subject.classId.name}</h2>

    <input
      type="text"
      placeholder="Material Title"
      className="w-full mb-3 p-2 border rounded text-gray-800"
      value={materials[subject._id]?.title || ''}
      onChange={(e) =>
        setMaterials(prev => ({
          ...prev,
          [subject._id]: { ...prev[subject._id], title: e.target.value }
        }))
      }
    />

    <input
      type="file"
      accept="application/pdf"
      className="mb-3"
      onChange={(e) =>
        setMaterials(prev => ({
          ...prev,
          [subject._id]: { ...prev[subject._id], file: e.target.files[0] }
        }))
      }
    />

    <button
      onClick={() => handleMaterialUpload(subject._id, subject.classId._id)}
      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
    >
      Upload
    </button>

    {/* Show previously uploaded materials */}
    <h4 className="mt-6 font-semibold text-gray-800">Uploaded Materials</h4>
    <ul className="space-y-2 mt-2">
      {uploadedMaterials[subject._id]?.map(mat => (
        <li key={mat._id} className="flex justify-between items-center border p-3 rounded bg-gray-50">
          <span>{mat.title}</span>
          <div className="flex gap-3">
            <a
              href={`http://localhost:5002${mat.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View
            </a>
            <button
              onClick={() => {
                setMaterials(prev => ({
                  ...prev,
                  [subject._id]: { title: mat.title, file: null, id: mat._id }
                }));
              }}
              className="text-sm text-orange-600 underline"
            >
              Edit
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
))}


        {/* ✅ ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && subjects.map(subject => (
  <div key={subject._id} className="bg-white p-6 rounded-xl shadow-md mb-10">
    <h2 className="text-xl font-semibold text-blue-700 mb-4">{subject.name} — {subject.classId.name}</h2>

    <textarea
      className="w-full h-24 p-2 border rounded"
      placeholder="Write your announcement..."
      value={announcementText}
      onChange={(e) => setAnnouncementText(e.target.value)}
    />

    <button
      onClick={() => handleAnnouncementSubmit(subject._id, subject.classId._id)}
      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      {materials[subject._id]?.id ? 'Update Announcement' : 'Send'}
    </button>

    <h4 className="mt-6 font-semibold text-gray-800">Previous Announcements</h4>
    <ul className="space-y-2 mt-2">
      {announcements[subject._id]?.map(ann => (
        <li key={ann._id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
          <span>{ann.content}</span>
          <button
            onClick={() => {
              setAnnouncementText(ann.content);
              setAnnouncements(prev => ({
                ...prev,
                [subject._id]: prev[subject._id].map(a =>
                  a._id === ann._id ? { ...a, isEditing: true } : a
                )
              }));
            }}
            className="text-orange-600 underline text-sm"
          >
            Edit
          </button>
        </li>
      ))}
    </ul>
  </div>
))}

      </div>
    </div>
  );
};

export default TeacherDashboard;
