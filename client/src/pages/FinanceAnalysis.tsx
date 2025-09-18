import React from "react";
import {
  Chat,
  type ChatSuggestion,
} from "@progress/kendo-react-conversational-ui";
import ChatMessage from "../components/ChatMessage";
import { useChatBot } from "../hooks/useChatBot";
import { Card } from "@progress/kendo-react-layout";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartValueAxis,
  ChartValueAxisItem,
} from "@progress/kendo-react-charts";

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
    botName: "Nuclia Financial Assistant",
    initialMessage:
      "Hello! I'm your Nuclia Financial assistant. I can help you by summarizing financial data and answering questions about companies. Try one of the suggestions below, or ask me anything about financial results of Apple, Amazon, Resolute, Exxon Mobil, Johnson&Jonson, Google, NVIDIA or Berkshire Hathaway!",
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

  return (
    <div className="k-bg-surface" style={{ minHeight: 'calc(100vh - 53px)' }}>
      <div className="k-d-grid k-grid-cols-1 k-grid-cols-xl-3 k-gap-lg k-p-lg" style={{ minHeight: 'calc(100vh - 53px - 2rem)' }}>
        {/* Left Panel - Chat */}
        <div className="k-d-flex k-col-span-1 k-col-span-xl-1 k-col-start-xl-1 k-col-end-xl-2" style={{ display: 'flex' }}>
          <Card>
            <div className="k-p-lg k-d-flex k-flex-col">
              <h2 className="k-font-size-xl k-font-bold k-mb-lg">Chat</h2>

              <Chat
                messages={chatBot.messages}
                authorId={chatBot.user.id}
                onSendMessage={chatBot.addNewMessage}
                placeholder={"Try a suggestion or ask about a company..."}
                className="k-border-transparent"
                height="calc(100vh - 200px)"
                messageTemplate={ChatMessage}
                suggestions={chatBot.availableSuggestions}
                onSuggestionClick={chatBot.handleSuggestionClick}
              />
            </div>
          </Card>
        </div>

        {/* Right Panel - Financial Charts Analysis */}
        <div className="k-d-flex k-col-span-1 k-col-span-xl-2 k-col-start-xl-2 k-col-end-xl-4">
          <Card className="k-flex-1">
            <div className="k-p-lg">
              <h2 className="k-font-size-xl k-font-bold k-mb-lg">
                Nuclia Financial Charts Analysis
              </h2>
              <div className="k-d-flex k-flex-col k-gap-lg">
                {/* Dynamic Charts from Nuclia answer (up to 3) */}
                <div>
                  {selectedCharts.length === 0 && (
                    <p className="k-text-secondary">
                      No charts available for the latest answer.
                    </p>
                  )}
                  {selectedCharts.length > 0 && (
                    <div className="k-d-flex k-flex-col k-gap-xl">
                      {selectedCharts.slice(0, 3).map((chart, idx) => (
                        <div key={idx} className="k-d-flex k-flex-col k-gap-sm">
                          <h4 className="k-font-size-md k-font-semibold k-mb-sm">
                            {chart.title}
                          </h4>
                          <Chart style={{ height: 210, width: "100%" }}>
                            <ChartCategoryAxis>
                              <ChartCategoryAxisItem
                                categories={chart.categories}
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
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
