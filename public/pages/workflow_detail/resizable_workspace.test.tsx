/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { store } from '../../store';
import { ResizableWorkspace } from './resizable_workspace';
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
jest.mock('../../services', () => {
  const { mockCoreServices } = require('../../../test');
  return {
    ...jest.requireActual('../../services'),
    ...mockCoreServices,
  };
});

const renderWithRouter = () =>
  render(
    <Provider store={store}>
      <Router>
        <Switch>
          <Route render={() => <ResizableWorkspace workflow={jest.fn()} />} />
        </Switch>
      </Router>
    </Provider>
  );

describe('ResizableWorkspace', () => {
  test('renders the page', () => {
    const { getAllByText } = renderWithRouter();
    expect(getAllByText('Manage existing workflows').length).toBeGreaterThan(0);
  });
});
