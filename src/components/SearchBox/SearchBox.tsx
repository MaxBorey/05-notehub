import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import css from './SearchBox.module.css';

interface Props {
  onSearch: (searchTerm: string) => void;
}

export default function SearchBox({ onSearch }: Props) {
  const [value, setValue] = useState('');
  const [debounced] = useDebounce(value, 500);

  useEffect(() => { onSearch(debounced); }, [debounced, onSearch]);

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}