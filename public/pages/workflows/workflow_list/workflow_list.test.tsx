/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
//import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { WorkflowList } from './workflow_list';
import { mockStore } from '../../../../test/utils';
import { WORKFLOW_TYPE } from '../../../../common';

jest.mock('../../../services', () => {
  const { mockCoreServices } = require('../../../../test');
  return {
    ...jest.requireActual('../../../services'),
    ...mockCoreServices,
  };
});

const workflowId = 'cfP7EpEB8_-RPNi-REgT';
const workflowName = 'semantic_search';
const workflowType = WORKFLOW_TYPE.SEMANTIC_SEARCH;

const renderWithRouter = (
  workflowId: string,
  workflowName: string,
  workflowType: WORKFLOW_TYPE
) =>

render(
  <Provider store={mockStore(workflowId, workflowName, workflowType)}>
    <Router>
      <Switch>
        <Route render={() => <WorkflowList setSelectedTabId={jest.fn()} />} />
      </Switch>
    </Router>
  </Provider>
);

describe('WorkflowList', () => {
  test('renders the page', () => {
    const { getAllByText, getAllByRole } = renderWithRouter(
      workflowId,
      workflowName,
      workflowType
    );
    expect(getAllByText('Manage existing workflows').length).toBeGreaterThan(0);
    expect(getAllByText('Name').length).toBeGreaterThan(0);
    expect(getAllByText('Type').length).toBeGreaterThan(0);
    expect(getAllByText('Last saved').length).toBeGreaterThan(0);
    expect(getAllByText('Actions').length).toBeGreaterThan(0);
    expect(getAllByText('semantic_search').length).toBeGreaterThan(0);

    // Find the table rows or cells containing the workflow names
    const workflowRows = getAllByRole('row'); // Or use a more specific selector if needed
    const workflowNames = workflowRows.map(row => row.querySelector('[data-test-subj="workflowName"]')?.textContent);

    // Check if workflowNames array is sorted in ascending order
    const sortedWorkflowNames = [...workflowNames].sort((a, b) => a.localeCompare(b));

    console.log("workflowNames", workflowNames);
    console.log("sortedWorkflowNames", sortedWorkflowNames);
    
    expect(workflowNames).toEqual(sortedWorkflowNames);
  });
});
