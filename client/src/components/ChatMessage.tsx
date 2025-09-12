import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@progress/kendo-react-buttons';
import { SvgIcon } from '@progress/kendo-react-common';
import { copyIcon } from '@progress/kendo-svg-icons';
import type { ChatMessageTemplateProps } from '@progress/kendo-react-conversational-ui';

const ChatMessage: React.FC<ChatMessageTemplateProps> = ({ item }) => {
  // Determine if this message is from the sender (user) or bot
  const isSenderMessage = item.author.id === 1; // User ID is 1, Bot ID is 0
  
  // State for tracking copied status
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({});
  
  // Copy function
  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates(prev => ({ ...prev, [index]: true }));
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  
  // Define styling classes based on message author
  const messageClasses = isSenderMessage
    ? "k-chat-message-text k-bg-primary k-text-surface k-border k-border-solid k-border-primary-emphasis k-p-4 k-rounded-lg"
    : "k-chat-message-text k-bg-secondary-subtle k-border k-border-solid k-border-secondary-subtle k-p-4 k-rounded-lg";

  const parseMessage = (text: string) => {
    // Split the text by code blocks (```language\ncode\n```)
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const parts: (string | { type: 'code'; language: string; content: string })[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText.trim()) {
          parts.push(beforeText);
        }
      }

      // Add the code block
      const language = match[1] || 'text';
      const content = match[2].trim();
      parts.push({
        type: 'code',
        language,
        content
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last code block
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push(remainingText);
      }
    }

    return parts;
  };

  const renderInlineCode = (text: string) => {
    // Handle inline code with `code`
    const inlineCodeRegex = /`([^`]+)`/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = inlineCodeRegex.exec(text)) !== null) {
      // Add text before inline code
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add inline code with adaptive styling
      parts.push(
        <code
          key={`inline-${match.index}`}
          className={isSenderMessage 
            ? "k-font-mono k-px-1 k-py-0 k-rounded-sm k-bg-surface k-text-on-surface"
            : "k-font-mono k-px-1 k-py-0 k-rounded-sm"
          }
          style={isSenderMessage 
            ? undefined 
            : {
                backgroundColor: '#f5f5f5',
                fontSize: '0.9em'
              }
          }
        >
          {match[1]}
        </code>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const renderContent = () => {
    if (!item.text) return null;

    const parts = parseMessage(item.text);

    return parts.map((part, index) => {
      if (typeof part === 'string') {
        // Handle inline code in regular text
        const inlineCodeParts = renderInlineCode(part);
        return (
          <span key={index} className="k-d-block k-mb-2">
            {inlineCodeParts.map((inlinePart, inlineIndex) => (
              <React.Fragment key={`${index}-${inlineIndex}`}>
                {inlinePart}
              </React.Fragment>
            ))}
          </span>
        );
      } else if (part.type === 'code') {
        // Render code block with syntax highlighting
        // Use different themes and backgrounds based on message type
        const syntaxTheme = isSenderMessage ? vscDarkPlus : oneLight;
        const headerBg = isSenderMessage ? '#2d2d30' : '#f8f9fa';
        const headerColor = isSenderMessage ? '#cccccc' : '#495057';
        const headerBorder = isSenderMessage ? '#3e3e42' : '#dee2e6';
        const codeBg = isSenderMessage ? '#1e1e1e' : '#ffffff';
        
        return (
          <div key={index} className="k-mb-4">
            <div className="k-rounded-md k-overflow-hidden">
              <div 
                className="k-px-3 k-py-2 k-font-mono k-text-sm k-d-flex k-justify-content-between k-align-items-center" 
                style={{
                  backgroundColor: headerBg,
                  color: headerColor,
                  borderBottom: `1px solid ${headerBorder}`
                }}
              >
                <span>{part.language}</span>
                <Button
                  onClick={() => copyToClipboard(part.content, index)}
                  fillMode="flat"
                  size="small"
                  className="k-ml-2"
                  style={{
                    color: headerColor,
                    minHeight: '20px',
                    padding: '2px 4px'
                  }}
                  title={copiedStates[index] ? "Copied!" : "Copy code"}
                >
                  <SvgIcon icon={copyIcon} size="small" />
                  {copiedStates[index] && <span className="k-ml-1 k-text-xs">Copied!</span>}
                </Button>
              </div>
              <SyntaxHighlighter
                language={part.language}
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: '12px',
                  backgroundColor: codeBg,
                  fontSize: '0.9em'
                }}
                showLineNumbers={false}
                wrapLines={true}
                wrapLongLines={true}
              >
                {part.content}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="k-chat-message-content">
      <div className={messageClasses}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ChatMessage;