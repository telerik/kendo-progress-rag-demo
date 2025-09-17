import React from "react";
// import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { Chat, type Message, type User, type ChatSuggestion } from "@progress/kendo-react-conversational-ui";
import ChatMessage from "../components/ChatMessage";
import { buildApiUrl } from '../config/api';
import { Card } from '@progress/kendo-react-layout'
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts'

export default function GridDemo() {
  interface ChartSeriesDef { name: string; data: number[] }
  interface BarChartDef { title: string; categories: string[]; series: ChartSeriesDef[] }
  type AskChartResponse = {
    question: string
    answer: string | null
    sources?: unknown[]
    raw?: unknown
    json?: { charts?: BarChartDef[] }
    error?: string
    incomplete?: boolean
  }

  // Type guard to validate incoming chart objects before rendering
  const isBarChartDef = (c: unknown): c is BarChartDef => {
    if (!c || typeof c !== 'object') return false;
    const obj = c as Record<string, unknown>;
    return Array.isArray(obj.categories) && Array.isArray(obj.series) && typeof obj.title === 'string';
  };

  const user: User = {
    id: 1,
    name: 'Demo User',
  };

  const bot: User = {
    id: 0,
    name: 'Nuclia Financial Assistant',
  };

  const initialMessages: Message[] = [
    {
      id: 1,
      author: bot,
      timestamp: new Date(),
      text: 'Hello! I\'m your Nuclia Financial assistant. I can help you by summarizing financial data and answering questions about companies. Try one of the suggestions below, or ask me anything about financial results of Apple, Amazon, Resolute, Exxon Mobil, Johnson&Jonson, Google, NVIDIA or Berkshire Hathaway!'
    }
  ];

  const [messages, setMessages] = React.useState(initialMessages);
  const [selectedCharts, setSelectedCharts] = React.useState<BarChartDef[]>([]);

  // Predefined suggestions related to Kendo React
  const kendoSuggestions: ChatSuggestion[] = [
    {
      id: 1,
      text: "Compare Nvidia and Google revenue?",
      description: "Comparison of the revenue of Nvidia and Google."
    },
    {
      id: 2,
      text: "How does each product line contribute to Apple's revenue?",
      description: "Learn how does each product line contribute to Apple's revenue."
    },
    {
      id: 3,
      text: "What are the financial results of Google in 2024 compared to 2023?",
      description: "Learn about Google's financial performance in 2024 versus 2023."
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

    setSelectedCharts([]); // Clear previous charts

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
      const res = await fetch(buildApiUrl('/api/ask-charts'), {
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
              const payload = JSON.parse(dataLine.replace(/^data: /, '')) as AskChartResponse;
              if (payload.answer) {
                currentAnswer = payload.answer;
                // Update the bot message with streaming content
                setMessages(prev => prev.map(msg =>
                  msg.id === botMessageId
                    ? { ...msg, text: currentAnswer, typing: false }
                    : msg
                ));

                // Try to set charts if present on payload.json.charts; validate minimal shape
                if (payload.json?.charts && Array.isArray(payload.json.charts)) {
                  const validCharts: BarChartDef[] = payload.json.charts
                    .filter(isBarChartDef)
                    .slice(0, 3);
                  // Only update state if charts are different to prevent unnecessary re-renders
                  setSelectedCharts(prev => {
                    if (prev.length !== validCharts.length) return validCharts;
                    return prev;
                  });
                }
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
    <div className="k-d-grid k-grid-cols-1 k-grid-cols-xl-3 k-bg-surface k-gap-lg k-p-lg k-h-full">
      {/* Left Panel - Chat */}
      <div className="k-col-span-1 k-col-span-xl-1 k-col-start-xl-1 k-col-end-xl-2">
        <Card>
          <div className="k-p-lg k-d-flex k-flex-col">
            <h2 className="k-font-size-xl k-font-bold k-mb-lg">Chat</h2>

            <Chat
              messages={messages}
              authorId={user.id}
              onSendMessage={addNewMessage}
              placeholder={'Try a suggestion or ask about a company...'}
              height={"855px"}
              className="k-border-transparent"
              messageTemplate={ChatMessage}
              suggestions={kendoSuggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </Card>
      </div>

      {/* Right Panel - Financial Charts Analysis */}
      <div className="k-col-span-1 k-col-span-xl-2 k-col-start-xl-2 k-col-end-xl-4">
        <Card>
          <div className="k-p-lg">
            <h2 className="k-font-size-xl k-font-bold k-mb-lg">Nuclia Financial Charts Analysis</h2>
            <div className="k-d-flex k-flex-col k-gap-lg">
              {/* Dynamic Charts from Nuclia answer (up to 3) */}
              <div>
                {selectedCharts.length === 0 && (
                  <p className="k-text-secondary">No charts available for the latest answer.</p>
                )}
                {selectedCharts.length > 0 && (
                  <div className="k-d-flex k-flex-col k-gap-xl">
                    {selectedCharts.slice(0, 3).map((chart, idx) => (
                      <div key={idx} className="k-d-flex k-flex-col k-gap-sm">
                        <h4 className="k-font-size-md k-font-semibold k-mb-sm">{chart.title}</h4>
                        <Chart style={{ height: 210, width: '100%' }}>
                          <ChartCategoryAxis>
                            <ChartCategoryAxisItem categories={chart.categories} />
                          </ChartCategoryAxis>
                          <ChartValueAxis>
                            <ChartValueAxisItem labels={{ format: "{0:n0}" }} />
                          </ChartValueAxis>
                          <ChartSeries>
                            {chart.series.map(series => (
                              <ChartSeriesItem
                                key={series.name}
                                type="column"
                                name={series.name}
                                data={series.data}
                                tooltip={{ visible: true, format: "{0:n0}" }}
                              />
                            ))}
                          </ChartSeries>
                        </Chart>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
