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
    <div key={blockKey} className="code-block-wrapper">
      <div className="code-block-container k-d-flex k-align-items-center k-justify-content-space-between k-p-2 k-overflow-x-auto">
        <pre className="code-block-pre">
          {code}
        </pre>
        <Button
          onClick={handleCopy}
          fillMode="flat"
          size="small"
          className={`code-copy-button ${copied ? 'copied' : ''}`}
          title={copied ? "Copied!" : "Copy code"}
        >
          <SvgIcon icon={copyIcon} size="small" />
          {copied && <span className="code-copy-text">Copied!</span>}
        </Button>
      </div>
    </div>
  );
};

export default CodeBlockWithCopy;
