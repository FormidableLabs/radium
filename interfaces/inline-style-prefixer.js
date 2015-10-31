declare class InlineStylePrefixer {
  constructor(userAgent?: ?string): void;

  prefix(style: Object): Object;
}

declare module 'inline-style-prefixer' {
  declare var exports: typeof InlineStylePrefixer;
}
