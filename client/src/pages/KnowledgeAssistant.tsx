import { Chat, type ChatSuggestion } from "@progress/kendo-react-conversational-ui";
import ChatMessage from "../components/ChatMessage";
import { useChatBot } from '../hooks/useChatBot';
import { SvgIcon } from "@progress/kendo-react-common";
import { searchIcon } from "@progress/kendo-svg-icons";

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
    botName: 'Nuclia Assistant',
    initialMessage: 'Hello! I\'m your Nuclia AI assistant. I can help you with KendoReact questions and documentation. Try one of the suggestions below, or ask me anything about KendoReact components, theming, data visualization, and more!',
    apiEndpoint: '/api/ask',
    placeholder: 'Try a suggestion or ask about KendoReact...',
    suggestions: kendoSuggestions
  });

  return (
    <div className="k-h-full k-color-surface k-d-flex k-flex-column k-align-items-center k-justify-content-center k-px-4 k-px-sm-6 k-px-md-8 k-px-lg-12 k-px-xl-30 k-gap-2 k-gap-sm-3 k-gap-md-4" style={{ background: 'linear-gradient(134deg, #23A5D4 14.27%, #2E7BD2 49.62%, #20B4CB 85.65%)'}}>
      <div className="k-d-flex k-flex-column k-gap-2 k-gap-sm-3 k-gap-md-4">
        <div className="k-d-flex k-gap-2 k-align-items-center">
          <SvgIcon icon={searchIcon} size="xxlarge" className="k-flex-shrink-0" />
          <h1 className="k-h1 !k-mb-0">Nuclia Knowledge Assistant</h1>
        </div>
        <p className="!k-mb-0 k-font-size-xl">Explore the comprehensive Nuclia knowledge base with AI-powered intelligent search for precise, contextual results about Nuclia features, capabilities, and best practices</p>
      </div>
      <Chat
        messages={chatBot.messages}
        authorId={chatBot.user.id}
        onSendMessage={chatBot.addNewMessage}
        placeholder={'Try a suggestion or ask about KendoReact...'}
        height={"700px"}
        className="k-border-transparent"
        messageTemplate={ChatMessage}
        suggestions={chatBot.availableSuggestions}
        onSuggestionClick={chatBot.handleSuggestionClick}
      />
    </div>
  );
}

export default KnowledgeAssistant;