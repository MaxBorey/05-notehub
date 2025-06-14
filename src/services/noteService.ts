// src/services/noteService.ts
import axios from "axios";
import { Note } from "../types/note";

interface NotesApiResponse {
  notes: Note[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

const API_URL = 'https://notehub-public.goit.study/api/notes';

const token = import.meta.env.VITE_SWAGER_TOKEN;
const headers = { Authorization: `Bearer ${token}` };

export async function fetchNotes(page: number, search: string = ''): Promise<NotesApiResponse> {
  const response = await axios.get(API_URL, {
    params: {
      page,
      perPage: 12,
      ...(search ? { search } : {}),
    },
    headers,
  });

  return response.data;
}

export async function createNote(newNote: Omit<Note, 'id'>): Promise<Note> {
  const response = await axios.post(API_URL, newNote, { headers });
  return response.data.note;
}

export async function deleteNote(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`, { headers });
}
