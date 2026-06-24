import { FileTypes } from '@components';
import { validateFile, validateFiles } from './validators';

const createMockFile = (name: string, type: string, size: number): File => {
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', {
    value: size,
    writable: false,
  });
  return file;
};
describe('validateFile', () => {
  it('SHOULD return null when file is valid', () => {
    const file = createMockFile('test.jpg', FileTypes.jpeg, 500000);
    console.log('FileTypes', FileTypes);
    expect(validateFile(file, [FileTypes.jpeg], 1000000)).toBeNull();
  });

  it('SHOULD return error when file type is not accepted', () => {
    const file = createMockFile('test.txt', FileTypes.text, 500000);
    expect(validateFile(file, [FileTypes.jpeg], 1000000)).toContain('File type not supported');
  });

  it('SHOULD return error when file size exceeds maxFileSize', () => {
    const file = createMockFile('large.jpg', FileTypes.jpeg, 2000000);
    expect(validateFile(file, [FileTypes.jpeg], 1000000)).toContain('File too large');
  });

  it('SHOULD return null when no restrictions provided', () => {
    const file = createMockFile('any.file', FileTypes.csv, 9999999);
    expect(validateFile(file)).toBeNull();
  });
});

describe('validateFiles', () => {
  it('SHOULD validate multiple valid files', () => {
    const files = [
      createMockFile('img1.jpg', FileTypes.jpeg, 100000),
      createMockFile('img2.jpg', FileTypes.jpeg, 200000),
    ];
    const result = validateFiles(files, [], [FileTypes.jpeg], 5, 300000);
    expect(result.validFiles.length).toBe(2);
  });

  it('SHOULD return error when total file count exceeds maxFilesNumber', () => {
    const files = [createMockFile('new1.jpg', FileTypes.jpeg, 100000)];
    const existing = Array(5).fill(createMockFile('old.jpg', FileTypes.jpeg, 100000));
    const result = validateFiles(files, existing, [FileTypes.jpeg], 5, 1000000);
    expect(result.errors.length > 0).toBe(true);
  });

  it('SHOULD accept only valid file types', () => {
    const files = [
      createMockFile('img.jpg', FileTypes.jpeg, 100000),
      createMockFile('doc.txt', FileTypes.text, 100000),
    ];
    const result = validateFiles(files, [], [FileTypes.jpeg], 5, 1000000);
    expect(result.validFiles.length).toBe(1);
    expect(result.errors.length).toBe(1);
  });

  it('SHOULD handle empty file list', () => {
    const result = validateFiles([], [], [FileTypes.jpeg], 5, 1000000);
    expect(result).toEqual({ validFiles: [], errors: [] });
  });
});
