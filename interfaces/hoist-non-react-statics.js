declare module 'hoist-non-react-statics' {
  /*
    S - source component statics
    TP - target component props
    SP - additional source component props
  */
  declare module.exports: <TP, SP, S>(
    target: React$ComponentType<TP>,
    source: React$ComponentType<SP> & S,
    blacklist?: {[key: $Keys<S>]: boolean}
  ) => React$ComponentType<TP> & $Shape<S>;
}
