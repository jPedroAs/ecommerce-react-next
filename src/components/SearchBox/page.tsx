"use client";
import styles from "./searchbox.module.css";
import { IoSearch } from "react-icons/io5";

interface SearchBoxProps {
  query: string;
  setQuery: (q: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ query, setQuery }) => {
  return (
    <>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Pesquisar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IoSearch className={styles.i} />
      </div>
    </>
  );
};

export default SearchBox;