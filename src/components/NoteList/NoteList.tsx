import css from './NoteList.module.css';
import { Note } from '../../types/note';

interface NoteListProps {
  items: Note[];
}

export default function NoteList({items}: NoteListProps) {
  return (
    <ul className={css.list}>
      {items.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.button}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
