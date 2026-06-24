import FlexContainer from './components/FlexContainer';
import Column from './components/Column';
import Row from './components/Row';
import Box from './components/Box';
import Search from './components/Search';
import Select from './components/Select';
import ChatContainer from './components/ChatContainer';
import ChatBubble from './components/ChatBubble';
import Typography from './components/Typography';
import Input from './components/Input';
import Badge from './components/Badge';
import Button from './components/Button';
import Link from './components/Link';
import Card from './components/Card';
import Icon from './components/Icon';
import Image from './components/Image';
import Breadcrumbs from './components/Breadcrumbs';
import InlineNotification from './components/InlineNotification';
import InputFile from './components/InputFile';
import Form from './components/Form';
import Label from './components/Label';
import List from './components/List';
import Loader from './components/Loader';
import Modal from './components/Modal';
import Portal from './components/Portal';
import Scroll from './components/Scroll';
import Separator from './components/Separator';
import Skeleton from './components/Skeleton';
import Slider from './components/Slider';
import Snackbar from './components/Snackbar';
import SnackbarManager from './components/SnackbarManager';
import Switch from './components/Switch';
import Toggle from './components/Toggle';
import Textarea from './components/Textarea';
import Tooltip from './components/Tooltip';
import Wrapper from './components/Wrapper';
import Accordion from './components/Accordion';
import Avatar from './components/Avatar';
import AvatarUser from './components/AvatarUser';
import Carousel from './components/Carousel';
import ContentCarousel from './components/ContentCarousel';
import Counter from './components/Counter';
import Tabs from './components/Tabs';
import Stepper from './components/Stepper';
import Price from './components/Price';
import ProgressBar from './components/ProgressBar';
import Rating from './components/Rating';
import Dropdown from './components/Dropdown';
import DropdownItem from './components/DropdownItem';
import DragAndDropFiles from './components/DragAndDropFiles';
import DragAndDrop from './components/DragAndDrop';
import RadioGroup from './components/RadioGroup';
import Menu from './components/Menu';
import Table from './components/Table';
import Chart from './components/Chart';
import Header from './components/Header';
import SearchModal from './components/SearchModal';
import Truncate from './components/Truncate';
import Checkbox from './components/Checkbox';
import SliderDots from './components/SliderDots';
import ImagePreview from './components/ImagePreview';
import InputArea from './components/InputArea';
import AttachmentFile from './components/AttachmentFile';
import Sidebar from './components/Sidebar';
import useTheme from './hooks/useTheme';

export type PropSchema = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  enum?: readonly string[];
  default?: unknown;
};

/** A2UI subcomponent entry (e.g. Card.Row, Card.Column) */
export type A2UISubcomponentSchema = {
  /** GridKit compound component path (e.g. 'Card.Row') */
  component: string;
  /** A2UI JSON field descriptions for this subcomponent */
  props: PropSchema[];
};

export type ComponentSchema = {
  name: string;
  import: string;
  description: string;
  /**
   * Prop definitions for this component.
   * For A2UI-enabled components (those with `a2uiName`), these describe the A2UI JSON
   * spec fields the renderer reads — not raw React props.
   * For code-mode-only components, these describe the React component props.
   */
  props: PropSchema[];
  examples?: string[];
  /**
   * A2UI component type key — the value used in A2UI JSON `type` field.
   * e.g. 'button', 'radio-group', 'flex-container'.
   * Components without this field are code-mode only (not available in A2UI JSON).
   */
  a2uiName?: string;
  /**
   * A2UI subcomponent entries for compound components (e.g. Card).
   * Each key is an A2UI type string (e.g. 'card-row'), value describes that subtype.
   */
  a2uiSubcomponents?: Record<string, A2UISubcomponentSchema>;
};

export type AISchema = {
  version: string;
  components: ComponentSchema[];
  compositionTips: string[];
};

export const aiComponentsSchema: AISchema = {
  version: '1.0.0',
  components: [
    useTheme.provider,
    useTheme.hook,
    FlexContainer.component,
    Column.component,
    Row.component,
    Box.component,
    Search.component,
    Select.component,
    ChatContainer.component,
    ChatBubble.component,
    Typography.component,
    Input.component,
    Badge.component,
    Button.component,
    Link.component,
    Card.component,
    Icon.component,
    Image.component,
    Breadcrumbs.component,
    InlineNotification.component,
    InputFile.component,
    Form.component,
    Label.component,
    List.component,
    Loader.component,
    Modal.component,
    Portal.component,
    Scroll.component,
    Separator.component,
    Skeleton.component,
    Slider.component,
    Snackbar.component,
    SnackbarManager.component,
    Switch.component,
    Toggle.component,
    Textarea.component,
    Tooltip.component,
    Wrapper.component,
    Accordion.component,
    Avatar.component,
    AvatarUser.component,
    Carousel.component,
    ContentCarousel.component,
    Counter.component,
    Tabs.component,
    Stepper.component,
    Price.component,
    ProgressBar.component,
    Rating.component,
    Dropdown.component,
    DropdownItem.component,
    DragAndDropFiles.component,
    DragAndDrop.component,
    RadioGroup.component,
    Menu.component,
    Table.component,
    Chart.component,
    Header.component,
    SearchModal.component,
    Truncate.component,
    Checkbox.component,
    SliderDots.component,
    ImagePreview.component,
    InputArea.component,
    AttachmentFile.component,
    Sidebar.component,
  ],
  compositionTips: [
    ...useTheme.compositionTips,
    ...useTheme.themeProviderCompositionTips,
    ...FlexContainer.compositionTips,
    ...Column.compositionTips,
    ...Row.compositionTips,
    ...Box.compositionTips,
    ...Search.compositionTips,
    ...Select.compositionTips,
    ...ChatContainer.compositionTips,
    ...ChatBubble.compositionTips,
    ...Typography.compositionTips,
    ...Input.compositionTips,
    ...Badge.compositionTips,
    ...Button.compositionTips,
    ...Link.compositionTips,
    ...Card.compositionTips,
    ...Icon.compositionTips,
    ...Image.compositionTips,
    ...Breadcrumbs.compositionTips,
    ...InlineNotification.compositionTips,
    ...InputFile.compositionTips,
    ...Form.compositionTips,
    ...Label.compositionTips,
    ...List.compositionTips,
    ...Loader.compositionTips,
    ...Modal.compositionTips,
    ...Portal.compositionTips,
    ...Scroll.compositionTips,
    ...Separator.compositionTips,
    ...Skeleton.compositionTips,
    ...Slider.compositionTips,
    ...Snackbar.compositionTips,
    ...SnackbarManager.compositionTips,
    ...Switch.compositionTips,
    ...Toggle.compositionTips,
    ...Textarea.compositionTips,
    ...Tooltip.compositionTips,
    ...Wrapper.compositionTips,
    ...Accordion.compositionTips,
    ...Avatar.compositionTips,
    ...AvatarUser.compositionTips,
    ...Carousel.compositionTips,
    ...ContentCarousel.compositionTips,
    ...Counter.compositionTips,
    ...Tabs.compositionTips,
    ...Stepper.compositionTips,
    ...Price.compositionTips,
    ...ProgressBar.compositionTips,
    ...Rating.compositionTips,
    ...Dropdown.compositionTips,
    ...DropdownItem.compositionTips,
    ...DragAndDropFiles.compositionTips,
    ...DragAndDrop.compositionTips,
    ...RadioGroup.compositionTips,
    ...Menu.compositionTips,
    ...Table.compositionTips,
    ...Chart.compositionTips,
    ...Header.compositionTips,
    ...SearchModal.compositionTips,
    ...Truncate.compositionTips,
    ...Checkbox.compositionTips,
    ...SliderDots.compositionTips,
    ...ImagePreview.compositionTips,
    ...InputArea.compositionTips,
    ...AttachmentFile.compositionTips,
    ...Sidebar.compositionTips,
  ],
};

export type ComponentModule = { component: ComponentSchema; compositionTips: string[] };

export const componentModulesByName = new Map<string, ComponentModule>([
  ['FlexContainer', FlexContainer],
  ['Column', Column],
  ['Row', Row],
  ['Box', Box],
  ['Search', Search],
  ['Select', Select],
  ['ChatContainer', ChatContainer],
  ['ChatBubble', ChatBubble],
  ['Typography', Typography],
  ['Input', Input],
  ['Badge', Badge],
  ['Button', Button],
  ['Link', Link],
  ['Card', Card],
  ['Icon', Icon],
  ['Image', Image],
  ['Breadcrumbs', Breadcrumbs],
  ['InlineNotification', InlineNotification],
  ['InputFile', InputFile],
  ['Form', Form],
  ['Label', Label],
  ['List', List],
  ['Loader', Loader],
  ['Modal', Modal],
  ['Portal', Portal],
  ['Scroll', Scroll],
  ['Separator', Separator],
  ['Skeleton', Skeleton],
  ['Slider', Slider],
  ['Snackbar', Snackbar],
  ['SnackbarManager', SnackbarManager],
  ['Switch', Switch],
  ['Toggle', Toggle],
  ['Textarea', Textarea],
  ['Tooltip', Tooltip],
  ['Wrapper', Wrapper],
  ['Accordion', Accordion],
  ['Avatar', Avatar],
  ['AvatarUser', AvatarUser],
  ['Carousel', Carousel],
  ['ContentCarousel', ContentCarousel],
  ['Counter', Counter],
  ['Tabs', Tabs],
  ['Stepper', Stepper],
  ['Price', Price],
  ['ProgressBar', ProgressBar],
  ['Rating', Rating],
  ['Dropdown', Dropdown],
  ['DropdownItem', DropdownItem],
  ['DragAndDropFiles', DragAndDropFiles],
  ['DragAndDrop', DragAndDrop],
  ['RadioGroup', RadioGroup],
  ['Menu', Menu],
  ['Table', Table],
  ['Chart', Chart],
  ['Header', Header],
  ['SearchModal', SearchModal],
  ['Truncate', Truncate],
  ['Checkbox', Checkbox],
  ['SliderDots', SliderDots],
  ['ImagePreview', ImagePreview],
  ['InputArea', InputArea],
  ['AttachmentFile', AttachmentFile],
  ['Sidebar', Sidebar],
]);

export const aiPromptGuidelines = [
  'Prefer gd-design-library components for layout and controls.',
  'Use FlexContainer/Column for spacing rather than manual CSS, unless necessary.',
  'Keep accessibility: label inputs using label or Input label prop, set aria attributes if needed.',
  'Do not inline ThemeProvider inside leaf components; wrap at app root.',
];
