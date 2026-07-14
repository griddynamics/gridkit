'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Button, Icon } from '@components/atoms';
import { Tooltip } from '@components/molecules/Tooltip';

import { COMPONENT_NAME } from './constants';
import {
  AttachmentFileStyled,
  AttachmentFileInfoStyled,
  AttachmentFileNameStyled,
  AttachmentFileMetaRowStyled,
  AttachmentFileMetaTextStyled,
  resolveAttachmentFileTokens,
} from './AttachmentFileStyled';
import type { AttachmentFileProps } from './';

export const AttachmentFile = forwardRef<HTMLDivElement, AttachmentFileProps>((props, forwardedRef) => {
  const {
    fileName,
    fileType,
    fileSize,
    fileIcon,
    separator = '·',
    onRemove,
    removeButtonLabel = 'Remove file',
    disabled = false,
    isLoading = false,
    ...rest
  } = props;
  const { theme } = useTheme();
  const { buttonVariant, buttonStyles, fileIconProps, removeIconProps } = resolveAttachmentFileTokens(theme);

  const hasMeta = Boolean(fileType || fileSize);

  return (
    <AttachmentFileStyled ref={forwardedRef} theme={theme} data-testid={COMPONENT_NAME} {...rest}>
      {fileIcon ?? <Icon {...fileIconProps} />}
      <AttachmentFileInfoStyled theme={theme}>
        <Tooltip content={fileName}>
          <AttachmentFileNameStyled theme={theme} data-testid={`${COMPONENT_NAME}-name`}>
            {fileName}
          </AttachmentFileNameStyled>
        </Tooltip>
        {hasMeta && (
          <AttachmentFileMetaRowStyled theme={theme} data-testid={`${COMPONENT_NAME}-meta`}>
            {fileType && <AttachmentFileMetaTextStyled theme={theme}>{fileType}</AttachmentFileMetaTextStyled>}
            {fileType && fileSize && (
              <AttachmentFileMetaTextStyled theme={theme}>{separator}</AttachmentFileMetaTextStyled>
            )}
            {fileSize && <AttachmentFileMetaTextStyled theme={theme}>{fileSize}</AttachmentFileMetaTextStyled>}
          </AttachmentFileMetaRowStyled>
        )}
      </AttachmentFileInfoStyled>
      {onRemove && (
        <Button
          isIcon
          isLoading={isLoading}
          variant={buttonVariant}
          styles={buttonStyles}
          onClick={onRemove}
          disabled={disabled}
          ariaLabel={removeButtonLabel}
          iconStart={isLoading ? null : <Icon {...removeIconProps} />}
          data-testid={`${COMPONENT_NAME}-remove`}
        />
      )}
    </AttachmentFileStyled>
  );
});

AttachmentFile.displayName = COMPONENT_NAME;
