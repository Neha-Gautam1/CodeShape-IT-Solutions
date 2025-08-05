import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [showForm, setShowForm] = useState(false);
  const [roleToAdd, setRoleToAdd] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', classId: '', parentId: '' });
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);

  const openForm = (role, user = null) => {
    setRoleToAdd(role);
    setShowForm(true);
    if (user) {
      setIsEditing(true);
      setEditUserId(user._id);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        classId: user.classId?._id || '',
        parentId: user.parentId || '',
      });
    } else {
      setIsEditing(false);
      setFormData({ name: '', email: '', password: '', classId: '', parentId: '' });
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setFormData({ name: '', email: '', password: '', classId: '', parentId: '' });
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/users/all', {
        withCredentials: true,
      });

      const combinedUsers = [
        ...res.data.teachers.map((user) => ({ ...user, role: 'Teacher' })),
        ...res.data.students.map((user) => ({ ...user, role: 'Student' })),
        ...res.data.parents.map((user) => ({ ...user, role: 'Parent' })),
      ];

      setUsers(combinedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err.response?.data?.message || err.message);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/classes/all');
      setClasses(res.data);
    } catch (err) {
      console.error('Failed to fetch classes:', err.response?.data?.message || err.message);
    }
  };

  const fetchParents = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/users/all', {
        withCredentials: true,
      });
      setParents(res.data.parents || []);
    } catch (err) {
      console.error('Failed to fetch parents:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: roleToAdd,
      };

      if (roleToAdd === 'student') {
        if (formData.classId) payload.classId = formData.classId;
        if (formData.parentId) payload.parentId = formData.parentId;
      }

      if (isEditing) {
        await axios.put(
          `http://localhost:5002/api/users/update/${roleToAdd}/${editUserId}`,
          payload,
          { withCredentials: true }
        );
        toast.success('User updated successfully!');
      } else {
        await axios.post('http://localhost:5002/api/users/add', payload, {
          withCredentials: true,
        });
        toast.success(`${roleToAdd} added successfully!`);
      }

      closeForm();
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (role, userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5002/api/users/delete/${role}/${userId}`, {
        withCredentials: true,
      });
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchClasses();
    fetchParents();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-8 pt-20 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">Manage Users</h2>

        <div className="space-x-4 mb-6">
          <button onClick={() => openForm('teacher')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Teacher</button>
          <button onClick={() => openForm('student')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Student</button>
          <button onClick={() => openForm('parent')} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Add Parent</button>
        </div>

        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-blue-100 text-blue-900 font-semibold">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Class (if student)</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-4 text-gray-500">No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="p-3 border text-gray-800">{user.name}</td>
                  <td className="p-3 border text-gray-800">{user.email}</td>
                  <td className="p-3 border text-gray-800 capitalize">{user.role}</td>
                  <td className="p-3 border text-gray-800">
                    {user.role === 'Student' ? user.classId?.name || 'Unassigned' : '—'}
                  </td>
                  <td className="p-3 border space-x-2">
                    <button className="text-blue-600 hover:underline" onClick={() => openForm(user.role.toLowerCase(), user)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(user.role.toLowerCase(), user._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 w-full max-w-md shadow-2xl border border-blue-100">
              <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                {isEditing ? 'Edit' : 'Add'} {roleToAdd.charAt(0).toUpperCase() + roleToAdd.slice(1)}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-transparent text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-transparent text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    {isEditing ? 'New Password (optional)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-transparent text-gray-800"
                    required={!isEditing}
                  />
                </div>

                {roleToAdd === 'student' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Assign Class</label>
                      <select
                        name="classId"
                        value={formData.classId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-transparent text-gray-800"
                        required
                      >
                        <option value="">-- Select Class --</option>
                        {classes.map((cls) => (
                          <option key={cls._id} value={cls._id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Assign Parent</label>
                      <select
                        name="parentId"
                        value={formData.parentId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-transparent text-gray-800"
                      >
                        <option value="">-- Select Parent --</option>
                        {parents.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} ({p.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                  >
                    {isEditing ? 'Update' : `Add ${roleToAdd}`}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="text-gray-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
