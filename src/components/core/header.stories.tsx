import { MockedProvider } from '@apollo/react-testing';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { CartDocument, MenuDocument, MenuLocationEnum } from '../../graphql';
import Header from './header';

export default {
  title: 'Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Base: Story = () => (
  <MockedProvider
    mocks={[
      {
        request: {
          query: MenuDocument,
          variables: { location: MenuLocationEnum.PRIMARY_NAVIGATION },
        },
        result: {
          data: {
            menuItems: {
              nodes: [
                { id: '1', label: 'Home', url: '/', childItems: null },
                { id: '2', label: 'Shop', url: '/shop', childItems: null },
                { id: '3', label: 'Contact', url: '/contact', childItems: null },
              ],
            },
          },
        },
      },
      {
        request: {
          query: CartDocument,
        },
        result: {
          data: {
            cart: {
              contents: {
                itemCount: 1,
                nodes: [null],
              },
              contentsTotal: null,
              subtotal: null,
              total: null,
              availableShippingMethods: null,
              chosenShippingMethod: null,
            },
          },
        },
      },
    ]}
    addTypename={false}
  >
    <Header />
  </MockedProvider>
);
