/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  INITIAL_ML_STATE,
  INITIAL_OPENSEARCH_STATE,
  INITIAL_PRESETS_STATE,
  INITIAL_WORKFLOWS_STATE,
} from '../public/store';
import { WORKFLOW_TYPE } from '../common/constants';
import { UIState, Workflow } from '../common/interfaces';
import {
  fetchEmptyMetadata,
  fetchHybridSearchMetadata,
  fetchMultimodalSearchMetadata,
  fetchSemanticSearchMetadata,
} from '../public/pages/workflows/new_workflow/utils';

export function mockStore(
  workflowId: string,
  workflowName: string,
  workflowType: WORKFLOW_TYPE
) {
  return {
    getState: () => ({
      opensearch: INITIAL_OPENSEARCH_STATE,
      ml: INITIAL_ML_STATE,
      workflows: {
        ...INITIAL_WORKFLOWS_STATE,
        workflows: {
          '1ECGC5EBUkBYAWA_XOrF': {
            id: '1ECGC5EBUkBYAWA_XOrF',
            name: 'semantic_search',
            use_case: '',
            description:
              'A basic workflow containing the ingest pipeline and index configurations for performing semantic search',
            version: {
              template: '1.0.0',
              compatibility: ['2.13.0', '3.0.0'],
            },
            workflows: {},
            ui_metadata: {
              type: 'Semantic search',
              config: {
                search: {
                  request: {
                    id: 'request',
                    type: 'json',
                    value:
                      '{\n  "query": {\n    "match_all": {}\n  },\n  "size": 1000\n}',
                  },
                  enrichRequest: {
                    processors: [],
                  },
                  enrichResponse: {
                    processors: [],
                  },
                },
                ingest: {
                  enrich: {
                    processors: [
                      {
                        name: 'ML Inference Processor',
                        id: 'ml_processor_ingest_d5478e92935a5e9a',
                        fields: [
                          {
                            id: 'model',
                            type: 'model',
                          },
                          {
                            id: 'inputMap',
                            type: 'mapArray',
                          },
                          {
                            id: 'outputMap',
                            type: 'mapArray',
                          },
                        ],
                        type: 'ml_processor',
                      },
                    ],
                  },
                  index: {
                    settings: {
                      id: 'indexSettings',
                      type: 'json',
                    },
                    mappings: {
                      id: 'indexMappings',
                      type: 'json',
                    },
                    name: {
                      id: 'indexName',
                      type: 'string',
                    },
                  },
                  source: {},
                  enabled: true,
                },
              },
            },
            lastUpdated: 1722475240633,
            state: 'Started',
            resourcesCreated: [],
          },
        },
      },
      presets: INITIAL_PRESETS_STATE,
    }),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
    [Symbol.observable]: jest.fn(),
  };
}

function generateWorkflow(
  workflowId: string,
  workflowName: string,
  workflowType: WORKFLOW_TYPE
): Workflow {
  return {
    id: workflowId,
    name: workflowName,
    version: { template: '1.0.0', compatibility: ['2.17.0', '3.0.0'] },
    ui_metadata: getConfig(workflowType),
  };
}
function getConfig(workflowType: WORKFLOW_TYPE) {
  let uiMetadata = {} as UIState;
  switch (workflowType) {
    case WORKFLOW_TYPE.SEMANTIC_SEARCH: {
      uiMetadata = fetchSemanticSearchMetadata();
      break;
    }
    case WORKFLOW_TYPE.MULTIMODAL_SEARCH: {
      uiMetadata = fetchMultimodalSearchMetadata();
      break;
    }
    case WORKFLOW_TYPE.HYBRID_SEARCH: {
      uiMetadata = fetchHybridSearchMetadata();
      break;
    }
    default: {
      uiMetadata = fetchEmptyMetadata();
      break;
    }
  }
  return uiMetadata;
}

export const resizeObserverMock = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
