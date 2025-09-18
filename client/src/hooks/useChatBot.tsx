import React from "react";
import { type Message, type User, type ChatSuggestion } from "@progress/kendo-react-conversational-ui";
import { buildApiUrl } from '../config/api';

export interface ChatBotConfig {
  botName: string;
  initialMessage: string;
  apiEndpoint: string;
  placeholder?: string;
  suggestions?: ChatSuggestion[];
}

export interface StreamingResponse {
  question: string;
  answer: string | null;
  sources?: unknown[];
  raw?: unknown;
  json?: Record<string, unknown>; // For chart data or other structured responses
  error?: string;
  incomplete?: boolean;
}

export interface UseChatBotReturn {
  messages: Message[];
  user: User;
  bot: User;
  addNewMessage: (event: { message: Message }) => Promise<void>;
  handleSuggestionClick: (suggestion: ChatSuggestion) => void;
  isLoading: boolean;
  latestResponse: StreamingResponse | null;
  availableSuggestions: ChatSuggestion[];
  resetSuggestions: () => void;
}

export const useChatBot = (config: ChatBotConfig): UseChatBotReturn => {
  const user: User = {
    id: 1,
    name: 'Demo User',
  };

  const bot: User = {
    id: 0,
    name: config.botName,
  };

  const initialMessages: Message[] = [
    {
      id: 1,
      author: bot,
      timestamp: new Date(),
      text: config.initialMessage
    }
  ];

  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = React.useState(false);
  const [latestResponse, setLatestResponse] = React.useState<StreamingResponse | null>(null);
  const [usedSuggestionIds, setUsedSuggestionIds] = React.useState<Set<string | number>>(new Set());

  // Filter out used suggestions
  const availableSuggestions = React.useMemo(() => {
    return (config.suggestions || []).filter(suggestion => !usedSuggestionIds.has(suggestion.id));
  }, [config.suggestions, usedSuggestionIds]);

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: ChatSuggestion) => {
    // Prevent clicking suggestions while a response is being generated
    if (isLoading) {
      return;
    }
    
    // Mark this suggestion as used
    setUsedSuggestionIds(prev => new Set(prev).add(suggestion.id));
    
    const suggestionMessage: Message = {
      id: Date.now(),
      author: user,
      timestamp: new Date(),
      text: suggestion.text
    };
    
    addNewMessage({ message: suggestionMessage });
  };

  const addNewMessage = async (event: { message: Message }): Promise<void> => {
    // Prevent sending new messages while already loading
    if (isLoading) {
      return;
    }
    
    const userMessage = {
      ...event.message,
      author: user
    };
    
    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setLatestResponse(null);

    // Create a placeholder bot message for streaming
    const botMessageId = Date.now() + 1;
    const botMessage: Message = {
      id: botMessageId,
      author: bot,
      timestamp: new Date(),
      typing: true 
    };
    
    setMessages(prev => [...prev, botMessage]);

    try {
      const res = await fetch(buildApiUrl(config.apiEndpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: (userMessage.text || '').trim() })
      });

      if (!res.ok || !res.body) {
        throw new Error('Request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let currentAnswer = '';
      let finalResponse: StreamingResponse | null = null;

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
              const payload = JSON.parse(dataLine.replace(/^data: /, '')) as StreamingResponse;
              if (payload.answer) {
                const previousAnswer = currentAnswer;
                const newAnswer = payload.answer;
                const isLargeJump = newAnswer.length > previousAnswer.length + 50; // Detect large jumps
                
                // If it's a large jump (like complete replacement), simulate streaming
                if (isLargeJump && previousAnswer.length === 0) {
                  console.log(`[${config.apiEndpoint}] Large jump detected, simulating streaming: ${newAnswer.length} chars`);
                  
                  // Simulate streaming by gradually revealing the text
                  const simulateStreaming = async (fullText: string) => {
                    const chunkSize = 10; // Characters per chunk
                    const delay = 30; // Milliseconds between chunks
                    
                    for (let i = 0; i < fullText.length; i += chunkSize) {
                      const partialText = fullText.slice(0, i + chunkSize);
                      currentAnswer = partialText;
                      
                      // Update the UI
                      setMessages(prev => prev.map(msg => 
                        msg.id === botMessageId 
                          ? { ...msg, text: currentAnswer, typing: false }
                          : msg
                      ));
                      
                      // Small delay to create streaming effect
                      if (i + chunkSize < fullText.length) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                      }
                    }
                  };
                  
                  // Start the simulated streaming
                  simulateStreaming(newAnswer);
                } else {
                  // Normal incremental update
                  currentAnswer = newAnswer;
                  
                  // Debug log
                  if (previousAnswer !== currentAnswer) {
                    console.log(`[${config.apiEndpoint}] Text updated: ${previousAnswer.length} -> ${currentAnswer.length} chars`);
                  }
                  
                  setMessages(prev => prev.map(msg => 
                    msg.id === botMessageId 
                      ? { ...msg, text: currentAnswer, typing: false }
                      : msg
                  ));
                }
                
                finalResponse = payload;
              }
            } catch (e) {
              console.warn('Failed to parse SSE chunk', e, part);
            }
          }
        }
      }
      
      // Set the final response for any additional processing
      if (finalResponse) {
        setLatestResponse(finalResponse);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      // Update bot message with error
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, text: `Sorry, I encountered an error: ${errorMessage}`, typing: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset used suggestions (if needed)
  const resetSuggestions = React.useCallback(() => {
    setUsedSuggestionIds(new Set());
  }, []);

  return {
    messages,
    user,
    bot,
    addNewMessage,
    handleSuggestionClick,
    isLoading,
    latestResponse,
    availableSuggestions,
    resetSuggestions
  };
};