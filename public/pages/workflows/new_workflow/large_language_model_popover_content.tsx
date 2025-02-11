/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiLink,
} from '@elastic/eui';
import { ML_CHOOSE_MODEL_LINK, COHERE_EMBEDDING_MODEL_LINK, AMAZON_BEDROCK_TITAN_EMBEDDING_MODEL_LINK } from '../../../../common';

export function LargeLanguageModelPopoverContent() {

return (
    <div style={{ padding: '12px', width: '400px' }}>
      <p style={{ margin: '0', lineHeight: '1.5' }}>
        To create this workflow, you must select an large language model. We suggest{' '}
        <EuiLink external href={COHERE_EMBEDDING_MODEL_LINK} target="_blank">
          Cohere Embed
        </EuiLink>
        {' '}or{' '}
        <EuiLink external href={AMAZON_BEDROCK_TITAN_EMBEDDING_MODEL_LINK} target="_blank">
          Amazon Bedrock Titan Embedding
        </EuiLink>
        {'.'}
      </p>
      <p style={{ margin: '24px 0 0 0', lineHeight: '1.5' }}>
        <EuiLink external href={ML_CHOOSE_MODEL_LINK} target="_blank">
          Learn more
        </EuiLink>
        {' '}about integrating ML models.
      </p>
    </div>
);
}
