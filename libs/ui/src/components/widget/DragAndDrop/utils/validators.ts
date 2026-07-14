export const validateFile = (file: File, acceptedFileTypes?: string[], maxFileSize?: number): string | null => {
  if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
    return `File type not supported: ${file.name} (${file.type})`;
  }
  if (maxFileSize && file.size > maxFileSize) {
    return `File too large: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB). Max allowed is ${(
      maxFileSize /
      (1024 * 1024)
    ).toFixed(2)} MB.`;
  }
  return null;
};

export const validateFiles = (
  files: File[],
  existingFiles: File[],
  acceptedFileTypes?: string[],
  maxFilesNumber?: number,
  maxFilesSize?: number
): { validFiles: File[]; errors: string[] } => {
  const errors: string[] = [];
  const validFiles: File[] = [];

  if (maxFilesNumber && files.length + existingFiles.length > maxFilesNumber) {
    errors.push(`Too many files. You can upload a maximum of ${maxFilesNumber} files.`);
    return { validFiles: [], errors };
  }

  files.forEach((file) => {
    const error = validateFile(file, acceptedFileTypes, maxFilesSize);
    if (error) {
      errors.push(error);
    } else {
      validFiles.push(file);
    }
  });

  return { validFiles, errors };
};
