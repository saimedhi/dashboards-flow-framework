/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  //EuiInMemoryTable,
  Direction,
  EuiCodeBlock,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiInMemoryTable,
  EuiTitle,
  EuiIcon,
  EuiText
} from '@elastic/eui';
import { WORKFLOW_STEP_TO_RESOURCE_TYPE_MAP, WORKFLOW_STEP_TYPE, Workflow, WorkflowResource, customStringify } from '../../common';

interface ResourceListFlyoutProps {
  workflow?: Workflow;
}

/**
 * The searchable list of resources for a particular workflow.
 */
export function ResourceListFlyout(props: ResourceListFlyoutProps) {
  const [allResources, setAllResources] = useState<WorkflowResource[]>([]);


  // Hook to initialize all resources. Reduce to unique IDs, since
  // the backend resources may include the same resource multiple times
  // (e.g., register and deploy steps persist the same model ID resource)
  useEffect(() => {
    if (props.workflow?.resourcesCreated) {
      const resourcesMap = {} as { [id: string]: WorkflowResource };
      props.workflow.resourcesCreated.forEach((resource) => {
        resourcesMap[resource.id] = resource;
      });
      setAllResources(Object.values(resourcesMap));
    }
  }, [props.workflow?.resourcesCreated]);

  const sorting = {
    sort: {
      field: 'id',
      direction: 'asc' as Direction,
    },
  };

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

  function getcodeBlockData(item:WorkflowResource){
    return codeBlockData;
// if (item.type.toLowerCase() == 'ingest pipeline'){
//   // dispatch(catIndices({ pattern: OMIT_SYSTEM_INDEX_PATTERN, dataSourceId })) 
//   // .unwrap()
//   //   .then(async (resp) => {
//   //     codeBlockData = resp;
//   //     console.log('response getIngestPipeline', resp);
//   //   });

// }
// else if (item.type.toLowerCase() == 'index'){
  
// }
// else if (item.type.toLowerCase() == 'search pipeline'){
  
// }
  }
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<
    WorkflowResource | undefined
  >(undefined);

  const closeFlyout = () => {
    setIsFlyoutVisible(false);
    setSelectedRowData(undefined);
  };

  const openFlyout = (row:WorkflowResource) => {
    setSelectedRowData(row);
    setIsFlyoutVisible(true);
  };

    const columns=() => [
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
      name: 'Actions',
      width: '20%',

          render:(row:WorkflowResource)=>(
            <EuiIcon onClick={()=>openFlyout(row)
          }
            type="inspect" size = "m" style={{cursor:'pointer'}}
          
          />
          )
      
    }

  ];
  
  return (
    <>
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <EuiInMemoryTable<WorkflowResource>
            items={allResources}
            rowHeader="id"
            columns={columns()}
            sorting={sorting}
            pagination={true}
            message={'No existing resources found'}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      {isFlyoutVisible && (
        <EuiFlyout onClose={closeFlyout}>
          <EuiFlyoutHeader>
            <EuiTitle>
              <h2>{selectedRowData?.id}</h2>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
          <EuiFlexGroup direction='column' gutterSize="xs">

          <EuiFlexItem grow={true} style={{ paddingLeft: '20px' }}>
            <EuiText size="m" >
            <h4>Resource details</h4>
            </EuiText> 
            </EuiFlexItem>

          <EuiFlexItem grow={true}>
            <EuiCodeBlock language="json" fontSize="m" isCopyable={true} overflowHeight={650} >
          {customStringify((getcodeBlockData(selectedRowData!)))}
          </EuiCodeBlock>
          </EuiFlexItem>
          </EuiFlexGroup>

          </EuiFlyoutBody>
        </EuiFlyout>
      )}
    </>
);
}

