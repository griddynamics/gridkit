import type { ReactNode } from 'react';
import { Avatar, AvatarUser, Icon } from '@components';
import type { A2UIComponent } from '../../../ai';
import { isSafeA2UIUrl } from '../../../ai';
import {
  getMergedComponentStyles,
  getComponentText,
  getAttributeString,
  renderComponentSlot,
  getComponentArrayField,
} from '../helpers';

function getSafeAvatarSrc(component: A2UIComponent) {
  const src = (component.src as string | undefined) || getAttributeString(component, 'src');
  return isSafeA2UIUrl(src) ? src : undefined;
}

function getAvatarIconSize(sizeVariant?: string) {
  switch (sizeVariant) {
    case 'xs':
      return 12;
    case 'sm':
      return 18;
    case 'lg':
      return 24;
    case 'xl':
      return 40;
    case 'md':
    default:
      return 20;
  }
}

export function getAvatarFallback(component: A2UIComponent) {
  const iconName = (component.icon as string | undefined) || getAttributeString(component, 'icon');

  if (iconName) {
    const avatarSize =
      ((component.sizeVariant as string | undefined) || (component.size as string | undefined)) ?? 'md';
    const iconSize = getAvatarIconSize(avatarSize);

    return (
      <Icon
        name={iconName as never}
        width={iconSize}
        height={iconSize}
        fill={component.fill || getAttributeString(component, 'fill')}
        fillSvg={component.fillSvg || getAttributeString(component, 'fillSvg')}
      />
    );
  }

  return getComponentText(component) || component.id.slice(0, 2).toUpperCase();
}

export function getInitials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return '';
  }

  if (words.length === 1) {
    return words[0]!.slice(0, 2).toUpperCase();
  }

  return `${words[0]![0] ?? ''}${words[words.length - 1]![0] ?? ''}`.toUpperCase();
}

export function getAvatarUserName(component: A2UIComponent) {
  if (typeof component.name === 'string' && component.name.trim().length > 0) {
    return component.name.trim();
  }

  const text = getComponentText(component).trim();
  return text || component.id;
}

export function getAvatarUserSubtitle(component: A2UIComponent) {
  if (typeof component.subtitle === 'string' && component.subtitle.trim().length > 0) {
    return component.subtitle.trim();
  }

  if (typeof component.description === 'string' && component.description.trim().length > 0) {
    return component.description.trim();
  }

  return undefined;
}

export const avatarRenderers = {
  avatar: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Avatar
      key={component.id}
      id={component.id}
      src={getSafeAvatarSrc(component)}
      alt={
        (component.alt as string | undefined) || getAttributeString(component, 'alt') || component.label || component.id
      }
      fallbackComponent={getAvatarFallback(component)}
      sizeVariant={((component.sizeVariant as string) || component.size) as never}
      backgroundColor={
        (component.backgroundColor as string | undefined) || getAttributeString(component, 'backgroundColor')
      }
      withBadge={
        (component.withBadge as boolean | undefined) ?? (component.attributes?.['withBadge'] as boolean | undefined)
      }
      badgeColor={(component.badgeColor as string | undefined) || getAttributeString(component, 'badgeColor')}
      className={component.className}
      styles={getMergedComponentStyles(component)}
      onClick={component.actions?.length ? () => component.actions!.forEach((id) => dispatchAction?.(id)) : undefined}
      {...(component.ariaLabel ? { 'aria-label': component.ariaLabel } : {})}
    />
  ),
  'avatar-user': (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => {
    const name = getAvatarUserName(component);
    const iconName = (component.icon as string | undefined) || getAttributeString(component, 'icon');

    return (
      <AvatarUser
        key={component.id}
        variant={component.variant as never}
        name={name}
        subtitle={getAvatarUserSubtitle(component)}
        src={getSafeAvatarSrc(component)}
        alt={(component.alt as string | undefined) || getAttributeString(component, 'alt') || name}
        fallbackComponent={
          iconName ? getAvatarFallback(component) : getInitials(name) || component.id.slice(0, 2).toUpperCase()
        }
        sizeVariant={((component.sizeVariant as string) || component.size) as never}
        withBadge={
          (component.withBadge as boolean | undefined) ?? (component.attributes?.['withBadge'] as boolean | undefined)
        }
        badgeColor={(component.badgeColor as string | undefined) || getAttributeString(component, 'badgeColor')}
        backgroundColor={
          (component.backgroundColor as string | undefined) || getAttributeString(component, 'backgroundColor')
        }
        action={renderComponentSlot(renderChildren, getComponentArrayField(component, 'actionChildren'))}
        className={component.className}
        styles={getMergedComponentStyles(component)}
        onClick={component.actions?.length ? () => component.actions!.forEach((id) => dispatchAction?.(id)) : undefined}
        aria-label={component.ariaLabel}
      />
    );
  },
};
