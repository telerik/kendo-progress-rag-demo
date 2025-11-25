import { Chat, type ChatSuggestion } from "@progress/kendo-react-conversational-ui";
import ChatMessage from "../components/ChatMessage";
import { useChatBot } from '../hooks/useChatBot';
import DrawerComponent from "../components/DrawerComponent";
import { VectorsBackground } from "../components/VectorsBackground";
import ChatMessageBox from '../components/ChatMessageBox';
import ChatHeaderTemplate from '../components/ChatHeader';

const KnowledgeAssistant = () => {
  
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

  const chatBot = useChatBot({
    botName: 'Progress Agentic RAG Assistant',
    initialMessage: '👋 Hello! I\'m your Progress Agentic RAG AI assistant. I can help you with KendoReact questions and documentation. Try one of the suggestions below, or ask me anything about KendoReact like:\n- components\n- theming\n- data visualization\n- and more!',
    apiEndpoint: '/api/ask',
    placeholder: 'Try a suggestion or ask about KendoReact...',
    suggestions: kendoSuggestions
  });

  // Check if conversation has started (more than initial message)
  const hasConversationStarted = chatBot.messages.length > 1;

  return (
    <DrawerComponent>
      <div 
        className="k-d-flex k-flex-column k-overflow-x-hidden" 
        style={{ 
          height: '100%', 
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          position: 'relative',
        }}
      >
        {/* Background Illustration Blur Ellipse */}
        <div 
          style={{
            position: 'absolute',
            width: '815px',
            height: '63.344px',
            left: '184px',
            top: '789.66px',
            opacity: 0.6,
            pointerEvents: 'none',
            background: 'conic-gradient(from 270deg at 47.29% 49.93%, rgba(255, 0, 251, 0.60) 0deg, rgba(0, 200, 255, 0.30) 180deg, rgba(0, 119, 255, 0.60) 360deg)',
            filter: 'blur(75px)',
            borderRadius: '815px'
          }}
        />

        {/* Background Illustration with Vectors - Only show in idle state */}
        <VectorsBackground width="569px" height="725px" show={!hasConversationStarted} />

        {/* Hero Section - Only visible in idle state */}
        {!hasConversationStarted && (
          <div className="k-d-flex k-flex-column" style={{ paddingTop: '96px', paddingBottom: '24px', paddingLeft: '128px', paddingRight: '128px', position: 'relative', zIndex: 1 }}>
            <div className="k-d-flex k-flex-column" style={{ width: '100%', maxWidth: '770px', gap: '36px' }}>
              <h1 
                className="k-mb-0"
                style={{
                  background: 'linear-gradient(105deg, #C158E4 11.99%, #0BF 49.33%, #001DFF 88.12%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '56px',
                  fontWeight: 500,
                  lineHeight: 1.1,
                  letterSpacing: '-1.12px',
                  fontFamily: '"Metric", sans-serif'
                }}
              >
                Progress Agentic RAG Knowledge Assistant
              </h1>
              <p 
                className="k-mb-0"
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
        {hasConversationStarted && <ChatHeaderTemplate messages={chatBot.messages} />}
        {/* Chat Component */}
        <div 
          className="k-d-flex k-flex-column k-flex-1" 
          style={{ 
            minHeight: 0,
            width: '100%',
            alignItems: hasConversationStarted ? 'stretch' : 'center',
            boxSizing: 'border-box',
            padding: hasConversationStarted ? '24px' : '0'
          }}
        >
          <div style={{ 
            width: '100%',
            maxWidth: hasConversationStarted ? 'none' : '770px',
            paddingInline: hasConversationStarted ? '128px' : '0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
          }}>
            <Chat
              messages={hasConversationStarted ? chatBot.messages.slice(1) : chatBot.messages}
              authorId={chatBot.user.id}
              onSendMessage={chatBot.addNewMessage}
              placeholder="Try a suggestion or ask about KendoReact"
              className="k-border-transparent"
              height="100%"
              messageTemplate={ChatMessage}
              timestampTemplate={() => null }
              showUsername={false}
              messageWidthMode="full"
              messageBox={(props) => (
                <ChatMessageBox 
                  {...props} 
                  isLoading={chatBot.isLoading}
                  suggestions={chatBot.availableSuggestions}
                  onSuggestionClick={chatBot.handleSuggestionClick}
                  placeholder={chatBot.placeholder}
                  onSendMessage={(text) => {
                    chatBot.addNewMessage({
                      message: {
                        id: Date.now(),
                        author: chatBot.user,
                        timestamp: new Date(),
                        text
                      }
                    });
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
    </DrawerComponent>
  );
}

export default KnowledgeAssistant;