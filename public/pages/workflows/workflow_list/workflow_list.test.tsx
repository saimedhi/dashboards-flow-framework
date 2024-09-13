// /*
//  * Copyright OpenSearch Contributors
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import React from 'react';
// import { render } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import { Provider } from 'react-redux';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { WorkflowList } from './workflow_list';
// import { mockStore } from '../../../../test/utils';
// import { WORKFLOW_TYPE } from '../../../../common';

// jest.mock('../../../services', () => {
//   const { mockCoreServices } = require('../../../../test');
//   return {
//     ...jest.requireActual('../../../services'),
//     ...mockCoreServices,
//   };
// });

// const workflowId = '1ECGC5EBUkBYAWA_XOrF';
// const workflowName = 'semantic_search';
// const workflowType = WORKFLOW_TYPE.SEMANTIC_SEARCH;

// const renderWithRouter = (
//   workflowId: string,
//   workflowName: string,
//   workflowType: WORKFLOW_TYPE
// ) =>
//   console.log(
//     'mockStore state:',
//     mockStore(workflowId, workflowName, workflowType).getState()
//   );

// render(
//   <Provider store={mockStore(workflowId, workflowName, workflowType)}>
//     <Router>
//       <Switch>
//         <Route render={() => <WorkflowList setSelectedTabId={jest.fn()} />} />
//       </Switch>
//     </Router>
//   </Provider>
// );

// // describe('WorkflowList', () => {
// //   test('renders the page', () => {
// //     const { getAllByText } = renderWithRouter(
// //       workflowId,
// //       workflowName,
// //       workflowType
// //     );
// //     expect(getAllByText('Manage existing workflows').length).toBeGreaterThan(0);
// //   });
// // });
