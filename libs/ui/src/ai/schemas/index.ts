import { aiComponentsSchema } from './components';

/**
 * Component index for easy discovery by category, complexity, and feature
 */
export const componentIndex = {
  byCategory: {
    'Actions & Controls': aiComponentsSchema.components
      .filter((c) => (c as any).category === 'Actions & Controls')
      .map((c) => c.name),
    'Layout & Structure': aiComponentsSchema.components
      .filter((c) => (c as any).category === 'Layout & Structure')
      .map((c) => c.name),
    'Forms & Inputs': aiComponentsSchema.components
      .filter((c) => (c as any).category === 'Forms & Input' || (c as any).category === 'Forms & Inputs')
      .map((c) => c.name),
    'Feedback & Overlays': aiComponentsSchema.components
      .filter((c) => (c as any).category === 'Feedback & Overlays')
      .map((c) => c.name),
    Navigation: aiComponentsSchema.components.filter((c) => (c as any).category === 'Navigation').map((c) => c.name),
    'Display & Content': aiComponentsSchema.components
      .filter((c) => (c as any).category === 'Display & Content' || (c as any).category === 'Content & Media')
      .map((c) => c.name),
  },

  byComplexity: {
    Low: aiComponentsSchema.components.filter((c) => (c as any).complexity === 'Low').map((c) => c.name),
    Medium: aiComponentsSchema.components.filter((c) => (c as any).complexity === 'Medium').map((c) => c.name),
    High: aiComponentsSchema.components.filter((c) => (c as any).complexity === 'High').map((c) => c.name),
  },

  byFeature: {
    'Form Controls': [
      'Input',
      'Select',
      'Textarea',
      'Switch',
      'Toggle',
      'RadioGroup',
      'Slider',
      'InputFile',
      'DragAndDropFiles',
      'Form',
      'Label',
    ],
    Layout: ['Box', 'FlexContainer', 'Column', 'Row', 'Wrapper', 'Scroll', 'Separator'],
    Navigation: ['Breadcrumbs', 'Tabs', 'Stepper', 'List', 'Accordion', 'Link', 'Menu'],
    Feedback: ['InlineNotification', 'Loader', 'Skeleton', 'Snackbar', 'SnackbarManager', 'Tooltip', 'Modal', 'Portal'],
    Display: ['Typography', 'Button', 'Icon', 'Image', 'Card', 'Avatar', 'Badge', 'Truncate'],
    Media: ['Carousel', 'ContentCarousel', 'Image'],
    'Data Display': ['Table', 'Chart', 'Counter', 'Price', 'ProgressBar', 'Rating'],
    Chat: ['ChatContainer', 'ChatBubble'],
  },
};
