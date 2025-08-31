// src/pages/NotesPage.jsx
import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axiosClient.get("/notes");
      setNotes(res.data);
    } catch {
      toast.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create new note
  const handleCreate = async (data) => {
    try {
      const res = await axiosClient.post("/notes", data);
      setNotes([res.data, ...notes]);
      setAdding(false);
      toast.success("Note created!");
    } catch {
      toast.error("Failed to create note");
    }
  };

  // Update note
  const handleUpdate = async (data) => {
    try {
      const res = await axiosClient.put(`/notes/${editingNote.id}`, data);
      setNotes(notes.map((n) => (n.id === editingNote.id ? res.data : n)));
      setEditingNote(null);
      toast.success("Note updated!");
    } catch {
      toast.error("Failed to update note");
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await axiosClient.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n.id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  // Filter notes
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tag?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Note */}
        <div className="mb-8">
          {adding ? (
            <NoteForm
              onSubmit={handleCreate}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl shadow"
            >
              <Plus size={20} /> Create a note
            </button>
          )}
        </div>

        {/* Edit Note */}
        {editingNote && (
          <NoteForm
            initialData={editingNote}
            onSubmit={handleUpdate}
            onCancel={() => setEditingNote(null)}
          />
        )}

        {/* Notes grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNotes.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">
              {searchTerm ? "No notes match your search." : "No notes yet."}
            </p>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => setEditingNote(note)}
                onDelete={() => handleDelete(note.id)}
                onClick={() => navigate(`/notes/${note.id}`)} // go to detail
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesPage;
