import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, placeholder = 'Поиск...' }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={styles.search}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className={styles.input}
      />
    </div>
  );
}
