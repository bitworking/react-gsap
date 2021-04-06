import React from 'react';

type RegisteredPlugins = 'scrollTrigger';
type Plugin = (targets: any) => any;
type Plugins = { [key in RegisteredPlugins]: Plugin } | {};

export type ContextProps = {
  registerConsumer: (consumer: any) => void;
  plugins?: Plugins;
  getPlugins: (plugins?: Plugins, targets?: any) => any;
};

export const Context = React.createContext<ContextProps>({
  registerConsumer: () => {},
  getPlugins: () => {},
  plugins: {},
});

abstract class Provider<T, S = {}> extends React.Component<T, S> {
  static contextType = Context;

  consumers: any[];
  plugins?: Plugins;

  constructor(props: T) {
    super(props);
    this.consumers = [];
    this.plugins = {};

    this.registerConsumer = this.registerConsumer.bind(this);
    this.getContextValue = this.getContextValue.bind(this);
    this.getPlugin = this.getPlugin.bind(this);
    this.getPlugins = this.getPlugins.bind(this);
    this.renderWithProvider = this.renderWithProvider.bind(this);
  }

  registerConsumer(consumer: any) {
    this.consumers.push(consumer);
  }

  getContextValue(plugin: Plugins = {}) {
    return {
      registerConsumer: this.registerConsumer,
      // plugins: { ...this.context.plugins, ...plugin },
      plugins: plugin,
      getPlugins: this.getPlugins,
    };
  }

  getPlugin(props: any, targets: any) {
    return {};
  }

  getPlugins(plugins?: Plugins, targets?: any) {
    return Object.keys(plugins ?? {}).reduce((acc, plugin) => {
      if (Object.prototype.hasOwnProperty.call(plugins, plugin)) {
        // @ts-ignore
        return { ...acc, [plugin]: this.getPlugin(plugins[plugin], targets) };
      }
      return acc;
    }, {});
  }

  renderWithProvider(output: any, plugin?: Plugins) {
    return <Context.Provider value={this.getContextValue(plugin)}>{output}</Context.Provider>;
  }
}

export default Provider;
