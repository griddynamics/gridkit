const component = {
  name: 'DragAndDrop',
  import: "import { DragAndDrop } from 'gd-design-library'",
  description:
    'Workflow upload widget that combines drag-and-drop handling, inline validation, and an InputFile fallback trigger into a single controlled upload surface. In A2UI, describe it with JSON-safe fields and actions[] rather than React callbacks or refs.',
  a2uiName: 'drag-and-drop',
  category: 'Widgets',
  complexity: 'High',
  accessibility:
    'WCAG 2.1 AA Compliant - preserves a keyboard-accessible file picker fallback, visible validation messaging, and descriptive upload copy.',
  performance: 'Optimized - validates files client-side before dispatching upload actions or displaying inline errors.',
  props: [
    {
      name: 'title',
      type: 'string',
      description: 'Primary heading shown inside the default upload surface. Falls back to label when omitted.',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Supporting copy explaining allowed formats, file size limits, or the next upload step.',
    },
    {
      name: 'inputFileButtonLabel',
      type: 'string',
      description: 'Visible label for the built-in InputFile trigger button inside the default upload surface.',
    },
    {
      name: 'acceptedFileTypes',
      type: 'string[]',
      description: 'Allowed MIME types for dropped or selected files (for example ["image/png", "application/pdf"]).',
    },
    {
      name: 'maxFileSize',
      type: 'number',
      description: 'Maximum allowed size in bytes for each file.',
    },
    {
      name: 'maxFiles',
      type: 'number',
      description: 'Maximum total number of files allowed in the widget at once.',
    },
    {
      name: 'errors',
      type: 'string[]',
      description: 'Inline validation or upload error messages rendered below the uploader controls.',
    },
    {
      name: 'files',
      type: 'Array<{ name: string; size?: number; type?: string }>',
      description:
        'Optional controlled file metadata used by A2UI renderers to preserve the current file count between re-renders.',
    },
    {
      name: 'dragOverContent',
      type: 'A2UIComponent[]',
      description: 'Optional custom components rendered while the user is actively dragging files over the drop zone.',
    },
    {
      name: 'loadingOverlay',
      type: 'A2UIComponent[]',
      description: 'Optional custom components rendered instead of the default upload surface while isLoading is true.',
    },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description:
        'Optional custom idle-state drop-zone content. When provided, it replaces the default title/button/description layout.',
    },
    {
      name: 'actions',
      type: 'string[]',
      description:
        'Action IDs from ui.actions. The A2UI renderer dispatches selected file metadata and validation errors through these actions.',
    },
    { name: 'disabled', type: 'boolean', description: 'Disables dragging and file picker interactions.' },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Shows loading state and swaps the default upload surface for loadingOverlay when provided.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the widget container.' },
  ],
  quickStart: {
    basic: '{ type: "drag-and-drop", title: "Upload files", inputFileButtonLabel: "Choose files" }',
    withValidation:
      '{ type: "drag-and-drop", title: "Upload assets", description: "PNG or PDF up to 10MB", acceptedFileTypes: ["image/png", "application/pdf"], maxFiles: 3, maxFileSize: 10000000 }',
    withActions:
      '{ type: "drag-and-drop", title: "Attach report", inputFileButtonLabel: "Browse files", actions: ["upload_report_action"] }',
    withCustomOverlay:
      '{ type: "drag-and-drop", title: "Upload assets", isLoading: true, loadingOverlay: [{ type: "loader", name: "circle" }, { type: "typography", value: "Uploading files..." }] }',
  },
  commonPatterns: {
    'Document Intake': {
      code: '{ type: "drag-and-drop", title: "Upload contracts", description: "PDF or DOCX up to 15MB", inputFileButtonLabel: "Choose documents", acceptedFileTypes: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], maxFiles: 5, maxFileSize: 15000000 }',
      useCase: 'Multi-file document intake flows with clear validation guidance',
    },
    'Avatar Upload': {
      code: '{ type: "drag-and-drop", title: "Drop a new profile photo", description: "PNG or JPG up to 5MB", acceptedFileTypes: ["image/png", "image/jpeg"], maxFiles: 1, maxFileSize: 5000000, actions: ["upload_avatar_action"] }',
      useCase: 'Single-image upload workflows with immediate action dispatch',
    },
    'Async Upload State': {
      code: '{ type: "drag-and-drop", title: "Upload assets", isLoading: true, loadingOverlay: [{ type: "loader", name: "circle" }, { type: "typography", value: "Uploading files..." }] }',
      useCase: 'Long-running uploads or post-processing states that need custom loading feedback',
    },
    'Custom Drag State': {
      code: '{ type: "drag-and-drop", title: "Attach evidence", dragOverContent: [{ type: "icon", icon: "upload" }, { type: "typography", value: "Release to upload" }] }',
      useCase: 'Branded drag-over feedback while keeping the normal idle upload layout',
    },
  },
  examples: [
    '{ type: "drag-and-drop", title: "Upload assets", description: "PNG, JPG or PDF up to 10MB", inputFileButtonLabel: "Choose files" }',
    '{ type: "drag-and-drop", title: "Upload assets", acceptedFileTypes: ["image/png", "image/jpeg"], maxFiles: 5, maxFileSize: 10000000 }',
    '{ type: "drag-and-drop", title: "Upload receipts", errors: ["File too large", "Only PDFs are supported"], actions: ["upload_receipt_action"] }',
    '{ type: "drag-and-drop", title: "Upload files", dragOverContent: [{ type: "typography", value: "Release to upload" }], loadingOverlay: [{ type: "loader", name: "circle" }] }',
  ],
  troubleshooting: {
    'Upload action never fires':
      'Attach one or more action IDs through actions[]. The renderer forwards selected file metadata through those actions instead of exposing React callbacks.',
    'Validation rules are ignored':
      'Use top-level acceptedFileTypes, maxFiles, and maxFileSize fields. Do not emit React-only props such as onFilesChanged, onError, onDrop, targetRef, or triggerRef.',
    'Custom drag state does not appear':
      'Provide dragOverContent[] with A2UI component objects. The default drag overlay is used when dragOverContent is omitted.',
  },
  bestPractices: [
    'Use title, description, and inputFileButtonLabel together so upload expectations remain obvious in the default layout.',
    'Keep maxFiles, maxFileSize, and acceptedFileTypes explicit so the renderer can validate files before dispatching actions.',
    'Wire file selection through actions[] instead of raw callbacks; the renderer sends file metadata and validation errors in the action payload.',
    'Use errors[] for server-returned or previously known validation messages so users see the reason for a failed upload immediately.',
    'Prefer loadingOverlay[] over replacing the whole widget when uploads are in progress.',
    'Only use children[] when you truly need a custom idle-state surface; otherwise keep the default layout for consistent guidance and accessibility.',
    'Use dragOverContent[] sparingly to reinforce the drop target without hiding the upload requirements.',
  ],
};

const compositionTips = [
  'Use DragAndDrop when the upload workflow needs both drag-and-drop handling and a normal file picker fallback.',
  'In A2UI, use top-level inputFileButtonLabel, acceptedFileTypes, maxFiles, maxFileSize, errors, files, dragOverContent, and loadingOverlay fields instead of React-only props.',
  'Wire upload reactions through actions[]; the renderer dispatches selected file metadata and validation errors instead of exposing onFilesChanged/onError callbacks.',
  'Use errors[] for controlled or server-returned messages, while letting the renderer maintain live client-side validation after interaction.',
  'Provide loadingOverlay[] or children[] only when custom UI is needed; otherwise rely on the default title/button/description upload surface.',
];

export default { component, compositionTips };
