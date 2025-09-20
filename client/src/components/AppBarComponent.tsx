import { AppBar, AppBarSection, AppBarSpacer } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { SvgIcon } from "@progress/kendo-react-common";
import { useNavigate } from 'react-router-dom';
import {
  searchIcon,
  homeIcon,
  chartLineStackedMarkersIcon,
  sparklesIcon
} from "@progress/kendo-svg-icons";

export default function AppBarComponent() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleSearchClick = () => {
    navigate('/knowledge-assistant');
  }

  const handleChartClick = () => {
    navigate('/finance-analysis');
  }

  return (
    <AppBar
      positionMode="sticky"
      style={{
        background: "linear-gradient(135deg, #0a5bb8 0%, #0d6edf 50%, #085096 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)"
      }}
    >
      <AppBarSection>
        <div className="k-d-flex k-align-items-center k-gap-md">
          <div className="k-d-flex k-align-items-center k-justify-content-center k-rounded-md k-w-8 k-h-8"
               style={{
                 background: "rgba(255, 255, 255, 0.2)",
                 border: "1px solid rgba(255, 255, 255, 0.3)"
               }}>
            <SvgIcon

              className="k-color-warning"
              icon={sparklesIcon}
            />
          </div>
          <h3 className="k-m-0 k-text-surface k-font-semibold k-font-size-xl k-d-none k-d-sm-block" style={{
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
          }}>
            Kendo + Progress Agentic RAG Demo
          </h3>
        </div>
      </AppBarSection>

      <AppBarSpacer />

      <AppBarSection>
        <div className="k-d-flex k-d-md-none k-align-items-center k-gap-sm">
          <Button
            svgIcon={homeIcon}
            fillMode="flat"
            themeColor="primary"
            className="k-rounded-sm k-text-surface"
            onClick={handleHomeClick}
          />
          <Button
            svgIcon={searchIcon}
            fillMode="flat"
            themeColor="primary"
            className="k-rounded-sm k-text-surface"
            onClick={handleSearchClick}
          />
          <Button
            svgIcon={chartLineStackedMarkersIcon}
            fillMode="flat"
            themeColor="primary"
            className="k-rounded-sm k-text-surface"
            onClick={handleChartClick}
          />
        </div>
      </AppBarSection>
    </AppBar>
  );
}