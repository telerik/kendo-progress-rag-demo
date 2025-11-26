import React from "react";
import { useLocation } from "react-router-dom";
import { type TextAreaProps, type TextAreaChangeEvent } from "@progress/kendo-react-inputs";
import { buildApiUrl } from '../config/api';
import { renderMarkdown } from '../utils/markdownRenderer';
import { SearchPill } from '../components/SearchPill';
import { SearchInput } from '../components/SearchInput';
import { VectorsBackground } from '../components/VectorsBackground';
import { GradientLoader } from '../components/GradientLoader';

export default function AiSearch() {
  const location = useLocation();
  const [query, setQuery] = React.useState<TextAreaProps['value']>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [answer, setAnswer] = React.useState<string>('');
  const [currentQuestion, setCurrentQuestion] = React.useState<string>('');

  const handleQueryChange = React.useCallback((event: TextAreaChangeEvent) => {
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

  React.useEffect(() => {
    const state = location.state as { query?: string } | null;
    if (state?.query) {
      setQuery(state.query);
      handleSearch(state.query);
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const popularSearches = [
    "What is PARAG and how does it work?",
    "Deployment options and requirements",
    "Security features and compliance",
    "API integration and capabilities",
    "Pricing and licensing options",
    "Use cases and customer success stories"
  ];

  const hasResults = (answer || isLoading || currentQuestion);

  return (
    <div 
      className="k-pos-relative k-overflow-x-hidden k-overflow-y-auto" 
      style={{ 
        height: 'calc(100vh - 54px)',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        maxWidth: '100vw',
        boxSizing: 'border-box'
      }}
    >
      {/* Decorative circle background - only show when no results */}
      {!hasResults && (
        <>
          <div 
            className="k-pos-absolute"
            style={{
              left: '50%',
              top: '545px',
              transform: 'translateX(-50%)',
              width: '930px',
              height: '169px',
              opacity: 0.6,
              pointerEvents: 'none',
              zIndex: 0
            }}
          >
            <div className="k-pos-absolute"
              style={{
                inset: '-177.57% -32.26%'
              }}
            >
              <div className="k-w-full k-h-full"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(193, 88, 228, 0.15) 0%, rgba(0, 187, 255, 0.1) 50%, transparent 70%)'
                }}
              />
            </div>
          </div>

          {/* Decorative network visualization image on the right */}
          <VectorsBackground show={true} />
        </>
      )}

      {/* Main content container */}
      <div className="k-d-flex k-flex-column k-pos-relative k-overflow-hidden" style={{ zIndex: 1, maxWidth: '100%' }}>
        {/* Header section - changes based on hasResults */}
        {!hasResults ? (
          // Initial state: Large header with description
          <>
            <div 
              className="k-d-flex k-flex-column k-gap-8 rag-hero-wrapper"
            >
              <h1 
                className="k-mb-0 k-h1"
                style={{
                  background: 'linear-gradient(105deg, #C158E4 11.99%, #0BF 49.33%, #001DFF 88.12%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Discover
                <br />
                Progress Agentic RAG Knowledge
              </h1>
              <p 
                className="k-mb-0"
                style={{
                  fontSize: '24px',
                  lineHeight: '1.2',
                  color: '#535B6A'
                }}
              >
                Search our comprehensive Nuclia knowledge base with AI-powered intelligent search for precise, contextual results about Nuclia features, capabilities, and best practices
              </p>
            </div>

            {/* Search input section - centered horizontally */}
            <div 
              className="k-d-flex k-flex-column k-gap-8 search-input-wrapper k-w-full"
              style={{
                maxWidth: '770px'
              }}
            >
              <SearchInput
                query={query}
                onQueryChange={handleQueryChange}
                onKeyPress={handleKeyPress}
                onSearchClick={handleSearchClick}
                isLoading={isLoading}
                placeholder="Ask about PARAG features, deployment, security, integrations..."
              />

              {/* Popular searches section */}
              <div className="k-d-flex k-flex-column k-w-full k-gap-3">
                <p 
                  className="k-mb-0"
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#212529',
                    textAlign: 'left'
                  }}
                >
                  Popular searches:
                </p>
                <div 
                  className="k-d-flex k-flex-wrap k-gap-1.5 k-justify-content-flex-start"
                >
                  {popularSearches.map((searchText, index) => (
                    <SearchPill key={index} text={searchText} onClick={handleExampleSearch} disabled={isLoading} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Results state: Compact header with integrated search
          <div 
            className="k-d-flex k-flex-column k-gap-9 k-pos-relative hero"
            style={{
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '64px',
              paddingBottom: '64px',
              isolation: 'isolate',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Decorative elements container with overflow clipping */}
            <div 
              className="k-pos-absolute k-overflow-hidden"
              style={{
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0
              }}
            >
              {/* Decorative gradient circle behind title */}
              <div 
                className="k-pos-absolute"
                style={{
                  left: '50%',
                  top: '162px',
                  transform: 'translateX(-50%) rotate(180deg)',
                  width: '815px',
                  height: '63px',
                  opacity: 0.6
                }}
              >
                <div className="k-pos-absolute"
                  style={{
                    inset: '-236.8% -18.4%'
                  }}
                >
                  <div className="k-w-full k-h-full"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(193, 88, 228, 0.15) 0%, rgba(0, 187, 255, 0.1) 50%, transparent 70%)'
                    }}
                  />
                </div>
              </div>

              {/* Vertical gradient shadow */}
              <div 
                className="k-pos-absolute"
                style={{
                  left: '50%',
                  top: '207px',
                  transform: 'translateX(-50%) rotate(90deg) scaleY(-1)',
                  width: '32px',
                  height: '1440px',
                  opacity: 0.3,
                  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0) 100%)'
                }}
              />
            </div>

            <h1 
              className="k-mb-0 k-text-center k-pos-relative"
              style={{
                fontSize: '36px',
                fontWeight: 500,
                lineHeight: '1.3',
                background: 'linear-gradient(105deg, #C158E4 11.99%, #0BF 49.33%, #001DFF 88.12%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                maxWidth: '800px',
                margin: '0 auto',
                zIndex: 1,
                paddingBottom: '4px'
              }}
            >
              Discover Progress Agentic RAG Knowledge
            </h1>

            {/* Search input - centered and integrated */}
            <div className="k-w-full k-pos-relative"
              style={{
                maxWidth: '770px',
                margin: '0 auto',
                zIndex: 1
              }}
            >
              <SearchInput
                query={query}
                onQueryChange={handleQueryChange}
                onKeyPress={handleKeyPress}
                onSearchClick={handleSearchClick}
                isLoading={isLoading}
                placeholder="What is PARAG and how does it work?"
              />
            </div>
          </div>
        )}

        {/* Results section */}
        {hasResults && (
          <div 
            className="k-d-flex k-flex-column k-overflow-hidden k-w-full results-section"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <div 
              className="k-d-flex k-flex-column k-gap-16 k-w-full results-content"
              style={{
                maxWidth: '770px',
                margin: '0 auto',
                minWidth: 0
              }}
            >
              {/* Answer content */}
              {isLoading && (
                <GradientLoader 
                  title="Searching<br />Knowledge Base" 
                  subtitle="Analyzing your query..." 
                />
              )}
              
              {!isLoading && answer && (
                <div 
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.5',
                    color: '#000000',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                >
                  {renderMarkdown(answer)}
                </div>
              )}

              {/* Related searches section */}
              {!isLoading && answer && (
                <div className="k-d-flex k-flex-column k-gap-3">
                  <p 
                    className="k-mb-0"
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: '#212529',
                      textAlign: 'left'
                    }}
                  >
                    Related searches:
                  </p>
                  <div 
                    className="k-d-flex k-flex-wrap k-justify-content-flex-start k-gap-1"
                  >
                    {popularSearches.map((searchText, index) => (
                      <SearchPill key={index} text={searchText} onClick={handleExampleSearch} disabled={isLoading} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}