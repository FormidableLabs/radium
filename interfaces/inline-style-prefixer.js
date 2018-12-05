declare class InlineStylePrefixer {
  static prefixAll: typeof prefixAll;

  prefixedKeyframes: string;

  constructor(config: {
    keepUnprefixed?: boolean,
    userAgent?: ?string
  }): void;

  prefix(style: Object): Object;
}

declare function prefixAll(style: Object): Object;

declare function createStaticPrefixer(browserData: Object): typeof prefixAll;

declare function createDynamicPrefixer(
  browserData: Object,
  prefixAll: typeof prefixAll
): typeof InlineStylePrefixer;

declare module 'inline-style-prefixer' {
  declare var exports: typeof InlineStylePrefixer;
}

declare module 'inline-style-prefixer/static/createPrefixer' {
  declare var exports: typeof createStaticPrefixer;
}

declare module 'inline-style-prefixer/dynamic/createPrefixer' {
  declare var exports: typeof createDynamicPrefixer;
}
