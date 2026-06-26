import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import useWindowSize from "../hooks/useWindowSize";

function Notes() {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes/");
      setNotes(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await API.post("/notes/", { notes: newNote });
      setNotes([res.data, ...notes]);
      setNewNote("");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.notes);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await API.put(`/notes/${id}/`, { notes: editText });
      setNotes(notes.map((n) => (n.id === id ? res.data : n)));
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await API.delete(`/notes/${id}/`);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav
        style={{
          ...styles.navbar,
          padding: isMobile ? "0 16px" : "0px 40px",
        }}
      >
        {!isMobile && <h1 style={styles.navLogo}>🎮 MathQuest Arena</h1>}
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
      </nav>

      {/* Header */}
      <div
        style={{
          ...styles.headerCard,
          padding: isMobile ? "24px 16px" : "50px 20px 40px",
          marginTop: isMobile ? "82px" : "60px",
        }}
      >
        <h2 style={styles.pageTitle}>📓 My Notes</h2>
        <p style={styles.pageSubtitle}>
          Write and save your personal study notes!
        </p>
      </div>
      <div style={styles.main}>
        {/* Add Note */}
        <div style={styles.addCard}>
          <h3 style={styles.addTitle}>✏️ Write a new note</h3>
          <textarea
            style={styles.textarea}
            placeholder="Write your note here... e.g. 1 lakh = 1,00,000 has 5 zeros"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={4}
          />
          <button style={styles.addBtn} onClick={handleAdd}>
            + Save Note
          </button>
        </div>

        {/* Notes List */}
        <h3 style={styles.sectionTitle}>📋 My Notes ({notes.length})</h3>

        {notes.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📝</div>
            <p style={styles.emptyText}>
              No notes yet! Write your first note above.
            </p>
          </div>
        ) : (
          <div style={styles.notesList}>
            {notes.map((note) => (
              <div key={note.id} style={styles.noteCard}>
                {editingId === note.id ? (
                  /* Edit Mode */
                  <div>
                    <textarea
                      style={styles.editTextarea}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={4}
                    />
                    <div style={styles.editButtons}>
                      <button
                        style={styles.saveBtn}
                        onClick={() => handleUpdate(note.id)}
                      >
                        ✅ Save
                      </button>
                      <button
                        style={styles.cancelBtn}
                        onClick={() => setEditingId(null)}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div>
                    <p
                      style={{
                        ...styles.noteText,
                        fontSize: isMobile ? "16px" : "20px",
                      }}
                    >
                      {note.notes}
                    </p>
                    <div
                      style={{
                        ...styles.noteFooter,
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "flex-start" : "center",
                        gap: isMobile ? "8px" : "0",
                      }}
                    >
                      <span style={styles.noteDate}>
                        🕐 {formatDate(note.last_updated)}
                      </span>
                      <div style={styles.noteActions}>
                        <button
                          style={styles.editBtn}
                          onClick={() => handleEdit(note)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(note.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    // backgroundColor: '#f8fafc',
    backgroundColor: "#f1f5f9",
  },
  navbar: {
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    padding: "0px 40px",
    height: "82px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: "0 4px 15px rgba(99,102,241,0.2)",
  },
  navLogo: {
    color: "white",
    fontSize: "22px",
    margin: 0,
    fontWeight: "700",
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    padding: "8px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    transition: "0.3s",
  },
  loading: {
    textAlign: "center",
    padding: "100px",
    color: "#6366f1",
  },
  headerCard: {
    marginTop: "60px", // Navbar height ke barabar margin
    background: "linear-gradient(180deg, #bbdff7 0%, #ffffff 100%)",
    padding: "50px 20px 40px",
    textAlign: "center",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: "30px",
    color: "#333",
    margin: "0 0 8px 0",
  },
  pageSubtitle: {
    color: "#666",
    fontSize: "18px",
    margin: "0 0 8px 0",
  },
  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "32px 16px",
  },
  addCard: {},
  addTitle: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "12px",
  },
  textarea: {
    width: "100%",
    backgroundColor: "#fff",
    padding: "16px",
    border: "2px solid #e2e8f0", // Thinner, lighter border
    borderRadius: "12px",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  addBtn: {
    marginTop: "12px",
    marginBottom: "24px",
    padding: "10px 24px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "16px",
  },
  emptyState: {
    backgroundColor: "#f1f5f9", // Light blue-grey
    padding: "60px",
    borderRadius: "20px",
    textAlign: "center",
    border: "2px dashed #cbd5e1", // Dashed border looks better for empty states
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyText: {
    color: "#64748b", // Neutral grey
    fontSize: "16px",
    marginTop: "10px",
  },
  notesList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  noteCard: {
    backgroundColor: "#ffffff", // Clean white
    padding: "24px",
    borderRadius: "16px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    borderLeft: "6px solid #6366f1", // Vibrant purple/blue accent
    transition: "transform 0.2s ease", // Add this for a subtle lift effect
  },
  noteText: {
    fontSize: "20px", // Better reading size
    color: "#1e293b", // Dark slate
    lineHeight: "1.6",
    margin: "0 0 16px 0",
    whiteSpace: "pre-wrap",
  },
  noteFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteDate: {
    fontSize: "14px",
    color: "#0e0d0d",
  },
  noteActions: {
    display: "flex",
    gap: "8px",
  },
  editBtn: {
    padding: "6px 14px",
    backgroundColor: "#eef2ff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#4f46e5",
    fontWeight: "500",
  },
  deleteBtn: {
    padding: "6px 14px",
    backgroundColor: "#fff1f2",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#9f1239",
    fontWeight: "500",
  },
  editTextarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "18px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    lineHeight: "1.6",
    marginBottom: "12px",
  },
  editButtons: {
    display: "flex",
    gap: "8px",
  },
  saveBtn: {
    padding: "8px 20px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelBtn: {
    padding: "8px 20px",
    backgroundColor: "#f1f5f9",
    color: "#666",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default Notes;
