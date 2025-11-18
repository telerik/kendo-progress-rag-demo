import React from "react";
import { TextBox, type TextBoxProps, InputSuffix, type TextBoxChangeEvent } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Card, CardHeader, CardTitle, CardBody } from "@progress/kendo-react-layout";
import { searchIcon } from "@progress/kendo-svg-icons";
import { buildApiUrl } from '../config/api';
import { renderMarkdown } from '../utils/markdownRenderer';

export default function AiSearch() {
  const [query, setQuery] = React.useState<TextBoxProps['value']>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [answer, setAnswer] = React.useState<string>('');
  const [currentQuestion, setCurrentQuestion] = React.useState<string>('');

  const handleQueryChange = React.useCallback((event: TextBoxChangeEvent) => {
    setQuery(event.target.value);
  }, []);

  const handleSearch = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim() === '' || isLoading) {
      return;
    }

    setIsLoading(true);
    setAnswer('');
    setCurrentQuestion(searchQuery);

    try {
      const res = await fetch(buildApiUrl('/api/ask-nuclia'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: searchQuery.trim() })
      });

      if (!res.ok || !res.body) {
        throw new Error('Request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let currentAnswer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';
        
        for (const part of parts) {
          const lines = part.split('\n').filter(Boolean);
          const dataLine = lines.find(l => l.startsWith('data: '));
          const isError = lines.some(l => l.startsWith('event: error'));
          
          if (isError) {
            if (dataLine) {
              try {
                const payload = JSON.parse(dataLine.replace(/^data: /, ''));
                throw new Error(payload.error || 'Error');
              } catch {
                throw new Error('Error processing request');
              }
            } else {
              throw new Error('Error processing request');
            }
          }
          
          if (dataLine) {
            try {
              const payload = JSON.parse(dataLine.replace(/^data: /, ''));
              if (payload.answer) {
                currentAnswer = payload.answer;
                setAnswer(currentAnswer);
              }
            } catch (e) {
              console.warn('Failed to parse SSE chunk', e, part);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      setAnswer(`Sorry, I encountered an error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleSearchClick = React.useCallback(() => {
    if (query) {
      handleSearch(String(query));
    }
  }, [query, handleSearch]);

  const handleKeyPress = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && query) {
      handleSearch(String(query));
    }
  }, [query, handleSearch]);

  const handleExampleSearch = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const searchText = event.currentTarget.innerText;
    setQuery(searchText);
    handleSearch(searchText);
  }, [handleSearch]);

  return (
    <div style={{ minHeight: 'calc(100vh - 53px)', background: 'linear-gradient(135deg, #1F7ACF 20%, #2E7BD2 50%, #2BBACD 85%)', padding: '20px'}}>
      <div className="k-d-flex k-flex-column k-gap-2 k-justify-content-center k-align-items-center k-mb-8">
        <h1 className="k-h1" style={{ margin: '0', color: 'white' }}>AI Search</h1>
        <p style={{ color: 'white' }}>Ask questions and get AI-powered answers from our knowledge base.</p>
      </div>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <TextBox
          size="large"
          placeholder="Type your AI search query here..."
          suffix={() => (
            <InputSuffix>
              <Button 
                size="large" 
                fillMode="flat" 
                svgIcon={searchIcon} 
                onClick={handleSearchClick}
                disabled={isLoading}
              />
            </InputSuffix>
          )}
          value={query}
          onChange={handleQueryChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
      </div>
      <div className="k-d-flex k-flex-column k-gap-2 k-justify-content-center k-align-items-center k-mt-8">
        <p style={{ color: 'white' }}>Popular searches:</p>
        <div className="k-d-grid k-grid-cols-3 k-gap-3">
          <Button onClick={handleExampleSearch} disabled={isLoading}>What is Nuclia and how does it work?</Button>
          <Button onClick={handleExampleSearch} disabled={isLoading}>How does AI search work?</Button>
          <Button onClick={handleExampleSearch} disabled={isLoading}>Tell me about semantic search</Button>
          <Button onClick={handleExampleSearch} disabled={isLoading}>What are knowledge bases?</Button>
          <Button onClick={handleExampleSearch} disabled={isLoading}>Explain vector embeddings</Button>
        </div>
      </div>
      <div style={{maxWidth: '800px'}} className="k-mt-20 k-mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {isLoading ? 'Searching...' : currentQuestion ? 'AI Search Results' : 'AI Search Results'}
            </CardTitle>
          </CardHeader>
          <CardBody>
            {isLoading && (
              <div className="k-d-flex k-justify-content-center k-align-items-center k-py-8">
                <span className="k-icon k-i-loading k-icon-64"></span>
              </div>
            )}
            {!isLoading && !answer && (
              <p>Your AI search results will appear here. Try searching for something or click one of the popular searches above.</p>
            )}
            {!isLoading && currentQuestion && (
              <div>
                <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>Question: {currentQuestion}</p>
                <div>{renderMarkdown(answer)}</div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}