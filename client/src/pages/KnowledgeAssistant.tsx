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
      <div className="knowledge-assistant-container k-d-flex k-flex-column k-overflow-x-hidden k-pos-relative k-h-full">

        {/* Background Illustration with Vectors - Only show in idle state */}
        <VectorsBackground show={!hasConversationStarted} />

        {/* Hero Section - Only visible in idle state */}
        {!hasConversationStarted && (
          <div className="knowledge-assistant-hero k-d-flex k-flex-column knowledge-assistant-hero-wrapper k-pos-relative">
            <div className="knowledge-assistant-hero-content k-d-flex k-flex-column k-w-full k-gap-9">
              <h1 className="knowledge-assistant-title !k-mb-0 k-h1">
                Progress Agentic RAG Knowledge Assistant
              </h1>
              <p className="knowledge-assistant-description !k-mb-0">
                Use AI search to quickly find accurate, relevant information about Progress Agentic RAG—its features, capabilities, and best practices.
              </p>
            </div>
          </div>
        )}
        {hasConversationStarted && <ChatHeaderTemplate messages={chatBot.messages} />}
        {/* Chat Component */}
        <div className={`knowledge-assistant-conversation k-d-flex k-flex-column k-flex-1 k-align-items-center k-w-full conversation-container ${hasConversationStarted ? 'knowledge-assistant-conversation-started' : ''}`}>
          <div className={`knowledge-assistant-chat-wrapper chat-content-wrapper k-w-full k-d-flex k-flex-column k-pos-relative ${!hasConversationStarted ? 'show-gradient' : ''} ${hasConversationStarted ? 'knowledge-assistant-chat-flex-full' : 'knowledge-assistant-chat-flex-none'}`}>
            <Chat
              messages={hasConversationStarted ? chatBot.messages.slice(1) : chatBot.messages}
              authorId={chatBot.user.id}
              onSendMessage={chatBot.addNewMessage}
              placeholder="Try a suggestion or ask about KendoReact"
              className="k-border-transparent"
              height={hasConversationStarted ? "100%" : undefined}
              messageTemplate={ChatMessage}
              timestampTemplate={() => null }
              showUsername={false}
              messageWidthMode="full"
              messageBox={(props) => (
                <ChatMessageBox 
                  {...props} 
                  isLoading={chatBot.isLoading}
                  suggestions={chatBot.messages.length <= 1 ? chatBot.availableSuggestions : []}
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