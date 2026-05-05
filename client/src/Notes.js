import { useEffect, useState, useCallback } from "react";
import axios from "axios";

function Notes({ API }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = useCallback(async () => {
    const res = await axios.get(`${API}/notes`, {
      withCredentials: true
    });
    setNotes(res.data);
  }, [API]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async () => {
    await axios.post(
      `${API}/notes`,
      { title, content },
      { withCredentials: true }
    );

    setTitle("");
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API}/notes/${id}`, {
      withCredentials: true
    });

    fetchNotes();
  };

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />

      <button onClick={addNote}>Add Note</button>

      {notes.map(n => (
        <div key={n.id}>
          <h3>{n.title}</h3>
          <p>{n.content}</p>
          <button onClick={() => deleteNote(n.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Notes;