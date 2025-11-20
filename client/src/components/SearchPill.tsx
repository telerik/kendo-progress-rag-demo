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
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid white',
        borderRadius: '16px',
        padding: '13px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#000000',
        cursor: disabled ? 'not-allowed' : 'pointer',
        whiteSpace: 'nowrap',
        opacity: disabled ? 0.6 : 1,
        transition: 'background-color 0.2s ease',
        lineHeight: '1.42',
        boxShadow: 'var(--kendo-elevation-2)'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
      }}
    >
      {text}
    </button>
  );
};

export default SearchPill;