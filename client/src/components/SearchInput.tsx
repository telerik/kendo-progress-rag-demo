import React, { useState, useEffect } from "react";
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
  forceOneRow?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  query,
  onQueryChange,
  onKeyPress,
  onSearchClick,
  isLoading,
  placeholder,
  forceOneRow = false,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <TextArea
      style={{ 
        padding: "2px",
        whiteSpace: 'nowrap'
      }}
      className={'search-input k-white-space-none k-align-items-center k-flex-col k-flex-md-row k-w-full k-p-0.5'}
      rounded="full"
      size="large"
      placeholder={placeholder}
      value={query}
      onChange={onQueryChange}
      onKeyPress={onKeyPress}
      disabled={isLoading}
      rows={forceOneRow ? 1 : (isMobile ? 3 : 1)}
      autoSize={true}
      resizable={'none'}
      prefix={() => (
        <Button
          className="k-d-none k-d-md-inline-flex"
          rounded="full"
          svgIcon={plusIcon}
          size="large"
          fillMode="clear"
          style={{ padding: "11px"}}
        />
      )}
      suffix={() => (
        <>
          <Button
            className="k-d-none k-d-md-inline-flex"
            rounded="full"
            svgIcon={microphoneOutlineIcon}
            fillMode="clear"
            size="large"
            style={{ padding: "11px"}}
          />
          <Button
            className="send-button k-d-none k-d-md-inline-flex"
            rounded="full"
            svgIcon={arrowUpIcon}
            onClick={onSearchClick}
            disabled={isLoading}
            size="large"
            style={{ padding: "11px", color: '#fff', backgroundColor: '#A1B0C7'}}
          />
          <div className="k-d-flex k-d-md-none k-align-items-stretch k-w-full">
            <Button
              rounded="full"
              svgIcon={plusIcon}
              size="large"
              fillMode="clear"
              style={{ padding: "11px"}}
            />
            <Button
            rounded="full"
            svgIcon={microphoneOutlineIcon}
            fillMode="clear"
            size="large"
            style={{ padding: "11px"}}
          />
          <div className="k-spacer"></div>
          <Button
            className="send-button"
            rounded="full"
            svgIcon={arrowUpIcon}
            onClick={onSearchClick}
            disabled={isLoading}
            size="large"
            style={{ padding: "11px", color: '#fff', backgroundColor: '#A1B0C7'}}
          />

          </div>
        </>
      )}
    />
  );
};

export default SearchInput;
