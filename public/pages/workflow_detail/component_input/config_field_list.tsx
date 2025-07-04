/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiFlexItem, EuiSpacer } from '@elastic/eui';
import {
  TextField,
  SelectField,
  BooleanField,
  NumberField,
  JsonField,
  MapField,
  ModelField,
} from './input_fields';
import { IConfigField } from '../../../../common';
import { camelCaseToTitleString } from '../../../utils';

/**
 * A helper component to format all of the input fields for a component. Dynamically
 * render based on the input type.
 */

interface ConfigFieldListProps {
  configId: string;
  configFields: IConfigField[];
  baseConfigPath: string; // the base path of the nested config, if applicable. e.g., 'ingest.enrich'
  disabled?: boolean;
}

const CONFIG_FIELD_SPACER_SIZE = 'm';

export function ConfigFieldList(props: ConfigFieldListProps) {
  const disabled = props.disabled ?? false;
  return (
    <EuiFlexItem grow={false}>
      {props.configFields.map((field, idx) => {
        const fieldPath = `${props.baseConfigPath}.${props.configId}.${field.id}`;
        let el;
        switch (field.type) {
          case 'string': {
            el = (
              <EuiFlexItem key={idx}>
                <TextField
                  label={camelCaseToTitleString(field.id)}
                  fieldPath={fieldPath}
                  showError={true}
                  disabled={disabled}
                  fullWidth={true}
                />
                <EuiSpacer size={CONFIG_FIELD_SPACER_SIZE} />
              </EuiFlexItem>
            );
            break;
          }
          case 'textArea': {
            el = (
              <EuiFlexItem key={idx}>
                <TextField
                  label={camelCaseToTitleString(field.id)}
                  fieldPath={fieldPath}
                  showError={true}
                  textArea={true}
                  disabled={disabled}
                  fullWidth={true}
                />
                <EuiSpacer size={CONFIG_FIELD_SPACER_SIZE} />
              </EuiFlexItem>
            );
            break;
          }
          case 'select': {
            el = (
              <EuiFlexItem key={idx}>
                <SelectField
                  field={field}
                  fieldPath={fieldPath}
                  disabled={disabled}
                  fullWidth={true}
                />
                <EuiSpacer size={CONFIG_FIELD_SPACER_SIZE} />
              </EuiFlexItem>
            );
            break;
          }
          case 'boolean': {
            el = (
              <EuiFlexItem key={idx}>
                <BooleanField
                  label={camelCaseToTitleString(field.id)}
                  fieldPath={fieldPath}
                  type="Checkbox"
                  disabled={disabled}
                />
                <EuiSpacer size={CONFIG_FIELD_SPACER_SIZE} />
              </EuiFlexItem>
            );
            break;
          }
          case 'number': {
            el = (
              <EuiFlexItem key={idx}>
                <NumberField
                  label={camelCaseToTitleString(field.id)}
                  fieldPath={fieldPath}
                  showError={true}
                  disabled={disabled}
                  fullWidth={true}
                />
                <EuiSpacer size={CONFIG_FIELD_SPACER_SIZE} />
              </EuiFlexItem>
            );
            break;
          }
          case 'json': {
            el = (
              <EuiFlexItem key={idx}>
                <JsonField
                  label={camelCaseToTitleString(field.id)}
                  fieldPath={fieldPath}
                  readOnly={disabled}
                />
                <EuiSpacer size={CONFIG_FIELD_SPACER_SIZE} />
              </EuiFlexItem>
            );
            break;
          }
          case 'jsonString': {
            el = (
              <EuiFlexItem key={idx}>
                <JsonField
                  validate={false}
                  label={camelCaseToTitleString(field.id)}
                  fieldPath={fieldPath}
                  readOnly={disabled}
                />
                <EuiSpacer size={CONFIG_FIELD_SPACER_SIZE} />
              </EuiFlexItem>
            );
            break;
          }
          case 'map': {
            el = (
              <EuiFlexItem key={idx}>
                <MapField
                  label={camelCaseToTitleString(field.id)}
                  fieldPath={fieldPath}
                  disabled={disabled}
                />
                <EuiSpacer size={CONFIG_FIELD_SPACER_SIZE} />
              </EuiFlexItem>
            );
            break;
          }
          case 'model': {
            el = (
              <EuiFlexItem key={idx}>
                <ModelField
                  fieldPath={fieldPath}
                  showMissingInterfaceCallout={false}
                  disabled={disabled}
                  fullWidth={true}
                />
                <EuiSpacer size={CONFIG_FIELD_SPACER_SIZE} />
              </EuiFlexItem>
            );
            break;
          }
        }
        return el;
      })}
    </EuiFlexItem>
  );
}
