'use client';
import {
  forwardRef,
  Children,
  useCallback,
  useRef,
  type PropsWithChildren,
  type RefObject,
  type ChangeEvent,
} from 'react';
import { DragAndDropFiles } from '@components/organisms/DragAndDropFiles';
import { useTheme } from '@hooks/useTheme';
import { InputFile } from '@components';
import { Column } from '@components/layout';
import { get } from '@utils';
import { ButtonVariant, TypographyVariant } from '@types';

import { COMPONENT_NAME } from './constants';
import { validateFiles } from './utils';
import {
  ContentTypographyStyled,
  DragAndDropAreaStyled,
  DragAndDropStyled,
  DragOverContentStyled,
  UploadIconStyled,
} from './DragAndDropStyled';
import type { DragAndDropProps } from './';

export const DragAndDrop = forwardRef<HTMLDivElement, PropsWithChildren<DragAndDropProps>>((props, forwardedRef) => {
  const {
    styles = {},
    files,
    errors,
    title,
    description,
    inputFileButtonLabel,
    acceptedFileTypes,
    maxFileSize,
    maxFiles,
    onError,
    onFilesChanged,
    disabled,
    isLoading,
    loadingOverlay,
    children,
    ...rest
  } = props;
  const { theme } = useTheme();

  const dragAndDropAreaRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles || isLoading) return;
      const currentFiles = files ?? [];
      const newFilesArray = Array.from(newFiles);

      const { validFiles, errors } = validateFiles(
        newFilesArray,
        currentFiles,
        acceptedFileTypes,
        maxFiles,
        maxFileSize
      );

      onError(errors);
      if (validFiles.length > 0) {
        const updatedFiles = [...currentFiles, ...validFiles];
        onFilesChanged(updatedFiles);
      }
    },
    [files, acceptedFileTypes, maxFiles, maxFileSize, onFilesChanged, onError, isLoading]
  );

  const handleDragAndDrop = useCallback(
    (files: FileList) => {
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleFileInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files);
    },
    [handleFiles]
  );

  const isError = errors && errors.length > 0;
  const allowMultipleFiles = !maxFiles || maxFiles > 1;

  const hasChildren = Children.count(children) > 0;
  const passedRef = forwardedRef ? (forwardedRef as RefObject<HTMLElement>) : null;
  return (
    <DragAndDropStyled ref={forwardedRef || wrapperRef} theme={theme} styles={styles} data-testid={COMPONENT_NAME}>
      <DragAndDropFiles
        targetRef={passedRef || wrapperRef}
        triggerRef={dragAndDropAreaRef}
        dragOverContent={
          isLoading ? null : (
            <DragOverContentStyled theme={theme}>
              <Column justify="center" align="center" gutter={16}>
                <UploadIconStyled theme={theme} />
                <ContentTypographyStyled theme={theme} variant={TypographyVariant.H6}>
                  {title}
                </ContentTypographyStyled>
              </Column>
            </DragOverContentStyled>
          )
        }
        onDrop={handleDragAndDrop}
        {...rest}
      >
        {hasChildren && children}
        {!hasChildren && (
          <DragAndDropAreaStyled
            theme={theme}
            ref={dragAndDropAreaRef}
            $disabled={disabled}
            $isError={isError}
            $isLoading={isLoading}
          >
            <Column justify="center" align="center" gutter={16}>
              {!isLoading && (
                <>
                  <UploadIconStyled theme={theme} $disabled={disabled} />
                  {title && (
                    <>
                      <ContentTypographyStyled theme={theme} variant={TypographyVariant.H6} $disabled={disabled}>
                        {title}
                      </ContentTypographyStyled>
                      <ContentTypographyStyled
                        theme={theme}
                        as="div"
                        variant={TypographyVariant.Caption}
                        $disabled={disabled}
                      >
                        or
                      </ContentTypographyStyled>
                    </>
                  )}

                  <InputFile
                    multiple={allowMultipleFiles}
                    disabled={disabled}
                    onChange={handleFileInputChange}
                    buttonProps={{
                      variant: disabled ? ButtonVariant.Text : ButtonVariant.Outlined,
                    }}
                  >
                    {inputFileButtonLabel}
                  </InputFile>
                  {description && (
                    <ContentTypographyStyled
                      theme={theme}
                      as="div"
                      variant={TypographyVariant.Caption}
                      $disabled={disabled}
                    >
                      {description}
                    </ContentTypographyStyled>
                  )}

                  {errors?.map((error, idx) => (
                    <ContentTypographyStyled
                      key={`${error}-${idx}`}
                      theme={theme}
                      as="div"
                      color={get(theme, 'colors.text.error', 'theme.colors.text.error')}
                      variant={TypographyVariant.Caption}
                    >
                      {error}
                    </ContentTypographyStyled>
                  ))}
                </>
              )}
              {isLoading && loadingOverlay}
            </Column>
          </DragAndDropAreaStyled>
        )}
      </DragAndDropFiles>
    </DragAndDropStyled>
  );
});

DragAndDrop.displayName = COMPONENT_NAME;
