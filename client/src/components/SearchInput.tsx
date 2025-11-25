import React from "react";
import { TextArea, type TextAreaProps, type TextAreaChangeEvent } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { plusIcon, microphoneOutlineIcon, arrowUpIcon } from "@progress/kendo-svg-icons";

interface SearchInputProps {
  query: TextAreaProps['value'];
  onQueryChange: (event: TextAreaChangeEvent) => void;
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
    <TextArea
      style={{ 
        width: '100%',
        padding: "7px",
        whiteSpace: 'nowrap'
      }}
      className={'search-input k-white-space-none k-align-items-center k-flex-col k-flex-md-row'}
      rounded="full"
      size="large"
      placeholder={placeholder}
      value={query}
      onChange={onQueryChange}
      onKeyPress={onKeyPress}
      disabled={isLoading}
      rows={1}
      resizable={'none'}
      prefix={() => (
        <Button
          className="k-d-none k-d-md-inline-flex"
          rounded="full"
          fillMode="flat"
          svgIcon={plusIcon}
          size="large"
          style={{ padding: "14px"}}
        />
      )}
      suffix={() => (
        <>
          <Button
            className="k-d-none k-d-md-inline-flex"
            rounded="full"
            fillMode="flat" 
            svgIcon={microphoneOutlineIcon}
            
            size="large"
            style={{ padding: "14px"}}
          />
          <Button
            className="send-button k-d-none k-d-md-inline-flex"
            rounded="full"
            svgIcon={arrowUpIcon}
            onClick={onSearchClick}
            disabled={isLoading}
            size="large"
            style={{ padding: "14px", color: '#fff', backgroundColor: '#A1B0C7'}}
          />
          <div className="k-d-flex k-d-md-none k-align-items-stretch k-w-full">
            <Button
              rounded="full"
              fillMode="flat"
              svgIcon={plusIcon}
              size="large"
              style={{ padding: "14px"}}
            />
            <Button
            rounded="full"
            fillMode="flat" 
            svgIcon={microphoneOutlineIcon}
            
            size="large"
            style={{ padding: "14px"}}
          />
          <div class="k-spacer"></div>
          <Button
            className="send-button"
            rounded="full"
            svgIcon={arrowUpIcon}
            onClick={onSearchClick}
            disabled={isLoading}
            size="large"
            style={{ padding: "14px", color: '#fff', backgroundColor: '#A1B0C7'}}
          />

          </div>
        </>
      )}
    />
  );
};

export default SearchInput;
