import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Note } from "../types/note"; 

interface NotesApiResponse {
  notes: Note[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export function useFetchNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = import.meta.env.VITE_SWAGER_TOKEN;
    setIsLoading(true);
    setIsError(false);
    axios.get<NotesApiResponse>(`https://notehub-public.goit.study/api/notes?page=${page}&perPage=12`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNotes(response.data.notes);
        setTotalPages(response.data.totalPages);
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [page]);

  const addNote = useCallback(async (newNote: Omit<Note, 'id'>) => {
    const token = import.meta.env.VITE_SWAGER_TOKEN;
    try {
      const response = await axios.post(
        "https://notehub-public.goit.study/api/notes",
        newNote,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes(prev => [response.data.note, ...prev]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return { notes, isLoading, isError, addNote, page, setPage, totalPages };
}
