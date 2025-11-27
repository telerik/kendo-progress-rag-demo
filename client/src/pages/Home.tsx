import React from "react";
import { type TextAreaChangeEvent } from "@progress/kendo-react-inputs";
import { SearchInput } from "../components/SearchInput";
import { useNavigate } from "react-router-dom";

// Figma design asset URLs
const imgBot = `${import.meta.env.BASE_URL}bot.svg`;
const imgChartArea = `${import.meta.env.BASE_URL}chart-area.svg`;
const imgScanSearch = `${import.meta.env.BASE_URL}scan-search.svg`;
const imgSparkles = `${import.meta.env.BASE_URL}sparkles.svg`;

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
    <div className="home-container k-pos-relative k-overflow-x-hidden k-overflow-y-auto k-d-flex k-flex-column k-align-items-center k-justify-content-between k-px-md-9 k-px-xs-3">
      {/* Gradient background - positioned fixed to viewport */}
      <div className="home-background-fixed k-pos-fixed k-overflow-hidden">
        <div className="home-background-gradient k-pos-absolute">
          <div className="home-background-gradient-inner k-pos-absolute">
            <svg className="home-background-image k-d-block k-w-full k-h-full" width="1440" height="838" viewBox="0 0 1440 838" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.6" filter="url(#filter0_f_144_966)">
                <ellipse cx="720" cy="465.5" rx="633" ry="165.5" fill="url(#radialGradient)" opacity="0.4"/>
              </g>
              <defs>
                <filter id="filter0_f_144_966" x="-213" y="0" width="1866" height="931" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_144_966"/>
                </filter>
                <radialGradient id="radialGradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                  <stop offset="0%" stopColor="rgb(255, 0, 250)" stopOpacity="1"/>
                  <stop offset="50%" stopColor="rgb(0, 199, 255)" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="rgb(0, 119, 255)" stopOpacity="1"/>
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Main heading + Subtitle */}
      <section className="home-section k-pos-relative">
        <div className="k-d-flex k-align-items-center k-justify-content-center hero-wrapper">
          <div className="k-d-flex k-flex-column k-text-center k-flex-1 k-gap-8">
            <h1 className="gradient-heading home-heading-padding k-mt-20 k-mb-8">
              Supercharging
              <br />
              AI-Powered Applications
            </h1>
            <p className="k-font-size-xl k-text-center k-flex-1 !k-mb-0">
              Build AI-powered apps that look great, are easy to use, and rely
              on accurate, trustworthy data— <br />
              so they deliver real value where it counts.
            </p>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="home-section k-pos-relative">
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
            <p className="k-font-size-xl k-font-weight-medium k-text-center k-mb-4">
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
                      className="home-demo-icon"
                      src={demo.icon}
                      alt={demo.name}
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
