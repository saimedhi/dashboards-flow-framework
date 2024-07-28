/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoreStart, HttpFetchError } from '../../../src/core/public';
import {
  CREATE_WORKFLOW_NODE_API_PATH,
  DELETE_WORKFLOW_NODE_API_PATH,
  CAT_INDICES_NODE_API_PATH,
  GET_WORKFLOW_NODE_API_PATH,
  GET_WORKFLOW_STATE_NODE_API_PATH,
  SEARCH_WORKFLOWS_NODE_API_PATH,
  GET_PRESET_WORKFLOWS_NODE_API_PATH,
  SEARCH_MODELS_NODE_API_PATH,
  PROVISION_WORKFLOW_NODE_API_PATH,
  DEPROVISION_WORKFLOW_NODE_API_PATH,
  UPDATE_WORKFLOW_NODE_API_PATH,
  WorkflowTemplate,
  SEARCH_INDEX_NODE_API_PATH,
  INGEST_NODE_API_PATH,
  SIMULATE_PIPELINE_NODE_API_PATH,
  IngestPipelineConfig,
  SimulateIngestPipelineDoc,
  BULK_NODE_API_PATH,
} from '../common';

/**
 * A simple client-side service interface containing all of the available node API functions.
 * Exposed in services.ts.
 * Example function call: getRouteService().getWorkflow(<workflow-id>)
 *
 * Used in redux by wrapping them in async thunk functions which mutate redux state when executed.
 */
export interface RouteService {
  getWorkflow: (workflowId: string, dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
  searchWorkflows: (body: {}, dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
  getWorkflowState: (workflowId: string, dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
  createWorkflow: (body: {}, dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
  updateWorkflow: (
    workflowId: string,
    workflowTemplate: WorkflowTemplate,
    updateFields: boolean,
    dataSourceId: string|undefined
  ) => Promise<any | HttpFetchError>;
  provisionWorkflow: (workflowId: string, dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
  //TODO:FF
  deprovisionWorkflow: (
    workflowId: string,
    dataSourceId: string|undefined,
    resourceIds?: string,
  ) => Promise<any | HttpFetchError>;
  deleteWorkflow: (workflowId: string, dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
  getWorkflowPresets: (dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
  catIndices: (pattern: string, dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
  //TODO:FF
  searchIndex: (
    index: string,
    body: {},
    dataSourceId: string|undefined,
    searchPipeline?: string,
  ) => Promise<any | HttpFetchError>;
  ingest: (index: string, doc: {}, dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
  //TODO:FF
  bulk: (body: {}, dataSourceId: string|undefined, ingestPipeline?: string) => Promise<any | HttpFetchError>;
  searchModels: (body: {}, dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
  simulatePipeline: (body: {
    pipeline: IngestPipelineConfig;
    docs: SimulateIngestPipelineDoc[];
  },
  dataSourceId: string|undefined) => Promise<any | HttpFetchError>;
}

//TODO:FF
export function configureRoutes(core: CoreStart): RouteService {
  return {
    getWorkflow: async (workflowId: string, dataSourceId: string|undefined) => {
      try {
        const baseUrl = `${GET_WORKFLOW_NODE_API_PATH}/${workflowId}`;
        const url = dataSourceId ? `${baseUrl}/${dataSourceId}` : baseUrl;
        const response = await core.http.get<{ respString: string }>(url);
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    searchWorkflows: async (body: {}, dataSourceId: string|undefined) => {  
      try {
        const url = dataSourceId ? `api/flow_framework/${dataSourceId}/workflow/search` : SEARCH_WORKFLOWS_NODE_API_PATH;
        console.log('searchWorkflows entered', url);
        const response = await core.http.post<{ respString: string }>(
          url,
          {
            body: JSON.stringify(body),
          }
        );
        console.log('searchWorkflows success 1');
        return response;
      } catch (e: any) {
        console.log('searchWorkflows failed 1', e);
        return e as HttpFetchError;
      }
    },
    getWorkflowState: async (workflowId: string, dataSourceId: string|undefined) => {
      try {
        const response = await core.http.get<{ respString: string }>(
          `${GET_WORKFLOW_STATE_NODE_API_PATH}/${workflowId}`
        );
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    createWorkflow: async (body: {}, dataSourceId: string|undefined) => {
      try {
        const response = await core.http.post<{ respString: string }>(
          CREATE_WORKFLOW_NODE_API_PATH,
          {
            body: JSON.stringify(body),
          }
        );
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    updateWorkflow: async (
      workflowId: string,
      workflowTemplate: WorkflowTemplate,
      updateFields: boolean,
      dataSourceId: string|undefined
    ) => {
      try {
        const response = await core.http.put<{ respString: string }>(
          `${UPDATE_WORKFLOW_NODE_API_PATH}/${workflowId}/${updateFields}`,
          {
            body: JSON.stringify(workflowTemplate),
          }
        );
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    provisionWorkflow: async (workflowId: string, dataSourceId: string|undefined) => {
      try {
        const response = await core.http.post<{ respString: string }>(
          `${PROVISION_WORKFLOW_NODE_API_PATH}/${workflowId}`
        );
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    deprovisionWorkflow: async (workflowId: string, dataSourceId: string|undefined, resourceIds?: string) => {
      try {
        const path = resourceIds
          ? `${DEPROVISION_WORKFLOW_NODE_API_PATH}/${workflowId}/${resourceIds}`
          : `${DEPROVISION_WORKFLOW_NODE_API_PATH}/${workflowId}`;
        const response = await core.http.post<{ respString: string }>(path);
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    deleteWorkflow: async (workflowId: string, dataSourceId: string|undefined) => {
      try {
        const response = await core.http.delete<{ respString: string }>(
          `${DELETE_WORKFLOW_NODE_API_PATH}/${workflowId}`
        );
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    getWorkflowPresets: async (dataSourceId: string|undefined) => {
      try {
        const response = await core.http.get<{ respString: string }>(
          GET_PRESET_WORKFLOWS_NODE_API_PATH
        );
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    catIndices: async (pattern: string, dataSourceId: string|undefined) => {
      try {
        const response = await core.http.get<{ respString: string }>(
          `${CAT_INDICES_NODE_API_PATH}/${pattern}`
        );
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    searchIndex: async (index: string, body: {}, dataSourceId: string|undefined, searchPipeline?: string) => {
      try {
        const basePath = `${SEARCH_INDEX_NODE_API_PATH}/${index}`;
        const path = searchPipeline
          ? `${basePath}/${searchPipeline}`
          : basePath;
        const response = await core.http.post<{ respString: string }>(path, {
          body: JSON.stringify(body),
        });
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    ingest: async (index: string, doc: {}, dataSourceId: string|undefined) => {
      try {
        const response = await core.http.put<{ respString: string }>(
          `${INGEST_NODE_API_PATH}/${index}`,
          {
            body: JSON.stringify(doc),
          }
        );
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    bulk: async (body: {}, dataSourceId: string|undefined, ingestPipeline?: string) => {
      try {
        const path = ingestPipeline
          ? `${BULK_NODE_API_PATH}/${ingestPipeline}`
          : BULK_NODE_API_PATH;
        const response = await core.http.post<{ respString: string }>(path, {
          body: JSON.stringify(body),
        });
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    searchModels: async (body: {}, dataSourceId: string|undefined) => {
      try {
        const response = await core.http.post<{ respString: string }>(
          SEARCH_MODELS_NODE_API_PATH,
          {
            body: JSON.stringify(body),
          }
        );
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
    simulatePipeline: async (body: {
      pipeline: IngestPipelineConfig;
      docs: SimulateIngestPipelineDoc[];
    },
    dataSourceId: string|undefined) => {
      try {
        const response = await core.http.post<{ respString: string }>(
          SIMULATE_PIPELINE_NODE_API_PATH,
          {
            body: JSON.stringify(body),
          }
        );
        return response;
      } catch (e: any) {
        return e as HttpFetchError;
      }
    },
  };
}
