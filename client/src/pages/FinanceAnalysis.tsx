import React from "react";
import { Chat, type ChatSuggestion, type ChatMessageTemplateProps } from "@progress/kendo-react-conversational-ui";
import { useChatBot } from "../hooks/useChatBot";
import { VectorsBackground } from "../components/VectorsBackground";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartValueAxis,
  ChartValueAxisItem,
} from "@progress/kendo-react-charts";
import { Button } from "@progress/kendo-react-buttons";
import { SvgIcon } from "@progress/kendo-react-common";
import { xIcon } from "@progress/kendo-svg-icons";
import DrawerComponent from "../components/DrawerComponent";
import ChatMessage from "../components/ChatMessage";
import ChatMessageBox from "../components/ChatMessageBox";
import ChatHeaderTemplate from "../components/ChatHeader";

// Chart Thumbnail Component - Shows mini preview with "Preview" button
interface ChartThumbnailProps {
  onClick: () => void;
}

function ChartThumbnail({ onClick }: ChartThumbnailProps) {
  return (
    <div 
      onClick={onClick}
      style={{
        width: '250px',
        height: '190px',
        backgroundColor: 'white',
        border: '1px solid #e1e3e8',
        borderRadius: '16px',
        padding: '8px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        marginTop: '12px'
      }}
    >
      {/* Mini chart preview */}
      <div style={{
        width: '200px',
        height: '150px',
        backgroundColor: 'white',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Simple placeholder for chart preview */}
        <div style={{
          width: '180px',
          height: '130px',
          background: 'linear-gradient(135deg, #04bfda 0%, #9b88ed 100%)',
          opacity: 0.3,
          borderRadius: '8px'
        }} />
      </div>
      {/* Preview button */}
      <div style={{
        color: '#0d6efd',
        fontSize: '14px',
        fontFamily: '"Metric", sans-serif',
        marginTop: '4px'
      }}>
        Preview
      </div>
    </div>
  );
}

export default function FinanceAnalysis() {
  interface ChartSeriesDef {
    name: string;
    data: number[];
  }
  interface BarChartDef {
    title: string;
    categories: string[];
    series: ChartSeriesDef[];
  }

  // Type guard to validate incoming chart objects before rendering
  const isBarChartDef = React.useCallback((c: unknown): c is BarChartDef => {
    if (!c || typeof c !== "object") return false;
    const obj = c as Record<string, unknown>;
    return (
      Array.isArray(obj.categories) &&
      Array.isArray(obj.series) &&
      typeof obj.title === "string"
    );
  }, []);

  const [selectedCharts, setSelectedCharts] = React.useState<BarChartDef[]>([]);
  const [isChartsExpanded, setIsChartsExpanded] = React.useState(false);

  // Predefined suggestions related to financial data
  const financialSuggestions: ChatSuggestion[] = [
    {
      id: 1,
      text: "Compare Nvidia and Google revenue?",
      description: "Comparison of the revenue of Nvidia and Google.",
    },
    {
      id: 2,
      text: "How does each product line contribute to Apple's revenue?",
      description:
        "Learn how does each product line contribute to Apple's revenue.",
    },
    {
      id: 3,
      text: "What are the financial results of Google in 2024 compared to 2023?",
      description:
        "Learn about Google's financial performance in 2024 versus 2023.",
    },
  ];

  const chatBot = useChatBot({
    botName: "Progress Agentic RAG Financial Assistant",
    initialMessage:
      "👋 Hello! I'm your Progress Agentic RAG Financial assistant. I can help you by summarizing financial data and answering questions about companies. Try one of the suggestions below, or ask me anything about financial results of Apple, Amazon, Resolute, Exxon Mobil, Johnson&Jonson, Google, NVIDIA or Berkshire Hathaway!",
    apiEndpoint: "/api/ask-charts",
    placeholder: "Try a suggestion or ask about a company...",
    suggestions: financialSuggestions,
  });

  // Watch for changes in the latest response to update charts
  React.useEffect(() => {
    if (
      chatBot.latestResponse?.json?.charts &&
      Array.isArray(chatBot.latestResponse.json.charts)
    ) {
      const validCharts: BarChartDef[] = chatBot.latestResponse.json.charts
        .filter(isBarChartDef)
        .slice(0, 3);
      setSelectedCharts(validCharts);
    } else {
      setSelectedCharts([]);
    }
  }, [chatBot.latestResponse, isBarChartDef]);

  // Custom message template that includes thumbnail when charts are available
  const customMessageTemplate = React.useCallback((props: ChatMessageTemplateProps) => {
    const isBot = props.item.author.id !== chatBot.user.id;
    const isLatestBotMessage = isBot && props.item.id === chatBot.messages[chatBot.messages.length - 1]?.id;
    const hasCharts = selectedCharts.length > 0;
    
    return (
      <div>
        <ChatMessage {...props} />
        {isLatestBotMessage && hasCharts && (
          <ChartThumbnail onClick={() => setIsChartsExpanded(true)} />
        )}
      </div>
    );
  }, [chatBot.user.id, chatBot.messages, selectedCharts]);

  // Memoized callback for sending messages
  const handleSendMessage = React.useCallback((text: string) => {
    chatBot.addNewMessage({
      message: {
        id: Date.now(),
        author: chatBot.user,
        timestamp: new Date(),
        text
      }
    });
  }, [chatBot]);

  // Render function for the Chat component to avoid duplication
  const renderChat = () => {
    let chatClassName = "k-border-transparent";
    
    if (isChartsExpanded) {
      chatClassName += " finance-analysis-chat-expanded";
    } else if (chatBot.messages.length > 1) {
      chatClassName += " finance-analysis-chat-conversation";
    } else {
      chatClassName += " finance-analysis-chat-initial";
    }
    
    return (
      <Chat
        messages={chatBot.messages.length > 1 ? chatBot.messages.slice(1) : chatBot.messages}
        authorId={chatBot.user.id}
        onSendMessage={chatBot.addNewMessage}
        className={chatClassName}
        style={{ minHeight: "auto", width: "100%"}}
        height="100%"
        messageTemplate={customMessageTemplate}
        timestampTemplate={() => null}
        showUsername={false}
        messageWidthMode="full"
        messageBox={(props) => (
          <ChatMessageBox 
            {...props} 
            isLoading={chatBot.isLoading}
            suggestions={chatBot.messages.length <= 1 ? chatBot.availableSuggestions : []}
            onSuggestionClick={chatBot.handleSuggestionClick}
            onSendMessage={handleSendMessage}
            placeholder={chatBot.placeholder}
          />
        )}
      />
    );
  };

  return (
    <>
      {!isChartsExpanded ? (
        // Default Single-Column Layout with Drawer
        <DrawerComponent>
          <div 
            className="k-d-flex k-flex-column k-overflow-x-hidden k-justify-content-between" 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              position: 'relative',
              height: '100%'
            }}
          >

        {/* Background Illustration with Vectors - Only show on initial screen */}
        <VectorsBackground show={chatBot.messages.length <= 1} />

        {/* Hero Section - Only show on initial screen */}
        {chatBot.messages.length <= 1 && (
          <div className="k-d-flex k-flex-column" style={{ paddingTop: '96px', paddingLeft: '128px', paddingBottom: '96px', position: 'relative', zIndex: 1 }}>
            <div className="k-d-flex k-flex-column" style={{ width: '100%', gap: '32px', maxWidth: '540px' }}>
              <h1 
                className="k-mb-0"
                style={{
                  background: 'linear-gradient(105deg, #C158E4 11.99%, #0BF 49.33%, #001DFF 88.12%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '56px',
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: '-1.12px',
                  fontFamily: '"Metric", sans-serif'
                }}
              >
                Progress Agentic RAG Financial Charts Analysis
              </h1>
              <p 
                className="!k-mb-0"
                style={{
                  color: '#535B6A',
                  fontSize: '24px',
                  lineHeight: '1.2',
                  fontFamily: '"Metric", sans-serif'
                }}
              >
                Use AI search to quickly find accurate, relevant information about Progress Agentic RAG—its features, capabilities, and best practices.
              </p>
            </div>
          </div>
        )}
        {/* Page Header */}
        {chatBot.messages.length > 1 && <ChatHeaderTemplate messages={chatBot.messages} />}
        {/* Conversation Area */}
        <div className="k-d-flex k-flex-column k-flex-1" style={{ paddingLeft: '128px', paddingRight: '128px', paddingBottom: '32px', position: 'relative', zIndex: 1 }}>
          <div 
            className={chatBot.messages.length > 1 ? "finance-analysis-chat-wrapper-conversation" : ""}
            style={{  display: 'flex', flexDirection: 'column', height: '100%', alignItems: "center", justifyContent: "flex-end", padding: "24px", paddingBottom: "8px"}}
          >
            {renderChat()}
          </div>
        </div>
          </div>
        </DrawerComponent>
      ) : (
        // Two-Panel Expanded Layout (No Drawer)
        <div 
          className="k-d-flex k-overflow-x-hidden k-overflow-y-auto" 
          style={{ 
            height: 'calc(100vh - 54px)', 
            width: '100%',
            alignItems: 'stretch'
          }}
        >
          {/* Left Panel - Chat (393px) */}
          <div 
            style={{ 
              width: '393px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid #e1e3e8',
              backgroundColor: '#fafafa'
            }}
          >
            <div className="k-d-flex k-flex-column" style={{ padding: '24px', flex: '1', minHeight: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {renderChat()}
              </div>
            </div>
          </div>

          {/* Right Panel - Charts (flex-1) */}
          <div 
            style={{ 
              flex: 1,
              height: '100%',
              overflow: 'hidden',
              padding: '24px',
              backgroundColor: '#ffffff'
            }}
          >
            {/* Glassmorphism Card */}
            <div 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                position: 'relative'
              }}
            >
              {/* Close Button */}
              <Button
                onClick={() => setIsChartsExpanded(false)}
                fillMode="flat"
                rounded="full"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px'
                }}
              >
                <SvgIcon icon={xIcon} size="medium" />
              </Button>

              {/* Charts Display */}
              <div className="k-d-flex k-flex-col k-gap-6">
                {selectedCharts.slice(0, 3).map((chart, idx) => (
                  <div key={idx} className="k-d-flex k-flex-col">
                    <h4 
                      style={{ 
                        fontSize: '20px',
                        fontWeight: 600,
                        marginBottom: '16px',
                        fontFamily: '"Metric", sans-serif'
                      }}
                    >
                      {chart.title}
                    </h4>
                    <Chart style={{ minHeight: "300px", width: "100%" }}>
                      <ChartCategoryAxis>
                        <ChartCategoryAxisItem
                          categories={chart.categories}
                          labels={{ rotation: "auto" }}
                        />
                      </ChartCategoryAxis>
                      <ChartValueAxis>
                        <ChartValueAxisItem
                          labels={{ format: "{0:n0}" }}
                        />
                      </ChartValueAxis>
                      <ChartSeries>
                        {chart.series.map((series) => (
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
