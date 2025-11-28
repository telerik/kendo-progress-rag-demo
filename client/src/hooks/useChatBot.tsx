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
  json?: Record<string, unknown>; // For chart data or other structured responses
  error?: string;
  incomplete?: boolean;
  messageId?: string | number; // ID of the message associated with this response
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
  placeholder: string;
}

export const useChatBot = (config: ChatBotConfig): UseChatBotReturn => {
  const user: User = {
    id: 1,
    name: 'Demo User',
    avatarUrl: `${import.meta.env.BASE_URL}drawer-user.svg`
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

    // Add typing indicator - this creates better UX
    const typingMessageId = Date.now() + 1;
    const typingMessage: Message = {
      id: typingMessageId,
      author: bot,
      timestamp: new Date(),
      typing: true
    };
    
    setMessages(prev => [...prev, typingMessage]);

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
                currentAnswer = payload.answer;
                finalResponse = payload;
              }
            } catch (e) {
              console.warn('Failed to parse SSE chunk', e, part);
            }
          }
        }
      }
      
      // Add complete bot message after removing typing indicator
      // Use a small delay to ensure smooth auto-scroll
      if (currentAnswer) {
        // First, remove typing indicator
        setMessages(prev => prev.filter(msg => msg.id !== typingMessageId));
        
        // Then add complete response after a tiny delay
        const botMessageId = Date.now() + 2;
        setTimeout(() => {
          const botMessage: Message = {
            id: botMessageId,
            author: bot,
            timestamp: new Date(),
            text: currentAnswer
          };
          
          setMessages(prev => [...prev, botMessage]);
        }, 10);
        
        // Set the final response with the message ID for any additional processing
        if (finalResponse) {
          finalResponse.messageId = botMessageId;
          setLatestResponse(finalResponse);
        }
      } else {
        // If no response, just remove typing indicator
        setMessages(prev => prev.filter(msg => msg.id !== typingMessageId));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      
      // Remove typing and add error with delay
      setMessages(prev => prev.filter(msg => msg.id !== typingMessageId));
      
      setTimeout(() => {
        const errorBotMessage: Message = {
          id: Date.now() + 2,
          author: bot,
          timestamp: new Date(),
          text: `Sorry, I encountered an error: ${errorMessage}`
        };
        
        setMessages(prev => [...prev, errorBotMessage]);
      }, 10);
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
    resetSuggestions,
    placeholder: config.placeholder || 'Type a message...'
  };
};