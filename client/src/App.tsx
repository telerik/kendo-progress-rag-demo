import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppBarComponent from "./components/AppBarComponent";
import DrawerComponent from "./components/DrawerComponent";
import Home from "./pages/Home";
import ChatDemo from "./pages/ChatDemo";
import GridDemo from "./pages/GridDemo";

export default function App() {

  return (
    <>
      <BrowserRouter basename={`/`}>
        <AppBarComponent />
        <DrawerComponent>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat-demo" element={<ChatDemo />} />
                <Route path="/grid-demo" element={<GridDemo />} />
            </Routes>
        </DrawerComponent>
      </BrowserRouter>
    </>
  )
}