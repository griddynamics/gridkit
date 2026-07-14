const component = {
  name: 'InputArea',
  import: "import { InputArea } from 'gd-design-library'",
  description:
    'Multi-line text input organism with auto-growing rows, character count, attachment button, and send action. Use for chat inputs, comment boxes, and message composers.',
  a2uiName: 'input-area',
  category: 'Forms & Input',
  complexity: 'Medium',
  accessibility: 'WCAG 2.1 AA Compliant',
  props: [
    { name: 'value', type: 'string', description: 'Controlled text value of the input area' },
    { name: 'placeholder', type: 'string', description: 'Placeholder text shown when the input is empty' },
    { name: 'disabled', type: 'boolean', description: 'Disables the input area and all its actions', default: false },
    { name: 'maxLength', type: 'number', description: 'Maximum number of characters allowed' },
    {
      name: 'showCharacterCount',
      type: 'boolean',
      description: 'Whether to display a character count indicator',
      default: false,
    },
    {
      name: 'showAttachmentButton',
      type: 'boolean',
      description: 'Whether to show the attachment action button',
      default: false,
    },
    { name: 'showSendButton', type: 'boolean', description: 'Whether to show the send action button', default: true },
    {
      name: 'sendButtonLabel',
      type: 'string',
      description: 'Accessible label for the send button',
      default: 'Send message',
    },
    {
      name: 'showSendButtonTooltip',
      type: 'boolean',
      description: 'Whether to show a tooltip on hover of the send button',
      default: false,
    },
    {
      name: 'attachmentButtonLabel',
      type: 'string',
      description: 'Tooltip and accessible label for the attachment button',
      default: 'Attach files',
    },
    {
      name: 'recordingState',
      type: 'string',
      description:
        'Controls the current voice recording state. idle shows the normal input. recording hides the textarea and shows cancel/confirm buttons. processing disables confirm and shows a spinner.',
      enum: ['idle', 'recording', 'processing'] as const,
      default: 'idle',
    },
    {
      name: 'recordButtonLabel',
      type: 'string',
      description: 'Accessible label for the record button',
      default: 'Voice record',
    },
    { name: 'minRows', type: 'number', description: 'Minimum number of visible text rows', default: 1 },
    { name: 'maxRows', type: 'number', description: 'Maximum number of rows before the area scrolls', default: 5 },
    {
      name: 'maxHeight',
      type: 'number',
      description: 'Maximum height in pixels for the textarea before scrolling is enabled',
      default: 112,
    },
    {
      name: 'actions',
      type: 'string[]',
      description:
        'Optional action IDs triggered when the user sends the current value or clicks the attachment button. The renderer includes trigger metadata in the action payload.',
    },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description:
        'Additional components rendered before the textarea — use for file chips, waveform visualisers, or other contextual content.',
    },
    { name: 'styling', type: 'object', description: 'Custom styles for the input area container', default: {} },
  ],
  examples: [
    '<InputArea value={message} showSendButton placeholder="Type a message..." actions={["send"]} />',
    '<InputArea maxLength={500} showCharacterCount showAttachmentButton attachmentButtonLabel="Attach files" actions={["attach"]} />',
    '<InputArea minRows={3} maxRows={8} disabled={isSubmitting} />',
    '<InputArea showSendButton showSendButtonTooltip sendButtonLabel="Submit" />',
    '<InputArea recordingState="recording" recordButtonLabel="Record voice" />',
    '<InputArea recordingState="processing" showAttachmentButton attachmentButtonLabel="Add attachment" />',
  ],
};

const compositionTips: string[] = [
  'Use InputArea with showSendButton and an actions[] send action for chat or messaging interfaces.',
  'Set InputArea maxLength with showCharacterCount to enforce and display text limits.',
  'Apply InputArea minRows and maxRows to control the auto-growing textarea behavior.',
  'Use InputArea showAttachmentButton with attachmentButtonLabel and an attach action in actions[] to add file upload capability.',
  'Set showSendButtonTooltip to true to surface a tooltip on hover of the send button.',
  'Wire the recording lifecycle: set recordingState (idle → recording → processing → idle) and bind cancel/confirm via actions[].',
  'Pass waveform visualisers or file chips as children — they render above the textarea inside the container.',
  'Set recordingState to "processing" while transcription is in progress — the confirm button disables automatically.',
];

export default { component, compositionTips };
