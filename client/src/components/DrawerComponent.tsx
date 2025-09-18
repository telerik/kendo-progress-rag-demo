import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import { folderIcon, searchIcon, chartLineStackedMarkersIcon } from "@progress/kendo-svg-icons";
import type { To } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
    
const drawerItems = [
    { text: "Home", svgIcon: folderIcon, route: "/", selected: true },
    { text: "Knowledge Assistant", svgIcon: searchIcon, route: "/knowledge-assistant" },
    { text: "Finance Analysis", svgIcon: chartLineStackedMarkersIcon, route: "/finance-analysis" },
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
      width={220}
      className="k-h-full"
      drawerClassName="k-border-none"
    >
      <DrawerContent>
          {children}
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerComponent;