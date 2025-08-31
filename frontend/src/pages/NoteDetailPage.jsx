import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
import axiosClient from "../api/axiosClient";
import NoteForm from "../components/NoteForm";
import toast from "react-hot-toast";

function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch note
  const fetchNote = async () => {
    try {
      const res = await axiosClient.get(`/notes/${id}`);
      setNote(res.data);
    } catch {
      toast.error("Failed to load note");
      navigate("/notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [id]);

  // Update note
  const handleUpdate = async (data) => {
    try {
      const res = await axiosClient.put(`/notes/${id}`, data);
      setNote(res.data);
      setEditing(false);
      toast.success("Note updated!");
    } catch {
      toast.error("Failed to update note");
    }
  };

  // Delete note
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axiosClient.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/notes");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!note) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Back + Actions */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/notes")}
            className="inline-flex items-center text-gray-600 hover:text-purple-600"
          >
            <ArrowLeft size={20} className="mr-1" /> Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 flex items-center gap-1 text-sm"
            >
              <Edit size={16} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-1 text-sm"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* Edit Mode */}
        {editing ? (
          <NoteForm
            initialData={note}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>

            {/* Meta */}
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>
                {new Date(note.created_at).toLocaleDateString()} •{" "}
                {note.tag || "No tag"}
              </span>
            </div>

            {/* Content */}
            <div className="mt-6 prose prose-purple max-w-none">
              <p className="whitespace-pre-line">{note.content}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NoteDetailPage;