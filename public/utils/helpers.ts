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

import queryString from 'query-string';
import { GetDetectorsQueryParams } from '../../server/types';
import { DETECTORS_QUERY_PARAMS, SORT_DIRECTION } from '../../server/utils/constants';
import { DEFAULT_QUERY_PARAMS } from '../utils/constants';
import { getDataSourceEnabled} from '../services';


export const getURLQueryParams = (location: {
  search: string;
}): GetDetectorsQueryParams => {
  const {
    from,
    size,
    search,
    indices,
    sortField,
    sortDirection,
    dataSourceId,
  } = queryString.parse(location.search) as { [key: string]: string };
  return {
    // @ts-ignore
    from: isNaN(parseInt(from, 10))
      ? DEFAULT_QUERY_PARAMS.from
      : parseInt(from, 10),
    // @ts-ignore
    size: isNaN(parseInt(size, 10))
      ? DEFAULT_QUERY_PARAMS.size
      : parseInt(size, 10),
    search: typeof search !== 'string' ? DEFAULT_QUERY_PARAMS.search : search,
    indices:
      typeof indices !== 'string' ? DEFAULT_QUERY_PARAMS.indices : indices,
    sortField: typeof sortField !== 'string' ? 'name' : sortField,
    sortDirection:
      typeof sortDirection !== 'string'
        ? DEFAULT_QUERY_PARAMS.sortDirection
        : (sortDirection as SORT_DIRECTION),
    dataSourceId: dataSourceId === undefined ? undefined : dataSourceId,
  };
};

export const constructHrefWithDataSourceId = (
    basePath: string,
    dataSourceId: string = '',
    withHash: Boolean
  ): string => {
    const dataSourceEnabled = getDataSourceEnabled().enabled;
    const url = new URLSearchParams();
  
    // Set up base parameters for '/detectors'
    if (basePath.startsWith('/detectors')) {
      url.set(DETECTORS_QUERY_PARAMS.FROM, DEFAULT_QUERY_PARAMS.from.toString());
      url.set(DETECTORS_QUERY_PARAMS.SIZE, DEFAULT_QUERY_PARAMS.size.toString());
      url.set(DETECTORS_QUERY_PARAMS.SEARCH, DEFAULT_QUERY_PARAMS.search);
      url.set(DETECTORS_QUERY_PARAMS.INDICES, DEFAULT_QUERY_PARAMS.indices);
      url.set(DETECTORS_QUERY_PARAMS.SORT_FIELD, DEFAULT_QUERY_PARAMS.sortField);
      url.set(DETECTORS_QUERY_PARAMS.SORT_DIRECTION, SORT_DIRECTION.ASC)
      if (dataSourceEnabled) {
        url.set(DETECTORS_QUERY_PARAMS.DATASOURCEID, '');
      }
    }
  
    if (dataSourceEnabled && dataSourceId !== undefined) {
      url.set('dataSourceId', dataSourceId);
    }
  
    // we share this helper function to construct the href with dataSourceId
    // some places we need to return the url with hash, some places we don't need to
    // so adding this flag to indicate if we want to return the url with hash
    if (withHash) {
      return `#${basePath}?${url.toString()}`;
    }
  
    return `${basePath}?${url.toString()}`;
  };
