interface MockFunction {
  mock: {
    calls: Array<any[]>;
    results: Array<{ value: any }>;
  };
}

/**
 * Get the arguments from the last call to a mock function
 * @param mockFn - The mock function
 * @returns The arguments array from the last call, or undefined if no calls
 */
export function getLastCallArgs(mockFn: MockFunction) {
  return mockFn.mock.calls.at(-1)?.[0];
}

/**
 * Get the result (return value) from a specific call to a mock function
 * @param mockFn - The mock function
 * @param callIndex - Index of the call (0-based)
 * @returns The return value from that call, or undefined
 */
export function getMockCallResult(mockFn: MockFunction, callIndex: number) {
  return mockFn.mock.results[callIndex]?.value;
}

/**
 * Get the arguments from a specific call to a mock function
 * @param mockFn - The mock function
 * @param callIndex - Index of the call (0-based)
 * @returns The arguments array from the specified call, or undefined if call doesn't exist
 */
export function getMockCallArgs(mockFn: MockFunction, callIndex: number) {
  return mockFn.mock.calls[callIndex]?.[0];
}

/**
 * Creates a mock File object with specified name, size, and type
 * @param name - File name
 * @param size - File size in bytes
 * @param type - MIME type
 * @returns Mock File object
 */
export const createMockFile = (name: string, size: number, type: string): File => {
  const buffer = new ArrayBuffer(size);
  const blob = new Blob([buffer], { type });
  return new File([blob], name, { type, lastModified: Date.now() });
};

/**
 * Creates a mock DataTransfer object with files for drag-and-drop testing
 * @param files - Array of File objects to add to DataTransfer
 * @returns DataTransfer object with files
 */
export const createMockDataTransfer = (files: File[]): DataTransfer => {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer;
};
