declare module 'html-to-image' {
  export function toPng(node: HTMLElement, options?: unknown): Promise<string>;
}

declare module '@imgly/background-removal' {
  export function removeBackground(...args: any[]): Promise<any>;
}

declare module '@odeconto/scraper' {
  export function scrape(url: string, options?: any): Promise<any>;
  export function pickBestImage(meta: any): any;
}
