import { useState, useEffect } from 'react';
import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../NoteModal/NoteModal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '../../services/noteService';
import { Note } from '../../types/note';

interface NotesApiResponse  {
  notes: Note[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export default function App() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPage(1); 
  }, [debouncedSearchTerm]);

  const { data, isLoading, isError } = useQuery<NotesApiResponse, Error>({
    queryKey: ['notes', page, debouncedSearchTerm],
    queryFn: () => fetchNotes(page, debouncedSearchTerm),
    placeholderData: (previousData) => previousData,
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={setSearchTerm} />

        {totalPages > 1 && (
          <div className={css.paginationInline}>
            <Pagination
              pageCount={totalPages}
              forcePage={page - 1}
              onPageChange={({ selected }) => setPage(selected + 1)}
            />
          </div>
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <strong>Loading notes...</strong>}
      {isError && <div style={{ color: 'red' }}>Error loading notes</div>}
      {!isLoading && !isError && <NoteList items={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
