const component = {
  name: 'AttachmentFile',
  import: "import { AttachmentFile } from 'gd-design-library'",
  description:
    'File attachment chip: file-copy icon on the left, bold file name (truncates with tooltip on hover), optional small metadata row (fileType · fileSize, both truncate), and a close/remove (×) button on the right. Horizontal inline chip, typically 40–48 px tall with rounded corners. Renders above the InputArea textarea or standalone. Use actions[] to wire the remove button in A2UI; in TSX use onRemove. Figma component set names: "AttachmentFile", "Attachment File", "File Chip", "File Tag", "attachment-chip". Also matches any chip/pill node that contains a file name + a remove/close affordance.',
  a2uiName: 'attachment-file',
  category: 'Forms & Input',
  complexity: 'Low',
  accessibility: 'WCAG 2.1 AA Compliant',
  props: [
    {
      name: 'fileName',
      type: 'string',
      required: true,
      description:
        'Name of the attached file displayed in the chip. Truncates with a tooltip on hover when long. Required.',
    },
    {
      name: 'fileType',
      type: 'string',
      description: 'File type label shown below the file name (e.g. "PDF", "doc"). Truncates with ellipsis when long.',
    },
    {
      name: 'fileSize',
      type: 'string',
      description: 'File size label shown below the file name (e.g. "1.2 MB").',
    },
    {
      name: 'separator',
      type: 'string',
      description:
        'Character rendered between fileType and fileSize in the metadata row. Defaults to "·". Override for designs that use "/" or "|".',
      default: '·',
    },
    {
      name: 'actions',
      type: 'string[]',
      description:
        'Action IDs from ui.actions to trigger when the remove (×) button is clicked. The remove button is only rendered when this array is non-empty. In TSX this maps to onRemove. Example: set actions: ["remove_notes_txt"] and define { id: "remove_notes_txt", type: "remove-file" } in ui.actions.',
    },
    {
      name: 'removeButtonLabel',
      type: 'string',
      description: 'Accessible aria-label for the remove button.',
      default: 'Remove file',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disables the remove button, preventing file removal.',
      default: false,
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Shows a spinner in place of the remove button while the file is uploading. Only takes effect when actions[] is also provided (TSX: when onRemove is set).',
      default: false,
    },
    {
      name: 'styling',
      type: 'object',
      description: 'CSS style overrides for the chip container (e.g. { margin: "4px 0" }).',
      default: {},
    },
  ],
  examples: [
    '<AttachmentFile fileName="report.pdf" fileType="PDF" fileSize="1.2 MB" onRemove={() => removeFile(id)} />',
    '<AttachmentFile fileName="image.png" />',
    '<AttachmentFile fileName="data.xlsx" fileType="xlsx" fileSize="3.8 MB" onRemove={handleRemove} disabled={isUploading} />',
    '<AttachmentFile fileName="photo.jpg" fileIcon={<Icon name="image" size="xl" />} onRemove={handleRemove} />',
    '<AttachmentFile fileName="report.pdf" isLoading onRemove={handleRemove} />',
  ],
};

const compositionTips: string[] = [
  'A2UI — wire the remove button via actions[], NOT onRemove: { "id": "attachment_file_1", "type": "attachment-file", "fileName": "notes.txt", "actions": ["remove_notes_txt"] } and { "id": "remove_notes_txt", "type": "remove-file" } in ui.actions. Never set onRemove or fileIcon directly in A2UI JSON.',
  'A2UI — omit actions[] entirely for read-only display (no remove button is rendered).',
  'A2UI — isLoading, disabled, separator, removeButtonLabel, fileType, fileSize all work in A2UI JSON exactly as in TSX.',
  'Pass AttachmentFile as a child of InputArea to show selected files above the textarea.',
  'Always provide onRemove (TSX) / actions[] (A2UI) so users can deselect files; omit only for read-only display.',
  'Set disabled during upload or processing to prevent premature removal.',
  'Use fileType and fileSize together for full file metadata — either can be omitted independently.',
  'Map an array of selected files to AttachmentFile chips inside a Box variant="vertical" with gap for a file list.',
  'Use isLoading during upload — it natively swaps the remove button for a spinner and disables removal until complete.',
  'Long file names truncate automatically and reveal the full text via a tooltip on hover; long fileType values truncate but do not show a tooltip.',
  'Override separator when the design uses a different delimiter between fileType and fileSize (e.g. separator="/" or separator="|").',
  'Visual signature for design intake: horizontal chip ~40-48 px tall, file-copy icon on the left, bold filename (possibly truncated), optional 12-13 px metadata text below, × close button on the right.',
  'Figma INSTANCE resolution: component set name "AttachmentFile" or "Attachment File" → A2UI type "attachment-file". Map Figma component properties: fileName caption → fileName, type badge → fileType, size text → fileSize.',
];

export default { component, compositionTips };
