import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import { useFetchNotes } from '../../services/noteService';

function App() {
  const { notes, isLoading } = useFetchNotes();

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {isLoading && <strong>Loading notes...</strong>}
        {!isLoading && notes.length > 0 && <NoteList items={notes} />}
        {/* Пагінація */}
        {/* Кнопка створення нотатки */}
      </header>
    </div>
  );
}

export default App;
