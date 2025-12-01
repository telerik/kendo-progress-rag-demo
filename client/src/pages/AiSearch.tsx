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
    <div className="ai-search-container k-pos-relative k-overflow-x-hidden k-overflow-y-auto">
      {/* Decorative circle background - only show when no results */}
      {!hasResults && (
        <>
          <div className="ai-search-decorative-circle k-pos-absolute">
            <div className="ai-search-decorative-inner k-pos-absolute">
              <div className="ai-search-gradient-bg k-w-full k-h-full" />
            </div>
          </div>

          {/* Decorative network visualization image on the right */}
          <VectorsBackground show={true} />
        </>
      )}

      {/* Main content container */}
      <div className="ai-search-content k-d-flex k-flex-column k-pos-relative k-overflow-hidden">
        {/* Header section - changes based on hasResults */}
        {!hasResults ? (
          // Initial state: Large header with description
          <>
            <div className="k-d-flex k-flex-column k-gap-8 rag-hero-wrapper">
              <h1 className="ai-search-title !k-mb-0 k-h1">
                Discover
                <br />
                Progress Agentic RAG Knowledge
              </h1>
              <p className="ai-search-description !k-mb-0">
                Search our comprehensive Nuclia knowledge base with AI-powered intelligent search for precise, contextual results about Nuclia features, capabilities, and best practices
              </p>
            </div>

            {/* Search input section - centered horizontally */}
            <div className="ai-search-input-wrapper k-d-flex k-flex-column k-gap-8 search-input-wrapper k-w-full">
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
                <p className="ai-search-popular-label !k-mb-0">
                  Popular searches:
                </p>
                <div className="k-d-flex k-flex-wrap k-gap-1.5 k-justify-content-flex-start k-pb-4.5">
                  {popularSearches.map((searchText, index) => (
                    <SearchPill key={index} text={searchText} onClick={handleExampleSearch} disabled={isLoading} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Results state: Compact header with integrated search
          <div className="ai-search-results-hero k-d-flex k-flex-column k-gap-9 k-pos-relative hero">
            {/* Decorative elements container with overflow clipping */}
            <div className="ai-search-results-decorative-container k-pos-absolute k-overflow-hidden">
              {/* Decorative gradient circle behind title */}
              <div className="ai-search-results-gradient-circle k-pos-absolute">
                <div className="ai-search-results-gradient-inner k-pos-absolute">
                  <div className="ai-search-gradient-bg k-w-full k-h-full" />
                </div>
              </div>

              {/* Vertical gradient shadow */}
              <div className="ai-search-results-shadow k-pos-absolute" />
            </div>

            <h1 className="ai-search-results-title !k-mb-0 k-text-center k-pos-relative">
              Discover Progress Agentic RAG Knowledge
            </h1>

            {/* Search input - centered and integrated */}
            <div className="ai-search-results-input-wrapper k-w-full k-pos-relative">
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
          <div className="ai-search-results-section k-d-flex k-flex-column k-overflow-hidden k-w-full results-section">
            <div className="ai-search-results-content-wrapper k-d-flex k-flex-column k-gap-16 k-w-full results-content">
              {/* Answer content */}
              {isLoading && (
                <GradientLoader 
                  title="Searching<br />Knowledge Base" 
                  subtitle="Analyzing your query..." 
                />
              )}
              
              {!isLoading && answer && (
                <div className="ai-search-answer-text">
                  {renderMarkdown(answer)}
                </div>
              )}

              {/* Related searches section */}
              {!isLoading && answer && (
                <div className="k-d-flex k-flex-column k-gap-3">
                  <p className="ai-search-popular-label !k-mb-0">
                    Related searches:
                  </p>
                  <div className="k-d-flex k-flex-wrap k-justify-content-flex-start k-gap-1">
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