import merge from 'lodash/merge';
import React from 'react';
import { SettingsQuery, useSettingsQuery } from '../../graphql';

const defaultSettings = {
  title: 'Art With Aliens',
};

export const SettingsContext = React.createContext<
  Omit<NonNullable<SettingsQuery['settings']>, 'title'> & { title: string }
>(defaultSettings);

const SettingsProvider: React.FC = ({ children }) => {
  const { data: { settings } = { settings: undefined } } = useSettingsQuery();

  return (
    <SettingsContext.Provider value={merge(defaultSettings, settings)}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
