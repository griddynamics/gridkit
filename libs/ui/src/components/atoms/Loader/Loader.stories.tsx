import { PropsWithChildren, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Loader, LoaderProps, Button, Column, FlexContainer, Link, Row, Typography } from '@components';
import { SizeVariant, TypographyVariant, WrapperVariant } from '@types';
import { defaultTheme } from '@tokens';

const meta = {
  title: 'Atoms/Loader',
  component: Loader,
  tags: ['autodocs'],
  args: {
    withWrapper: true,
    name: 'circle',
    variant: 'inline',
    size: SizeVariant.Md,
  },

  argTypes: {
    // ============================================================================
    // Appearance
    // ============================================================================
    name: {
      description:
        'Type of loader animation to display. "circle" provides a smooth rotating animation, while "dots" offers a rhythmic pulsing sequence',
      options: ['circle', 'dots'],
      control: {
        type: 'select',
      },
      table: {
        category: 'Appearance',
        type: { summary: '"circle" | "dots"' },
        defaultValue: { summary: 'circle' },
      },
    },
    size: {
      description:
        'Size variant of the loader. Controls both the loader animation size and wrapper dimensions. Available sizes: xs, sm, md (default), lg, xl',
      options: Object.values(SizeVariant).filter((size) => size !== SizeVariant.Xxl),
      control: {
        type: 'select',
      },
      table: {
        category: 'Appearance',
        type: { summary: 'SizeVariant' },
        defaultValue: { summary: 'SizeVariant.Md' },
      },
    },
    rounded: {
      description:
        'Border radius style for the loader. Available options: none, default, round, xs, sm, md, lg, xl. Note: Only applies to "dots" animation type, not "circle"',
      options: ['none', 'default', 'round', 'xs', 'sm', 'md', 'lg', 'xl'],
      control: {
        type: 'select',
      },
      table: {
        category: 'Appearance',
        type: { summary: "'none' | 'default' | 'round' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'none' },
      },
    },
    // ============================================================================
    // Layout & Positioning
    // ============================================================================
    variant: {
      description:
        'Layout wrapper variant that determines positioning and container behavior. Inline: flows naturally in content, Section: absolute positioned overlay within container, FullPage: fixed position full-screen overlay with portal',
      options: Object.values(WrapperVariant),
      control: {
        type: 'select',
      },
      table: {
        category: 'Layout & Positioning',
        type: { summary: 'inline | section | fullPage' },
        defaultValue: { summary: 'inline' },
      },
    },
    withWrapper: {
      description:
        'Whether to wrap the loader in a container element. When false, the loader renders directly without wrapper styling. Useful for embedding loaders in buttons or other custom containers',
      control: 'boolean',
      table: {
        category: 'Layout & Positioning',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    WrapperView: {
      description:
        'HTML element type or React component to use for the wrapper container. Defaults to "span" for inline usage. Use semantic elements like "div", "section", or custom components for better accessibility',
      table: {
        category: 'Layout & Positioning',
        type: { summary: 'keyof HTMLElementTagNameMap | ElementType' },
        defaultValue: { summary: 'span' },
      },
    },
    // ============================================================================
    // Content & Customization
    // ============================================================================
    children: {
      description:
        'Custom React content to replace the default loader animation. Use this to create custom loading indicators while maintaining Loader wrapper and positioning functionality',
      table: {
        category: 'Content & Customization',
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    animationProps: {
      description:
        'Custom CSS animation properties string. Overrides default animation timing and easing for advanced customization. Use sparingly—prefer size and variant props for standard use cases',
      table: {
        category: 'Content & Customization',
        type: { summary: 'string' },
        defaultValue: { summary: 'BASE_ANIMATION' },
      },
    },
    // ============================================================================
    // Custom Styling
    // ============================================================================
    styles: {
      description:
        'Custom CSS styles object to override default theme tokens. Use for one-off styling needs. Prefer theme tokens and component props for consistent design system styling',
      table: {
        category: 'Custom Styling',
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    className: {
      description:
        'Additional CSS class names to apply to the loader element. Use for custom styling, state management, or integration with CSS frameworks',
      table: {
        category: 'Custom Styling',
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Loader\` component is a versatile loading indicator designed to provide visual feedback during asynchronous operations. 
  It seamlessly integrates into any part of your application to enhance user experience by clearly showing loading states.
  <br/><br/>
  
  <h3>🎯 Core Features</h3>
  <ul>
  <li><b>Multiple Animation Types</b> – Two built-in animations: "circle" (smooth rotation) and "dots" (rhythmic pulsing). Support for custom animations via children prop</li>
  <li><b>Flexible Positioning</b> – Three wrapper variants: Inline (natural flow), Section (overlay within container), FullPage (full-screen with portal)</li>
  <li><b>Size Variants</b> – Five responsive sizes (xs, sm, md, lg, xl) for different contexts from inline text to full-page overlays</li>
  <li><b>Border Radius Control</b> – Rounded prop for styling dots animation with border radius (none, default, round, xs, sm, md, lg, xl). Note: Only applies to "dots", not "circle"</li>
  <li><b>Wrapper Control</b> – Optional wrapper container with customizable HTML element or React component for semantic flexibility</li>
  <li><b>Theme Integration</b> – Full theme customization with design tokens for colors, sizes, and animations</li>
  <li><b>Custom Content</b> – Replace default animations with custom React content while maintaining wrapper functionality</li>
  </ul>
  
  <h3>📋 Usage Patterns</h3>
  <ul>
  <li><b>Inline Loading</b> – Use \`variant="inline"\` for text replacements and inline content: \`<Loader name="circle" size="sm" />\`</li>
  <li><b>Section Overlay</b> – Use \`variant="section"\` for container-level loading states with absolute positioning</li>
  <li><b>Full Page</b> – Use \`variant="fullPage"\` for modal-style full-screen loading overlays with portal rendering</li>
  <li><b>Button Integration</b> – Use \`withWrapper={false}\` and \`size="sm"\` for compact button loaders: \`<Loader withWrapper={false} size="sm" />\`</li>
  <li><b>Custom Animations</b> – Pass custom React content via \`children\` prop for branded loading animations</li>
  </ul>
  
  <h3>💡 Best Practices</h3>
  <ul>
  <li>Use "circle" animation for general loading states and "dots" for more playful or casual interfaces</li>
  <li>Choose size based on context: xs/sm for inline, md for buttons, lg/xl for section/full-page</li>
  <li>Use \`rounded\` prop to style dots animation corners when desired (does not apply to circle)</li>
  <li>Set \`withWrapper={false}\` when embedding in buttons or custom containers to avoid wrapper styling</li>
  <li>Use Section variant with relative positioned containers for localized loading states</li>
  <li>Prefer theme tokens over custom styles for consistent design system integration</li>
  </ul>
        `,
      },
    },
  },
} as Meta<typeof Loader>;

export default meta;
const Template: StoryFn<PropsWithChildren<LoaderProps>> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'circle',
  size: SizeVariant.Md,
  variant: 'inline',
};
Default.parameters = {
  docs: {
    source: {
      code: `<Loader name="circle" size="md" variant="inline" />`,
    },
    description: {
      story:
        'Default loader with circle animation, medium size, and inline variant. This is the standard loading indicator for most use cases.',
    },
  },
};

export const LoaderNames: StoryFn<PropsWithChildren<LoaderProps>> = () => {
  return (
    <Row gap="30px" align="center">
      <Column gap="10px">
        <Typography variant={TypographyVariant.H6}>Circle Animation</Typography>
        <Loader name="circle" size={SizeVariant.Md} />
      </Column>
      <Column gap="10px">
        <Typography variant={TypographyVariant.H6}>Dots Animation</Typography>
        <Loader name="dots" size={SizeVariant.Md} />
      </Column>
    </Row>
  );
};
LoaderNames.parameters = {
  docs: {
    source: {
      code: `<Row gap="30px" align="center">
  <Column gap="10px">
    <Typography variant="h6">Circle Animation</Typography>
    <Loader name="circle" size="md" />
  </Column>
  <Column gap="10px">
    <Typography variant="h6">Dots Animation</Typography>
    <Loader name="dots" size="md" />
  </Column>
</Row>`,
    },
    description: {
      story:
        'Two animation types available: "circle" provides a smooth rotating animation ideal for general loading states, while "dots" offers a rhythmic pulsing sequence suitable for more playful interfaces.',
    },
  },
};

export const LoaderSizes: StoryFn<PropsWithChildren<LoaderProps>> = () => {
  return (
    <Column gap="20px">
      <Column gap="10px">
        <Typography variant={TypographyVariant.H5}>Loader Sizes</Typography>
        <Typography variant={TypographyVariant.P}>Five size variants from extra small to extra large</Typography>
      </Column>
      <Row gap="20px" align="center">
        <Column gap="8px" align="center">
          <Loader name="circle" size={SizeVariant.Xs} />
          <Typography variant={TypographyVariant.Small}>XS</Typography>
        </Column>
        <Column gap="8px" align="center">
          <Loader name="circle" size={SizeVariant.Sm} />
          <Typography variant={TypographyVariant.Small}>SM</Typography>
        </Column>
        <Column gap="8px" align="center">
          <Loader name="circle" size={SizeVariant.Md} />
          <Typography variant={TypographyVariant.Small}>MD</Typography>
        </Column>
        <Column gap="8px" align="center">
          <Loader name="circle" size={SizeVariant.Lg} />
          <Typography variant={TypographyVariant.Small}>LG</Typography>
        </Column>
        <Column gap="8px" align="center">
          <Loader name="circle" size={SizeVariant.Xl} />
          <Typography variant={TypographyVariant.Small}>XL</Typography>
        </Column>
      </Row>
    </Column>
  );
};
LoaderSizes.parameters = {
  layout: 'padded',
  docs: {
    source: {
      code: `<Row gap="20px" align="center">
  <Loader name="circle" size="xs" />
  <Loader name="circle" size="sm" />
  <Loader name="circle" size="md" />
  <Loader name="circle" size="lg" />
  <Loader name="circle" size="xl" />
</Row>`,
    },
    description: {
      story:
        'Five size variants available: xs (extra small) for inline text, sm (small) for buttons, md (medium) for standard use, lg (large) for sections, and xl (extra large) for full-page overlays.',
    },
  },
};

export const LoaderRounded: StoryFn<PropsWithChildren<LoaderProps>> = () => {
  return (
    <Column gap="20px">
      <Column gap="10px">
        <Typography variant={TypographyVariant.H5}>Loader with Rounded Border</Typography>
        <Typography variant={TypographyVariant.P}>
          The rounded prop controls border radius for dots animation. Note: rounded prop only applies to "dots"
          animation type, not "circle"
        </Typography>
      </Column>
      <Row gap="20px" align="center">
        <Column gap="8px" align="center">
          <Loader name="dots" size={SizeVariant.Md} rounded="none" />
          <Typography variant={TypographyVariant.Small}>None</Typography>
        </Column>
        <Column gap="8px" align="center">
          <Loader name="dots" size={SizeVariant.Md} rounded="xs" />
          <Typography variant={TypographyVariant.Small}>XS</Typography>
        </Column>
        <Column gap="8px" align="center">
          <Loader name="dots" size={SizeVariant.Md} rounded="sm" />
          <Typography variant={TypographyVariant.Small}>SM</Typography>
        </Column>
        <Column gap="8px" align="center">
          <Loader name="dots" size={SizeVariant.Md} rounded="md" />
          <Typography variant={TypographyVariant.Small}>MD</Typography>
        </Column>
        <Column gap="8px" align="center">
          <Loader name="dots" size={SizeVariant.Md} rounded="lg" />
          <Typography variant={TypographyVariant.Small}>LG</Typography>
        </Column>
        <Column gap="8px" align="center">
          <Loader name="dots" size={SizeVariant.Md} rounded="xl" />
          <Typography variant={TypographyVariant.Small}>XL</Typography>
        </Column>
        <Column gap="8px" align="center">
          <Loader name="dots" size={SizeVariant.Md} rounded="round" />
          <Typography variant={TypographyVariant.Small}>Round</Typography>
        </Column>
      </Row>
    </Column>
  );
};
LoaderRounded.parameters = {
  layout: 'padded',
  docs: {
    source: {
      code: `<Row gap="20px" align="center">
  <Loader name="dots" size="md" rounded="none" />
  <Loader name="dots" size="md" rounded="xs" />
  <Loader name="dots" size="md" rounded="sm" />
  <Loader name="dots" size="md" rounded="md" />
  <Loader name="dots" size="md" rounded="lg" />
  <Loader name="dots" size="md" rounded="xl" />
  <Loader name="dots" size="md" rounded="round" />
</Row>`,
    },
    description: {
      story:
        'Rounded prop controls the border radius of dots animation. Available options: none, default, round, xs, sm, md, lg, xl. **Important**: The rounded prop only applies to "dots" animation type. Circle animations are always circular and do not use border radius.',
    },
  },
};

export const LoaderVariantsWithWrapperViewAsHeaderTag = Template.bind({});
LoaderVariantsWithWrapperViewAsHeaderTag.args = {
  variant: 'inline',
  WrapperView: 'header',
};
LoaderVariantsWithWrapperViewAsHeaderTag.parameters = {
  docs: {
    source: {
      code: `<Loader variant="inline" WrapperView="header" />`,
    },
    description: {
      story:
        'Customize the wrapper element using WrapperView prop. Use semantic HTML elements like "header", "section", "div", or React components for better accessibility and structure.',
    },
  },
};

export const CustomLoaderTailwindClassBounceAnimation = Template.bind({});
CustomLoaderTailwindClassBounceAnimation.args = {
  size: SizeVariant.Lg,
  variant: WrapperVariant.Section,
  children: <div className="animate-ping">Loading...</div>,
};
CustomLoaderTailwindClassBounceAnimation.parameters = {
  docs: {
    source: {
      code: `<Loader size="lg" variant="section" children={<div className="animate-ping">Loading...</div>} />`,
    },
    description: {
      story:
        'Replace default animation with custom React content via children prop. This example uses a custom ping animation while maintaining Loader wrapper and positioning functionality.',
    },
  },
};

export const LoaderSectionVariant: StoryFn = () => {
  const [showLoader, setShowLoader] = useState(false);
  return (
    <FlexContainer styles={{ backgroundColor: '#a5ffb4', padding: '10px', position: 'relative' }}>
      <Typography variant={TypographyVariant.H3}>Section 1</Typography>
      <Link onClick={() => setShowLoader((prevState) => !prevState)}>
        {showLoader ? 'Hide' : 'Show'} Loader in section 2
      </Link>
      <FlexContainer
        styles={{
          marginTop: '20px',
          backgroundColor: '#ffa5a5',
          padding: '10px',
          position: 'relative',
        }}
      >
        <Row>
          <Typography variant={TypographyVariant.H3}>Section 2</Typography>
        </Row>
        <Row>
          <Link onClick={() => setShowLoader((prevState) => !prevState)}>{showLoader ? 'Hide' : 'Show'} Loader</Link>
        </Row>
        {showLoader ? <Loader variant={WrapperVariant.Section} name="dots" /> : null}
      </FlexContainer>
    </FlexContainer>
  );
};

export const SectionLoaderButtonVariant: StoryFn = () => {
  const [showLoader, setShowLoader] = useState(false);
  return (
    <FlexContainer styles={{ backgroundColor: '#a5ffb4', padding: '10px', position: 'relative' }}>
      <Typography variant={TypographyVariant.H3}>Section 1</Typography>
      <Row>
        <Link onClick={() => setShowLoader((prevState) => !prevState)}>
          {showLoader ? 'Hide' : 'Show'} Loader in button
        </Link>
      </Row>
      <Row>
        <Button
          onClick={() => setShowLoader((prevState) => !prevState)}
          variant="outlined"
          styles={{ position: 'relative' }}
        >
          {showLoader ? 'Loading...' : 'Click me!'}
          {showLoader ? <Loader variant={WrapperVariant.Section} name="dots" size={SizeVariant.Sm} /> : null}
        </Button>
      </Row>
    </FlexContainer>
  );
};

export const InlineLoaderButtonVariant: StoryFn = () => {
  const [showLoader, setShowLoader] = useState(false);
  return (
    <FlexContainer styles={{ backgroundColor: '#a5ffb4', padding: '10px', position: 'relative' }}>
      <Typography variant={TypographyVariant.H3}>Section 1</Typography>
      <Row>
        <Button
          onClick={() => setShowLoader((prevState) => !prevState)}
          variant="outlined"
          iconEnd={showLoader ? <Loader size={SizeVariant.Sm} name="circle" withWrapper={false} /> : null}
        >
          {showLoader ? 'Loading...' : 'Click me!'}
        </Button>
      </Row>
    </FlexContainer>
  );
};

export const WithAccessibility: StoryFn<PropsWithChildren<LoaderProps>> = () => {
  return (
    <div style={{ display: 'flex', gap: '40px' }} role="status" aria-label="Loading content">
      <Column gap="10px">
        <Loader name="circle" size={SizeVariant.Md} />
      </Column>
      <Column gap="10px">
        <Loader name="dots" size={SizeVariant.Md} />
      </Column>
    </div>
  );
};
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};
WithAccessibility.tags = ['a11y'];

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ loader: defaultTheme.loader }} />;
DefaultTokens.parameters = {
  layout: 'padded',
  docs: {
    source: {
      code: `<TokenViewer tokens={{ loader: defaultTheme.loader }} />`,
    },
    description: {
      story:
        'View the default theme tokens used by the Loader component. These tokens control colors, sizes, animations, and spacing for all loader variants.',
    },
  },
};
