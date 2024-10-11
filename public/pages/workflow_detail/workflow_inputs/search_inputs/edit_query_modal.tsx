/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import {
  EuiSmallButton,
  EuiContextMenu,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiPopover,
  EuiSpacer,
} from '@elastic/eui';
import { JsonField } from '../input_fields';
import {
  QUERY_PRESETS,
  QueryPreset,
  WorkflowFormValues,
} from '../../../../../common';

interface EditQueryModalProps {
  queryFieldPath: string;
  setModalOpen(isOpen: boolean): void;
}

/**
 * Basic modal for configuring a query. Provides a dropdown to select from
 * a set of pre-defined queries targeted for different use cases.
 */
export function EditQueryModal(props: EditQueryModalProps) {
  // Form state
  const { setFieldValue, setFieldTouched } = useFormikContext<
    WorkflowFormValues
  >();

  // popover state
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  return (
    <EuiModal
      onClose={() => props.setModalOpen(false)}
      style={{ width: '70vw' }}
      data-testid="editQueryModal"
    >
      <EuiModalHeader>
        <EuiModalHeaderTitle data-testid="editQueryModalTitle">
          <p>{`Edit query`}</p>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody data-testid="editQueryModalBody">
        <EuiPopover
          button={
            <EuiSmallButton
              onClick={() => setPopoverOpen(!popoverOpen)}
              data-testid="searchQueryPresetButton"
            >
              Choose from a preset
            </EuiSmallButton>
          }
          isOpen={popoverOpen}
          closePopover={() => setPopoverOpen(false)}
          anchorPosition="downLeft"
          data-testid="presetQueryPopover"
        >
          <EuiContextMenu
            initialPanelId={0}
            panels={[
              {
                id: 0,
                items: QUERY_PRESETS.map((preset: QueryPreset) => ({
                  name: preset.name,
                  onClick: () => {
                    setFieldValue(props.queryFieldPath, preset.query);
                    setFieldTouched(props.queryFieldPath, true);
                    setPopoverOpen(false);
                  },
                  'data-testid': `presetQueryOption-${preset.name}`, // Add a data-testid to each preset option
                })),
              },
            ]}
            data-testid="presetQueryMenu"
          />
        </EuiPopover>
        <EuiSpacer size="s" />
        <JsonField
          label="Query"
          fieldPath={props.queryFieldPath}
          editorHeight="25vh"
          readOnly={false}
          data-testid="jsonQueryField" // Add data-testid for the JSON query input field
        />
      </EuiModalBody>
      <EuiModalFooter>
        <EuiSmallButton
          onClick={() => props.setModalOpen(false)}
          data-testid="searchQueryCloseButton"
          fill={false}
          color="primary"
        >
          Close
        </EuiSmallButton>
      </EuiModalFooter>
    </EuiModal>
  );
}
