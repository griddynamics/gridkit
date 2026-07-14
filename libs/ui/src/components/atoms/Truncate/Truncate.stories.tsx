import React, { useRef, useEffect, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';

import { Typography, Box, Tooltip } from '@components';

import { Truncate, type TruncateProps, type TruncateRef } from './';
import { defaultActions, lineTruncationActions, withCustomStylingActions } from './Truncate.stories.play';

const meta = {
  title: 'Atoms/Truncate',
  component: Truncate,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      table: {
        category: 'Content',
      },
      description: 'ReactNode content to display. Accepts string text or any ReactNode for flexible content.',
    },
    lines: {
      control: { type: 'number' },
      table: {
        defaultValue: { summary: '1' },
        category: 'Truncation',
      },
      description: 'Number of lines before truncation (default: 1)',
    },
    styles: {
      control: { type: 'object' },
      table: {
        defaultValue: { summary: '{}' },
        category: 'Appearance',
      },
      description:
        'Custom CSS styles object for one-off styling needs. Accepts Emotion CSS object syntax with support for nested selectors, pseudo-classes, and media queries.',
    },
    ref: {
      control: false,
      description:
        'Forwarded ref providing imperative access to truncation state. Exposes `isTruncated` (boolean) indicating if content is truncated. Useful for conditionally showing tooltips or for analytics.',
      table: {
        category: 'Ref API',
        type: {
          summary: 'Ref<TruncateRef>',
          detail: 'TruncateRef: { ref: Ref<HTMLSpanElement>; isTruncated: boolean; }',
        },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The \`Truncate\` component provides uniform text truncation with line-based truncation support. 
It ensures consistent visual alignment in lists, tables, or any component that requires text truncation.
<br/><br/>

<h3>🎯 Core Features</h3>
<ul>
  <li><b>Line-based Truncation</b> – Truncate text by number of lines using the \`lines\` prop (uses CSS line-clamp)</li>
  <li><b>Ref API</b> – Access truncation state via ref: \`isTruncated\` (boolean)</li>
  <li><b>Children Support</b> – Accepts string text or ReactNode children for flexible content</li>
</ul>

<h3>💡 Usage Guidelines</h3>
<ul>
  <li>Use \`lines\` prop to specify the maximum number of lines (default: 1)</li>
  <li>Access truncation state programmatically via ref for charts and analytics</li>
  <li>Wrap the component in a container with fixed width to see truncation behavior</li>
</ul>
        `,
      },
    },
  },
} satisfies Meta<typeof Truncate>;

export default meta;

export const Default: StoryFn<TruncateProps> = (args) => (
  <Box width="50%" margin="0 auto">
    <Truncate {...args} />
  </Box>
);
Default.args = {
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};
Default.parameters = {
  docs: {
    source: {
      code: `<Box width="50%" margin="0 auto">
  <Truncate>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </Truncate>
</Box>`,
    },
    description: {
      story: `
Line-based truncation limits text to a maximum number of lines.
When text exceeds the specified number of lines, it's truncated and an ellipsis symbol is appended.
      `,
    },
  },
};
Default.play = defaultActions;

export const LineTruncation: StoryFn<TruncateProps> = (args) => (
  <Box width="50%" margin="0 auto">
    <Truncate {...args} />
  </Box>
);
LineTruncation.args = {
  children: 'This is a very long text that will wrap to multiple ',
  lines: 2,
};
LineTruncation.parameters = {
  docs: {
    source: {
      code: `<Box width="50%" margin="0 auto">
  <Truncate lines={2}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </Truncate>
</Box>`,
    },
    description: {
      story: `
Line-based truncation uses CSS line-clamp to limit text to a specific number of lines.
The ellipsis is automatically handled by CSS, ensuring proper visual truncation.
      `,
    },
  },
};
LineTruncation.play = lineTruncationActions;

export const WithCustomStyling: StoryFn<TruncateProps> = (args) => (
  <Box width="50%" margin="0 auto">
    <Truncate {...args} />
  </Box>
);
WithCustomStyling.args = {
  children:
    'This text has custom styling applied via the styles prop. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  styles: {
    color: '#dc2626',
    fontWeight: 600,
    fontSize: '18px',
  },
};
WithCustomStyling.play = withCustomStylingActions;
WithCustomStyling.parameters = {
  docs: {
    source: {
      code: `<Box width="50%" margin="0 auto">
  <Truncate
    styles={{
      color: '#dc2626',
      fontWeight: 600,
      fontSize: '18px'
    }}
  >
    This text has custom styling applied via the styles prop.
  </Truncate>
</Box>`,
    },
    description: {
      story: `
The \`styles\` prop allows you to apply custom CSS styling to the truncated text using Emotion CSS object syntax.
This is useful for one-off styling needs like custom colors, font sizes, weights, or other CSS properties
while maintaining the truncation behavior.
      `,
    },
  },
};

export const RefAPIWithTooltipOnOverflow: StoryFn = () => {
  const ref = useRef<TruncateRef>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const updateState = () => {
    if (ref.current) {
      setIsTruncated(ref.current.isTruncated);
    }
  };

  useEffect(() => {
    // Initial state update
    requestAnimationFrame(() => {
      setTimeout(() => {
        updateState();
      });
    });

    // Listen to window resize
    window.addEventListener('resize', updateState);

    return () => {
      window.removeEventListener('resize', updateState);
    };
  }, []);

  // Periodically check ref value as a fallback to catch any missed updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateState();
    }, 200);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Box width="100%" margin="0 auto">
      <Tooltip content={isTruncated ? 'Content is truncated' : null}>
        <Truncate ref={ref}>
          (Resize window): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
        </Truncate>
      </Tooltip>

      <Box padding="12px" styles={{ backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <Typography variant="small">
          <Typography variant="strong">Ref API State:</Typography>
          <br />
          isTruncated: {isTruncated ? 'true' : 'false'}
        </Typography>
      </Box>
    </Box>
  );
};
RefAPIWithTooltipOnOverflow.parameters = {
  docs: {
    source: {
      code: `import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Tooltip, Truncate, TruncateRef } from 'gd-design-library';

const RefAPIWithTooltipExample = () => {
  const ref = useRef<TruncateRef>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const updateState = () => {
    if (ref.current) {
      setIsTruncated(ref.current.isTruncated);
    }
  };

  useEffect(() => {
    // Check after a delay to allow Truncate component's internal calculation to complete
    requestAnimationFrame(() => {
      setTimeout(() => {
        updateState();
      });
    });

    // Check on window resize
    window.addEventListener('resize', updateState);

    return () => {
      window.removeEventListener('resize', updateState);
    };
  }, []);

  return (
    <Box width="100%" margin="0 auto">
      <Tooltip content={isTruncated ? 'Content is truncated' : null}>
        <Truncate ref={ref}>
          (Resize window): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
        </Truncate>
      </Tooltip>

      <Box padding="12px" styles={{ backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <Typography variant="small">
          <Typography variant="strong">Ref API State:</Typography>
          <br />
          isTruncated: {isTruncated ? 'true' : 'false'}
        </Typography>
      </Box>
    </Box>
  );
};`,
    },
    description: {
      story: `
Access truncation state programmatically via the ref API and conditionally show a tooltip when content is truncated. The ref exposes:
- \`isTruncated\`: boolean indicating if the content is truncated
<br/><br/>
**Note:** Ref values are calculated asynchronously after the component renders and truncation is measured. The example includes a delay to ensure the ref state is properly updated. Try resizing the window to see the state update dynamically.
      `,
    },
  },
};

export const WithAccessibility = {
  ...Default,
  parameters: {
    ...Default.parameters,
    a11y: {
      test: 'error',
    },
    docs: {
      disable: true,
    },
  },
  tags: ['a11y'],
};
