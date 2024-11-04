/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  EuiCodeBlock,
  EuiFlexGroup,
  EuiFlexItem,
  EuiBasicTable,
  EuiButtonIcon,
  RIGHT_ALIGNMENT,
  EuiText,
  Direction,
} from '@elastic/eui';
import {
  WORKFLOW_STEP_TO_RESOURCE_TYPE_MAP,
  WORKFLOW_STEP_TYPE,
  Workflow,
  WorkflowResource,
  customStringify,
} from '../../common';
import {
  getIndex,
  getIngestPipeline,
  getSearchPipeline,
  useAppDispatch,
} from '../store';
import { getDataSourceId } from '../../public/utils';

interface ResourceListProps {
  workflow?: Workflow;
}

/**
 * The searchable list of resources for a particular workflow.
 */
export function ResourceList(props: ResourceListProps) {
  const [allResources, setAllResources] = useState<WorkflowResource[]>([]);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<{
    [key: string]: React.ReactNode;
  }>({});
  const [codeBlockData, setCodeBlockData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const dataSourceId = getDataSourceId();
  let totalItemCount = 0;

  // Hook to initialize all resources. Reduce to unique IDs, since
  // the backend resources may include the same resource multiple times
  // (e.g., register and deploy steps persist the same model ID resource)
  useEffect(() => {
    if (props.workflow?.resourcesCreated) {
      const resourcesMap: { [id: string]: WorkflowResource } = {};
      props.workflow.resourcesCreated.forEach((resource) => {
        resourcesMap[resource.id] = resource;
      });
      setAllResources(Object.values(resourcesMap));
      totalItemCount = allResources.length;
    }
  }, [props.workflow?.resourcesCreated]);

  useEffect(() => {
    if (codeBlockData) {
      const { item, data } = codeBlockData;
      setItemIdToExpandedRowMap((prevMap) => ({
        ...prevMap,
        [item.id]: renderExpandedRow(data),
      }));
    }
  }, [codeBlockData]);

  const renderExpandedRow = useCallback(
    (data: any) => (
      <EuiFlexGroup direction="column" gutterSize="xs">
        <EuiFlexItem grow={true} style={{ paddingLeft: '20px' }}>
          <EuiText size="m">
            <h4>Resource details</h4>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={true} style={{ paddingLeft: '20px' }}>
          <EuiCodeBlock
            language="json"
            fontSize="m"
            isCopyable={true}
            overflowHeight={150}
          >
            {customStringify(data)}
          </EuiCodeBlock>
        </EuiFlexItem>
      </EuiFlexGroup>
    ),
    [codeBlockData]
  );

  const toggleDetails = async (item: WorkflowResource) => {
    const updatedItemIdToExpandedRowMap = { ...itemIdToExpandedRowMap };

    if (updatedItemIdToExpandedRowMap[item.id]) {
      delete updatedItemIdToExpandedRowMap[item.id];
      setItemIdToExpandedRowMap(updatedItemIdToExpandedRowMap);
    } else {
      if (item.id.toLowerCase().includes('ingest_pipeline')) {
        await dispatch(
          getIngestPipeline({
            pipelineId: item.id,
            dataSourceId,
          })
        )
          .unwrap()
          .then((result) => {
            setCodeBlockData({ item, data: result });
          });
      } else if (item.type.toLowerCase() === 'index') {
        await dispatch(
          getIndex({
            index: item.id,
            dataSourceId,
          })
        )
          .unwrap()
          .then((result) => {
            setCodeBlockData({ item, data: result });
          });
      } else if (item.id.toLowerCase().includes('search_pipeline')) {
        await dispatch(
          getSearchPipeline({
            pipelineId: item.id,
            dataSourceId,
          })
        )
          .unwrap()
          .then((result) => {
            setCodeBlockData({ item, data: result });
          });
      }
    }
  };

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState<keyof WorkflowResource>('id');
  const [sortDirection, setSortDirection] = useState<Direction>('asc');

  // Corrected onTableChange function
  const onTableChange = ({
    page = { index: 0, size: 10 },
    sort = { field: 'id', direction: 'asc' },
  }: any) => {
    const { index: pageIndex, size: pageSize } = page;
    const { field, direction } = sort;

    setPageIndex(pageIndex);
    setPageSize(pageSize);
    setSortField(field as keyof WorkflowResource);
    setSortDirection(direction);
  };

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const sortedItems = [...allResources].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    if (a[sortField] > b[sortField]) return 1 * multiplier;
    if (a[sortField] < b[sortField]) return -1 * multiplier;
    return 0;
  });
  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount,
    pageSizeOptions: [10, 25, 50],
  };

  return (
    <EuiFlexGroup direction="column">
      <EuiFlexItem>
        <EuiBasicTable
          itemId="id"
          itemIdToExpandedRowMap={itemIdToExpandedRowMap}
          isExpandable={true}
          sorting={sorting}
          pagination={pagination}
          onChange={onTableChange}
          columns={[
            {
              field: 'id',
              name: 'ID',
              sortable: true,
            },
            {
              field: 'stepType',
              name: 'Type',
              sortable: true,
              render: (stepType: WORKFLOW_STEP_TYPE) => {
                return WORKFLOW_STEP_TO_RESOURCE_TYPE_MAP[stepType];
              },
            },
            {
              align: RIGHT_ALIGNMENT,
              width: '40px',
              isExpander: true,
              render: (item: WorkflowResource) => (
                <EuiButtonIcon
                  onClick={() => toggleDetails(item)}
                  aria-label={
                    itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand'
                  }
                  iconType={
                    itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown'
                  }
                />
              ),
            },
          ]}
          items={sortedItems}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
