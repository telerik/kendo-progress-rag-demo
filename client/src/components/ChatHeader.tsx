import React from "react";
import { type Message } from "@progress/kendo-react-conversational-ui";
import { Button } from "@progress/kendo-react-buttons";

interface ChatHeaderTemplateProps {
  messages: Message[];
}

/**
 * Reusable header template for the Chat component.
 * Displays the first user question as plain text in the header.
 */
const ChatHeaderTemplate: React.FC<ChatHeaderTemplateProps> = ({
  messages,
}) => {
  const shareIcon = `${import.meta.env.BASE_URL}share.svg`;
  // Find the first user message (skip the initial bot message)
  const firstUserMessage = React.useMemo(() => {
    return messages.find((msg) => msg.author.id === 1); // User ID is 1
  }, [messages]);

  // Don't render anything if there's no user message yet
  if (!firstUserMessage || !firstUserMessage.text) {
    return null;
  }

  return (
    <div
      className="k-d-flex k-justify-content-space-between k-align-items-center k-px-4 k-py-2"
      style={{
        fontSize: "16px",
        lineHeight: "1.5",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <span>{firstUserMessage.text}</span>
      <Button imageUrl={shareIcon} fillMode="flat">
        Share
      </Button>
    </div>
  );
};

export default ChatHeaderTemplate;
