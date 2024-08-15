/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  EuiPageHeader,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSmallButtonEmpty,
} from '@elastic/eui';
import {
  DEFAULT_NEW_WORKFLOW_STATE,
  PLUGIN_ID,
  WORKFLOW_STATE,
  Workflow,
  toFormattedDate,
} from '../../../../common';
import { APP_PATH } from '../../../utils';
import {
  getApplication,
  getCore,
  getHeaderActionMenu,
  getNavigationUI,
  getUISettings,
} from '../../../services';
import { HeaderVariant, MountPoint } from '../../../../../../src/core/public';
import {
  TopNavControls,
  TopNavMenuData,
  TopNavMenuItemRenderType,
} from '../../../../../../src/plugins/navigation/public';

interface WorkflowDetailHeaderProps {
  workflow?: Workflow;
  //setActionMenu: (menuMount?: MountPoint) => void;
}

export function WorkflowDetailHeader(props: WorkflowDetailHeaderProps) {
  const history = useHistory();
  // workflow state
  const [workflowName, setWorkflowName] = useState<string>('');
  const [workflowState, setWorkflowState] = useState<WORKFLOW_STATE>('');
  const [workflowLastUpdated, setWorkflowLastUpdated] = useState<string>('');

  useEffect(() => {
    if (props.workflow) {
      setWorkflowName(props.workflow.name);
      setWorkflowState(props.workflow.state || DEFAULT_NEW_WORKFLOW_STATE);
      try {
        const formattedDate = toFormattedDate(
          // @ts-ignore
          props.workflow.lastUpdated
        ).toString();
        setWorkflowLastUpdated(formattedDate);
      } catch (err) {
        setWorkflowLastUpdated('');
      }
    }
  }, [props.workflow]);

  const { TopNavMenu, HeaderControl } = getNavigationUI();
  const { setAppRightControls, setAppCenterControls } = getApplication();
  const uiSettings = getUISettings();
  const showActionsInHeader = uiSettings.get('home:useNewHomePage');
  useEffect(() => {
    if (showActionsInHeader) {
      getCore().chrome.setHeaderVariant?.(HeaderVariant.APPLICATION);
    }

    return () => {
      getCore().chrome.setHeaderVariant?.();
    };
  }, [getCore().chrome.setHeaderVariant, showActionsInHeader]);

  // dataSourceMenuConfig={{
  //   componentType: { DataSourceView: 'DataSourceView' },
  //   componentConfig: T,
  //   setMenuMountPoint: setAppRightControls,
  // }}
  // <TopNavMenu
  //       appName={PLUGIN_ID}
  //       setMenuMountPoint={props.setActionMenu}
  //       groupActions={true}
  //       screenTitle={workflowName}
  //       showDataSourceMenu={false}
  //     />
  //   <TopNavMenu
  //   appName={PLUGIN_ID}
  //   setMenuMountPoint={getHeaderActionMenu()}
  //   screenTitle={'abc1234567'}
  //
  // const config = {
  //     label: i18n.translate('dashboard.topNav.editSwitchLabel', {
  //       defaultMessage: 'Edit',
  //     }),
  //     testId: 'dashboardEditSwitch',
  //     controlType: 'switch',
  //   };

  // console.log('getHeaderActionMenu', getHeaderActionMenu());
  // console.log('setAppRightControls', setAppRightControls);
  // const FF_TopNav = (
  //   <TopNavMenu
  //     appName={'dashboard'}
  //     config={topNavConfig}
  //     className={''}
  //     screenTitle={'abc123456'}
  //     showSearchBar={true}
  //     showQueryBar={true}
  //     showQueryInput={true}
  //     showDatePicker={true}
  //     showFilterBar={true}
  //     useDefaultBehaviors={true}
  //     showSaveQuery={true}
  //     savedQuery={undefined}
  //     setMenuMountPoint={getHeaderActionMenu}
  //     groupActions={showActionsInHeader}
  //   />
  // );
  // {
  //   /* <HeaderControl
  //       setMountPoint={setAppCenterControls}
  //       controls={[
  //         {
  //           renderComponent: [
  //             <TopNavMenu
  //   appName={'dashboard'}
  //   config={topNavConfig}
  //   className={''}
  //   screenTitle={'abc123456'}
  //   showSearchBar={true}
  //   showQueryBar={true}
  //   showQueryInput={true}
  //   showDatePicker={true}
  //   showFilterBar={true}
  //   useDefaultBehaviors={true}
  //   showSaveQuery={true}
  //   savedQuery={undefined}
  //   setMenuMountPoint={getHeaderActionMenu}
  //   groupActions={showActionsInHeader}
  // />
  //           ],
  //         },
  //       ]}
  //     /> */
  // }

  const title = (
    <EuiFlexGroup direction="row" alignItems="flexEnd" gutterSize="m">
      <EuiFlexItem grow={false}>{workflowName}</EuiFlexItem>
      <EuiFlexItem grow={false} style={{ marginBottom: '10px' }}>
        <EuiText size="m">{workflowState}</EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
  const onExitButtonClick = () => {
    history.replace(APP_PATH.WORKFLOWS);
  };

  const topNavConfig: TopNavMenuData[] = [
    {
      iconType: 'exit',
      emphasize: true,
      id: 'exit',
      label: 'exit',
      //testId: 'mapSaveButton',
      run: onExitButtonClick,
    },
  ];
  console.log('getHeaderActionMenu()', getHeaderActionMenu());
  console.log('PLUGIN_ID', PLUGIN_ID);
  return showActionsInHeader ? (
    <>
      <TopNavMenu
        appName={PLUGIN_ID}
        config={undefined}
        screenTitle="Miki"
        //showDataSourceMenu={true}
        //dataSourceMenuConfig={ componentType: DataSourceComponentType.DataSourceView,
        // componentConfig: T}
        showSearchBar={TopNavMenuItemRenderType.IN_PORTAL}
        showQueryBar={false}
        showQueryInput={false}
        showDatePicker={false}
        showFilterBar={false}
        useDefaultBehaviors={true}
        setMenuMountPoint={getHeaderActionMenu()}
        groupActions={showActionsInHeader}
      />
      {/* <HeaderControl
        setMountPoint={setAppRightControls}
        controls={[
          {
            renderComponent: [
              <EuiSmallButtonEmpty
                style={{ marginTop: '8px' }}
                onClick={() => {
                  // TODO: add lightweight save here when available
                  history.replace(APP_PATH.WORKFLOWS);
                }}
              >
                Close
              </EuiSmallButtonEmpty>,
              <EuiText style={{ marginTop: '16px' }} color="subdued" size="s">
                {`Last updated: ${workflowLastUpdated}`}
              </EuiText>,
            ],
          },
        ]}
      /> */}
    </>
  ) : (
    <EuiPageHeader
      style={{ marginTop: '-8px' }}
      pageTitle={title}
      rightSideItems={[
        <EuiSmallButtonEmpty
          style={{ marginTop: '8px' }}
          onClick={() => {
            // TODO: add lightweight save here when available
            history.replace(APP_PATH.WORKFLOWS);
          }}
        >
          Close
        </EuiSmallButtonEmpty>,
        <EuiText style={{ marginTop: '16px' }} color="subdued" size="s">
          {`Last updated: ${workflowLastUpdated}`}
        </EuiText>,
      ]}
      bottomBorder={false}
    />
  );
}
