/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { RouteComponentProps, useLocation } from 'react-router-dom';
import { escape } from 'lodash';
import {
  EuiPageHeader,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiSpacer,
  EuiFlexGroup,
  EuiSmallButton,
  EuiText,
  EuiFlexItem,
} from '@elastic/eui';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import { BREADCRUMBS, USE_NEW_HOME_PAGE } from '../../utils/constants';
import { getApplication, getCore, getNavigationUI } from '../../services';
import { WorkflowList } from './workflow_list';
import { NewWorkflow } from './new_workflow';
import { AppState, searchWorkflows, useAppDispatch } from '../../store';
import { EmptyListMessage } from './empty_list_message';
import { FETCH_ALL_QUERY, PLUGIN_NAME } from '../../../common';
import { ImportWorkflowModal } from './import_workflow';
import { MountPoint } from '../../../../../src/core/public';
import { DataSourceSelectableConfig } from '../../../../../src/plugins/data_source_management/public';
import { dataSourceFilterFn, getDataSourceFromURL } from '../../utils/utils';
import {
  getDataSourceManagementPlugin,
  getDataSourceEnabled,
  getNotifications,
  getSavedObjectsClient,
} from '../../services';
import { prettifyErrorMessage } from '../../../common/utils';
import { DataSourceOption } from '../../../../../src/plugins/data_source_management/public/components/data_source_menu/types';
import { ExperimentalBadge } from '../../general_components';
import { TopNavControlData } from '../../../../../src/plugins/navigation/public';

export interface WorkflowsRouterProps {}

interface WorkflowsProps extends RouteComponentProps<WorkflowsRouterProps> {
  setActionMenu: (menuMount: MountPoint | undefined) => void;
}

export enum WORKFLOWS_TAB {
  MANAGE = 'manage',
  CREATE = 'create',
}

const ACTIVE_TAB_PARAM = 'tab';

function replaceActiveTab(
  activeTab: string,
  props: WorkflowsProps,
  dataSourceId?: string
) {
  props.history.replace({
    ...history,
    search: queryString.stringify({
      [ACTIVE_TAB_PARAM]: activeTab,
      dataSourceId,
    }),
  });
}

/**
 * The base workflows page. From here, users can toggle between views to access
 * existing created workflows, explore the library of workflow templates
 * to get started on a new workflow, or import local workflow templates.
 */
export function Workflows(props: WorkflowsProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const queryParams = getDataSourceFromURL(location);
  const dataSourceEnabled = getDataSourceEnabled().enabled;
  const [dataSourceId, setDataSourceId] = useState<string | undefined>(
    queryParams.dataSourceId
  );
  const { workflows, loading } = useSelector(
    (state: AppState) => state.workflows
  );

  const {
    chrome: { setBreadcrumbs },
  } = getCore();
  const { HeaderControl } = getNavigationUI();
  const { setAppDescriptionControls, setAppCenterControls } = getApplication();

  // import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // tab state
  const tabFromUrl = queryString.parse(useLocation().search)[
    ACTIVE_TAB_PARAM
  ] as WORKFLOWS_TAB;
  const [selectedTabId, setSelectedTabId] = useState<WORKFLOWS_TAB>(
    escape(tabFromUrl) as WORKFLOWS_TAB
  );

  const isDataSourceReady =
    !dataSourceEnabled || (dataSourceId && dataSourceId !== '');

  // If there is no selected tab or invalid tab, default to manage tab
  useEffect(() => {
    if (
      !selectedTabId ||
      !Object.values(WORKFLOWS_TAB).includes(selectedTabId)
    ) {
      setSelectedTabId(WORKFLOWS_TAB.MANAGE);
      replaceActiveTab(WORKFLOWS_TAB.MANAGE, props, dataSourceId);
    }
  }, [selectedTabId, workflows]);

  // If the user navigates back to the manage tab, re-fetch workflows
  useEffect(() => {
    if (selectedTabId === WORKFLOWS_TAB.MANAGE) {
      // wait until selected data source is ready before doing dispatch calls if mds is enabled
      if (isDataSourceReady) {
        dispatch(
          searchWorkflows({
            apiBody: FETCH_ALL_QUERY,
            dataSourceId: dataSourceId,
          })
        );
      }
    }
  }, [selectedTabId, dataSourceId, dataSourceEnabled]);

  useEffect(() => {
    setBreadcrumbs(
      USE_NEW_HOME_PAGE
        ? [BREADCRUMBS.TITLE]
        : [
            BREADCRUMBS.PLUGIN_NAME,
            BREADCRUMBS.WORKFLOWS(dataSourceEnabled ? dataSourceId : undefined),
          ]
    );
  });

  // On initial render: fetch all workflows
  useEffect(() => {
    // wait until selected data source is ready before doing dispatch calls if mds is enabled
    if (isDataSourceReady) {
      dispatch(
        searchWorkflows({
          apiBody: FETCH_ALL_QUERY,
          dataSourceId: dataSourceId,
        })
      );
    }
  }, [dataSourceId, dataSourceEnabled]);

  useEffect(() => {
    const { history, location } = props;
    if (dataSourceEnabled) {
      const updatedParams = {
        dataSourceId: dataSourceId,
      };

      history.replace({
        ...location,
        search: queryString.stringify(updatedParams),
      });
    }
    // wait until selected data source is ready before doing dispatch calls if mds is enabled
    if (isDataSourceReady) {
      dispatch(
        searchWorkflows({
          apiBody: FETCH_ALL_QUERY,
          dataSourceId: dataSourceId,
        })
      );
    }
  }, [dataSourceId, setDataSourceId, dataSourceEnabled]);

  const handleDataSourceChange = ([event]: DataSourceOption[]) => {
    const dataSourceEventId = event?.id;
    if (dataSourceEnabled) {
      if (dataSourceEventId === undefined) {
        getNotifications().toasts.addDanger(
          prettifyErrorMessage('Unable to set data source.')
        );
      } else {
        setDataSourceId(dataSourceEventId);
      }
    }
  };

  let renderDataSourceComponent = null;
  if (dataSourceEnabled && getDataSourceManagementPlugin()) {
    const DataSourceMenu = getDataSourceManagementPlugin().ui.getDataSourceMenu<
      DataSourceSelectableConfig
    >();
    renderDataSourceComponent = useMemo(() => {
      return (
        <DataSourceMenu
          setMenuMountPoint={props.setActionMenu}
          componentType={'DataSourceSelectable'}
          componentConfig={{
            fullWidth: false,
            activeOption:
              dataSourceId === undefined ? undefined : [{ id: dataSourceId }],
            savedObjects: getSavedObjectsClient(),
            notifications: getNotifications(),
            onSelectedDataSources: (dataSources) =>
              handleDataSourceChange(dataSources),
            dataSourceFilter: dataSourceFilterFn,
          }}
        />
      );
    }, [getSavedObjectsClient, getNotifications(), props.setActionMenu]);
  }

  const experimentalBadgeInHeader = (
    <HeaderControl
      setMountPoint={setAppCenterControls}
      controls={[
        {
          renderComponent: (
            <ExperimentalBadge
              popoverEnabled={true}
              popoverAnchorPosition="downLeft"
            />
          ),
        } as TopNavControlData,
      ]}
    />
  );

  const DESCRIPTION = `Design, experiment, and prototype your solutions with ${PLUGIN_NAME}. Build your search and last mile 
  ingestion flows with a visual interface. Experiment with different configurations with prototyping tools and launch them 
  into your environment.`;

  const pageTitleAndDescription = USE_NEW_HOME_PAGE ? (
    <HeaderControl
      controls={[
        {
          description: DESCRIPTION,
        },
      ]}
      setMountPoint={setAppDescriptionControls}
    />
  ) : (
    <EuiFlexGroup direction="column" style={{ margin: '0px' }}>
      <EuiFlexGroup direction="row" gutterSize="s">
        <EuiFlexItem grow={false}>
          <EuiText size="m">
            <h1>{PLUGIN_NAME}</h1>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <ExperimentalBadge
            popoverEnabled={true}
            popoverAnchorPosition="downLeft"
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiText color="subdued">{DESCRIPTION}</EuiText>
    </EuiFlexGroup>
  );

  return (
    <>
      {isImportModalOpen && (
        <ImportWorkflowModal
          isImportModalOpen={isImportModalOpen}
          setIsImportModalOpen={setIsImportModalOpen}
          setSelectedTabId={setSelectedTabId}
        />
      )}
      {dataSourceEnabled && renderDataSourceComponent}
      {USE_NEW_HOME_PAGE && experimentalBadgeInHeader}
      <EuiPage>
        <EuiPageBody>
          <EuiPageHeader
            pageTitle={pageTitleAndDescription}
            tabs={[
              {
                id: WORKFLOWS_TAB.MANAGE,
                label: 'Manage workflows',
                isSelected: selectedTabId === WORKFLOWS_TAB.MANAGE,
                onClick: () => {
                  setSelectedTabId(WORKFLOWS_TAB.MANAGE);
                  replaceActiveTab(WORKFLOWS_TAB.MANAGE, props, dataSourceId);
                },
              },
              {
                id: WORKFLOWS_TAB.CREATE,
                label: 'New workflow',
                isSelected: selectedTabId === WORKFLOWS_TAB.CREATE,
                onClick: () => {
                  setSelectedTabId(WORKFLOWS_TAB.CREATE);
                  replaceActiveTab(WORKFLOWS_TAB.CREATE, props, dataSourceId);
                },
              },
            ]}
            bottomBorder={true}
          />

          <EuiPageContent>
            <EuiPageHeader
              style={{ marginTop: '-8px' }}
              pageTitle={
                <EuiText size="s">
                  <h2>
                    {selectedTabId === WORKFLOWS_TAB.MANAGE
                      ? 'Workflows'
                      : 'Create from a template'}
                  </h2>
                </EuiText>
              }
              rightSideItems={
                selectedTabId === WORKFLOWS_TAB.MANAGE
                  ? [
                      <EuiSmallButton
                        style={{ marginTop: '8px' }}
                        fill={true}
                        onClick={() => {
                          setSelectedTabId(WORKFLOWS_TAB.CREATE);
                          replaceActiveTab(
                            WORKFLOWS_TAB.CREATE,
                            props,
                            dataSourceId
                          );
                        }}
                        iconType="plus"
                        data-testid="createWorkflowButton"
                      >
                        Create workflow
                      </EuiSmallButton>,
                      <EuiSmallButton
                        style={{ marginTop: '8px' }}
                        onClick={() => {
                          setIsImportModalOpen(true);
                        }}
                        data-testid="importWorkflowButton"
                      >
                        Import workflow
                      </EuiSmallButton>,
                    ]
                  : [
                      <EuiSmallButton
                        style={{ marginTop: '8px' }}
                        onClick={() => {
                          setIsImportModalOpen(true);
                        }}
                        data-testid="importWorkflowButton"
                      >
                        Import workflow
                      </EuiSmallButton>,
                    ]
              }
              bottomBorder={false}
            />
            {selectedTabId === WORKFLOWS_TAB.MANAGE ? (
              <WorkflowList setSelectedTabId={setSelectedTabId} />
            ) : (
              <>
                <EuiSpacer size="s" />
                <NewWorkflow />
              </>
            )}
            {selectedTabId === WORKFLOWS_TAB.MANAGE &&
              Object.keys(workflows || {}).length === 0 &&
              !loading && (
                <EmptyListMessage
                  onClickNewWorkflow={() => {
                    setSelectedTabId(WORKFLOWS_TAB.CREATE);
                    replaceActiveTab(WORKFLOWS_TAB.CREATE, props, dataSourceId);
                  }}
                />
              )}
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  );
}
