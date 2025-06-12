import { useEffect, useState } from "react";
import axios from "axios";
import { Note } from "../types/note"; 

export function useFetchNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = import.meta.env.VITE_SWAGER_TOKEN;
    setIsLoading(true);
    axios
      .get("https://notehub-public.goit.study/api/notes?page=1&perPage=12", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setNotes(response.data.notes))
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, []);

  return { notes, isLoading };
}