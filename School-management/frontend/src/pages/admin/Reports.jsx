import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import toast from 'react-hot-toast';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "", description: "" });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchReports = async () => {
    const res = await axios.get("http://localhost:5002/api/reports");
    setReports(res.data);
  };

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("type", form.type);
    formData.append("description", form.description);
    if (file) formData.append("file", file);

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5002/api/reports/update/${editingId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Report updated");
      } else {
        await axios.post("http://localhost:5002/api/reports/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
       toast.success("Report added");
      }

      fetchReports();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save report");
    }
  };

  const resetForm = () => {
    setForm({ title: "", type: "", description: "" });
    setFile(null);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (report) => {
    setForm({
      title: report.title,
      type: report.type,
      description: report.description,
    });
    setFile(null);
    setShowForm(true);
    setEditingId(report._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    await axios.delete(`http://localhost:5002/api/reports/${id}`);
    fetchReports();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-8 pt-20 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Reports</h2>

        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Edit Report" : "Add Report"}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow mb-6 space-y-4"
          >
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInput}
              placeholder="Title"
              required
              className="w-full border p-2 rounded"
            />
            <select
              name="type"
              value={form.type}
              onChange={handleInput}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Type</option>
              <option>Attendance</option>
              <option>Performance</option>
              <option>Event</option>
              <option>Activity</option>
            </select>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInput}
              placeholder="Description"
              className="w-full border p-2 rounded"
            ></textarea>
            <input
              type="file"
              onChange={handleFile}
              accept="application/pdf"
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingId ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <table className="w-full bg-white border rounded shadow text-gray-800">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">File</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td className="p-3 border">{r.title}</td>
                <td className="p-3 border">{r.type}</td>
                <td className="p-3 border">{r.description}</td>
                <td className="p-3 border">
                  {r.fileUrl ? (
                    <a
                      href={`http://localhost:5002${r.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View PDF
                    </a>
                  ) : (
                    "No file"
                  )}
                </td>
                <td className="p-3 border space-x-3">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
