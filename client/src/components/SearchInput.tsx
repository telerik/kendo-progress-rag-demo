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
  bordered?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  query,
  onQueryChange,
  onKeyPress,
  onSearchClick,
  isLoading,
  placeholder,
  bordered = false
}) => {
  return (
    <TextBox
      style={{ 
        borderColor: bordered ? '#A1B0C7' : 'rgba(0, 0, 0, 0.5)',
        ...(bordered ? { borderWidth: '2px', backgroundColor: 'white' } : {}),
        width: '100%'
      }}
      className={bordered ? 'k-py-2 k-px-2' : 'k-p-2 k-elevation-2'}
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
            style={{ backgroundColor: bordered ? '#A1B0C7' : 'rgba(0, 0, 0, 0.5)', color: '#fff'}}
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
