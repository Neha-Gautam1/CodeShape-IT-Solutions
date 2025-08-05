import { useEffect, useState } from 'react';
import axios from 'axios';
import ParentSidebar from '../../components/ParentSidebar';
import { useAuth } from '../../context/AuthProvider';

const ParentDashboard = () => {
  const [tab, setTab] = useState('performance');
  const [authUser] = useAuth();
  const [performanceData, setPerformanceData] = useState([]);
  const [reports, setReports] = useState([]);
  const [timetables, setTimetables] = useState([]);

  const fetchPerformance = async () => {
    try {
      const res = await axios.get(`http://localhost:5002/api/users/parent-children/${authUser._id}`, {
        withCredentials: true,
      });

      const children = res.data.children;

      const allPerformance = await Promise.all(
        children.map(async (child) => {
          const perfRes = await axios.get(`http://localhost:5002/api/performance/student/${child._id}`, {
            withCredentials: true,
          });
          return {
            student: child,
            performance: perfRes.data,
          };
        })
      );

      setPerformanceData(allPerformance);
    } catch (err) {
      console.error('Error fetching performance:', err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/reports");
      setReports(res.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const fetchTimetables = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/timetable/all");
      setTimetables(res.data);
    } catch (err) {
      console.error('Error fetching timetable:', err);
    }
  };

  useEffect(() => {
    if (authUser?.role === 'parent') {
      fetchPerformance();
      fetchReports();
      fetchTimetables();
    }
  }, [authUser]);

  return (
    <div className="flex pt-16">
      <ParentSidebar activeTab={tab} setActiveTab={setTab} />
      <div className="ml-64 w-full min-h-screen p-8 bg-gradient-to-br from-purple-50 to-white">
        <h1 className="text-3xl font-bold text-purple-800 mb-8">Parent Dashboard</h1>

        {tab === 'performance' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-purple-700">Child’s Performance</h2>
            {performanceData.length === 0 ? (
              <p className="text-gray-500">No performance data available yet.</p>
            ) : (
              performanceData.map(({ student, performance }) => (
                <div key={student._id} className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">
                    {student.name} ({student.email})
                  </h3>
                  {performance.length === 0 ? (
                    <p className="text-gray-500">No records found for this student.</p>
                  ) : (
                    <table className="w-full border text-sm">
                      <thead className="bg-purple-100 text-purple-800">
                        <tr>
                          <th className="p-2 border">Subject</th>
                          <th className="p-2 border">Marks</th>
                          <th className="p-2 border">Attendance</th>
                          <th className="p-2 border">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performance.map((perf) => (
                          <tr key={perf._id}>
                            <td className="p-2 border">{perf.subjectId?.name}</td>
                            <td className="p-2 border">{perf.marks}</td>
                            <td className="p-2 border">{perf.attendance}%</td>
                            <td className="p-2 border">{perf.remarks || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'notices' && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">School Notices / Reports</h2>
            {reports.length === 0 ? (
              <p className="text-gray-600">No notices or reports available.</p>
            ) : (
              <ul className="space-y-3">
                {reports.map((report) => (
                  <li key={report._id} className="border-b pb-2">
                    <h4 className="text-lg font-bold text-purple-900">{report.title}</h4>
                    <p className="text-gray-700 text-sm">{report.description}</p>
                    {report.fileUrl && (
                      <a
                        href={`http://localhost:5002${report.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 text-sm underline"
                      >
                        View Report
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === 'events' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Class Timetables</h2>
            {timetables.length === 0 ? (
              <p className="text-gray-600">No timetables uploaded.</p>
            ) : (
              <ul className="list-disc ml-6 text-gray-700 space-y-2">
                {timetables.map((tt) => (
                  <li key={tt._id}>
                    <span className="font-medium">{tt.className}:</span>{" "}
                    <a
                      href={`http://localhost:5002/${tt.filePath || tt.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Timetable
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
