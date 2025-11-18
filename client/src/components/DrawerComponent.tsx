import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerNavigation } from "@progress/kendo-react-layout";
import { SvgIcon } from "@progress/kendo-react-common";
import { folderIcon, searchIcon, chartLineStackedMarkersIcon, sparklesIcon } from "@progress/kendo-svg-icons";
import type { To } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';


const drawerItems = [
    { text: "Home", svgIcon: folderIcon, route: "/", selected: true },
    { text: "Knowledge Assistant", svgIcon: searchIcon, route: "/knowledge-assistant" },
    { text: "Finance Analysis", svgIcon: chartLineStackedMarkersIcon, route: "/finance-analysis" },
    { text: "AI Search", svgIcon: searchIcon, route: "/ai-search" }, // either this or the Knowledge Assistant icon has to be changed
    { text: "Value Proposition", svgIcon: sparklesIcon, route: "/value-proposition" },
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
      onSelect={onSelect}
      width={220}
      className="k-h-full"
      drawerClassName="k-border-none"
    >
      <DrawerNavigation className="k-overflow-y-auto !k-pos-sticky" style={{ height: 'calc(100vh - 53px)', top: 53}}>
        <ul className="k-drawer-items">
           {drawerItems.map(item => (
          <div onClick={() => navigate(item.route)} key={item.text} className={`k-drawer-item ${selected === item.text ? 'k-selected' : ''}`}>
            <SvgIcon icon={item.svgIcon} />
            <span className="k-item-text">{item.text}</span>
          </div>
        ))}
        </ul>
      </DrawerNavigation>
      <DrawerContent>
          {children}
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerComponent;