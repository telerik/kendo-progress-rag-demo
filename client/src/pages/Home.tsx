import React from "react";
import { type TextAreaChangeEvent } from "@progress/kendo-react-inputs";
import { SearchInput } from "../components/SearchInput";
import { useNavigate } from "react-router-dom";

// Figma design asset URLs
const imgBot = `${import.meta.env.BASE_URL}bot.svg`;
const imgChartArea = `${import.meta.env.BASE_URL}chart-area.svg`;
const imgScanSearch = `${import.meta.env.BASE_URL}scan-search.svg`;
const imgSparkles = `${import.meta.env.BASE_URL}sparkles.svg`;
const imgBackground = `${import.meta.env.BASE_URL}background.svg`;

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (event: TextAreaChangeEvent) => {
    setSearchQuery(String(event.target.value || ""));
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate("/ai-search", { state: { query: searchQuery.trim() } });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      handleSearchSubmit();
    }
  };

  const demos = [
    {
      name: "Intelligent Search",
      icon: imgScanSearch,
      path: "/ai-search",
    },
    {
      name: "Financial Analysis",
      icon: imgChartArea,
      path: "/finance-analysis",
    },
    {
      name: "Knowledge Assistant",
      icon: imgBot,
      path: "/knowledge-assistant",
    },
    {
      name: "Agentic RAG Value",
      icon: imgSparkles,
      path: "/value-proposition",
    },
  ];

  const handleDemoClick = (path: string) => {
    navigate(path);
  };

  return (
    <div
      className="k-pos-relative k-overflow-x-hidden k-overflow-y-auto k-d-flex k-flex-column k-align-items-center k-justify-content-between k-px-md-9 k-px-xs-3"
      style={{ height: "calc(100vh - 54px)" }}
    >
      {/* Gradient background - positioned fixed to viewport */}
      <div className="k-pos-fixed k-overflow-hidden"
        style={{
          top: "54px",
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div className="k-pos-absolute"
          style={{
            width: "1266px",
            height: "331px",
            left: "50%",
            top: "calc(50% + 139.5px)",
            transform: "translate(-50%, -50%)",
            opacity: 0.6,
          }}
        >
          <div className="k-pos-absolute"
            style={{
              top: "-90.63%",
              right: "-23.7%",
              bottom: "-90.63%",
              left: "-23.7%",
            }}
          >
            <img className="k-d-block k-w-full k-h-full"
              src={imgBackground}
              alt=""
              style={{
                maxWidth: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Main heading + Subtitle */}
      <section className="k-pos-relative" style={{ zIndex: 1 }}>
        <div className="k-d-flex k-align-items-center k-justify-content-center hero-wrapper">
          <div className="k-d-flex k-flex-column k-text-center k-flex-1 k-gap-8">
            <h1
              className="gradient-heading k-mt-20 k-mb-8"
              style={{ padding: "10px" }}
            >
              Supercharging
              <br />
              AI-Powered Applications
            </h1>
            <p className="k-font-size-xl k-text-center k-flex-1 k-mb-0">
              Build AI-powered apps that look great, are easy to use, and rely
              on accurate, trustworthy data— <br />
              so they deliver real value where it counts.
            </p>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="k-pos-relative" style={{ zIndex: 1 }}>
        <div className="k-mt-17 k-d-flex k-flex-column k-align-items-center k-justify-content-between k-gap-25">
          <SearchInput
            query={searchQuery}
            onQueryChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onSearchClick={handleSearchSubmit}
            isLoading={false}
            placeholder="Ask about features, deployment, security, integrations..."
          />
          {/* Explore Demos section */}
          <div className="k-d-flex k-flex-column k-align-items-center k-w-full">
            <p className="k-font-size-xl k-font-weight-medium k-text-center k-mb-0 k-mb-4">
              Explore Demos
            </p>
            <div className="k-d-flex k-flex-wrap k-justify-content-center k-align-items-center k-gap-lg-8 k-gap-md-6 k-gap-3 k-w-full">
              {demos.map((demo) => (
                <div
                  key={demo.name}
                  className="demo-card"
                  onClick={() => handleDemoClick(demo.path)}
                >
                  <div className="demo-card-icon">
                    <img
                      src={demo.icon}
                      alt={demo.name}
                      style={{ width: "48px", height: "48px" }}
                    />
                  </div>
                  <div className="k-font-size-md">{demo.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="k-pos-relative k-d-flex k-align-items-center k-justify-content-center k-opacity-50 k-mt-26 footer">
        <p className="k-font-size-md k-text-center !k-mb-0 k-px-4 k-py-2">
          Copyright © 2025 Progress Software. All rights reserved. Progress® AI
          Powered
        </p>
      </footer>
    </div>
  );
}
