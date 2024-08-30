import React from 'react';
import { render } from '@testing-library/react';
import { WorkflowDetail } from './workflow_detail';
import { store } from '../../store';
import { RouteComponentProps } from 'react-router-dom';
import { Provider } from 'react-redux';
// import configureStore from 'redux-mock-store';

// const mockStore = configureStore([]);
// const store = mockStore({
//   workflows: {
//     workflows: {
//       'some-workflow-id': {
//         id: 'some-workflow-id',
//         name: 'Test Workflow',
//       },
//     },
//     errorMessage: '',
//   },
// });
jest.mock('../../services', () => {
  const { mockCoreServices } = require('../../../test');
  return {
    ...jest.requireActual('../../services'),
    ...mockCoreServices,
  };
});
const mockSetActionMenu = jest.fn();

const mockProps: RouteComponentProps<{
  workflowId: string;
}> = {
  match: {
    params: {
      workflowId: 'some-workflow-id',
    },
    isExact: true,
    path: '',
    url: '',
  },
  location: {
    pathname: '',
    search: '',
    state: undefined,
    hash: '',
  },
  history: {
    length: 0,
    action: 'POP',
    location: {
      pathname: '',
      search: '',
      state: undefined,
      hash: '',
    },
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    block: jest.fn(),
    createHref: jest.fn(),
    listen: jest.fn(),
  },
};

describe('WorkflowDetail', () => {
  test('renders the WorkflowDetail component', () => {
    const { container } = render(
      <Provider store={store}>
        <WorkflowDetail {...mockProps} setActionMenu={mockSetActionMenu} />
      </Provider>
    );

    // Check for the presence of a `div` element in the rendered output
    const divElements = container.querySelectorAll('div');
    console.log('Div elements found:', divElements);

    // Expect at least one div element to be present
    expect(divElements.length).toBeGreaterThan(0);
  });
});
