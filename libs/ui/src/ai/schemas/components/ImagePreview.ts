const component = {
  name: 'ImagePreview',
  import: "import { ImagePreview } from 'gd-design-library'",
  description:
    'Image gallery organism with thumbnail navigation, counter overlay, and optional lightbox. Use for previewing collections of images with navigation controls.',
  a2uiName: 'image-preview',
  category: 'Media & Display',
  complexity: 'Medium',
  accessibility: 'WCAG 2.1 AA Compliant',
  props: [
    {
      name: 'images',
      type: 'Array<{ src: string; alt?: string; caption?: string }>',
      description: 'Array of image objects with src, alt text, and optional caption.',
      required: true,
    },
    {
      name: 'initialIndex',
      type: 'number',
      description: 'Zero-based index of the initially displayed image',
      default: 0,
    },
    { name: 'showThumbnails', type: 'boolean', description: 'Whether to show thumbnail strip for navigation' },
    { name: 'showCounter', type: 'boolean', description: 'Whether to show a current/total image counter overlay' },
    { name: 'showArrows', type: 'boolean', description: 'Whether to show previous/next navigation arrows' },
    {
      name: 'thumbnailPosition',
      type: "'bottom' | 'left'",
      description: 'Position of the thumbnail strip relative to the main image',
    },
    {
      name: 'actions',
      type: 'string[]',
      description:
        'Optional action IDs triggered when the active image changes. The renderer includes the new index and image item in the action payload.',
    },
    { name: 'children', type: 'A2UIComponent[]', description: 'Optional components rendered below the image preview.' },
    { name: 'styling', type: 'object', description: 'Custom styles for the image preview container', default: {} },
  ],
  examples: [
    '<ImagePreview images={photos} showThumbnails showArrows onImageChange={setActive} />',
    '<ImagePreview images={gallery} showCounter thumbnailPosition="left" />',
    '<ImagePreview images={items} showCounter thumbnailPosition="left" showArrows />',
  ],
};

const compositionTips: string[] = [
  'Use ImagePreview with showThumbnails and showArrows for full gallery navigation.',
  'Set ImagePreview thumbnailPosition="left" for side-by-side layouts in wider containers.',
  'Provide ImagePreview onImageChange to synchronize external state with the active image.',
  'Use ImagePreview showCounter to display the current/total image indicator.',
  'Combine ImagePreview with ImagePreviewLightbox for a fullscreen viewing experience.',
];

export default { component, compositionTips };
