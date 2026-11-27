import styles from './SearchBar.module.css';

export default function SearchBar({ value = '', onSearch, placeholder = 'Поиск...' }) {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className={styles.search}>
      <input
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={styles.input}
        autoComplete="off"
      />
    </div>
  );
}
