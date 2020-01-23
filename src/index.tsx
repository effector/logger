import * as React from 'react';

export const Ctx = React.createContext({ isOpen: false });

type ComponentProps = {
  index: number;
};

export const Component: React.FC<ComponentProps> = ({ children, index }) => {
  const [counter, setActiveIndex] = React.useState(index);
  const context = React.useContext(Ctx);

  return (
    <div onClick={() => setActiveIndex(counter + 1)}>
      {children}
      {JSON.stringify(context)}
    </div>
  );
};
