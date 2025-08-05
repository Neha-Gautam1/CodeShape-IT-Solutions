import { useEffect, useState } from 'react';
import StudentSidebar from '../../components/StudentSidebar';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [authUser] = useAuth();
 const [announcements, setAnnouncements] = useState([]);

  const [grades, setGrades] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [attendance, setAttendance] = useState({ total: 0, present: 0, percentage: 0 });
  const [timetableUrl, setTimetableUrl] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (!authUser) return;

    const fetchAll = async () => {
      try {
        // Grades
        const gradeRes = await axios.get(`http://localhost:5002/api/performance/student/${authUser._id}`);
        setGrades(gradeRes.data);

        // Materials
        const classId = authUser.classId || authUser.class?._id;
if (!classId) return;

const materialRes = await axios.get(`http://localhost:5002/api/materials/class/${classId}`);

        setMaterials(materialRes.data);

        // Attendance
        const attRes = await axios.get(`http://localhost:5002/api/attendance/student/${authUser._id}`);
        setAttendance(attRes.data);

        // Timetable
        const timetableRes = await axios.get(`http://localhost:5002/api/timetable/class/${authUser.classId}`);
       if (timetableRes.data?.filePath) {
  setTimetableUrl(`http://localhost:5002/${timetableRes.data.filePath}`);
}
//announcements
const annRes = await axios.get(`http://localhost:5002/api/announcements/class/${classId}`);
setAnnouncements(annRes.data);

        // Feedbacks
        const fbRes = await axios.get(`http://localhost:5002/api/feedback/${authUser._id}`);
        setFeedbacks(fbRes.data);
      } catch (err) {
        console.error('Error fetching student data:', err);
      }
    };

    fetchAll();
  }, [authUser]);

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;

    try {
      await axios.post('http://localhost:5002/api/feedback', {
        studentId: authUser._id,
        content: feedback
      });

      setFeedback('');
      const fbRes = await axios.get(`http://localhost:5002/api/feedback/${authUser._id}`);
      setFeedbacks(fbRes.data);
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  return (
    <div className="flex">
      <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="ml-64 w-full min-h-screen p-8 pt-20 bg-gradient-to-br from-green-50 to-white">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Student Dashboard</h1>

        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-700">
            <h2 className="text-xl font-semibold text-green-700 mb-4">My Profile</h2>
            <p><strong>Name:</strong> {authUser?.name}</p>
            <p><strong>Class:</strong> {authUser?.class?.name || authUser?.classId}</p>
            <p><strong>Roll No:</strong> {authUser?.rollNumber || 'N/A'}</p>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-700">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Class Timetable</h2>
            {timetableUrl ? (
              <a
                href={timetableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                Download Timetable
              </a>
            ) : (
              <p>No timetable uploaded yet.</p>
            )}
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-700">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Grades</h2>
            {grades.length === 0 ? (
              <p>No grades available yet.</p>
            ) : (
              <ul className="text-gray-700 space-y-2">
                {grades.map((grade, idx) => (
                  <li key={idx} className="border-b pb-2">
                    <strong>{grade.subjectId?.name}</strong>: {grade.marks} marks — {grade.remarks}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-700">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Study Materials</h2>
            {materials.length === 0 ? (
              <p>No materials available.</p>
            ) : (
              <ul className="space-y-3">
                {materials.map((mat, idx) => (
                  <li key={idx} className="flex justify-between bg-green-50 p-3 rounded">
                    <span>{mat.title} ({mat.subjectId?.name})</span>
                    <a
                      href={`http://localhost:5002${mat.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-700">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Attendance</h2>
            <p>Total Classes: {attendance.total}</p>
            <p>Attended: {attendance.present}</p>
            <p className="text-green-600 font-semibold mt-2">Percentage: {attendance.percentage}%</p>
          </div>
        )}

        {activeTab === 'announcements' && (
  <div className="bg-white p-6 rounded-xl shadow text-gray-700">
    <h2 className="text-xl font-semibold text-green-700 mb-4">Announcements</h2>
    {announcements.length === 0 ? (
      <p>No announcements yet.</p>
    ) : (
      <ul className="space-y-3">
        {announcements.map((ann, idx) => (
          <li key={idx} className="bg-green-50 p-3 rounded">
            <p>{ann.content}</p>
            <p className="text-sm text-gray-500">Subject: {ann.subjectId?.name}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
)}


        {activeTab === 'feedback' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Submit Feedback</h2>
            <textarea
              rows={5}
              placeholder="Write your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2  text-gray-700focus:ring-green-300 bg-transparent"
            ></textarea>
            <button
              onClick={handleSubmitFeedback}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>

            {feedbacks.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-green-700 mb-2">Your Previous Feedback</h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  {feedbacks.slice().reverse().map((f, i) => (
                    <li key={i}>{f.content}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
