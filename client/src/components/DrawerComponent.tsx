import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerNavigation,
} from "@progress/kendo-react-layout";
import { SvgIcon } from "@progress/kendo-react-common";
import {
  pencilIcon,
  searchIcon,
  folderOpenIcon,
} from "@progress/kendo-svg-icons";
import type { To } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "@progress/kendo-react-layout";
import userImg from "../../public/drawer-user.svg";

const drawerItems = [
  { text: "New chat", svgIcon: pencilIcon, route: "/knowledge-assistant" },
  { text: "Search chats", svgIcon: searchIcon, route: "/knowledge-assistant" },
  { text: "Library", svgIcon: folderOpenIcon, route: "/knowledge-assistant" },
];

interface DrawerComponentProps {
  children: React.ReactNode;
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(window.innerWidth >= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSelect = (e: {
    itemTarget: { props: { route: To } };
    itemIndex: React.SetStateAction<number>;
  }) => {
    navigate(e.itemTarget.props.route);
  };

  const setSelectedItem = (pathName: string) => {
    const currentPath = drawerItems.find((item) => item.route === pathName);
    if (currentPath && currentPath.text) {
      return currentPath.text;
    }
  };

  const selected = setSelectedItem(location.pathname);

  return (
    <Drawer
      expanded={isExpanded}
      mode="push"
      onSelect={onSelect}
      width={220}
      className="k-h-full"
      drawerClassName="k-border-none"
    >
      <DrawerNavigation
        className="k-overflow-y-auto !k-pos-sticky drawer-navigation"
        style={{ height: "calc(100vh - 53px)", top: 53 }}
      >
        <div className="k-drawer-items k-h-full">
          {drawerItems.map((item) => (
            <div
              onClick={() => navigate(item.route)}
              key={item.text}
              className={`k-drawer-item ${
                selected === item.text ? "k-selected" : ""
              }`}
            >
              <SvgIcon icon={item.svgIcon} />
              <span className="k-item-text">{item.text}</span>
            </div>
          ))}
          <div className="k-mt-6 k-d-flex k-flex-column k-justify-content-between k-flex-1">
            <div>
              <span className="k-p-4" style={{ color: "#A1B0C7" }}>
                Chats
              </span>
              <div className="k-drawer-item">
                <span className="k-text-ellipsis">How do I get started with KendoReact components?</span>
              </div>
              <div className="k-drawer-item">
                <span className="k-text-ellipsis">
                  What are the best KendoReact components for data
                  visualization?
                </span>
              </div>
              <div className="k-drawer-item">
                <span className="k-text-ellipsis">
                  How to implement theming and styling with KendoReact?
                </span>
              </div>
            </div>
            <div className="k-d-flex k-gap-2 k-align-items-center k-p-4">
              <Avatar type="image">
                <img src={userImg} alt="User" />
              </Avatar>
              <div className="k-d-flex k-flex-column">
                <span>John Smith</span>
                <span style={{ opacity: "0.5" }}>Manager</span>
              </div>
            </div>
          </div>
        </div>
      </DrawerNavigation>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
};

export default DrawerComponent;
