import React from 'react';

export type ContextProps = {
  registerConsumer: (consumer: any) => void;
};

export const Context = React.createContext<ContextProps>({ registerConsumer: () => {} });

abstract class Provider<T, S = {}> extends React.Component<T, S> {
  consumers: any[];

  constructor(props: T) {
    super(props);
    this.consumers = [];

    this.registerConsumer = this.registerConsumer.bind(this);
    this.getContextValue = this.getContextValue.bind(this);
    this.renderWithProvider = this.renderWithProvider.bind(this);
  }

  registerConsumer(consumer: any) {
    this.consumers.push(consumer);
  }

  getContextValue() {
    return {
      registerConsumer: this.registerConsumer,
    };
  }

  renderWithProvider(output: any) {
    return <Context.Provider value={this.getContextValue()}>{output}</Context.Provider>;
  }
}

export default Provider;
