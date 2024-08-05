/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import {
  EuiPageSideBar,
  EuiSideNav,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { Navigation, APP_PATH } from './utils';
import {
  Workflows,
  WorkflowDetail,
  WorkflowDetailRouterProps,
  WorkflowsRouterProps,
} from './pages';

// styling
import './global-styles.scss';
import { useSelector } from 'react-redux';
import { AppState } from './store';

interface Props extends RouteComponentProps {
  landingPage: string | undefined;
  hideInAppSideNavBar: boolean;
}

export const FlowFrameworkDashboardsApp = (props: Props) => {
  const { landingPage, hideInAppSideNavBar} = props;
  // const hideSideNavBar = useSelector(
  //   (state: AppState) => state.workflows.hideSideNavBar
  // ) || hideInAppSideNavBar;
  const hideSideNavBar = hideInAppSideNavBar;
  const sidebar = (
    <EuiPageSideBar style={{ minWidth: 190 }} hidden={hideSideNavBar} paddingSize="l">
      <EuiSideNav
        style={{ width: 190 }}
        items={[
          {
            name: Navigation.FlowFramework,
            id: 0,
            items: [
              {
                name: Navigation.Workflows,
                id: 1,
                href: `#${APP_PATH.WORKFLOWS}`,
                isSelected: props.location.pathname === APP_PATH.WORKFLOWS,
              },
            ],
          },
        ]}
      />
    </EuiPageSideBar>
  );

  // Render the application DOM.
  return (
    <EuiFlexGroup
      direction="row"
      gutterSize="none"
      className="stretch-relative"
    >
      <EuiFlexItem grow={false}>{sidebar}</EuiFlexItem>
      <EuiFlexItem>
        <Switch>
          <Route
            path={APP_PATH.WORKFLOW_DETAIL}
            render={(
              routeProps: RouteComponentProps<WorkflowDetailRouterProps>
            ) => <WorkflowDetail {...routeProps} />}
          />
          <Route
            path={APP_PATH.WORKFLOWS}
            render={(routeProps: RouteComponentProps<WorkflowsRouterProps>) => (
              <Workflows {...routeProps} />
            )}
          />
          {/*
        Defaulting to Workflows page. The pathname will need to be updated
        to handle the redirection and get the router props consistent.
        */}
          <Route
            path={`${APP_PATH.HOME}`}
            render={(routeProps: RouteComponentProps<WorkflowsRouterProps>) => {
              if(landingPage){
                return <Redirect from="/" to={landingPage} />;
              }
              else if (props.history.location.pathname !== APP_PATH.WORKFLOWS) {
                props.history.replace({
                  ...history,
                  pathname: APP_PATH.WORKFLOWS,
                });
              }
              return <Workflows {...routeProps} />;
            }}
          />
        </Switch>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
