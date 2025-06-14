import { useState } from 'react';
import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../NoteModal/NoteModal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Note } from '../../types/note';

type NotesApiResponse = {
  notes: Note[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

const PER_PAGE = 12;

const fetchNotes = async (page: number, search: string): Promise<NotesApiResponse> => {
  const token = import.meta.env.VITE_SWAGER_TOKEN;

  try {
    const res = await axios.get('https://notehub-public.goit.study/api/notes', {
      params: {
        page,
        perPage: PER_PAGE,
        ...(search ? { search } : {}),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('fetchNotes error:', error);
    throw error;
  }
};

export default function App() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<NotesApiResponse, Error>({
    queryKey: ['notes', page, searchTerm],
    queryFn: () => fetchNotes(page, searchTerm),
    staleTime: 1000 * 60,
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={setSearchTerm} />

        <div className={css.paginationInline}>
          <Pagination
            pageCount={totalPages}
            forcePage={page - 1}
            onPageChange={({ selected }) => setPage(selected + 1)}
          />
        </div>

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <strong>Loading notes...</strong>}
      {isError && <div style={{ color: 'red' }}>Error loading notes</div>}
      {!isLoading && !isError && <NoteList items={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
