/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Node, Edge } from 'reactflow';
import { FormikValues } from 'formik';
import { ObjectSchema } from 'yup';
import { COMPONENT_CLASS, PROCESSOR_TYPE } from './constants';

export type Index = {
  name: string;
  health: 'green' | 'yellow' | 'red';
};

/**
 ********** WORKFLOW TYPES/INTERFACES **********
TODO: over time these can become less generic as the form inputs & UX becomes finalized
 */

export type ConfigFieldType = 'string' | 'json' | 'select' | 'model' | 'map';
export type ConfigSelectType = 'model';
export type ConfigFieldValue = string | {};
export interface IConfigField {
  label: string;
  type: ConfigFieldType;
  id: string;
  value?: ConfigFieldValue;
  placeholder?: string;
  helpText?: string;
  helpLink?: string;
  selectType?: ConfigSelectType;
}
export interface IConfig {
  id: string;
  name: string;
  fields: IConfigField[];
}

export interface IProcessorConfig extends IConfig {
  type: PROCESSOR_TYPE;
}

export type EnrichConfig = {
  processors: IProcessorConfig[];
};

export type IndexConfig = {
  name: IConfigField;
};

export type IngestConfig = {
  source: IConfig;
  enrich: EnrichConfig;
  index: IndexConfig;
};

export type SearchConfig = {
  request: IConfig;
  enrichRequest: IConfig;
  enrichResponse: IConfig;
};

export type WorkflowConfig = {
  ingest: IngestConfig;
  search: SearchConfig;
};

export type MapEntry = {
  key: string;
  value: string;
};

export type MapFormValue = MapEntry[];

export type WorkflowFormValues = {
  ingest: FormikValues;
  search: FormikValues;
};

export type WorkflowSchemaObj = {
  [key: string]: ObjectSchema<any, any, any>;
};
export type WorkflowSchema = ObjectSchema<WorkflowSchemaObj>;

/**
 ********** WORKSPACE TYPES/INTERFACES **********
 */

export type FieldType = 'string' | 'json' | 'select' | 'model';
export type SelectType = 'model';
export type FieldValue = string | {};
export type ComponentFormValues = FormikValues;
export type WorkspaceFormValues = {
  [componentId: string]: ComponentFormValues;
};
export type WorkspaceSchemaObj = {
  [componentId: string]: ObjectSchema<any, any, any>;
};
export type WorkspaceSchema = ObjectSchema<WorkspaceSchemaObj>;

export interface IComponentInput {
  id: string;
  label: string;
  acceptMultiple: boolean;
}

export interface IComponentOutput {
  id: string;
  label: string;
}

/**
 * An input field for a component. Specifies enough configuration for the
 * UI node to render it properly (help text, links, etc.)
 */
export interface IComponentField {
  label: string;
  type: FieldType;
  id: string;
  value?: FieldValue;
  placeholder?: string;
  helpText?: string;
  helpLink?: string;
  selectType?: SelectType;
}

/**
 * The base interface the components will implement.
 */
export interface IComponent {
  type: COMPONENT_CLASS;
  label: string;
  description: string;
  inputs?: IComponentInput[];
  outputs?: IComponentOutput[];
}

/**
 * We need to include some extra instance-specific data to the ReactFlow component
 * to perform extra functionality, such as deleting the node from the ReactFlowInstance.
 */
export interface IComponentData extends IComponent {
  id: string;
  selected?: boolean;
}

export type ReactFlowComponent = Node<IComponentData>;
export type ReactFlowEdge = Edge<{}> & {
  key: string;
  sourceClasses: COMPONENT_CLASS[];
  targetClasses: COMPONENT_CLASS[];
};

type ReactFlowViewport = {
  x: number;
  y: number;
  zoom: number;
};

export type UIState = {
  config: WorkflowConfig;
  workspace_flow?: WorkspaceFlowState;
};

export type WorkspaceFlowState = {
  nodes: ReactFlowComponent[];
  edges: ReactFlowEdge[];
  viewport?: ReactFlowViewport;
};

/**
 ********** USE CASE TEMPLATE TYPES/INTERFACES **********
 */

export type IngestProcessor = {};
export type SearchProcessor = {};
export type SearchRequestProcessor = SearchProcessor & {};
export type SearchResponseProcessor = SearchProcessor & {};
export type SearchPhaseResultsProcessor = SearchProcessor & {};

export type MLInferenceProcessor = IngestProcessor & {
  ml_inference: {
    model_id: string;
    input_map?: {};
    output_map?: {};
  };
};

export type TextEmbeddingProcessor = IngestProcessor & {
  text_embedding: {
    model_id: string;
    field_map: {};
  };
};

export type SparseEncodingProcessor = IngestProcessor & {
  sparse_encoding: {
    model_id: string;
    field_map: {};
  };
};

export type NormalizationProcessor = SearchProcessor & {
  normalization: {
    technique: string;
  };
  combination: {
    technique: string;
    parameters: {
      weights: number[];
    };
  };
};

export type IndexConfiguration = {
  settings: {};
  mappings: IndexMappings;
};

export type IndexMappings = {
  properties: {};
};

export type TemplateNode = {
  id: string;
  type: string;
  previous_node_inputs?: {};
  user_inputs?: {};
};

export type CreateIngestPipelineNode = TemplateNode & {
  user_inputs: {
    pipeline_id: string;
    model_id?: string;
    input_field?: string;
    output_field?: string;
    configurations: {
      description?: string;
      processors: IngestProcessor[];
    };
  };
};

export type CreateSearchPipelineNode = TemplateNode & {
  user_inputs: {
    pipeline_id: string;
    configurations: {
      description?: string;
      request_processors?: SearchRequestProcessor[];
      response_processors?: SearchResponseProcessor[];
      phase_results_processors?: SearchPhaseResultsProcessor[];
    };
  };
};

export type CreateIndexNode = TemplateNode & {
  previous_node_inputs?: {
    [ingest_pipeline_step_id: string]: string;
  };
  user_inputs: {
    index_name: string;
    configurations: {
      settings: {};
      mappings: {};
    };
  };
};

export type RegisterPretrainedModelNode = TemplateNode & {
  user_inputs: {
    name: string;
    description: string;
    model_format: string;
    version: string;
    deploy: boolean;
  };
};

export type TemplateEdge = {
  source: string;
  dest: string;
};

export type TemplateFlow = {
  nodes: TemplateNode[];
  edges?: TemplateEdge[];
};

export type TemplateFlows = {
  provision: TemplateFlow;
};

// A stateless template of a workflow
export type WorkflowTemplate = {
  name: string;
  description: string;
  use_case: USE_CASE;
  // TODO: finalize on version type when that is implemented
  // https://github.com/opensearch-project/flow-framework/issues/526
  version: any;
  workflows: TemplateFlows;
  // UI state and any ReactFlow state may not exist if a workflow is created via API/backend-only.
  ui_metadata?: UIState;
};

// An instance of a workflow based on a workflow template
export type Workflow = WorkflowTemplate & {
  // won't exist until created in backend
  id?: string;
  // won't exist until created in backend
  lastUpdated?: number;
  // won't exist until launched/provisioned in backend
  lastLaunched?: number;
  // won't exist until launched/provisioned in backend
  state?: WORKFLOW_STATE;
  // won't exist until launched/provisioned in backend
  resourcesCreated?: WorkflowResource[];
};

export enum USE_CASE {
  SEMANTIC_SEARCH = 'SEMANTIC_SEARCH',
  NEURAL_SPARSE_SEARCH = 'NEURAL_SPARSE_SEARCH',
  HYBRID_SEARCH = 'HYBRID_SEARCH',
}

/**
 ********** ML PLUGIN TYPES/INTERFACES **********
 */

// Based off of https://github.com/opensearch-project/ml-commons/blob/main/common/src/main/java/org/opensearch/ml/common/model/MLModelState.java
export enum MODEL_STATE {
  REGISTERED = 'Registered',
  REGISTERING = 'Registering',
  DEPLOYING = 'Deploying',
  DEPLOYED = 'Deployed',
  PARTIALLY_DEPLOYED = 'Partially deployed',
  UNDEPLOYED = 'Undeployed',
  DEPLOY_FAILED = 'Deploy failed',
}

// Based off of https://github.com/opensearch-project/ml-commons/blob/main/common/src/main/java/org/opensearch/ml/common/FunctionName.java
export enum MODEL_ALGORITHM {
  LINEAR_REGRESSION = 'Linear regression',
  KMEANS = 'K-means',
  AD_LIBSVM = 'AD LIBSVM',
  SAMPLE_ALGO = 'Sample algorithm',
  LOCAL_SAMPLE_CALCULATOR = 'Local sample calculator',
  FIT_RCF = 'Fit RCF',
  BATCH_RCF = 'Batch RCF',
  ANOMALY_LOCALIZATION = 'Anomaly localization',
  RCF_SUMMARIZE = 'RCF summarize',
  LOGISTIC_REGRESSION = 'Logistic regression',
  TEXT_EMBEDDING = 'Text embedding',
  METRICS_CORRELATION = 'Metrics correlation',
  REMOTE = 'Remote',
  SPARSE_ENCODING = 'Sparse encoding',
  SPARSE_TOKENIZE = 'Sparse tokenize',
  TEXT_SIMILARITY = 'Text similarity',
  QUESTION_ANSWERING = 'Question answering',
  AGENT = 'Agent',
}

export enum MODEL_CATEGORY {
  DEPLOYED = 'Deployed',
  PRETRAINED = 'Pretrained',
}

export enum PRETRAINED_MODEL_FORMAT {
  TORCH_SCRIPT = 'TORCH_SCRIPT',
}

export type PretrainedModel = {
  name: string;
  shortenedName: string;
  description: string;
  format: PRETRAINED_MODEL_FORMAT;
  algorithm: MODEL_ALGORITHM;
  version: string;
};

export type PretrainedSentenceTransformer = PretrainedModel & {
  vectorDimensions: number;
};

export type PretrainedSparseEncodingModel = PretrainedModel & {};

export type ModelConfig = {
  modelType?: string;
  embeddingDimension?: number;
};

export type Model = {
  id: string;
  name: string;
  algorithm: MODEL_ALGORITHM;
  state: MODEL_STATE;
  modelConfig?: ModelConfig;
};

export type ModelDict = {
  [modelId: string]: Model;
};

export type ModelFormValue = {
  id: string;
  category?: MODEL_CATEGORY;
  algorithm?: MODEL_ALGORITHM;
};

/**
 ********** MISC TYPES/INTERFACES ************
 */

// TODO: finalize how we have the launch data model
export type WorkflowLaunch = {
  id: string;
  state: WORKFLOW_STATE;
  lastUpdated: number;
};

// Based off of https://github.com/opensearch-project/flow-framework/blob/main/src/main/java/org/opensearch/flowframework/model/State.java
export enum WORKFLOW_STATE {
  NOT_STARTED = 'Not started',
  PROVISIONING = 'Provisioning',
  FAILED = 'Failed',
  COMPLETED = 'Completed',
}

export type WorkflowResource = {
  id: string;
  stepType: WORKFLOW_STEP_TYPE;
  type: WORKFLOW_RESOURCE_TYPE;
};

// Based off of https://github.com/opensearch-project/flow-framework/blob/main/src/main/java/org/opensearch/flowframework/common/WorkflowResources.java
export enum WORKFLOW_RESOURCE_TYPE {
  PIPELINE_ID = 'Ingest pipeline',
  INDEX_NAME = 'Index',
  MODEL_ID = 'Model',
  MODEL_GROUP_ID = 'Model group',
  CONNECTOR_ID = 'Connector',
}

export enum WORKFLOW_STEP_TYPE {
  CREATE_INGEST_PIPELINE_STEP_TYPE = 'create_ingest_pipeline',
  CREATE_SEARCH_PIPELINE_STEP_TYPE = 'create_search_pipeline',
  CREATE_INDEX_STEP_TYPE = 'create_index',
  REGISTER_LOCAL_PRETRAINED_MODEL_STEP_TYPE = 'register_local_pretrained_model',
  REGISTER_LOCAL_SPARSE_ENCODING_MODEL_STEP_TYPE = 'register_local_sparse_encoding_model',
}

// We cannot disambiguate ingest vs. search pipelines based on workflow resource type. To work around
// that, we maintain this map from workflow step type -> formatted type
export enum WORKFLOW_STEP_TO_RESOURCE_TYPE_MAP {
  'create_ingest_pipeline' = 'Ingest pipeline',
  'create_search_pipeline' = 'Search pipeline',
  'create_index' = 'Index',
  'register_local_pretrained_model' = 'Model',
  'register_local_sparse_encoding_model' = 'Model',
  'deploy_model' = 'Model',
}

export type WorkflowDict = {
  [workflowId: string]: Workflow;
};
