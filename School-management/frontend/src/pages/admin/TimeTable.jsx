import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';

const Timetable = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [classes, setClasses] = useState([]);

  const handleClassChange = (e) => setSelectedClass(e.target.value);
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || !file) return toast.error('Please select class and file');

    const formData = new FormData();
    formData.append('className', selectedClass);
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5002/api/timetable/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      toast.success('Timetable uploaded successfully!');
      fetchTimetables();
      setSelectedClass('');
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/classes/all', {
        withCredentials: true
      });
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      toast.error('Error loading class list');
    }
  };

  const fetchTimetables = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/timetable/all', {
        withCredentials: true,
      });

      const filesMap = {};
      res.data.forEach(item => {
        filesMap[item.className] = item.filePath;
      });

      setUploadedFiles(filesMap);
    } catch (err) {
      console.error('Error fetching timetables:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTimetables();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-8 pt-20 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Upload Timetable</h2>

        <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="block w-full border p-2 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls.name}>{cls.name}</option>
            ))}
          </select>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full border p-2 rounded text-gray-700"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </form>

        <h3 className="text-xl font-semibold text-blue-800 mb-2">Uploaded Timetables</h3>
        <table className="w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-3 border">Class</th>
              <th className="p-3 border">Uploaded File</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id}>
                <td className="p-3 border text-gray-800">{cls.name}</td>
                <td className="p-3 border text-blue-600">
                  {uploadedFiles[cls.name] ? (
                    <a
                      href={`http://localhost:5002/${uploadedFiles[cls.name]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View PDF
                    </a>
                  ) : (
                    'No file uploaded'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
