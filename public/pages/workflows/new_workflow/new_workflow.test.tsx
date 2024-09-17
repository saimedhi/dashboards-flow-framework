/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NewWorkflow } from './new_workflow';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from '../../../store/store';
import '@testing-library/jest-dom';

jest.mock('../../../services', () => {
  const { mockCoreServices } = require('../../../../test');
  return {
    ...jest.requireActual('../../../services'),
    ...mockCoreServices,
  };
});

const mockDispatch = jest.fn();

const mockStore = configureStore([]);

const initialState = {
  presets: {
    loading: false,
    success: 'hope',
    presetWorkflows: [
      {
        name: 'Custom',
        description: 'A blank workflow with no preset configurations',
        use_case: 'CUSTOM',
        version: { template: '1.0.0', compatibility: ['2.17.0', '3.0.0'] },
      },
      {
        name: 'Hybrid Search',
        description:
          'A basic workflow containing the ingest pipeline, search pipeline, and index configurations for performing hybrid search',
        version: { template: '1.0.0', compatibility: ['2.17.0', '3.0.0'] },
        ui_metadata: { type: 'Hybrid search' },
      },
      {
        name: 'Multimodal Search',
        description:
          'A basic workflow containing the ingest pipeline, search pipeline, and index configurations for performing multimodal search',
        version: { template: '1.0.0', compatibility: ['2.17.0', '3.0.0'] },
        ui_metadata: { type: 'Multimodal search' },
      },
      {
        name: 'Semantic Search',
        description:
          'A basic workflow containing the ingest pipeline, search pipeline, and index configurations for performing semantic search',
        version: { template: '1.0.0', compatibility: ['2.17.0', '3.0.0'] },
        ui_metadata: { type: 'Semantic search' },
      },
      {
        name: 'Sentiment Analysis',
        description:
          'A basic workflow containing the ingest pipeline, search pipeline, and index configurations for performing sentiment analysis',
        version: { template: '1.0.0', compatibility: ['2.17.0', '3.0.0'] },
        ui_metadata: { type: 'Sentiment analysis' },
      },
    ],
  },
};

const store = mockStore(initialState);

const renderWithProvider = () =>
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
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ReactReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
  });

  test('renders the search bar and workflows', () => {
    const {
      getByPlaceholderText,
      getAllByText,
      queryByText,
    } = renderWithProvider();

    // Assert that the search bar is rendered
    expect(getByPlaceholderText('Search')).toBeInTheDocument();

    // Assert that the "Custom" workflow is rendered
    expect(getAllByText('Custom')).toHaveLength(1);

    // Assert that the loading spinner is not rendered
    expect(queryByText('Loading')).toBeNull();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
