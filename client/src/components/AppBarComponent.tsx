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
        className="app-bar k-overflow-hidden"
        positionMode="sticky"
      >
        <AppBarSection className="k-justify-content-center k-gap-2 k-w-full k-flex-lg-row k-flex-col k-pos-relative">
          <div
            className="app-bar-logo-container"
            onClick={handleLogoClick}
          >
            <img
              className="app-bar-logo-image k-d-block k-h-full k-w-full"
              src={imgProgressLogo}
              alt="Progress Logo"
            />
          </div>
          <p className="app-bar-title !k-m-0 k-font-weight-medium k-text-center">
            Agentic RAG + Telerik DevTools
          </p>
        </AppBarSection>
      </AppBar>
    );
  }

  return (
    <AppBar
      className={`app-bar ${isMobile ? 'app-bar-mobile' : ''} k-overflow-hidden`}
      positionMode="sticky"
    >
      <AppBarSection>
        <div
          className="app-bar-logo-wrapper k-d-flex k-align-items-center k-gap-2"
          onClick={handleLogoClick}
        >
          <div className={`k-pos-relative ${isMobile ? 'app-bar-logo-compact-container' : 'app-bar-logo-full-container'}`}>
            <img
              className="app-bar-logo-image k-d-block k-h-full k-w-full"
              src={isMobile ? imgProgressLogoCompact : imgProgressLogo}
              alt="Progress Logo"
            />
          </div>
          <span className={`k-font-weight-medium ${isMobile ? 'app-bar-title-mobile' : 'app-bar-title-desktop'}`}>
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
              className="app-bar-menu-button k-d-flex k-align-items-center k-gap-2"
              ref={menuButtonRef}
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
              <div className="mobile-menu-popup-content">
                {navItems.map((item) => (
                  <div
                    key={item.path}
                    className={`mobile-menu-item ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
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
