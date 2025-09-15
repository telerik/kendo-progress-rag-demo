import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import { homeIcon, commentIcon, gridIcon } from "@progress/kendo-svg-icons";
import type { To } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
    
const drawerItems = [
    { text: "Home", svgIcon: homeIcon, route: "/", selected: true },
    { text: "Nuclia AI Assistant", svgIcon: commentIcon, route: "/chat-demo" },
    { text: "Grid Demo", svgIcon: gridIcon, route: "/grid-demo" },
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

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSelect = (e: { itemTarget: { props: { route: To; }; }; itemIndex: React.SetStateAction<number>; }) => {
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
      items={drawerItems.map(item => ({
        ...item,
        selected: item.text === selected,
      }))}
      onSelect={onSelect}
      width={200}
      className="k-h-full k-flex-1"
    >
      <DrawerContent>
        <div className="k-overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerComponent;