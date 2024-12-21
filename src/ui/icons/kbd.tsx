import type { Component, ParentComponent } from 'solid-js';

type IconProps = {
  size?: number;
  color?: string;
};

const Svg: ParentComponent<IconProps> = (props) => {
  const sizeProps = () => ({
    width: props.size ?? 20,
    height: props.size ?? 20,
  });

  return (
    <svg viewBox="0 0 72 72" fill={props.color || 'currentColor'} {...sizeProps()}>
      {props.children}
    </svg>
  );
};

export const Command: Component<IconProps> = props => (
  <Svg {...props}>
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-miterlimit="10"
      d="M52.8,70.3H19.2c-9.6,0-17.5-7.9-17.5-17.5V19.2c0-9.6,7.9-17.5,17.5-17.5h33.6 c9.6,0,17.5,7.9,17.5,17.5v33.6C70.3,62.4,62.4,70.3,52.8,70.3z"
    />
    <path
      fill="currentColor"
      d="M32.1,43.8v4.5c0,2.3-0.8,4.2-2.4,5.8c-1.6,1.6-3.6,2.4-5.9,2.4s-4.2-0.8-5.9-2.4 c-1.6-1.6-2.4-3.6-2.4-5.9c0-2.3,0.8-4.2,2.4-5.8c1.6-1.6,3.5-2.4,5.8-2.4h4.5v-7.8h-4.5c-2.2,0-4.2-0.8-5.8-2.4 c-1.6-1.6-2.4-3.6-2.4-5.9c0-2.3,0.8-4.2,2.4-5.8c1.6-1.6,3.6-2.4,5.9-2.4s4.3,0.8,5.9,2.4c1.6,1.6,2.4,3.5,2.4,5.8v4.5h7.8v-4.5 c0-2.3,0.8-4.2,2.4-5.8c1.6-1.6,3.6-2.4,5.9-2.4c2.3,0,4.3,0.8,5.9,2.4c1.6,1.6,2.4,3.6,2.4,5.8c0,2.3-0.8,4.2-2.4,5.9 c-1.6,1.6-3.5,2.4-5.8,2.4h-4.5v7.8h4.5c2.3,0,4.2,0.8,5.8,2.4c1.6,1.6,2.4,3.6,2.4,5.8c0,2.3-0.8,4.3-2.4,5.9 c-1.6,1.6-3.6,2.4-5.9,2.4c-2.3,0-4.3-0.8-5.9-2.4c-1.6-1.6-2.4-3.5-2.4-5.8v-4.5H32.1z M28.2,28.2v-4.4c0-1.2-0.4-2.2-1.3-3.1 s-1.9-1.3-3.1-1.3c-1.2,0-2.2,0.4-3.1,1.3c-0.9,0.9-1.3,1.9-1.3,3.1c0,1.2,0.4,2.2,1.3,3.1c0.9,0.9,1.9,1.3,3.1,1.3L28.2,28.2 L28.2,28.2z M28.2,43.8h-4.4c-1.2,0-2.2,0.4-3.1,1.3s-1.3,1.9-1.3,3.1c0,1.2,0.4,2.3,1.3,3.1s1.9,1.3,3.1,1.3s2.2-0.4,3.1-1.3 c0.9-0.9,1.3-1.9,1.3-3.1L28.2,43.8L28.2,43.8z M32.1,39.9h7.8v-7.8h-7.8V39.9z M43.8,28.2h4.4c1.2,0,2.2-0.4,3.1-1.3 c0.9-0.9,1.3-1.9,1.3-3.1s-0.4-2.2-1.3-3.1c-0.9-0.9-1.9-1.3-3.1-1.3c-1.2,0-2.3,0.4-3.1,1.3c-0.9,0.9-1.3,1.9-1.3,3.1L43.8,28.2 L43.8,28.2z M43.8,43.8v4.4c0,1.2,0.4,2.2,1.3,3.1s1.9,1.3,3.1,1.3c1.2,0,2.2-0.4,3.1-1.3c0.9-0.9,1.3-1.9,1.3-3.1 c0-1.2-0.4-2.2-1.3-3.1c-0.9-0.9-1.9-1.3-3.1-1.3H43.8z"
    />
  </Svg>
);

export const Space: Component<IconProps> = props => (
  <Svg {...props}>
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-miterlimit="10"
      d="M52.8,70.3H19.2c-9.6,0-17.5-7.9-17.5-17.5V19.2c0-9.6,7.9-17.5,17.5-17.5h33.6 c9.6,0,17.5,7.9,17.5,17.5v33.6C70.3,62.4,62.4,70.3,52.8,70.3z"
    />
    <path
      fill="currentColor"
      d="M53 40 53 44C53 44.2761 52.7761 44.5 52.5 44.5L19.5 44.5C19.2239 44.5 19 44.2761 19 44L19 40C19 39.1716 18.3284 38.5 17.5 38.5 16.6716 38.5 16 39.1716 16 40 16 40.8889 16 42.2222 16 44 16 45.933 17.567 47.5 19.5 47.5L52.5 47.5C54.433 47.5 56 45.933 56 44L56 40C56 39.1716 55.3284 38.5 54.5 38.5 53.6716 38.5 53 39.1716 53 40Z"
    />
  </Svg>
);

export const ArrowUp: Component<IconProps> = props => (
  <Svg {...props}>
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-miterlimit="10"
      d="M52.8,70.3H19.2c-9.6,0-17.5-7.9-17.5-17.5V19.2c0-9.6,7.9-17.5,17.5-17.5h33.6 c9.6,0,17.5,7.9,17.5,17.5v33.6C70.3,62.4,62.4,70.3,52.8,70.3z"
    />
    <rect x="32.4" y="33" width="7.2" height="22.1" />
    <polygon points="36,33 26.7,33 31.4,25 36,16.9 40.6,25 45.3,33" />
  </Svg>
);

export const ArrowDown: Component<IconProps> = props => (
  <Svg {...props}>
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-miterlimit="10"
      d="M52.8,70.3H19.2c-9.6,0-17.5-7.9-17.5-17.5V19.2c0-9.6,7.9-17.5,17.5-17.5h33.6 c9.6,0,17.5,7.9,17.5,17.5v33.6C70.3,62.4,62.4,70.3,52.8,70.3z"
    />
    <rect x="32.4" y="16.9" width="7.2" height="22.1" />
    <polygon points="36,39 45.3,39 40.6,47 36,55.1 31.4,47 26.7,39" />
  </Svg>
);

export const ArrowLeft: Component<IconProps> = props => (
  <Svg {...props}>
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-miterlimit="10"
      d="M52.8,70.3H19.2c-9.6,0-17.5-7.9-17.5-17.5V19.2c0-9.6,7.9-17.5,17.5-17.5h33.6 c9.6,0,17.5,7.9,17.5,17.5v33.6C70.3,62.4,62.4,70.3,52.8,70.3z"
    />
    <rect x="33" y="32.4" width="22.1" height="7.2" />
    <polygon points="33,36 33,45.3 25,40.6 16.9,36 25,31.4 33,26.7" />
  </Svg>
);

export const ArrowRight: Component<IconProps> = props => (
  <Svg {...props}>
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-miterlimit="10"
      d="M52.8,70.3H19.2c-9.6,0-17.5-7.9-17.5-17.5V19.2c0-9.6,7.9-17.5,17.5-17.5h33.6 c9.6,0,17.5,7.9,17.5,17.5v33.6C70.3,62.4,62.4,70.3,52.8,70.3z"
    />
    <rect x="16.9" y="32.4" width="22.1" height="7.2" />
    <polygon points="39,36 39,26.7 47,31.4 55.1,36 47,40.6 39,45.3" />
  </Svg>
);

export const Slash: Component<IconProps> = props => (
  <Svg {...props}>
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-miterlimit="10"
      d="M52.8,70.3H19.2c-9.6,0-17.5-7.9-17.5-17.5V19.2c0-9.6,7.9-17.5,17.5-17.5h33.6 c9.6,0,17.5,7.9,17.5,17.5v33.6C70.3,62.4,62.4,70.3,52.8,70.3z"
    />
    <path
      fill="currentColor"
      stroke="currentColor"
      d="M27.6 55.6l15-39.2h3.6L31 55.6C31 55.6 27.6 55.6 27.6 55.6z"
    />
  </Svg>
);

export const KeyM: Component<IconProps> = props => (
  <Svg {...props}>
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-miterlimit="10"
      d="M52.8,70.3H19.2c-9.6,0-17.5-7.9-17.5-17.5V19.2c0-9.6,7.9-17.5,17.5-17.5h33.6 c9.6,0,17.5,7.9,17.5,17.5v33.6C70.3,62.4,62.4,70.3,52.8,70.3z"
    />
    <path
      fill="currentColor"
      d="M15.7,29.1c0-2.9-0.1-5.4-0.2-7.7H20l0.2,4.6h0.2c1.6-2.7,4.2-5.2,9-5.2c3.9,0,6.8,2.4,8.1,5.7h0.1 c0.9-1.6,2-2.8,3.2-3.7c1.7-1.3,3.6-2,6.3-2c3.8,0,9.4,2.5,9.4,12.4v16.8h-5.1V33.8c0-5.5-2-8.8-6.2-8.8c-2.9,0-5.2,2.2-6.1,4.7 c-0.2,0.7-0.4,1.6-0.4,2.6v17.6h-5.1V32.9c0-4.5-2-7.8-5.9-7.8c-3.2,0-5.6,2.6-6.4,5.2c-0.3,0.8-0.4,1.6-0.4,2.5v17.2h-5.1V29.1z"
    />
  </Svg>
);

export const KeyF: Component<IconProps> = props => (
  <Svg {...props}>
    <path
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-miterlimit="10"
      d="M52.8,70.3H19.2c-9.6,0-17.5-7.9-17.5-17.5V19.2c0-9.6,7.9-17.5,17.5-17.5h33.6 c9.6,0,17.5,7.9,17.5,17.5v33.6C70.3,62.4,62.4,70.3,52.8,70.3z"
    />
    <path
      fill="currentColor"
      d="M32.2,54.9V30.4h-4v-3.9h4v-1.4c0-4,0.9-7.7,3.3-10c1.9-1.9,4.5-2.6,6.9-2.6c1.8,0,3.4,0.4,4.4,0.8l-0.7,4 c-0.8-0.4-1.8-0.6-3.3-0.6c-4.4,0-5.5,3.9-5.5,8.2v1.5h6.9v3.9h-6.9v24.6H32.2z"
    />
  </Svg>
);
