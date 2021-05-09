import merge from 'lodash/merge';
import React, { useContext } from 'react';
import { SettingsQuery, useSettingsQuery } from '../../graphql';

const defaultSettings = {
  settings: {
    title: 'Art With Aliens',
  },
  seo: {},
};

export const SettingsContext =
  React.createContext<{
    settings: Omit<NonNullable<SettingsQuery['settings']>, 'title'> & { title: string };
    seo: NonNullable<SettingsQuery['seo']>;
  }>(defaultSettings);

export const SettingsProvider: React.FC = ({ children }) => {
  const { data = {} } = useSettingsQuery();

  return (
    <SettingsContext.Provider value={merge(defaultSettings, data)}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context == null) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
