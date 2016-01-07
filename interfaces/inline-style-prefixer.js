declare class InlineStylePrefixer {
  static prefixAll(style: Object): Object;

  prefixedKeyframes: string;

  constructor(config: {
    keepUnprefixed?: bool,
    userAgent?: ?string
  }): void;

  prefix(style: Object): Object;
}

declare module 'inline-style-prefixer' {
  declare var exports: typeof InlineStylePrefixer;
}
