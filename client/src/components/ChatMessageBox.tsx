import React from "react";
import type { ChatMessageBoxProps, ChatSuggestion } from "@progress/kendo-react-conversational-ui";
import type { TextBoxChangeEvent } from "@progress/kendo-react-inputs";
import SearchInput from "./SearchInput";
import SearchPill from "./SearchPill";

interface ChatMessageBoxAdapterProps extends ChatMessageBoxProps {
  isLoading?: boolean;
  onSendMessage?: (text: string) => void;
  suggestions?: ChatSuggestion[];
  onSuggestionClick?: (suggestion: ChatSuggestion) => void;
  placeholder?: string;
}

export const ChatMessageBox: React.FC<ChatMessageBoxAdapterProps> = ({
  isLoading = false,
  onSendMessage,
  suggestions = [],
  onSuggestionClick,
  placeholder = 'Type a message...'
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleChange = (event: TextBoxChangeEvent) => {
    setInputValue(String(event.value || ''));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleSuggestionClick = (suggestion: ChatSuggestion) => {
    if (onSuggestionClick && !isLoading) {
      onSuggestionClick(suggestion);
    }
  };

  return (
    <div className="k-d-flex k-flex-column k-gap-3">
      <SearchInput
        query={inputValue}
        onQueryChange={handleChange}
        onKeyPress={handleKeyPress}
        onSearchClick={handleSend}
        isLoading={isLoading}
        placeholder={placeholder}
      />
      
      {suggestions.length > 0 && (
        <div 
          className="k-d-flex k-flex-wrap k-gap-1.5"
          style={{ width: '100%' }}
        >
          {suggestions.map((suggestion) => (
            <SearchPill
              key={suggestion.id}
              text={suggestion.text}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMessageBox;
