import React from "react";

interface SearchPillProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const SearchPill: React.FC<SearchPillProps> = ({ text, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="search-pill"
    >
      {text}
    </button>
  );
};

export default SearchPill;