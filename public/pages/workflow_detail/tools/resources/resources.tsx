/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
} from '@elastic/eui';
import { Workflow } from '../../../../../common';
import { ResourceList } from '../../../../general_components';

interface ResourcesProps {
  workflow?: Workflow;
}

/**
 * The basic resources component for the Tools panel. Displays all created
 * resources for the particular workflow
 */
export function Resources(props: ResourcesProps) {
  return (
    <>
      {props.workflow?.resourcesCreated &&
      props.workflow.resourcesCreated.length > 0 ? (
        <>
          <EuiFlexGroup direction="row">
            <EuiFlexItem>
              <ResourceList workflow={props.workflow} />
            </EuiFlexItem>
          </EuiFlexGroup>
        </>
      ) : (
        <EuiEmptyPrompt
          iconType={'cross'}
          title={<h2>No resources available</h2>}
          titleSize="s"
          body={
            <>
              <EuiText size="s">
                Provision the workflow to generate resources in order to start
                prototyping.
              </EuiText>
            </>
          }
        />
      )}
    </>
  );
}
