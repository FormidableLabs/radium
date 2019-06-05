/* @flow */
import React, {type Context, type ComponentType, useContext} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import StyleKeeper from './style-keeper';
import type {Config} from './config';

export const StyleKeeperContext: Context<StyleKeeper | void> = React.createContext(
  undefined
);
export const RadiumConfigContext: Context<Config | void> = React.createContext(
  undefined
);

export type WithRadiumContextsProps = {
  styleKeeperContext?: StyleKeeper,
  radiumConfigContext?: Config
};

export function withRadiumContexts<P: {}>(
  WrappedComponent: ComponentType<P>
): ComponentType<$Diff<P, WithRadiumContextsProps>> {
  const WithRadiumContexts = React.forwardRef(
    (props: $Diff<P, WithRadiumContextsProps>, ref) => {
      const radiumConfigContext = useContext(RadiumConfigContext);
      const styleKeeperContext = useContext(StyleKeeperContext);

      return (
        <WrappedComponent
          ref={ref}
          {...props}
          radiumConfigContext={radiumConfigContext}
          styleKeeperContext={styleKeeperContext}
        />
      );
    }
  );

  WithRadiumContexts.displayName = `withRadiumContexts(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;

  return hoistStatics(WithRadiumContexts, WrappedComponent);
}
