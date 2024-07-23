/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { SORT_DIRECTION} from './utils/constants';

export interface FlowFrameworkDashboardsPluginSetup {}
export interface FlowFrameworkDashboardsPluginStart {}
export type GetDetectorsQueryParams = {
    from: number;
    size: number;
    search: string;
    indices?: string;
    sortDirection: SORT_DIRECTION;
    sortField: string;
    dataSourceId?: string;
  };
