import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Simple markdown renderer for basic formatting
 * Handles: bold, italic, code blocks, inline code, headings, lists
 */
export const renderMarkdown = (text: string): React.ReactNode[] => {
  if (!text) return [];

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentCodeBlock: string[] = [];
  let inCodeBlock = false;
  let codeLanguage = 'text';

  lines.forEach((line, lineIndex) => {
    // Check for code block start/end
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        codeLanguage = line.trim().substring(3) || 'text';
      } else {
        // End of code block
        inCodeBlock = false;
        elements.push(
          <div key={`code-${lineIndex}`} style={{ marginBottom: '12px' }}>
            <SyntaxHighlighter
              language={codeLanguage}
              style={oneLight}
              customStyle={{
                margin: 0,
                padding: '12px',
                borderRadius: '4px',
                fontSize: '0.9em',
              }}
              showLineNumbers={false}
              wrapLines={true}
              wrapLongLines={true}
            >
              {currentCodeBlock.join('\n')}
            </SyntaxHighlighter>
          </div>
        );
        currentCodeBlock = [];
        codeLanguage = 'text';
      }
      return;
    }

    // If in code block, accumulate lines
    if (inCodeBlock) {
      currentCodeBlock.push(line);
      return;
    }

    // Process regular lines
    const processedLine = processInlineMarkdown(line);
    
    // Handle headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={lineIndex} style={{ marginTop: '16px', marginBottom: '8px', fontSize: '1.2em', fontWeight: 'bold' }}>
          {processInlineMarkdown(line.substring(4))}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={lineIndex} style={{ marginTop: '18px', marginBottom: '10px', fontSize: '1.4em', fontWeight: 'bold' }}>
          {processInlineMarkdown(line.substring(3))}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={lineIndex} style={{ marginTop: '20px', marginBottom: '12px', fontSize: '1.6em', fontWeight: 'bold' }}>
          {processInlineMarkdown(line.substring(2))}
        </h1>
      );
    }
    // Handle unordered lists
    else if (line.trim().match(/^[-*+]\s/)) {
      const content = line.trim().substring(2);
      elements.push(
        <li key={lineIndex} style={{ marginLeft: '20px', marginBottom: '4px' }}>
          {processInlineMarkdown(content)}
        </li>
      );
    }
    // Handle ordered lists
    else if (line.trim().match(/^\d+\.\s/)) {
      const content = line.trim().replace(/^\d+\.\s/, '');
      elements.push(
        <li key={lineIndex} style={{ marginLeft: '20px', marginBottom: '4px', listStyleType: 'decimal' }}>
          {processInlineMarkdown(content)}
        </li>
      );
    }
    // Handle empty lines
    else if (line.trim() === '') {
      elements.push(<br key={lineIndex} />);
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={lineIndex} style={{ marginBottom: '8px' }}>
          {processedLine}
        </p>
      );
    }
  });

  return elements;
};

/**
 * Process inline markdown: bold, italic, inline code, links
 */
const processInlineMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const currentText = text;
  let key = 0;

  // Combined regex to match bold, italic, inline code, and links
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(currentText)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(currentText.slice(lastIndex, match.index));
    }

    // Determine which pattern matched
    if (match[1]) {
      // Bold: **text**
      parts.push(
        <strong key={`bold-${key++}`}>{match[2]}</strong>
      );
    } else if (match[3]) {
      // Italic: *text*
      parts.push(
        <em key={`italic-${key++}`}>{match[4]}</em>
      );
    } else if (match[5]) {
      // Inline code: `code`
      parts.push(
        <code
          key={`code-${key++}`}
          style={{
            backgroundColor: '#f5f5f5',
            padding: '2px 6px',
            borderRadius: '3px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
          }}
        >
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      // Link: [text](url)
      parts.push(
        <a
          key={`link-${key++}`}
          href={match[8]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0066cc', textDecoration: 'underline' }}
        >
          {match[7]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < currentText.length) {
    parts.push(currentText.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [currentText];
};
