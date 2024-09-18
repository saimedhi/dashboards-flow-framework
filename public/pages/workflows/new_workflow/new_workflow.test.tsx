/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NewWorkflow } from './new_workflow';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from '../../../store/store';
import '@testing-library/jest-dom';
import { loadPresetTemplates } from '../../../../test/utils';
import { INITIAL_ML_STATE } from '../../../../public/store';

jest.mock('../../../services', () => {
  const { mockCoreServices } = require('../../../../test');
  return {
    ...jest.requireActual('../../../services'),
    ...mockCoreServices,
  };
});

const mockStore = configureStore([]);
const initialState = {
  ml: INITIAL_ML_STATE,
  presets: {
    loading: false,
    presetWorkflows: loadPresetTemplates(),
  },
};
const store = mockStore(initialState);

const mockDispatch = jest.fn();

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
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ReactReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
  });

  test('renders the preset workflow templates', () => {
    const { getByPlaceholderText, getAllByText } = renderWithRouter();
    expect(getByPlaceholderText('Search')).toBeInTheDocument();
    expect(getAllByText('Custom')).toHaveLength(1);
    expect(getAllByText('Hybrid Search')).toHaveLength(1);
    expect(getAllByText('Multimodal Search')).toHaveLength(1);
    expect(getAllByText('Semantic Search')).toHaveLength(1);
  });

  test('renders the quick configure for preset workflow templates', async () => {
    const {
      getAllByTestId,
      getAllByText,
      getByTestId,
      queryByText,
    } = renderWithRouter();

    // Click the first "Go" button on the templates and test Quick Configure.
    const goButtons = getAllByTestId('goButton');
    userEvent.click(goButtons[0]);
    await waitFor(() =>
      expect(getAllByText('Quick configure')).toHaveLength(1)
    );

    // Verify that the create button is present in the Quick Configure pop-up.
    expect(getByTestId('quickConfigureCreateButton')).toBeInTheDocument();

    // Click the "Cancel" button in the Quick Configure pop-up.
    const quickConfigureCancelButton = getByTestId(
      'quickConfigureCancelButton'
    );
    userEvent.click(quickConfigureCancelButton);

    // Ensure the quick configure pop-up is closed after canceling.
    await waitFor(() =>
      expect(queryByText('quickConfigureCreateButton')).toBeNull()
    );
  });
});
