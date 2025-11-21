import { AppBar, AppBarSection, AppBarSpacer } from "@progress/kendo-react-layout";
import { useLocation, useNavigate } from "react-router-dom";

const imgProgressLogo = `${import.meta.env.BASE_URL}progress-logo.svg`;

export default function AppBarComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const navItems = [
    { label: "Knowledge Assistant", path: "/knowledge-assistant" },
    { label: "Finance Analysis", path: "/finance-analysis" },
    { label: "Intelligent Search", path: "/ai-search" },
    { label: "Agentic RAG Value", path: "/value-proposition" },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  if (isHomePage) {
    return (
      <AppBar
        positionMode="sticky"
        style={{
          background: "#ffffff",
          borderBottom: "none",
          boxShadow: "0px 2px 7px 0px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          padding: "15px 32px"
        }}
      >
        <AppBarSection>
          <div 
            style={{ height: "24px", width: "102px", position: "relative", cursor: "pointer" }}
            onClick={handleLogoClick}
          >
            <img 
              src={imgProgressLogo} 
              alt="Progress Logo" 
              style={{ 
                display: "block", 
                maxWidth: "none", 
                width: "100%", 
                height: "100%" 
              }} 
            />
          </div>
        </AppBarSection>

        <AppBarSection>
          <p 
            className="k-m-0 k-font-weight-medium k-text-center" 
            style={{
              fontSize: "20px",
              lineHeight: "1",
              color: "var(--gray/light/black, #000000)",
              letterSpacing: "var(--kendo-letter-spacing, 0px)",
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            Progress Agentic RAG + Telerik DevTools
          </p>
        </AppBarSection>
      </AppBar>
    );
  }

  return (
    <AppBar
      positionMode="sticky"
      style={{
        background: "#ffffff",
        borderBottom: "none",
        boxShadow: "0px 2px 7px 0px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        padding: "15px 32px"
      }}
    >
      <AppBarSection>
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "16px",
            cursor: "pointer"
          }}
          onClick={handleLogoClick}
        >
          <div style={{ height: "24px", width: "102px", position: "relative" }}>
            <img 
              src={imgProgressLogo} 
              alt="Progress Logo" 
              style={{ 
                display: "block", 
                maxWidth: "none", 
                width: "100%", 
                height: "100%" 
              }} 
            />
          </div>
          <span 
            className="k-font-weight-medium" 
            style={{
              fontSize: "20px",
              lineHeight: "24px",
              color: "var(--gray/light/black, #000000)",
              letterSpacing: "var(--kendo-letter-spacing, 0px)"
            }}
          >
            Agentic RAG + Telerik DevTools
          </span>
        </div>
      </AppBarSection>

      <AppBarSpacer />

      <AppBarSection>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {navItems.map((item) => (
            <a
              className={`nav-link ${location.pathname === item.path ? "k-active" : ""}`}
              key={item.path}
              onClick={() => handleNavClick(item.path)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </AppBarSection>
    </AppBar>
  );
}