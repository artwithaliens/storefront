import React from 'react';
import { SettingsQuery, useSettingsQuery } from '../../graphql';

export const SettingsContext = React.createContext<NonNullable<SettingsQuery['settings']>>({
  title: 'Art With Aliens',
});

const SettingsProvider: React.FC = ({ children }) => {
  const { data: { settings } = { settings: undefined } } = useSettingsQuery();

  return <SettingsContext.Provider value={settings ?? {}}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
