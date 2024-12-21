import { splitProps } from 'solid-js';

import type {
  Component,
  JSX,
  ParentComponent,
} from 'solid-js';

export type IconProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  size?: number;
  color?: string;
};

export const Svg: ParentComponent<IconProps> = (props) => {
  const [local, other] = splitProps(props, ['size', 'color', 'children']);
  const sizeProps = () => ({
    width: local.size ?? 20,
    height: local.size ?? 20,
  });

  return (
    <svg viewBox="0 0 72 72" fill={local.color || 'currentColor'} {...sizeProps()} {...other}>
      {local.children}
    </svg>
  );
};

export const HeartIcon: Component<IconProps> = props => (
  <Svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    />
  </Svg>
);

export const MaximizeIcon: Component<IconProps> = props => (
  <Svg
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    shape-rendering="geometricPrecision"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
  </Svg>
);

export const MinimizeIcon: Component<IconProps> = props => (
  <Svg
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    shape-rendering="geometricPrecision"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
  </Svg>
);
