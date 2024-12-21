import { HeartIcon } from '@/ui/icons/normal';

import type { Component } from 'solid-js';

const Footer: Component = () => {
  return (
    <footer class="footer ease-ease fixed bottom-0 m-0 mx-auto box-border flex h-16 w-full items-center justify-center p-0 text-center text-foreground transition-[border-color] duration-300">
      <p class="m-0 break-words text-sm leading-normal">
        <span class="inline-block items-center">
          Music Box
        </span>
        <HeartIcon size={12} class="mx-1 inline-block" />
        Copyright © 2020-present
        <a class="external-link-wrapper mx-1.5 font-medium text-lightblue no-underline" href="https://github.com/Moriarty47" target="_blank" rel="noopener noreferrer">
          Moriarty47
          <span class="relative top-[-2px] inline-block size-[15px] align-middle text-lightblue">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" shape-rendering="geometricPrecision" viewBox="0 0 24 24" height="16" width="16" style={{ color: 'currentColor', height: 'var(--w, 16px)', overflow: 'visible', width: 'var(--w, 16px)' }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
            <span class="external-link-icons sr-only select-none">Open in new window</span>
          </span>
        </a>
      </p>
    </footer>
  );
};

export default Footer;
