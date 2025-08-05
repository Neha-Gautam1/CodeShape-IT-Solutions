import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageClasses = () => {
  const [showForm, setShowForm] = useState(false);
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/classes/all', { withCredentials: true });
      setClasses(res.data);
    } catch (err) {
      toast.error('Error fetching classes');
    }
  };

  const handleAddOrEdit = async () => {
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:5002/api/classes/update/${editId}`,
          { name: className },
          { withCredentials: true }
        );
        toast.success('Class updated successfully');
      } else {
        await axios.post(
          'http://localhost:5002/api/classes/add',
          { name: className },
          { withCredentials: true }
        );
        toast.success('Class added successfully');
      }

      fetchClasses();
      setClassName('');
      setShowForm(false);
      setEditMode(false);
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await axios.delete(`http://localhost:5002/api/classes/delete/${id}`, { withCredentials: true });
      toast.success('Class deleted successfully');
      fetchClasses();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (id, name) => {
    setEditId(id);
    setClassName(name);
    setEditMode(true);
    setShowForm(true);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-8 pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">Manage Classes</h2>
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Add Class
        </button>

        <ul className="space-y-4">
          {classes.map((cls) => (
            <li key={cls._id} className="p-4 bg-white rounded shadow border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-semibold text-gray-900">{cls.name}</span>
                <div className="space-x-3">
                  <button onClick={() => handleEdit(cls._id, cls.name)} className="text-blue-700 font-medium">Edit</button>
                  <button onClick={() => handleDelete(cls._id)} className="text-red-700 font-medium">Delete</button>
                </div>
              </div>
              <p className="text-gray-800"><strong>Subjects:</strong> {cls.subjects?.map(s => s.name).join(', ') || 'None'}</p>
              <p className="text-gray-800"><strong>Students:</strong> {cls.students?.map(s => s.name).join(', ') || 'None'}</p>
            </li>
          ))}
        </ul>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-xl w-full max-w-md">
              <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                {editMode ? 'Edit Class' : 'Add Class'}
              </h3>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Class Name"
                className="w-full px-4 py-2 border border-gray-400 rounded text-gray-900"
              />
              <div className="flex justify-between mt-6">
                <button
                  onClick={handleAddOrEdit}
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setClassName('');
                    setShowForm(false);
                    setEditMode(false);
                  }}
                  className="text-gray-700 hover:underline"
                >
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

export default ManageClasses;
