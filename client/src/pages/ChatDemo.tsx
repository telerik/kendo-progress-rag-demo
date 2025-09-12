import React from "react";
import { Chat, type Message, type User } from "@progress/kendo-react-conversational-ui";

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
        text: 'Hello! I\'m your Nuclia AI assistant. Ask me anything about your knowledge base.'
    }
];

const ChatDemo = () => {
  const [messages, setMessages] = React.useState(initialMessages);

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
        text: 'Thinking...'
    };
    
    setMessages(prev => [...prev, botMessage]);

    try {
        const res = await fetch('/api/ask', {
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
                                    ? { ...msg, text: currentAnswer }
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
                ? { ...msg, text: `Sorry, I encountered an error: ${errorMessage}` }
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
                placeholder={'Type a message...'}
                width={"60%"}
                height={"100%"}
                className="k-m-auto k-border-transparent"
            />
        </div>
    );
}

export default ChatDemo;