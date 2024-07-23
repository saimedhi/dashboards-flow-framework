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

export enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

export enum DETECTORS_QUERY_PARAMS {
    FROM = 'from',
    SIZE = 'size',
    SEARCH = 'search',
    INDICES = 'indices',
    SORT_FIELD = 'sortField',
    SORT_DIRECTION = 'sortDirection',
    NAME = 'name',
    DATASOURCEID = 'dataSourceId',
  }