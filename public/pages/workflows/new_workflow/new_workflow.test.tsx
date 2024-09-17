/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { mockStore } from '../../../../test/utils';
import { NewWorkflow } from './new_workflow';
import { WORKFLOW_TYPE } from '../../../../common/constants';
import { render, waitFor } from '@testing-library/react';
//import userEvent from '@testing-library/user-event';

jest.mock('../../../services', () => {
  const { mockCoreServices } = require('../../../../test');
  return {
    ...jest.requireActual('../../../services'),
    ...mockCoreServices,
  };
});
const mockDispatch = jest.fn();

jest.mock('../../../../public/store', () => ({
  ...jest.requireActual('../../../../public/store'),
  useAppDispatch: () => mockDispatch,
}));

// jest.mock('../../../../public/store/reducers', () => {
//   const { mockReducers } = require('../../../../test');
//   return {
//     ...jest.requireActual('../../../../public/store/reducers'),
//     ...mockReducers,
//   };
// });

const workflowId = '12345';
const workflowName = 'test_workflow';
const workflowType = WORKFLOW_TYPE.SEMANTIC_SEARCH;

const renderWithRouter = (
  workflowId: string,
  workflowName: string,
  workflowType: WORKFLOW_TYPE
) =>
  render(
    <Provider store={mockStore([workflowId, workflowName, workflowType])}>
      <Router>
        <Switch>
          <Route render={() => <NewWorkflow />} />
        </Switch>
      </Router>
    </Provider>
  );

describe('NewWorkflow', () => {
  test('renders the search bar', () => {
    const { getByPlaceholderText, getAllByText } = renderWithRouter(
      workflowId,
      workflowName,
      workflowType
    );
    expect(getByPlaceholderText('Search')).toBeInTheDocument();
    expect(getAllByText('Create from a template')).toBeInTheDocument();

    // const usecaseCard = getByTestId('usecase-card-Hybrid Search');
    // const goButton = usecaseCard.querySelector('button');

    // // Ensure the button exists
    // expect(goButton).toBeInTheDocument();

    // // Simulate a click on the "Go" button
    // await waitFor(() => userEvent.click(goButton!));
  });
});
