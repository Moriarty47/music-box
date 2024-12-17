class IAnimation<T extends HTMLElement> {
  ele: T;
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
  animation: Animation | null;
  constructor(ele: T) {
    this.ele = ele;
    this.keyframes = [];
    this.options = {};
    this.animation = null;
  }

  switch() {
    if (this.animation) {
      this.animation.reverse();
    } else {
      this.animation = this.ele.animate(this.keyframes, this.options);
    }
  }
}

export class Play2PauseAnimation<T extends HTMLElement = HTMLElement> extends IAnimation<T> {
  constructor(ele: T) {
    super(ele);
    this.keyframes = [
      {
        d: `path('M 6 4 C 6 4 6 12 6 12 C 6 12 6 20 6 20 C 6 20 22 12 22 12 C 22 12 6 4 6 4 Z M8 12C8 12 8 12 8 12H8C8 12 8 12 8 12V12C8 12 8 12 8 12H8C8 12 8 12 8 12V12Z M16 12C16 12 16 12 16 12H16C16 12 16 12 16 12V12C16 12 16 12 16 12H16C16 12 16 12 16 12V12Z')`,
      },
      {
        d: `path('M 11.9688 2 C 6.4488 2 1.9688 6.48 1.9688 12 C 1.9688 17.52 6.4488 22 11.9688 22 C 17.4888 22 21.9688 17.52 21.9688 12 C 21.9688 6.48 17.4988 2 11.9688 2 ZM10.7 15C10.7 15.5 10.5 15.7 10 15.7H8.7C8.2 15.7 8 15.5 8 15V9C8 8.5 8.2 8.3 8.7 8.3H10C10.4 8.3 10.7 8.5 10.7 9V15Z M16 15C16 15.5 15.8 15.7 15.3 15.7H14C13.5 15.7 13.3 15.5 13.3 15V9C13.3 8.5 13.5 8.3 14 8.3H15.3C15.7 8.3 16 8.5 16 9V15Z')`,
      },
    ];
    this.options = {
      duration: 200,
      iterations: 1,
      fill: 'forwards',
    };
  }
}

export class PlayModeAnimation<T extends HTMLElement = HTMLElement> extends IAnimation<T> {
  constructor(ele: T) {
    super(ele);
    this.keyframes = [
      {
        d: `path('M12 12C12 12 12 12 12 12V12L12 12C12 12 12 12 12 12 12 12 12 12 12 12L12 12C12 12 12 12 12 12 12 12 12 12 12 12V12C12 12 12 12 12 12Z')`,
      },
      {
        d: `path('M12.2485 15.4191C11.8385 15.4191 11.4985 15.0791 11.4985 14.6691V11.2791L11.3085 11.4891C11.0285 11.7991 10.5585 11.8191 10.2485 11.5491C9.93853 11.2791 9.91853 10.7991 10.1885 10.4891L11.6885 8.81909C11.8985 8.58909 12.2285 8.50909 12.5185 8.61909C12.8085 8.73909 12.9985 9.00909 12.9985 9.32909V14.6791C12.9985 15.0891 12.6585 15.4191 12.2485 15.4191Z')`,
      },
    ];
    this.options = {
      duration: 200,
      iterations: 1,
      fill: 'forwards',
    };
  }
}
