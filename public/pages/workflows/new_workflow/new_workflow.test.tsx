/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { store } from '../../../store';
import { NewWorkflow } from './new_workflow';

jest.mock('../../../services', () => {
  const { mockCoreServices } = require('../../../../test');
  return {
    ...jest.requireActual('../../../services'),
    ...mockCoreServices,
  };
});

jest.mock('../../../route_service', () => {
  const { mockRouteService } = require('../../../../test');
  return {
    ...jest.requireActual('../../../route_service'),
    ...mockRouteService,
  };
});

const renderWithRouter = () =>
  render(
    <Provider store={store}>
      <Router>
        <Switch>
          <Route render={() => <NewWorkflow />} />
        </Switch>
      </Router>
    </Provider>
  );

describe('NewWorkflow', () => {
  test('renders the search bar', () => {
    const { getByPlaceholderText, getAllByText } = renderWithRouter();
    expect(getAllByText('Create from a template')).toBeInTheDocument();
    expect(getByPlaceholderText('Search')).toBeInTheDocument();
  });
});
