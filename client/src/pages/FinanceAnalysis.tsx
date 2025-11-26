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
        cursor: 'pointer'
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="250" height="200" viewBox="0 0 262 202" fill="none">
        <g filter="url(#filter0_d_550_2324)">
          <rect x="6" y="4" width="250" height="190" rx="16" fill="white"/>
          <rect x="6.5" y="4.5" width="249" height="189" rx="15.5" stroke="#E1E3E8"/>
          <path d="M84.2731 132.097C80.4559 129.516 77.9433 125.145 77.9433 120.191C77.9433 112.264 84.3696 105.834 92.3007 105.834V92.8522C77.2034 92.8522 64.9619 105.094 64.9619 120.191C64.9619 129.023 69.1508 136.879 75.6522 141.876" fill="url(#paint0_linear_550_2324)"/>
          <path d="M84.2731 132.097C86.5642 133.644 89.327 134.548 92.3007 134.548C96.2644 134.548 99.8565 132.94 102.455 130.342L110.951 140.181C106.065 144.742 99.5098 147.53 92.3007 147.53C86.0352 147.53 80.2629 145.421 75.6522 141.875" fill="#E0E7F2"/>
          <path d="M102.455 130.345C105.053 127.747 106.658 124.158 106.658 120.195H119.64C119.64 128.086 116.298 135.195 110.951 140.185" fill="#E3E3E3"/>
          <path d="M106.658 120.191C106.658 112.264 100.232 105.834 92.3008 105.834V92.8522C107.398 92.8522 119.64 105.094 119.64 120.191" fill="#A1B0C7"/>
          <path d="M196.54 59.1461C199.967 44.4414 190.825 29.7425 176.12 26.3152C161.415 22.888 146.716 32.0301 143.289 46.7348C139.862 61.4394 149.004 76.1383 163.709 79.5656C178.413 82.9929 193.112 73.8508 196.54 59.1461Z" fill="#E0E7F2"/>
          <path d="M196.653 66.1299C198.222 62.4199 199.09 58.3418 199.09 54.06C199.087 36.9361 185.205 23.0541 168.081 23.0541V52.0727C168.081 53.1664 168.903 54.4067 169.911 54.832L196.649 66.1264L196.653 66.1299Z" fill="url(#paint1_linear_550_2324)"/>
          <path d="M155.601 128.63C153.657 128.63 152.082 127.055 152.082 125.111L152.082 146.371C152.082 148.315 153.657 149.891 155.601 149.891C157.545 149.891 159.121 148.315 159.121 146.371L159.121 125.111C159.121 127.055 157.545 128.63 155.601 128.63Z" fill="url(#paint2_linear_550_2324)"/>
          <path d="M152.084 96.3717L152.084 125.111C152.084 123.167 153.66 121.591 155.604 121.591C157.548 121.591 159.123 123.167 159.123 125.111L159.123 96.3717C159.123 94.4276 157.548 92.8522 155.604 92.8522C153.66 92.8522 152.084 94.4276 152.084 96.3717Z" fill="#A1B0C7"/>
          <path d="M155.601 121.592C153.657 121.592 152.082 123.167 152.082 125.111C152.082 127.055 153.657 128.63 155.601 128.63C157.545 128.63 159.121 127.055 159.121 125.111C159.121 123.167 157.545 121.592 155.601 121.592Z" fill="#E0E7F2"/>
          <path d="M200.598 128.63C198.654 128.63 197.079 127.055 197.079 125.111L197.079 146.371C197.079 148.315 198.654 149.891 200.598 149.891C202.542 149.891 204.118 148.315 204.118 146.371L204.118 125.111C204.118 127.055 202.542 128.63 200.598 128.63Z" fill="url(#paint3_linear_550_2324)"/>
          <path d="M197.082 96.3717L197.082 125.111C197.082 123.167 198.657 121.591 200.601 121.591C202.545 121.591 204.12 123.167 204.12 125.111L204.12 96.3717C204.12 94.4276 202.545 92.8522 200.601 92.8522C198.657 92.8522 197.082 94.4276 197.082 96.3717Z" fill="#A1B0C7"/>
          <path d="M200.598 121.591C198.654 121.591 197.079 123.167 197.079 125.111C197.079 127.055 198.654 128.63 200.598 128.63C202.542 128.63 204.118 127.055 204.118 125.111C204.118 123.167 202.542 121.591 200.598 121.591Z" fill="#E0E7F2"/>
          <path d="M140.603 111.176C138.659 111.176 137.083 109.601 137.083 107.657L137.083 146.371C137.083 148.315 138.659 149.891 140.603 149.891C142.547 149.891 144.122 148.315 144.122 146.371L144.122 107.657C144.122 109.601 142.547 111.176 140.603 111.176Z" fill="url(#paint4_linear_550_2324)"/>
          <path d="M137.083 96.3717L137.083 107.657C137.083 105.713 138.659 104.137 140.603 104.137C142.547 104.137 144.122 105.713 144.122 107.657L144.122 96.3717C144.122 94.4277 142.547 92.8523 140.603 92.8523C138.659 92.8523 137.083 94.4277 137.083 96.3717Z" fill="#A1B0C7"/>
          <path d="M140.603 104.137C138.659 104.137 137.083 105.713 137.083 107.657C137.083 109.601 138.659 111.176 140.603 111.176C142.547 111.176 144.122 109.601 144.122 107.657C144.122 105.713 142.547 104.137 140.603 104.137Z" fill="#E0E7F2"/>
          <path d="M185.6 111.176C183.656 111.176 182.081 109.601 182.081 107.657L182.081 146.371C182.081 148.315 183.656 149.891 185.6 149.891C187.544 149.891 189.12 148.315 189.12 146.371L189.12 107.657C189.12 109.601 187.544 111.176 185.6 111.176Z" fill="url(#paint5_linear_550_2324)"/>
          <path d="M182.081 96.3717L182.081 107.657C182.081 105.713 183.656 104.137 185.6 104.137C187.544 104.137 189.12 105.713 189.12 107.657L189.12 96.3717C189.12 94.4276 187.544 92.8522 185.6 92.8522C183.656 92.8522 182.081 94.4276 182.081 96.3717Z" fill="#A1B0C7"/>
          <path d="M185.6 104.137C183.656 104.137 182.081 105.713 182.081 107.657C182.081 109.601 183.656 111.176 185.6 111.176C187.544 111.176 189.12 109.601 189.12 107.657C189.12 105.713 187.544 104.137 185.6 104.137Z" fill="#E0E7F2"/>
          <path d="M83.739 48.0092C83.739 45.6446 85.6552 43.7283 88.0199 43.7283H62.1605C59.7959 43.7283 57.8796 45.6446 57.8796 48.0092C57.8796 50.3738 59.7959 52.2901 62.1605 52.2901H88.0199C85.6552 52.2901 83.739 50.3738 83.739 48.0092Z" fill="url(#paint6_linear_550_2324)"/>
          <path d="M122.977 43.7316H88.0199C90.3845 43.7316 92.3008 45.6478 92.3008 48.0124C92.3008 50.3771 90.3845 52.2933 88.0199 52.2933H122.977C125.341 52.2933 127.257 50.3771 127.257 48.0124C127.257 45.6478 125.341 43.7316 122.977 43.7316Z" fill="#A1B0C7"/>
          <path d="M92.3007 48.0092C92.3007 45.6446 90.3845 43.7283 88.0199 43.7283C85.6552 43.7283 83.739 45.6446 83.739 48.0092C83.739 50.3738 85.6552 52.2901 88.0199 52.2901C90.3845 52.2901 92.3007 50.3738 92.3007 48.0092Z" fill="#E0E7F2"/>
          <path d="M104.969 29.7663C104.969 27.4016 106.885 25.4854 109.25 25.4854H62.1605C59.7959 25.4854 57.8796 27.4016 57.8796 29.7663C57.8796 32.1309 59.7959 34.0471 62.1605 34.0471H109.25C106.885 34.0471 104.969 32.1309 104.969 29.7663Z" fill="url(#paint7_linear_550_2324)"/>
          <path d="M122.977 25.4854H109.25C111.615 25.4854 113.531 27.4016 113.531 29.7663C113.531 32.1309 111.615 34.0471 109.25 34.0471H122.977C125.341 34.0471 127.257 32.1309 127.257 29.7663C127.257 27.4016 125.341 25.4854 122.977 25.4854Z" fill="#A1B0C7"/>
          <path d="M113.531 29.7663C113.531 27.4016 111.615 25.4854 109.25 25.4854C106.885 25.4854 104.969 27.4016 104.969 29.7663C104.969 32.1309 106.885 34.0471 109.25 34.0471C111.615 34.0471 113.531 32.1309 113.531 29.7663Z" fill="#E0E7F2"/>
          <path d="M68.6673 66.2552C68.6673 63.8906 70.5835 61.9744 72.9481 61.9744H62.1605C59.7959 61.9744 57.8796 63.8906 57.8796 66.2552C57.8796 68.6199 59.7959 70.5361 62.1605 70.5361H72.9481C70.5835 70.5361 68.6673 68.6199 68.6673 66.2552Z" fill="url(#paint8_linear_550_2324)"/>
          <path d="M77.2291 66.2552C77.2291 63.8906 75.3129 61.9744 72.9482 61.9744C70.5836 61.9744 68.6674 63.8906 68.6674 66.2552C68.6674 68.6199 70.5836 70.5361 72.9482 70.5361C75.3129 70.5361 77.2291 68.6199 77.2291 66.2552Z" fill="#E0E7F2"/>
          <path d="M122.976 61.9744H72.9481C75.3128 61.9744 77.229 63.8906 77.229 66.2552C77.229 68.6199 75.3128 70.5361 72.9481 70.5361H122.976C125.341 70.5361 127.257 68.6199 127.257 66.2552C127.257 63.8906 125.341 61.9744 122.976 61.9744Z" fill="#A1B0C7"/>
          <path d="M170.602 141.022C168.658 141.022 167.083 139.446 167.083 137.502L167.083 146.371C167.083 148.315 168.658 149.891 170.602 149.891C172.546 149.891 174.121 148.315 174.121 146.371L174.121 137.502C174.121 139.446 172.546 141.022 170.602 141.022Z" fill="url(#paint9_linear_550_2324)"/>
          <path d="M170.602 133.983C168.658 133.983 167.083 135.558 167.083 137.502C167.083 139.446 168.658 141.022 170.602 141.022C172.546 141.022 174.122 139.446 174.122 137.502C174.122 135.558 172.546 133.983 170.602 133.983Z" fill="#E0E7F2"/>
          <path d="M167.083 96.3718L167.083 137.502C167.083 135.558 168.658 133.983 170.602 133.983C172.546 133.983 174.122 135.558 174.122 137.502L174.122 96.3718C174.122 94.4277 172.546 92.8523 170.602 92.8523C168.658 92.8523 167.083 94.4277 167.083 96.3718Z" fill="#A1B0C7"/>
          <path d="M106.269 166.978C106.269 169.938 104.413 172.034 101.821 172.034C99.2449 172.034 97.3889 169.938 97.3889 166.978C97.3889 164.002 99.2449 161.922 101.821 161.922C104.413 161.922 106.269 164.002 106.269 166.978ZM105.005 166.978C105.005 164.674 103.725 163.058 101.821 163.058C99.9329 163.058 98.6529 164.674 98.6529 166.978C98.6529 169.282 99.9329 170.898 101.821 170.898C103.725 170.898 105.005 169.282 105.005 166.978ZM109.131 171.058V174.61H107.931V164.786H109.131V165.618C109.499 165.106 110.251 164.642 111.131 164.642C113.227 164.642 114.331 166.37 114.331 168.338C114.331 170.306 113.227 172.034 111.131 172.034C110.251 172.034 109.499 171.57 109.131 171.058ZM109.131 166.898V169.778C109.499 170.514 110.203 170.946 110.955 170.946C112.315 170.946 113.115 169.842 113.115 168.338C113.115 166.834 112.315 165.73 110.955 165.73C110.203 165.73 109.499 166.162 109.131 166.898ZM121.562 168.546H116.666C116.714 170.194 117.754 170.978 119.05 170.978C119.85 170.978 120.426 170.786 121.066 170.306V171.41C120.49 171.858 119.754 172.034 118.906 172.034C116.858 172.034 115.482 170.642 115.482 168.402C115.482 166.194 116.762 164.642 118.65 164.642C120.57 164.642 121.562 166.034 121.562 168.114V168.546ZM118.666 165.666C117.722 165.666 116.954 166.29 116.73 167.602H120.394C120.346 166.562 119.818 165.666 118.666 165.666ZM123.197 171.89V164.786H124.397V165.682C124.813 165.122 125.581 164.642 126.493 164.642C128.109 164.642 128.989 165.682 128.989 167.234V171.89H127.773V167.426C127.773 166.434 127.277 165.746 126.205 165.746C125.373 165.746 124.653 166.306 124.397 167.074V171.89H123.197ZM134.044 168.338C134.044 166.066 135.548 164.642 137.468 164.642C138.156 164.642 138.876 164.802 139.372 165.234V166.45C138.86 165.938 138.236 165.714 137.548 165.714C136.284 165.714 135.26 166.706 135.26 168.338C135.26 169.97 136.284 170.962 137.548 170.962C138.236 170.962 138.86 170.738 139.372 170.226V171.442C138.876 171.874 138.156 172.034 137.468 172.034C135.548 172.034 134.044 170.61 134.044 168.338ZM141.041 171.89V161.49H142.241V165.682C142.657 165.122 143.425 164.642 144.337 164.642C145.953 164.642 146.833 165.682 146.833 167.234V171.89H145.617V167.426C145.617 166.434 145.121 165.746 144.049 165.746C143.217 165.746 142.497 166.306 142.241 167.074V171.89H141.041ZM152.821 168.098V167.17C152.821 166.29 152.165 165.746 151.125 165.746C150.341 165.746 149.701 165.986 149.109 166.37V165.234C149.589 164.898 150.437 164.642 151.317 164.642C152.997 164.642 153.989 165.57 153.989 167.074V171.89H152.821V171.362C152.549 171.65 151.813 172.018 150.981 172.018C149.525 172.018 148.341 171.154 148.341 169.746C148.341 168.418 149.525 167.522 151.045 167.522C151.781 167.522 152.517 167.826 152.821 168.098ZM152.821 170.13V169.394C152.629 168.866 151.925 168.514 151.173 168.514C150.309 168.514 149.477 168.898 149.477 169.746C149.477 170.61 150.309 171.01 151.173 171.01C151.925 171.01 152.629 170.658 152.821 170.13ZM159.689 164.754V165.986C159.497 165.858 159.193 165.794 158.889 165.794C158.137 165.794 157.481 166.29 157.241 167.122V171.89H156.041V164.786H157.241V165.714C157.545 165.106 158.217 164.642 159.001 164.642C159.305 164.642 159.561 164.69 159.689 164.754ZM163.165 165.81V171.89H161.965V165.81H160.477V164.786H161.965V162.914H163.165V164.786H164.813V165.81H163.165Z" fill="#0D6EFD"/>
        </g>
        <defs>
          <filter id="filter0_d_550_2324" x="0" y="0" width="262" height="202" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="3"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0392157 0 0 0 0 0.172549 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_550_2324"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_550_2324" result="shape"/>
          </filter>
          <linearGradient id="paint0_linear_550_2324" x1="78.6313" y1="141.876" x2="78.6313" y2="92.8522" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D58DED"/>
            <stop offset="1" stopColor="#4258FF"/>
          </linearGradient>
          <linearGradient id="paint1_linear_550_2324" x1="183.586" y1="66.1299" x2="183.586" y2="23.0541" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D58DED"/>
            <stop offset="1" stopColor="#4258FF"/>
          </linearGradient>
          <linearGradient id="paint2_linear_550_2324" x1="159.121" y1="137.501" x2="152.082" y2="137.501" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D58DED"/>
            <stop offset="1" stopColor="#4258FF"/>
          </linearGradient>
          <linearGradient id="paint3_linear_550_2324" x1="204.118" y1="137.501" x2="197.079" y2="137.501" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D58DED"/>
            <stop offset="1" stopColor="#4258FF"/>
          </linearGradient>
          <linearGradient id="paint4_linear_550_2324" x1="144.122" y1="128.774" x2="137.083" y2="128.774" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D58DED"/>
            <stop offset="1" stopColor="#4258FF"/>
          </linearGradient>
          <linearGradient id="paint5_linear_550_2324" x1="189.12" y1="128.774" x2="182.081" y2="128.774" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D58DED"/>
            <stop offset="1" stopColor="#4258FF"/>
          </linearGradient>
          <linearGradient id="paint6_linear_550_2324" x1="72.9498" y1="52.2901" x2="72.9498" y2="43.7283" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D58DED"/>
            <stop offset="1" stopColor="#4258FF"/>
          </linearGradient>
          <linearGradient id="paint7_linear_550_2324" x1="83.5648" y1="34.0471" x2="83.5648" y2="25.4854" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D58DED"/>
            <stop offset="1" stopColor="#4258FF"/>
          </linearGradient>
          <linearGradient id="paint8_linear_550_2324" x1="65.4139" y1="70.5361" x2="65.4139" y2="61.9744" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D58DED"/>
            <stop offset="1" stopColor="#4258FF"/>
          </linearGradient>
          <linearGradient id="paint9_linear_550_2324" x1="174.121" y1="143.696" x2="167.083" y2="143.696" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D58DED"/>
            <stop offset="1" stopColor="#4258FF"/>
          </linearGradient>
        </defs>
      </svg>
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
            forceOneRow={isChartsExpanded}
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
            className="k-d-flex k-flex-column k-overflow-x-hidden k-justify-content-between financial-analysis" 
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
          <div className="k-d-flex k-flex-column k-pos-relative k-p-12 hero">
            <div className="k-d-flex k-flex-column" style={{ width: '100%', gap: '32px' }}>
              <h1 
                className="k-mb-0 k-h1"
                style={{
                  background: 'linear-gradient(105deg, #C158E4 11.99%, #0BF 49.33%, #001DFF 88.12%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
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
        <div className="k-d-flex k-flex-column k-flex-1 k-p-6 k-gap-8 chat-wrapper">
          <div 
            className={chatBot.messages.length > 1 ? "finance-analysis-chat-wrapper-conversation" : ""}
            style={{  display: 'flex', flexDirection: 'column', height: '100%', alignItems: "center", justifyContent: "flex-end"}}
          >
            {renderChat()}
          </div>
        </div>
          </div>
        </DrawerComponent>
      ) : (
        // Two-Panel Expanded Layout (No Drawer)
        <div className="k-overflow-auto preview-wrapper"
          
          style={{ height: 'calc(100vh - 54px)'}}
        >
          {/* Page Header */}
          <ChatHeaderTemplate messages={chatBot.messages} />
          <div className="k-d-grid k-grid-cols-1 k-grid-cols-xl-2 preview">
          {/* Left Panel - Chat (393px) */}
          <div className="k-align-self-end k-d-none k-d-xl-flex chat-preview k-pos-relative">
            {renderChat()}
          </div>

          {/* Right Panel - Charts (flex-1) */}
          <div className="k-d-flex k-flex-col k-py-4 k-align-content-center charts-preview" style={{ 
              
              border: "1px solid #FFF",
              background: "rgba(255, 255, 255, 0.50)",
              boxShadow: "0 4px 12px 0 rgba(13, 10, 44, 0.08)",
              backdropFilter: "blur(2px)"



          }}>
            {/* Glassmorphism Card */}
            <div className="k-align-self-center k-gap-9 "
              style={{
                
                maxWidth: "679px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                    gap: "20px",
                    textAlign: "center"
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
              <div className="k-d-flex k-flex-col k-gap-2.5">
                {selectedCharts.slice(0, 3).map((chart, idx) => (
                  <div key={idx} className="k-d-flex k-flex-col">
                    <p className="!k-mb-0 k-font-weight-medium k-color-subtle"
                    >
                      {chart.title}
                    </p>
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
        </div>
      )}
    </>
  );
}
