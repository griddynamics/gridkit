'use client';
import { useState, useEffect, useRef, useCallback, type ComponentProps } from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { Row, Box, FlexContainer, Icon, Loader, Typography, AttachmentFile } from '@components';

import { InputArea } from './';

const meta: Meta<typeof InputArea> = {
  title: 'Organisms/InputArea',
  component: InputArea,
  tags: ['autodocs'],
  args: {
    placeholder: 'Write a message...',
    name: 'storyInputArea',
  },
  argTypes: {
    name: {
      description: 'HTML name attribute forwarded to the underlying textarea element',
      control: { type: 'text' },
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    minWidth: {
      description: 'Minimum width of the InputArea container',
      control: { type: 'text' },
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    placeholder: {
      description: 'Placeholder text displayed when the input is empty',
      control: { type: 'text' },
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      description: 'Disables the input area and prevents user interaction',
      control: { type: 'boolean' },
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maxLength: {
      description: 'Maximum number of characters allowed in the input',
      control: { type: 'number' },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    showCharacterCount: {
      description: 'Displays a character count indicator below the input',
      control: { type: 'boolean' },
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showAttachmentButton: {
      description: 'Shows an attachment button for file uploads',
      control: { type: 'boolean' },
      table: {
        category: 'Actions',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showSendButton: {
      description: 'Shows a send button for submitting the message',
      control: { type: 'boolean' },
      table: {
        category: 'Actions',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    minRows: {
      description: 'Minimum number of visible text rows',
      control: { type: 'number' },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    maxRows: {
      description: 'Maximum number of visible text rows before scrolling',
      control: { type: 'number' },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onSend: {
      description: 'Callback fired when the send button is clicked or Enter is pressed',
      action: 'sent',
      table: {
        category: 'Actions',
        type: { summary: '(value: string) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onValueChange: {
      description: 'Callback fired when the input value changes',
      action: 'valueChanged',
      table: {
        category: 'Actions',
        type: { summary: '(value: string) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onAttachmentClick: {
      description: 'Callback fired when the attachment button is clicked',
      action: 'attachmentClicked',
      table: {
        category: 'Actions',
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    value: {
      description: 'Controlled value of the input area',
      control: { type: 'text' },
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    sendButtonLabel: {
      description: 'Custom label for the send button',
      control: { type: 'text' },
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    showSendButtonTooltip: {
      description: 'Shows a tooltip on hover of the send button',
      control: { type: 'boolean' },
      table: {
        category: 'Actions',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    attachmentButtonLabel: {
      description: 'Tooltip label for the attachment button',
      control: { type: 'text' },
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: "'Attach files'" },
      },
    },
    attachmentIcon: {
      description: 'Custom icon for the attachment button',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onKeyDown: {
      description: 'Callback fired on keydown events in the textarea',
      table: {
        category: 'Actions',
        type: { summary: '(event: KeyboardEvent<HTMLTextAreaElement>) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    recordIcon: {
      description:
        'Custom icon for the record button. When provided, the record icon is shown when the input is empty and switches to the send icon when text is entered.',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onRecordClick: {
      description: 'Callback fired when the record button is clicked while recording is enabled and the input is empty',
      action: 'recordClicked',
      table: {
        category: 'Actions',
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    recordButtonLabel: {
      description: 'Accessible label for the record button',
      control: { type: 'text' },
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: "'Voice record'" },
      },
    },
    maxHeight: {
      description: 'Maximum height in pixels for the textarea before scrolling is enabled',
      control: { type: 'number' },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    sendIcon: {
      description:
        'Custom icon rendered inside the send button. Replaces the default send icon. Accepts any ReactNode — use an `<Icon>` component from the design system.',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    recordingState: {
      description:
        'Controls the current  recording state. `idle` shows the normal input. `recording` hides the textarea and shows cancel/confirm buttons. `processing` disables the confirm button and shows a processing icon.',
      control: { type: 'select' },
      options: ['idle', 'recording', 'processing'],
      table: {
        category: 'Recording',
        type: { summary: "'idle' | 'recording' | 'processing'" },
        defaultValue: { summary: "'idle'" },
      },
    },
    onRecordCancel: {
      description: 'Callback fired when the cancel button is clicked during an active recording session',
      action: 'recordCancelled',
      table: {
        category: 'Recording',
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onRecordConfirm: {
      description:
        'Callback fired when the confirm button is clicked to finalise the recording. Called before `recordingState` transitions from `recording` to `processing`.',
      action: 'recordConfirmed',
      table: {
        category: 'Recording',
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`InputArea\` component is a versatile text input designed for messaging interfaces, supporting auto-resizing, character limits, and action buttons.
<br/>
<br/>
<h3>Key Features:</h3>
<ul>
<li>
<b>Text Input</b>
<ul>
<li>Auto-resizing textarea</li>
<li>Configurable min/max rows</li>
<li>Character count with max length enforcement</li>
</ul>
</li>
<li>
<b>Action Buttons</b>
<ul>
<li>Send button with customizable label and icon (<code>sendIcon</code>)</li>
<li>Attachment button for file uploads</li>
<li>Custom attachment icon support</li>
</ul>
</li>
<li>
<b>Voice Recording</b>
<ul>
<li>Three-state recording flow: <code>idle → recording → processing</code></li>
<li>Cancel (<code>onRecordCancel</code>) and confirm (<code>onRecordConfirm</code>) controls</li>
<li>Custom record icon via <code>recordIcon</code> prop</li>
<li>Send/record icon auto-switches based on input content</li>
</ul>
</li>
<li><b>Keyboard Support</b> – Enter key to send, Shift+Enter for new line</li>
<li><b>States</b> – Default, disabled, focused, recording, processing</li>
<li><b>Theming</b> – Customizable styling via theme tokens</li>
</ul>
<br/>
<h3>Props:</h3>
<ul>
<li><b>Content</b>
<ul>
<li><code>value</code>: Controlled input value</li>
<li><code>placeholder</code>: Placeholder text</li>
<li><code>sendIcon</code>: Custom send button icon (ReactNode)</li>
<li><code>attachmentIcon</code>: Custom attachment button icon (ReactNode)</li>
<li><code>recordIcon</code>: Custom record button icon (ReactNode)</li>
</ul>
</li>
<li><b>Behavior</b>
<ul>
<li><code>disabled</code>: Disable the input</li>
<li><code>maxLength</code>: Character limit</li>
<li><code>showCharacterCount</code>: Display character counter</li>
<li><code>minRows / maxRows</code>: Textarea row constraints</li>
<li><code>maxHeight</code>: Max textarea height in px before scrolling</li>
</ul>
</li>
<li><b>Actions</b>
<ul>
<li><code>showSendButton</code>: Toggle send button</li>
<li><code>showAttachmentButton</code>: Toggle attachment button</li>
<li><code>onSend</code>: Send callback</li>
<li><code>onValueChange</code>: Value change callback</li>
<li><code>onAttachmentClick</code>: Attachment click callback</li>
</ul>
</li>
<li><b>Recording</b>
<ul>
<li><code>recordingState</code>: Current state — <code>'idle'</code>, <code>'recording'</code>, or <code>'processing'</code></li>
<li><code>onRecordClick</code>: Starts the recording session</li>
<li><code>onRecordCancel</code>: Cancels the active recording</li>
<li><code>onRecordConfirm</code>: Finalises the recording and triggers processing</li>
<li><code>recordButtonLabel</code>: Accessible label for the record button</li>
</ul>
</li>
</ul>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputArea>;

const InputAreaWithFilePicker = (props: ComponentProps<typeof InputArea>) => {
  const { FileInput, FileChips, openFilePicker, clearFiles, hasLoadingFiles, hasErrorFiles } = useFileAttachments();
  const { onSend, children, ...rest } = props;

  return (
    <>
      {FileInput}
      <InputArea
        {...rest}
        showAttachmentButton
        onAttachmentClick={openFilePicker}
        onSend={(value) => {
          onSend?.(value);
          clearFiles();
        }}
        disabled={rest.disabled || hasLoadingFiles || hasErrorFiles}
      >
        {FileChips}
        {children}
      </InputArea>
    </>
  );
};

export const Default: Story = {
  args: {
    placeholder: 'Write a message...',
    minWidth: '440px',
    showAttachmentButton: true,
    name: 'InputArea',
    onSend: action('onSend'),
    onValueChange: action('onValueChange'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic InputArea with attachment file picker and auto-resizing textarea.',
      },
    },
  },
  render: (args) => <InputAreaWithFilePicker minWidth="440px" {...args} />,
};

export const Disabled: Story = {
  args: {
    placeholder: 'Input is disabled...',
    maxLength: 200,
    name: 'InputArea',
    minWidth: '440px',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'InputArea in a disabled state. The textarea and action buttons are non-interactive.',
      },
    },
  },
  render: (args) => <InputArea {...args} />,
};

export const WithCharacterCount: Story = {
  args: {
    placeholder: 'Write a message...',
    maxLength: 200,
    name: 'InputArea',
    minWidth: '440px',
    showCharacterCount: true,
    onSend: action('onSend'),
    onValueChange: action('onValueChange'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'InputArea with a 200-character limit and a visible character count indicator. The counter updates in real time as the user types.',
      },
    },
  },
  render: (args) => <InputArea {...args} />,
};

export const CustomRows: Story = {
  args: {
    placeholder: 'This input starts with 3 rows...',
    minRows: 3,
    maxRows: 8,
    maxLength: 200,
    name: 'InputArea',
    minWidth: '440px',
    onSend: action('onSend'),
    onValueChange: action('onValueChange'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'InputArea configured with a minimum of 3 visible rows and a maximum of 8 rows before scrolling activates.',
      },
    },
  },
  render: (args) => <InputArea {...args} />,
};

export const CustomSendIcon: Story = {
  args: {
    placeholder: 'Write a message...',
    sendIcon: <Icon name="edit" size="md" />,
    showSendButton: true,
    name: 'InputArea',
    minWidth: '440px',
    onSend: action('onSend'),
    onValueChange: action('onValueChange'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'InputArea with a custom send icon passed via the `sendIcon` prop. Type something to reveal the send button with the overridden icon.',
      },
    },
  },
  render: (args) => <InputArea {...args} />,
};

export const RecordingStates: Story = {
  parameters: {
    docs: {
      description: {
        story: `Demonstrates all three \`recordingState\` values side-by-side:

- **idle** — normal input with mic button visible when empty
- **recording** — textarea hidden, cancel (✕) and confirm (✓) buttons shown
- **processing** — confirm button disabled with a processing spinner, waiting for transcription`,
      },
    },
  },
  render: () => {
    const labels: Array<'idle' | 'recording' | 'processing'> = ['idle', 'recording', 'processing'];
    return (
      <FlexContainer flexDirection="column" gap="24px" width="400px">
        {labels.map((state) => (
          <Box key={state}>
            <Typography
              as="p"
              variant="caption"
              styleVariant="bold"
              color="#666"
              styles={{ textTransform: 'uppercase', marginBottom: '6px' }}
            >
              {state}
            </Typography>
            <InputArea
              placeholder="Write a message..."
              recordingState={state}
              recordIcon={<Icon name="mic" size="md" />}
              showAttachmentButton
              onSend={action('onSend')}
              onRecordClick={action('onRecordClick')}
              onRecordCancel={action('onRecordCancel')}
              onRecordConfirm={action('onRecordConfirm')}
            />
          </Box>
        ))}
      </FlexContainer>
    );
  },
};

const LiveWaveform = ({ stream }: { stream: MediaStream | null }) => {
  const [bars, setBars] = useState<number[]>(Array.from({ length: 60 }, () => 4));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!stream) {
      setBars(Array.from({ length: 60 }, () => 4));
      return;
    }

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      const newBars = Array.from({ length: 60 }, (_, i) => {
        const index = Math.floor((i / 60) * dataArray.length);
        return 4 + (dataArray[index] / 255) * 20;
      });
      setBars(newBars);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current!);
      source.disconnect();
      audioCtx.close();
    };
  }, [stream]);

  return (
    <FlexContainer alignItems="center" gap="3px" padding="8px 0" height="24px" overflow="hidden">
      {bars.map((h, i) => (
        <Box key={i} width="4px" minWidth="4px" height={`${h}px`} styles={{ transition: 'height 0.08s ease' }} />
      ))}
    </FlexContainer>
  );
};

type SpeechRecognitionErrorCode =
  | 'aborted'
  | 'audio-capture'
  | 'bad-grammar'
  | 'language-not-supported'
  | 'network'
  | 'no-speech'
  | 'not-allowed'
  | 'service-not-allowed';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike extends ArrayLike<SpeechRecognitionAlternativeLike> {
  0: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
}

interface SpeechRecognitionResultListLike extends ArrayLike<SpeechRecognitionResultLike> {
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionResultEventLike {
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike {
  error: SpeechRecognitionErrorCode | string;
}

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onaudiostart: (() => void) | null;
  onsoundstart: (() => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
  onsoundend: (() => void) | null;
  onaudioend: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

const browserWindow =
  typeof window !== 'undefined'
    ? (window as Window &
        typeof globalThis & {
          SpeechRecognition?: SpeechRecognitionConstructor;
          webkitSpeechRecognition?: SpeechRecognitionConstructor;
        })
    : undefined;

const SpeechRecognitionAPI = browserWindow?.SpeechRecognition ?? browserWindow?.webkitSpeechRecognition ?? null;

const VoiceRecordingDemo = () => {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing'>('idle');
  const [text, setText] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState('');
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const transcriptRef = useRef('');

  const log = useCallback((msg: string, level: 'debug' | 'info' | 'warn' | 'error' = 'debug') => {
    const prefix = '[InputArea:VoiceRecording]';
    switch (level) {
      case 'error':
        console.error(prefix, msg);
        break;
      case 'warn':
        console.warn(prefix, msg);
        break;
      case 'info':
        console.info(prefix, msg);
        break;
      default:
        console.debug(prefix, msg);
    }
  }, []);
  const { FileInput, FileChips, openFilePicker, clearFiles, hasLoadingFiles, hasErrorFiles } = useFileAttachments();

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
    recognitionRef.current = null;
    transcriptRef.current = '';
    setInterimText('');
  }, []);

  const handleRecordClick = async () => {
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setRecordingState('recording');

      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = navigator.language || 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        log(`Recognition created, lang=${recognition.lang}`, 'info');

        recognition.onaudiostart = () => log('🎤 Audio capture started');
        recognition.onsoundstart = () => log('🔊 Sound detected');
        recognition.onspeechstart = () => log('🗣️ Speech detected');
        recognition.onspeechend = () => log('🗣️ Speech ended');
        recognition.onsoundend = () => log('🔊 Sound ended');
        recognition.onaudioend = () => log('🎤 Audio capture ended');

        recognition.onresult = (event: SpeechRecognitionResultEventLike) => {
          log(`Result: ${event.results.length} result(s)`, 'info');
          let final = '';
          let interim = '';
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              final += result[0].transcript;
            } else {
              interim += result[0].transcript;
            }
          }
          if (final) transcriptRef.current = final;
          setInterimText(interim || final);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
          log(`Error: ${event.error}`, 'error');
          if (event.error === 'not-allowed') {
            setError('Speech recognition blocked. Try opening Storybook directly (not in iframe/docs tab).');
          } else if (event.error === 'no-speech') {
            log('No speech detected — mic may be muted or too quiet', 'warn');
          } else if (event.error !== 'aborted') {
            setError(`Recognition error: ${event.error}`);
          }
        };

        // Auto-restart if recognition ends while still recording (Chrome stops after silence)
        recognition.onend = () => {
          if (recognitionRef.current === recognition && streamRef.current) {
            try {
              recognition.start();
            } catch {
              /* already stopped */
            }
          }
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
          log('Recognition started', 'info');
        } catch (err) {
          log(`Start failed: ${err}`, 'error');
          setError('Failed to start speech recognition. Try Chrome canvas tab (not docs).');
        }
      } else {
        setError('Web Speech API not available — use Chrome or Edge.');
      }

      action('onRecordClick')();
    } catch {
      setError('Microphone access denied. Please allow in browser settings.');
    }
  };

  const handleRecordCancel = () => {
    recognitionRef.current?.abort();
    cleanup();
    setRecordingState('idle');
    action('onRecordCancel')();
  };

  const handleRecordConfirm = () => {
    setRecordingState('processing');
    action('onRecordConfirm')();

    const recognition = recognitionRef.current;
    if (recognition) {
      // Clear ref first so auto-restart onend doesn't fire
      recognitionRef.current = null;

      recognition.onend = () => {
        const result = transcriptRef.current || interimText;
        setText(result || '(no speech detected — try speaking louder)');
        cleanup();
        setRecordingState('idle');
      };
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
    } else {
      const result = transcriptRef.current || interimText;
      if (result) {
        setText(result);
      } else {
        setText('(Web Speech API not available — use Chrome)');
      }
      cleanup();
      setRecordingState('idle');
    }
  };

  const handleSend = (value: string) => {
    action('onSend')(value);
    setText('');
    clearFiles();
  };

  return (
    <Box width="500px">
      {FileInput}
      <InputArea
        value={text}
        onValueChange={setText}
        placeholder="Write a message..."
        showAttachmentButton
        recordingState={recordingState}
        onRecordClick={handleRecordClick}
        onRecordCancel={handleRecordCancel}
        onRecordConfirm={handleRecordConfirm}
        onSend={handleSend}
        onAttachmentClick={openFilePicker}
        disabled={hasLoadingFiles || hasErrorFiles}
      >
        {FileChips}
        {recordingState !== 'idle' && <LiveWaveform stream={stream} />}
      </InputArea>
      {error && (
        <Typography as="p" variant="caption" color="#B42318" styles={{ marginTop: '8px', lineHeight: 1.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export const VoiceRecordingInteractive: Story = {
  parameters: {
    docs: {
      description: {
        story: `**Real  recording demo** using browser APIs (Web Speech API + AudioContext). Click the mic button to start:

- **Recording** — real microphone waveform visualization, speak into your mic
- **Confirm (✓)** — Web Speech API transcribes your speech to text (Polish)
- **Cancel (✕)** — stops recording, discards audio
- **Transcription** — real text appears in input, edit and send
- **Attachment** — real file picker

⚠️ Requires Chrome/Edge for Web Speech API. Mic permission needed.`,
      },
    },
  },
  render: () => <VoiceRecordingDemo />,
};

type FileState = 'idle' | 'loading' | 'loaded' | 'error';

interface AttachedFile {
  name: string;
  type: string;
  size: string;
  state: FileState;
}

const DropZoneOverlay = () => (
  <FlexContainer
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap="4px"
    styles={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(229, 160, 0, 0.08)',
      border: '2px dashed #E5A000',
      borderRadius: '0',
      zIndex: 10,
      pointerEvents: 'none',
    }}
  >
    <Typography as="span" styles={{ fontSize: '24px' }}>
      ⬆
    </Typography>
    <Typography as="span" variant="caption" styleVariant="bold" color="#464748">
      Drop items here
    </Typography>
  </FlexContainer>
);

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const useFileAttachments = () => {
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList) => {
    const newFiles: AttachedFile[] = Array.from(fileList).map((f) => ({
      name: f.name,
      type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
      size: formatFileSize(f.size),
      state: 'loading' as FileState,
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((nf) => {
      const shouldFail = Math.random() < 0.2;
      setTimeout(
        () => {
          setFiles((prev) =>
            prev.map((f) =>
              f.name === nf.name && f.state === 'loading' ? { ...f, state: shouldFail ? 'error' : 'loaded' } : f
            )
          );
        },
        1500 + Math.random() * 1000
      );
    });
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => setFiles([]);

  const hasLoadingFiles = files.some((f) => f.state === 'loading');
  const hasErrorFiles = files.some((f) => f.state === 'error');

  const FileInput = (
    <input
      ref={fileInputRef}
      type="file"
      multiple
      style={{ display: 'none' }}
      onChange={(e) => {
        if (e.target.files?.length) addFiles(e.target.files);
        e.target.value = '';
      }}
    />
  );

  const FileChips =
    files.length > 0 ? (
      <Row gap="6px" styles={{ marginBottom: '4px' }}>
        {files.map((file, i) => {
          const isLoading = file.state === 'loading';
          const isError = file.state === 'error';

          return (
            <AttachmentFile
              key={`${file.name}-${i}`}
              fileName={file.name}
              fileType={isError ? 'Upload failed' : file.type}
              fileSize={!isError ? file.size : undefined}
              fileIcon={isError ? <Icon name="error" fill="icon.error" size="xl" /> : undefined}
              onRemove={() => removeFile(i)}
              disabled={isLoading}
              isLoading={isLoading}
              maxWidth="45%"
            />
          );
        })}
      </Row>
    ) : null;

  return {
    files,
    openFilePicker,
    addFiles,
    removeFile,
    clearFiles,
    hasLoadingFiles,
    hasErrorFiles,
    FileInput,
    FileChips,
  };
};

const AttachmentDemo = () => {
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const { openFilePicker, addFiles, clearFiles, hasLoadingFiles, hasErrorFiles, FileInput, FileChips } =
    useFileAttachments();

  return (
    <Box width="500px">
      {FileInput}
      <Box
        styles={{ position: 'relative' }}
        onDragOver={(e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
      >
        {isDragging && <DropZoneOverlay />}
        <InputArea
          value={text}
          onValueChange={setText}
          placeholder="Write a message..."
          showAttachmentButton
          onAttachmentClick={openFilePicker}
          onSend={(value) => {
            action('onSend')(value);
            setText('');
            clearFiles();
          }}
          disabled={hasLoadingFiles || hasErrorFiles}
        >
          {FileChips}
        </InputArea>
      </Box>
    </Box>
  );
};

export const AttachmentInteractive: Story = {
  parameters: {
    docs: {
      description: {
        story: `Fully interactive file attachment demo. Click the attachment (📎) button to add files:

- **Loading** — file chip with spinner, send disabled
- **Loaded** — file chip with ✕ to remove, send enabled
- **Error** — red error chip with ✕ to dismiss (every 3rd file)
- **Drag & Drop** — drag files over the input area to see the drop zone overlay

Send clears all files and text.`,
      },
    },
  },
  render: () => <AttachmentDemo />,
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ inputArea: defaultTheme.inputArea }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
