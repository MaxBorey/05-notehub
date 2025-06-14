import { useState, useEffect } from 'react';
import css from './NoteForm.module.css';
import { Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type NoteFormProps = {
  note?: Note; 
  onSuccess?: () => void;
};

export default function NoteForm({ note, onSuccess }: NoteFormProps) {
  const [form, setForm] = useState<Omit<Note, 'id'>>({
    title: '',
    content: '',
    tag: 'Todo',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (note) {
      setForm({
        title: note.title,
        content: note.content,
        tag: note.tag,
      });
    }
  }, [note]);

  const createMutation = useMutation({
    mutationFn: async (newNote: Omit<Note, 'id'>) => {
      const token = import.meta.env.VITE_SWAGER_TOKEN;
      const response = await axios.post('https://notehub-public.goit.study/api/notes', newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.note as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setForm({ title: '', content: '', tag: 'Todo' });
      onSuccess?.();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = import.meta.env.VITE_SWAGER_TOKEN;
      await axios.delete(`https://notehub-public.goit.study/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSuccess?.();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const handleCancel = () => {
    setForm({ title: '', content: '', tag: 'Todo' });
    onSuccess?.();
  };

  const handleDelete = () => {
    if (note && window.confirm('Ви точно хочете видалити цю нотатку?')) {
      console.log('Видаляємо нотатку з id:', note.id); 
      deleteMutation.mutate(note.id);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={form.title}
          onChange={handleChange}
          required
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={form.content}
          onChange={handleChange}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={form.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <span className={css.error} />
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={createMutation.isPending || deleteMutation.isPending}
        >
          Cancel
        </button>

        {note && (
          <button
            type="button"
            className={css.deleteButton}
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        )}

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Saving...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
