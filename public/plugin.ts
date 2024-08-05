/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AppMountParameters,
  CoreSetup,
  CoreStart,
  DEFAULT_APP_CATEGORIES,
  DEFAULT_NAV_GROUPS,
  WorkspaceAvailability,
  Plugin,
} from '../../../src/core/public';
import {WORKFLOWS_PAGE_NAV_ID, WORKFLOW_DETAIL_PAGE_NAV_ID, APP_PATH } from './utils/constants';
import {
  FlowFrameworkDashboardsPluginSetup,
  FlowFrameworkDashboardsPluginStart,
} from './types';
import { PLUGIN_ID } from '../common';
import { setCore, setRouteService } from './services';
import { configureRoutes } from './route_service';

export class FlowFrameworkDashboardsPlugin
  implements
    Plugin<
      FlowFrameworkDashboardsPluginSetup,
      FlowFrameworkDashboardsPluginStart
    > {
  public setup(core: CoreSetup): FlowFrameworkDashboardsPluginSetup {
    const hideInAppSideNavBar = core.chrome.navGroup.getNavGroupEnabled();
    // Register the plugin in the side navigation
    core.application.register({
      id: PLUGIN_ID,
      title: 'Flow Framework',
      category: {
        id: 'opensearch',
        label: 'OpenSearch plugins',
        // TODO: this may change after plugin position is finalized
        order: 2000,
      },
      // TODO: can i remove this below order
      order: 5000,
      async mount(params: AppMountParameters) {
        const { renderApp } = await import('./render_app');
        const [coreStart] = await core.getStartServices();
        const routeServices = configureRoutes(coreStart);
        setCore(coreStart);
        setRouteService(routeServices);
        return renderApp(coreStart, params, undefined, hideInAppSideNavBar);
      },
    });
    // register applications with category and use case information
    core.chrome.navGroup.addNavLinksToGroup(DEFAULT_NAV_GROUPS.observability,[
      {
        id: PLUGIN_ID,
        category: DEFAULT_APP_CATEGORIES.search,
        showInAllNavGroup: true
      }
    ])
    core.chrome.navGroup.addNavLinksToGroup(DEFAULT_NAV_GROUPS['security-analytics'],[
      {
        id: PLUGIN_ID,
        category: DEFAULT_APP_CATEGORIES.search,
        showInAllNavGroup: true
      }
    ])

    // // register sub applications as standard OSD applications with use case
    // if (core.chrome.navGroup.getNavGroupEnabled()) {
    //   core.application.register({
    //     id: WORKFLOWS_PAGE_NAV_ID,
    //     title: 'Get started',
    //     order: 8040,
    //     category: DEFAULT_APP_CATEGORIES.detect,
    //     workspaceAvailability: WorkspaceAvailability.outsideWorkspace,
    //     mount: async (params: AppMountParameters) => {
    //       const { renderApp } = await import('./render_app');
    //       const [coreStart] = await core.getStartServices();
    //       return renderApp(coreStart, params, APP_PATH.WORKFLOWS, hideInAppSideNavBar);
    //     },
    //   }); 
    // }

    // if (core.chrome.navGroup.getNavGroupEnabled()) {
    //   core.application.register({
    //     id: WORKFLOW_DETAIL_PAGE_NAV_ID,
    //     title: 'Workflow_detail',
    //     order: 8040,
    //     category: DEFAULT_APP_CATEGORIES.detect,
    //     workspaceAvailability: WorkspaceAvailability.outsideWorkspace,
    //     mount: async (params: AppMountParameters) => {
    //       const { renderApp } = await import('./render_app');
    //       const [coreStart] = await core.getStartServices();
    //       return renderApp(coreStart, params, APP_PATH.WORKFLOW_DETAIL, hideInAppSideNavBar);
    //     },
    //   }); 
    // }

    // link the sub applications to the parent application
    core.chrome.navGroup.addNavLinksToGroup(
      DEFAULT_NAV_GROUPS.observability,
      [{
          id: WORKFLOWS_PAGE_NAV_ID,
          parentNavLinkId: PLUGIN_ID
      },
      {
        id: WORKFLOW_DETAIL_PAGE_NAV_ID,
        parentNavLinkId: PLUGIN_ID
      }]
    );

    core.chrome.navGroup.addNavLinksToGroup(
      DEFAULT_NAV_GROUPS['security-analytics'],
      [{
          id: WORKFLOWS_PAGE_NAV_ID,
          parentNavLinkId: PLUGIN_ID
      },
      {
        id: WORKFLOW_DETAIL_PAGE_NAV_ID,
        parentNavLinkId: PLUGIN_ID
      }]
    );
    return {};
  }

  public start(core: CoreStart): FlowFrameworkDashboardsPluginStart {
    return {};
  }

  public stop() {}
}
