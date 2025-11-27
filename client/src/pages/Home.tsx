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
            <svg className="home-background-image k-d-block k-w-full k-h-full" width="1440" height="838" viewBox="0 0 1440 838" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              <g opacity="0.6" filter="url(#filter0_f_144_966)">
                <g clipPath="url(#clip0)">
                  {/* Top half - Pink to Cyan transition */}
                  <ellipse cx="720" cy="465.5" rx="633" ry="165.5" fill="url(#gradient_top)" opacity="0.4"/>
                  {/* Bottom half - Cyan to Blue transition */}
                  <ellipse cx="720" cy="465.5" rx="633" ry="165.5" fill="url(#gradient_bottom)" opacity="0.4"/>
                  {/* Left side - Pink emphasis */}
                  <ellipse cx="400" cy="465.5" rx="400" ry="165.5" fill="url(#gradient_left)" opacity="0.3"/>
                  {/* Right side - Blue emphasis */}
                  <ellipse cx="1040" cy="465.5" rx="400" ry="165.5" fill="url(#gradient_right)" opacity="0.3"/>
                </g>
              </g>
              <defs>
                <filter id="filter0_f_144_966" x="-213" y="0" width="1866" height="931" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_144_966"/>
                </filter>
                <clipPath id="clip0">
                  <ellipse cx="720" cy="465.5" rx="633" ry="165.5"/>
                </clipPath>
                {/* Top: Pink (270deg start) to Cyan */}
                <linearGradient id="gradient_top" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF00FB" stopOpacity="1"/>
                  <stop offset="100%" stopColor="#00C8FF" stopOpacity="0.5"/>
                </linearGradient>
                {/* Bottom: Cyan to Blue */}
                <linearGradient id="gradient_bottom" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#0077FF" stopOpacity="1"/>
                </linearGradient>
                {/* Left side: Pink radial */}
                <radialGradient id="gradient_left" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#FF00FB" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#FF00FB" stopOpacity="0"/>
                </radialGradient>
                {/* Right side: Blue radial */}
                <radialGradient id="gradient_right" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#0077FF" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#0077FF" stopOpacity="0"/>
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
                  className="demo-card k-elevation-2"
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
