import React from "react";
import { TextBox, type TextBoxProps, type TextBoxChangeEvent } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { plusIcon, microphoneOutlineIcon, arrowUpIcon } from "@progress/kendo-svg-icons";

interface SearchInputProps {
  query: TextBoxProps['value'];
  onQueryChange: (event: TextBoxChangeEvent) => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  onSearchClick: () => void;
  isLoading: boolean;
  placeholder: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  query,
  onQueryChange,
  onKeyPress,
  onSearchClick,
  isLoading,
  placeholder,
}) => {
  return (
    <TextBox
      style={{ 
        width: '100%'
      }}
      className={'search-input'}
      rounded="full"
      size="large"
      placeholder={placeholder}
      value={query}
      onChange={onQueryChange}
      onKeyPress={onKeyPress}
      disabled={isLoading}
      prefix={() => (
        <div className="k-d-flex k-align-items-center k-justify-content-center k-px-2">
          <Button
            rounded="full"
            fillMode="flat"
            svgIcon={plusIcon}
          />
        </div>
      )}
      suffix={() => (
        <div className="k-d-flex k-align-items-center k-justify-content-center k-px-2">
          <Button
            rounded="full"
            fillMode="flat" 
            svgIcon={microphoneOutlineIcon}
          />
          <Button
            style={{ 
              background: 'linear-gradient(143deg, #C158E4 19.85%, #001DFF 83.02%)',
              color: '#fff',
              border: 'none'
            }}
            rounded="full"
            svgIcon={arrowUpIcon}
            onClick={onSearchClick}
            disabled={isLoading}
          />
        </div>
      )}
    />
  );
};

export default SearchInput;
