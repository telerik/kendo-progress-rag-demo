import React from "react";
import { Chat, type Message, type User, type ChatSuggestion } from "@progress/kendo-react-conversational-ui";
import ChatMessage from "../components/ChatMessage";
import { buildApiUrl } from '../config/api';

type AskResponse = {
  question: string
  answer: string | null
  sources?: unknown[]
  raw?: unknown
  error?: string
  incomplete?: boolean
}

const user: User = {
    id: 1,
    name: 'Demo User',
};

const bot: User = { 
    id: 0, 
    name: 'Nuclia Assistant',
};

const initialMessages: Message[] = [
    {
        id: 1,
        author: bot,
        timestamp: new Date(),
        text: 'Hello! I\'m your Nuclia AI assistant. I can help you with KendoReact questions and documentation. Try one of the suggestions below, or ask me anything about KendoReact components, theming, data visualization, and more!'
    }
];

const ChatDemo = () => {
  const [messages, setMessages] = React.useState(initialMessages);

  // Predefined suggestions related to Kendo React
  const kendoSuggestions: ChatSuggestion[] = [
    {
      id: 1,
      text: "How do I get started with KendoReact components?",
      description: "Learn about getting started with KendoReact"
    },
    {
      id: 2,
      text: "What are the best KendoReact components for data visualization?",
      description: "Explore charts, grids, and data visualization components"
    },
    {
      id: 3,
      text: "How to implement theming and styling in KendoReact?",
      description: "Learn about themes, CSS customization, and styling"
    }
  ];

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: ChatSuggestion) => {
    // Create a message from the suggestion
    const suggestionMessage: Message = {
      id: Date.now(),
      author: user,
      timestamp: new Date(),
      text: suggestion.text
    };
    
    // Send the suggestion as a message
    addNewMessage({ message: suggestionMessage });
  };

interface AddNewMessageEvent {
    message: Message;
}

const addNewMessage = async (event: AddNewMessageEvent): Promise<void> => {
    const userMessage = {
        ...event.message,
        author: user
    };
    
    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);

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
        const res = await fetch(buildApiUrl('/api/ask'), {
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
                        const payload = JSON.parse(dataLine.replace(/^data: /, '')) as AskResponse;
                        if (payload.answer) {
                            currentAnswer = payload.answer;
                            // Update the bot message with streaming content
                            setMessages(prev => prev.map(msg => 
                                msg.id === botMessageId 
                                    ? { ...msg, text: currentAnswer, typing: false }
                                    : msg
                            ));
                        }
                    } catch (e) {
                        console.warn('Failed to parse SSE chunk', e, part);
                    }
                }
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Network error';
        // Update bot message with error
        setMessages(prev => prev.map(msg => 
            msg.id === botMessageId 
                ? { ...msg, text: `Sorry, I encountered an error: ${errorMessage}`, typing: false }
                : msg
        ));
    }
};
    return (
        <div className="k-h-full k-bg-surface">
            <Chat
                messages={messages}
                authorId={user.id}
                onSendMessage={addNewMessage}
                placeholder={'Try a suggestion or ask about KendoReact...'}
                width={"100%"}
                height={"100%"}
                className="k-border-transparent"
                messageTemplate={ChatMessage}
                suggestions={kendoSuggestions}
                onSuggestionClick={handleSuggestionClick}
            />
        </div>
    );
}

export default ChatDemo;