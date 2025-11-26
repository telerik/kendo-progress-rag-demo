import React from 'react';
import type { ChatMessageTemplateProps } from '@progress/kendo-react-conversational-ui';
import { renderMarkdown } from '../utils/markdownRenderer';

const ChatMessage: React.FC<ChatMessageTemplateProps> = ({ item }) => {
  // Determine if this message is from the sender (user) or bot
  const isSenderMessage = item.author.id === 1; // User ID is 1, Bot ID is 0

  const renderContent = () => {
    if (!item.text) return null;

    // For bot messages, use markdown renderer with design system styling
    if (!isSenderMessage) {
      const markdownElements = renderMarkdown(item.text);
      return (
        <div style={{ fontSize: '20px', lineHeight: '1.2' }}>
          {markdownElements}
        </div>
      );
    }

    // For user messages, render with design styling
    return (
      <p style={{ 
        margin: 0,
        fontSize: '16px',
        lineHeight: '1.5',
        fontFamily: '"Metric", sans-serif',
        color: '#ffffff'
      }}>
        {item.text}
      </p>
    );
  };

  // Apply different styling for user vs bot messages
  if (isSenderMessage) {
    return (
      <div className="k-chat-message-content">
        <div
          className=" k-py-3 k-px-4"
          style={{
            backgroundColor: '#A1B0C7',
            color: '#ffffff',
            borderRadius: '12px 12px 2px 12px',
            maxWidth: '284px',
            fontSize: '16px',
            lineHeight: '1.5'
          }}
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  // Bot messages - no background, just text
  return (
    <div className="k-chat-message-content">
      <div className="k-chat-message-text k-text-base-on-subtle">
        {renderContent()}
      </div>
    </div>
  );
};

export default ChatMessage;