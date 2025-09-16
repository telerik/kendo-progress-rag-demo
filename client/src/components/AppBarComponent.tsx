import { AppBar, AppBarSection, AppBarSpacer } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Avatar } from "@progress/kendo-react-layout";
import { SvgIcon } from "@progress/kendo-react-common";
import { 
  searchIcon, 
  homeIcon,
  gearIcon,
  sparklesIcon
} from "@progress/kendo-svg-icons";

export default function AppBarComponent() {
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
          <h3 className="k-m-0 k-text-surface k-font-semibold k-font-size-xl" style={{ 
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
          }}>
            Kendo + Nuclia Demo
          </h3>
        </div>
      </AppBarSection>

      <AppBarSpacer />

      <AppBarSection>
        <div className="k-d-flex k-align-items-center k-gap-sm">
          <Button
            svgIcon={homeIcon}
            fillMode="flat"
            themeColor="primary"
            className="k-rounded-sm k-text-surface"
          />
          <Button
            svgIcon={searchIcon}
            fillMode="flat"
            themeColor="primary"
            className="k-rounded-sm k-text-surface"
          />
          <Button
            svgIcon={gearIcon}
            fillMode="flat"
            themeColor="primary"
            className="k-rounded-sm k-text-surface"
          />
          <div className="k-ml-md k-p-xs">
            <Avatar 
              type="text"
              className="k-text-surface k-font-bold"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)"
              }}
            >
              U
            </Avatar>
          </div>
        </div>
      </AppBarSection>
    </AppBar>
  );
}