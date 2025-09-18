import { HashRouter, Route, Routes } from "react-router-dom";
import AppBarComponent from "./components/AppBarComponent";
import DrawerComponent from "./components/DrawerComponent";
import Home from "./pages/Home";
import KnowledgeAssistant from "./pages/KnowledgeAssistant";
import FinanceAnalysis from "./pages/FinanceAnalysis";

export default function App() {

  return (
    <>
      <HashRouter>
        <AppBarComponent />
        <DrawerComponent>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/knowledge-assistant" element={<KnowledgeAssistant />} />
                <Route path="/finance-analysis" element={<FinanceAnalysis />} />
            </Routes>
        </DrawerComponent>
      </HashRouter>
    </>
  )
}