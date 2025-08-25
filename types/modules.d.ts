declare module 'html-to-image' {
  export function toPng(node: HTMLElement, options?: unknown): Promise<string>;
}

declare module '@imgly/background-removal' {
  export function removeBackground(
    source: string | Blob,
    config?: unknown
  ): Promise<Blob>;
}
