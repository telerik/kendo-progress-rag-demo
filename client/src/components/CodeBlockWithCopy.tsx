import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { SvgIcon } from '@progress/kendo-react-common';
import { copyIcon } from '@progress/kendo-svg-icons';

interface CodeBlockWithCopyProps {
  code: string;
  blockKey: string;
}

const CodeBlockWithCopy: React.FC<CodeBlockWithCopyProps> = ({ code, blockKey }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div key={blockKey} style={{ marginBottom: '12px' }}>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(250, 250, 250, 0.8)',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '8px',
          overflowX: 'auto'
        }}
      >
        <pre 
          style={{
            margin: 0,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: '14px',
            lineHeight: '20px',
            color: '#495057',
            whiteSpace: 'pre'
          }}
        >
          {code}
        </pre>
        <Button
          onClick={handleCopy}
          fillMode="flat"
          size="small"
          style={{
            minHeight: '24px',
            minWidth: copied ? 'auto' : '24px',
            width: copied ? 'auto' : '24px',
            height: '24px',
            padding: copied ? '4px 8px' : '4px',
            flexShrink: 0,
            marginLeft: '8px'
          }}
          title={copied ? "Copied!" : "Copy code"}
        >
          <SvgIcon icon={copyIcon} size="small" />
          {copied && <span style={{ marginLeft: '4px', fontSize: '12px' }}>Copied!</span>}
        </Button>
      </div>
    </div>
  );
};

export default CodeBlockWithCopy;
