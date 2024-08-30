/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  BrowserRouter as Router,
  RouteComponentProps,
  Route,
  Switch,
  MemoryRouter,
} from 'react-router-dom';
import { store } from '../../store';
import { WorkflowDetail } from './workflow_detail';
import { WorkflowDetailRouterProps } from '../../pages';

jest.mock('../../services', () => {
  const { mockCoreServices } = require('../../../test');
  return {
    ...jest.requireActual('../../services'),
    ...mockCoreServices,
  };
});

const renderWithRouter = (initialEntries: string[]) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries = {initialEntries}> 
        <Switch>
          <Route
            path="/workflow/:workflowId"
            render={(props: RouteComponentProps<WorkflowDetailRouterProps>) => (
              <WorkflowDetail setActionMenu={jest.fn()} {...props} />
            )}
          />
        </Switch>
      </MemoryRouter>
    </Provider>
  );

describe('WorkflowDetail', () => {
  test('renders the page with workflowId parameter', () => {
    // Render the component with a specific workflowId
    const workflowId = '12345';
    const { getAllByText } = renderWithRouter([`/workflow/${workflowId}`]);

    // // Assertions
    // expect(baseElement.tagName).toBe('BODY');
    // expect(container.tagName).toBe('DIV');

    // Add additional assertions to verify the component renders content based on workflowId
    // For example, you might want to check if certain elements are present
    // expect(container.innerHTML).toContain(Workflow ID: ${workflowId});
    expect(getAllByText('Workflows abcd').length).toBeGreaterThan(0);
  });
});