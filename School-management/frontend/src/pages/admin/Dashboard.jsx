import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Users
        const userRes = await axios.get('http://localhost:5002/api/users/all', {
          withCredentials: true,
        });
        const { teachers, students, parents } = userRes.data;
        setUserCount(teachers.length + students.length + parents.length);

        // Classes
        const classRes = await axios.get('http://localhost:5002/api/classes/all', {
          withCredentials: true,
        });
        setClassCount(classRes.data.length);

        // Subjects
        const subjectRes = await axios.get('http://localhost:5002/api/subjects/all', {
          withCredentials: true,
        });
        setSubjectCount(subjectRes.data.length);

      } catch (err) {
        console.error('Error fetching dashboard data:', err.response?.data?.message || err.message);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 pt-20">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 border-b pb-2">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition duration-300 border-l-4 border-blue-600">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Users</h2>
            <p className="text-4xl font-bold text-blue-700">{userCount}</p>
            <p className="text-sm text-gray-500 mt-2">Teachers, Students & Parents</p>
          </div>

          {/* Total Classes */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition duration-300 border-l-4 border-green-600">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Classes</h2>
            <p className="text-4xl font-bold text-green-700">{classCount}</p>
            <p className="text-sm text-gray-500 mt-2">All active classes</p>
          </div>

          {/* Total Subjects */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition duration-300 border-l-4 border-purple-600">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Subjects</h2>
            <p className="text-4xl font-bold text-purple-700">{subjectCount}</p>
            <p className="text-sm text-gray-500 mt-2">Subjects offered across classes</p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">Quick Overview</h3>
          <p className="text-gray-600">
            This dashboard will soon show real-time data visualizations like attendance graphs, activity summaries,
            and admin logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
