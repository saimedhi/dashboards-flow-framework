import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  RouteComponentProps,
  Route,
  Switch,
  MemoryRouter,
} from 'react-router-dom';
import { WorkflowDetail } from './workflow_detail';
import { WorkflowDetailRouterProps } from '../../pages';
import '@testing-library/jest-dom';

jest.mock('../../services', () => {
  const { mockCoreServices } = require('../../../test');
  return {
    ...jest.requireActual('../../services'),
    ...mockCoreServices,
  };
});
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockStore = {
  getState: () => ({
    opensearch: {
      errorMessage: '',
    },
    workflows: {
      loading: false,
      errorMessage: '',
      workflows: {
        '12345': {
          id: '12345',
          name: 'test_workflow',
          use_case: 'CUSTOM',
          description: 'A blank workflow with no preset configurations',
          version: { template: '1.0.0', compatibility: ['2.17.0', '3.0.0'] },
          workflows: {},
          ui_metadata: {
            type: 'Custom',
            config: {
              search: {
                pipelineName: {
                  id: 'pipelineName',
                  type: 'string',
                  value: 'search_pipeline_248e2f68b43db682',
                },
                request: {
                  id: 'request',
                  type: 'json',
                  value:
                    '{\n  "query": {\n    "match_all": {}\n  },\n  "size": 1000\n}',
                },
                index: { name: { id: 'indexName', type: 'string' } },
                enrichRequest: { processors: [] },
                enrichResponse: { processors: [] },
              },
              ingest: {
                pipelineName: {
                  id: 'pipelineName',
                  type: 'string',
                  value: 'ingest_pipeline_7b139fd4eccac336',
                },
                enrich: { processors: [] },
                index: {
                  settings: { id: 'indexSettings', type: 'json' },
                  mappings: {
                    id: 'indexMappings',
                    type: 'json',
                    value: '{\n  "properties": {}\n}',
                  },
                  name: {
                    id: 'indexName',
                    type: 'string',
                    value: 'my-new-index',
                  },
                },
                enabled: { id: 'enabled', type: 'boolean', value: true },
              },
            },
          },
          lastUpdated: 1725413687437,
          resourcesCreated: [],
        },
      },
    },
  }),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
  replaceReducer: jest.fn(),
  [Symbol.observable]: jest.fn(),
};

const renderWithRouter = (initialEntries: string[]) =>
  render(
    <Provider store={mockStore}>
      <MemoryRouter initialEntries={initialEntries}>
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
    const workflowId = '12345';
    const { getAllByText, getByText, getByRole } = renderWithRouter([
      `/workflow/${workflowId}`,
    ]);

    expect(getAllByText('test_workflow').length).toBeGreaterThan(0);
    expect(getAllByText('Create an ingest pipeline').length).toBeGreaterThan(0);
    expect(getAllByText('Skip ingestion pipeline').length).toBeGreaterThan(0);
    expect(getAllByText('Define ingest pipeline').length).toBeGreaterThan(0);
    expect(getAllByText('Tools').length).toBeGreaterThan(0);
    expect(getAllByText('Preview').length).toBeGreaterThan(0);
    expect(getAllByText('Not started').length).toBeGreaterThan(0);
    expect(
      getAllByText('Last updated: 09/03/24 06:34 PM').length
    ).toBeGreaterThan(0);
    expect(getAllByText('Search pipeline').length).toBeGreaterThan(0);
    expect(getByText('Close')).toBeInTheDocument();
    expect(getByText('Export')).toBeInTheDocument();
    expect(getByText('Visual')).toBeInTheDocument();
    expect(getByText('JSON')).toBeInTheDocument();
    expect(getByRole('tab', { name: 'Run ingestion' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'Run queries' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'Errors' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'Resources' })).toBeInTheDocument();
  });
});
