# Nuclia + KendoReact Demo

A comprehensive demo application showcasing the powerful integration between [Nuclia](https://nuclia.com/) AI-powered search capabilities and [KendoReact](https://www.telerik.com/kendo-react-ui) UI components. This application demonstrates how to build intelligent, data-driven interfaces that combine enterprise-grade AI retrieval with beautiful, functional user interfaces.

## 🚀 Live Demo

- **Frontend**: [https://telerik.github.io/nuclia-demo/](https://telerik.github.io/nuclia-demo/)
- **Backend API**: [https://nuclea-kendo-demo.azurewebsites.net](https://nuclea-kendo-demo.azurewebsites.net)

## 🌟 Features

### Knowledge Assistant
- **AI-Powered Q&A**: Ask questions about KendoReact documentation and get intelligent, contextual answers
- **Interactive Chat Interface**: Beautiful conversational UI powered by KendoReact Chat component
- **Smart Suggestions**: Pre-defined question suggestions to help users get started
- **Syntax Highlighting**: Code examples in responses are beautifully formatted with syntax highlighting
- **Real-time Streaming**: Server-sent events for responsive, real-time answer generation

### Finance Analysis
- **Structured Data Extraction**: AI processes financial documents and extracts structured chart data
- **Dynamic Chart Visualization**: Automatically generates interactive bar charts from AI responses
- **Multi-Company Analysis**: Query financial data for Apple, Amazon, Google, NVIDIA, and other major companies
- **Split-Screen Interface**: Chat on one side, dynamically generated charts on the other
- **Real-time Updates**: Charts update automatically as new financial queries are processed

## 🏗️ Architecture

This is a full-stack TypeScript application with:

### Frontend (`/client`)
- **React 19** with TypeScript
- **KendoReact Components** for enterprise-grade UI
- **Vite** for fast development and optimized builds
- **React Router** for navigation
- **Server-Sent Events** for real-time communication

### Backend (`/server`)
- **Node.js/Express** API server
- **Nuclia SDK** for AI-powered search and data extraction
- **TypeScript** for type safety
- **JSON Schema validation** for structured responses

## 🛠️ Tech Stack

### Frontend Technologies
- React 19 + TypeScript
- KendoReact UI Components
- React Router DOM
- React Syntax Highlighter
- Vite (build tool)

### Backend Technologies  
- Node.js + Express
- Nuclia Core SDK
- TypeScript
- CORS middleware
- dotenv for configuration

### KendoReact Components Used
- `Chat` - Conversational UI for AI interactions
- `Chart` - Dynamic data visualization
- `AppBar` - Application header with navigation
- `Drawer` - Collapsible navigation sidebar
- `Button` - Interactive elements
- `Card` - Content containers
- `Layout` components for responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Nuclia API keys (for backend functionality)
- KendoReact license (for UI components)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/telerik/nuclia-demo.git
   cd nuclia-demo
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies
   cd ../server && npm install
   ```

3. **Configure environment variables**

   **Server configuration** (`/server/.env`):
   ```bash
   # React Documentation Knowledge Box
   NUCLIA_KB=your_react_kb_id
   NUCLIA_API_KEY=your_react_api_key
   
   # Financial Data Knowledge Box
   NUCLIA_FIN_KB=your_finance_kb_id
   NUCLIA_FIN_API_KEY=your_finance_api_key
   
   PORT=5000
   ```

   **Client configuration** (`/client/.env`):
   ```bash
   # For development: leave empty (uses localhost:5000 via proxy)
   # For production: set to your deployed API URL
   VITE_API_BASE_URL=
   ```

4. **Activate KendoReact license**
   ```bash
   cd client
   npx kendo-ui-license activate
   ```

### Development

**Start both client and server concurrently:**
```bash
npm run dev
```

**Or start them separately:**
```bash
# Start backend server (from /server)
npm run dev

# Start frontend client (from /client)  
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Build

```bash
# Build both client and server
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
nuclia-demo/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── AppBarComponent.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── DrawerComponent.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useChatBot.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── KnowledgeAssistant.tsx
│   │   │   └── FinanceAnalysis.tsx
│   │   ├── config/         # Configuration files
│   │   │   └── api.ts
│   │   └── App.tsx         # Main application component
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend API
│   ├── src/
│   │   ├── schemas/        # JSON schemas for validation
│   │   │   └── charts-json-schema.ts
│   │   └── index.ts        # Main server file
│   ├── package.json
│   └── tsconfig.json
├── package.json           # Root package.json for scripts
└── README.md
```

## 🔧 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Knowledge Assistant
- `POST /api/ask` - Ask questions about React/KendoReact documentation
  ```json
  {
    "question": "How do I implement theming in KendoReact?"
  }
  ```

### Finance Analysis  
- `POST /api/ask-charts` - Query financial data with structured chart responses
  ```json
  {
    "question": "Compare Apple's revenue by product line in 2024 vs 2023"
  }
  ```

Both endpoints return Server-Sent Events (SSE) streams for real-time responses.

## 🎨 Key Features Explained

### Real-time Streaming Responses
The application uses Server-Sent Events (SSE) to stream AI responses in real-time, providing a responsive chat experience without blocking the UI.

### Structured Data Extraction
The finance analysis feature uses JSON Schema validation to ensure AI responses include properly structured chart data that can be immediately visualized.

### Responsive Design
Built with KendoReact's responsive utilities, the application adapts seamlessly to desktop, tablet, and mobile viewports.

### Code Syntax Highlighting
Chat responses automatically detect and highlight code blocks with proper language syntax highlighting for better readability.

## 🚀 Deployment

### Automated Deployment
The repository includes GitHub Actions workflows for automated deployment:

- **Frontend**: Deploys to GitHub Pages on push to `master`
- **Backend**: Deploys to Azure Web App on push to `master`

### Manual Deployment

**Frontend (Static hosting):**
```bash
cd client
npm run build
# Deploy contents of dist/ folder to your static hosting provider
```

**Backend (Node.js hosting):**
```bash
cd server  
npm run build
npm start
```

## 📄 License

This project is licensed under the ISC License.

## 🙋‍♂️ Support

For questions about:
- **KendoReact components**: Visit [KendoReact Documentation](https://www.telerik.com/kendo-react-ui/components/)
- **Nuclia AI platform**: Visit [Nuclia Documentation](https://docs.nuclia.com/)
- **This demo application**: Open an issue in this repository

## 🔗 Links

- [KendoReact Documentation](https://www.telerik.com/kendo-react-ui/components/)
- [Nuclia Platform](https://nuclia.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---