/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { FlowFrameworkDashboardsApp } from './app';
import { store } from './store';
import { createBrowserHistory, History } from 'history';
// styling
import './global-styles.scss';

export const renderApp = (
  coreStart: CoreStart,
  params: AppMountParameters,
  hideInAppSideNavBar: boolean
) => {
  // This is so our base element stretches to fit the entire webpage
  params.element.className = 'stretch-absolute';
  ReactDOM.render(
    <Provider store={store}>
      <Router basename={params.appBasePath + '#/'}>
        <Route
          render={(props) => (
            <FlowFrameworkDashboardsApp
              setHeaderActionMenu={params.setHeaderActionMenu}
              hideInAppSideNavBar={hideInAppSideNavBar}
              {...props}
            />
          )}
        />
      </Router>
    </Provider>,
    params.element
  );

  // // Usage Example
  // const mainHistory = createBrowserHistory();
  // const subHistory = createSubHistory(mainHistory, '/sub-section');

  // subHistory.push('/page1'); // Navigates to '/sub-section/page1'

  const expectedBasePath = `/app/flow-framework#`;
  //console.log("window.location.pathname", window.location.pathname);
  // if (!window.location.pathname.startsWith('/app/flow-framework')) {
  //   console.log("if if");
  //   window.location.href = `${expectedBasePath}`;
  // } else {
  // console.log("else else");
  // const newHistory = params.history.createSubHistory(expectedBasePath);
  // params.history = newHistory;

  const unlistenParentHistory = params.history.listen(() => {
    console.log("before unlistenParentHistory");
    // const newHistory = params.history.createSubHistory(`/app/flow-framework#`);
    // params.history = newHistory;
    // const newHistory = params.history.createSubHistory(expectedBasePath);
    // params.history = newHistory;
    // console.log("render_app dispatchEvent printed", params);
    window.location.href = `${expectedBasePath}`;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  return () => {
    console.log("render_app printed")
    ReactDOM.unmountComponentAtNode(params.element);
    unlistenParentHistory();
  };
//}
};

// function createSubHistory(parentHistory: History, basePath: string): History {
//   return {
//     ...parentHistory,
//     push: (path: string, state?: any) => parentHistory.push(${basePath}${path}, state),
//     replace: (path: string, state?: any) => parentHistory.replace(${basePath}${path}, state),
//     createHref: (location: any) => parentHistory.createHref({ ...location, pathname: ${basePath}${location.pathname} }),
//   };
// }
