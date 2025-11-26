import { useState, useRef, useEffect } from "react";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
} from "@progress/kendo-react-layout";
import { Popup } from "@progress/kendo-react-popup";
import { useLocation, useNavigate } from "react-router-dom";

const imgProgressLogo = `${import.meta.env.BASE_URL}progress-logo.svg`;
const imgProgressLogoCompact = `${import.meta.env.BASE_URL}progress-logo-compact.svg`;

export default function AppBarComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowMenu(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        const popup = document.querySelector(".mobile-menu-popup");
        if (popup && !popup.contains(event.target as Node)) {
          setShowMenu(false);
        }
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const navItems = [
    { label: "Intelligent Search", path: "/ai-search" },
    { label: "Finance Analysis", path: "/finance-analysis" },
    { label: "Knowledge Assistant", path: "/knowledge-assistant" },
    { label: "Agentic RAG Value", path: "/value-proposition" },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setShowMenu(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  if (isHomePage) {
    return (
      <AppBar
        className="k-overflow-hidden"
        positionMode="sticky"
        style={{
          background: "#ffffff",
          borderBottom: "none",
          boxShadow: "0px 2px 7px 0px rgba(0, 0, 0, 0.08)",
          padding: "15px 32px",
        }}
      >
        <AppBarSection className="k-justify-content-center k-gap-2 k-w-full k-flex-lg-row k-flex-col k-pos-relative">
          <div
            style={{
              height: "24px",
              width: "102px",
              cursor: "pointer",
            }}
            onClick={handleLogoClick}
          >
            <img
              className="k-d-block k-h-full k-w-full"
              src={imgProgressLogo}
              alt="Progress Logo"
              style={{
                maxWidth: "none",
              }}
            />
          </div>
          <p
            className="!k-m-0 k-font-weight-medium k-text-center"
            style={{
              fontSize: "20px",
              lineHeight: "1",
              color: "#000000",
              letterSpacing: "var(--kendo-letter-spacing, 0px)",
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
      className="k-overflow-hidden"
      positionMode="sticky"
      style={{
        background: "#ffffff",
        borderBottom: "none",
        boxShadow: "0px 2px 7px 0px rgba(0, 0, 0, 0.08)",
        padding: isMobile ? "15px 12px" : "15px 32px",
      }}
    >
      <AppBarSection>
        <div
          className="k-d-flex k-align-items-center k-gap-2"
          style={{
            cursor: "pointer",
          }}
          onClick={handleLogoClick}
        >
          <div className="k-pos-relative" style={{ height: "24px", width: isMobile ? "24px" : "102px" }}>
            <img
              className="k-d-block k-h-full k-w-full"
              src={isMobile ? imgProgressLogoCompact : imgProgressLogo}
              alt="Progress Logo"
              style={{
                maxWidth: "none",
              }}
            />
          </div>
          <span
            className="k-font-weight-medium"
            style={{
              fontSize: isMobile ? "14px" : "20px",
              lineHeight: isMobile ? "1" : "24px",
              color: "#000000",
              letterSpacing: "var(--kendo-letter-spacing, 0px)",
            }}
          >
            Agentic RAG + Telerik DevTools
          </span>
        </div>
      </AppBarSection>

      <AppBarSpacer />

      <AppBarSection>
        {!isMobile ? (
          <div className="k-d-flex k-gap-6 k-align-items-center">
            {navItems.map((item) => (
              <a
                className={`nav-link ${
                  location.pathname === item.path ? "k-active" : ""
                }`}
                key={item.path}
                onClick={() => handleNavClick(item.path)}
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : (
          <>
            <div
              className="k-d-flex k-align-items-center k-gap-2"
              ref={menuButtonRef}
              style={{
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 400,
                color: "#000000",
              }}
              onClick={toggleMenu}
            >
              MENU
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 18L20 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 12L20 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 6L20 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Popup
              anchor={menuButtonRef.current}
              show={showMenu}
              popupClass="mobile-menu-popup"
              anchorAlign={{ horizontal: "right", vertical: "bottom" }}
              popupAlign={{ horizontal: "right", vertical: "top" }}
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  padding: "8px",
                  minWidth: "200px",
                  marginTop: "8px",
                }}
              >
                {navItems.map((item) => (
                  <div
                    key={item.path}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      fontSize: "16px",
                      fontWeight:
                        location.pathname === item.path ? 600 : 400,
                      color:
                        location.pathname === item.path
                          ? "#000000"
                          : "#A1B0C7",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleNavClick(item.path)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f5f5f5";
                      if (location.pathname !== item.path) {
                        e.currentTarget.style.color = "#000000";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      if (location.pathname !== item.path) {
                        e.currentTarget.style.color = "#A1B0C7";
                      }
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </Popup>
          </>
        )}
      </AppBarSection>
    </AppBar>
  );
}
