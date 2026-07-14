import type { Renderer } from '../types';
import { A2UI_COMPONENT_MAP } from '../../../ai';

import { accordionRenderers } from './accordion';
import { attachmentFileRenderers } from './attachment-file';
import { avatarRenderers } from './avatar';
import { badgeRenderers } from './badge';
import { boxRenderers } from './box';
import { breadcrumbsRenderers } from './breadcrumbs';
import { buttonRenderers } from './button';
import { cardRenderers } from './card';
import { carouselRenderers } from './carousel';
import { chartRenderers } from './chart';
import { chatRenderers } from './chat';
import { checkboxRenderers } from './checkbox';
import { contentCarouselRenderers } from './content-carousel';
import { counterRenderers } from './counter';
import { dragAndDropRenderers } from './drag-and-drop';
import { dropdownRenderers } from './dropdown';
import { formRenderers } from './form';
import { headerRenderers } from './header';
import { iconRenderers } from './icon';
import { imageRenderers } from './image';
import { labelRenderers } from './label';
import { layoutRenderers } from './layout';
import { linkRenderers } from './link';
import { listRenderers } from './list';
import { loaderRenderers } from './loader';
import { menuRenderers } from './menu';
import { modalRenderers } from './modal';
import { notificationRenderers } from './notification';
import { priceRenderers } from './price';
import { progressBarRenderers } from './progress-bar';
import { radioGroupRenderers } from './radio-group';
import { ratingRenderers } from './rating';
import { searchRenderers } from './search';
import { selectRenderers } from './select';
import { separatorRenderers } from './separator';
import { sidebarRenderers } from './sidebar';
import { skeletonRenderers } from './skeleton';
import { sliderRenderers } from './slider';
import { stepperRenderers } from './stepper';
import { switchRenderers } from './switch';
import { tableRenderers } from './table';
import { tabsRenderers } from './tabs';
import { toggleRenderers } from './toggle';
import { tooltipRenderers } from './tooltip';
import { truncateRenderers } from './truncate';
import { typographyRenderers } from './typography';

export const renderers: Partial<Record<keyof typeof A2UI_COMPONENT_MAP, Renderer>> = {
  ...accordionRenderers,
  ...attachmentFileRenderers,
  ...avatarRenderers,
  ...badgeRenderers,
  ...boxRenderers,
  ...breadcrumbsRenderers,
  ...buttonRenderers,
  ...cardRenderers,
  ...carouselRenderers,
  ...chartRenderers,
  ...chatRenderers,
  ...checkboxRenderers,
  ...contentCarouselRenderers,
  ...counterRenderers,
  ...dragAndDropRenderers,
  ...dropdownRenderers,
  ...formRenderers,
  ...headerRenderers,
  ...iconRenderers,
  ...imageRenderers,
  ...labelRenderers,
  ...layoutRenderers,
  ...linkRenderers,
  ...listRenderers,
  ...loaderRenderers,
  ...menuRenderers,
  ...modalRenderers,
  ...notificationRenderers,
  ...priceRenderers,
  ...progressBarRenderers,
  ...radioGroupRenderers,
  ...ratingRenderers,
  ...searchRenderers,
  ...selectRenderers,
  ...separatorRenderers,
  ...sidebarRenderers,
  ...skeletonRenderers,
  ...sliderRenderers,
  ...stepperRenderers,
  ...switchRenderers,
  ...tableRenderers,
  ...tabsRenderers,
  ...toggleRenderers,
  ...tooltipRenderers,
  ...truncateRenderers,
  ...typographyRenderers,
};
