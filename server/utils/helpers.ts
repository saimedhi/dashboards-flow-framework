/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */


import {
    LegacyCallAPIOptions,
    OpenSearchDashboardsRequest,
    RequestHandlerContext,
  } from '../../../../src/core/server';

  export function getClientBasedOnDataSource(
    context: RequestHandlerContext,
    dataSourceEnabled: boolean,
    request: OpenSearchDashboardsRequest,
    dataSourceId: string,
    client: any
  ): (
    endpoint: string,
    clientParams?: Record<string, any>,
    options?: LegacyCallAPIOptions
  ) => any {
    if (dataSourceEnabled && dataSourceId && dataSourceId.trim().length != 0) {
      // client for remote cluster
      return context.dataSource.opensearch.legacy.getClient(dataSourceId).callAPI;
    } else {
      // fall back to default local cluster
      return client.asScoped(request).callAsCurrentUser;
    }
  }
  