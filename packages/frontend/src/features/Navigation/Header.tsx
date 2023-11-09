import React from 'react';
import TopBar from './TopBar';
import NavigationBar from './NavigationBar';
import { HeaderProps } from './types';
import HorizontalNavigationBar from './HorizontalClean/HorizontalNavigationBar';

const Header: React.FC<HeaderProps> = ({
  top,
  navigation,
  type = undefined,
}: HeaderProps) => {
  console.log('Header', top, navigation, type);
  return type === 'horizontal' ? (
    <div className="w-100">
      <HorizontalNavigationBar
        logo={navigation.logo}
        title={navigation.title}
        items={navigation.items}
        classNames={{...navigation.classNames}}
        actions={top}
      />
    </div>
  ) : (
    <div className="w-100">
      <TopBar items={top.items} showLogin={top?.showLogin} />
      <NavigationBar
        logo={navigation.logo}
        title={navigation.title}
        items={navigation.items}
      />
    </div>
  );
};

export default Header;
