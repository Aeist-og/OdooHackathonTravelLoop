import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { StickyNote, Plus, Trash2, Clock } from 'lucide-react';

export default function TripNotes() {
  const { trips, addNote, deleteNote } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState(trips[0]?.id || '');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const trip = trips.find(t => t.id === selectedTrip);
  const notes = trip?.notes || [];

  const handleAdd = () => {
    if (!noteTitle.trim() || !selectedTrip) return;
    addNote(selectedTrip, { title: noteTitle.trim(), content: noteContent.trim() });
    setNoteTitle('');
    setNoteContent('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📝 Trip Notes</h1>
        <p>Jot down ideas, reminders, and memories for your trips.</p>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state glass-card-static">
          <div className="empty-state-icon"><StickyNote size={32} /></div>
          <h3>Create a trip first</h3>
          <p>You need at least one trip to add notes.</p>
        </div>
      ) : (
        <>
          <select className="form-input" value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}
            style={{ maxWidth: 300, marginBottom: 'var(--space-xl)' }}>
            {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <div className="glass-card-static" style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="form-group">
              <input type="text" className="form-input" placeholder="Note title..." value={noteTitle}
                onChange={e => setNoteTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <textarea className="form-input" placeholder="Write your note..." value={noteContent}
                onChange={e => setNoteContent(e.target.value)} rows={4} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleAdd}>
              <Plus size={14} /> Add Note
            </button>
          </div>

          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {notes.map(note => (
              <div key={note.id} className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>{note.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Clock size={12} />
                      {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteNote(selectedTrip, note.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
                {note.content && (
                  <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {note.content}
                  </p>
                )}
              </div>
            ))}
            {notes.length === 0 && (
              <div className="empty-state">
                <p>No notes yet. Start writing above!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
