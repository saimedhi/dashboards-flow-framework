/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { INITIAL_PRESETS_STATE } from 'public/store';
import { loadTemplates } from 'test/utils';

export const mockReducers = {
  getWorkflowPresets: () =>
    jest.fn().mockResolvedValue({
      ...INITIAL_PRESETS_STATE,
      presetWorkflows: loadTemplates(),
    }),
  searchModels: () => jest.fn().mockResolvedValue({}),
  searchConnectors: () => jest.fn().mockResolvedValue({}),
  createWorkflow: () => jest.fn().mockResolvedValue({}),
};
