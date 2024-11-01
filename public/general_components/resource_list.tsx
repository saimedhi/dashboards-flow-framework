/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Direction,
  EuiCodeBlock,
  EuiFlexGroup,
  EuiFlexItem,
  EuiBasicTable,
  EuiButtonIcon,
  RIGHT_ALIGNMENT,
} from '@elastic/eui';
import { Workflow, WorkflowResource, customStringify } from '../../common';

interface ResourceListProps {
  workflow?: Workflow;
}

/**
 * The searchable list of resources for a particular workflow.
 */
export function ResourceList(props: ResourceListProps) {
  console.log("props printed printed", props.workflow?.resourcesCreated);
  const [allResources, setAllResources] = useState<WorkflowResource[]>([]);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<{
    [key: string]: React.ReactNode;
  }>({});

  // Hook to initialize all resources. Reduce to unique IDs, since
  // the backend resources may include the same resource multiple times
  // (e.g., register and deploy steps persist the same model ID resource)
  useEffect(() => {
    console.log("props.workflow printed printed", props.workflow);
    if (props.workflow?.resourcesCreated) {
      const resourcesMap = {} as { [id: string]: WorkflowResource };
      props.workflow.resourcesCreated.forEach((resource) => {
        resourcesMap[resource.id] = resource;
      });
      setAllResources(Object.values(resourcesMap));
    }
  }, [props.workflow?.resourcesCreated]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     

  const toggleDetails = async (item: WorkflowResource) => {
    console.log("item printed printed", item);
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[item.id]) {
      delete itemIdToExpandedRowMapValues[item.id];
    } else {
      
      var codeBlockData= [
          {
            title: 'Nationality',
            description: 'abcd',
          },
          {
            title: 'Online',
            description: 'xyz',
          },
        ]
      ;
      if (item.type.toLowerCase() == 'ingest pipeline'){
      
      }
      else if (item.type.toLowerCase() == 'index'){
        
      }
      else if (item.type.toLowerCase() == 'search pipeline'){
        
      }
       itemIdToExpandedRowMapValues[item.id] = (
        <EuiFlexItem grow={true}>
        <EuiCodeBlock language="json" fontSize="m" isCopyable={true} overflowHeight={150} >
          {customStringify(codeBlockData)}
        </EuiCodeBlock>
        </EuiFlexItem>
      );

    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };                                           



  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  // Ensure sortField is of the correct type
  const [sortField, setSortField] = useState<keyof WorkflowResource>('id'); // Use a default field that matches WorkflowResource
  const [sortDirection, setSortDirection] = useState<Direction>('asc');

  // Corrected onTableChange function
  const onTableChange = ({ page = { index: 0, size: 10 }, sort = { field: 'id', direction: 'asc' } }: any) => {
  const { index: pageIndex, size: pageSize } = page;
  const { field, direction } = sort;

  setPageIndex(pageIndex);
  setPageSize(pageSize);
  setSortField(field as keyof WorkflowResource); // Ensure correct type assignment
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

  return (
    <EuiFlexGroup direction="column">
      <EuiFlexItem>
        <EuiBasicTable
          itemId="id"
          itemIdToExpandedRowMap={itemIdToExpandedRowMap}
          isExpandable={true}
          sorting={sorting}
          onChange={onTableChange}
          columns={[
            {
              field: 'id',
              name: 'ID',
              sortable: true,
            },
            {
              field: 'type',
              name: 'Type',
              sortable: true,
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
