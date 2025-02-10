import { createContext, useContext, type ReactNode } from 'react';
import Shepherd from 'shepherd.js';

interface ShepherdContextType {
  Shepherd: typeof Shepherd;
}

const ShepherdJourneyContext = createContext<ShepherdContextType | undefined>(
  undefined,
);

export const useShepherd = () => {
  const context = useContext(ShepherdJourneyContext);
  if (!context) {
    throw new Error(
      'useShepherd must be used within a ShepherdJourneyProvider',
    );
  }

  const { Shepherd: ShepherdInstance } = context;

  return ShepherdInstance;
};

export const ShepherdJourneyProvider = ({
  children,
}: {
  children?: ReactNode;
}) => {
  return (
    <ShepherdJourneyContext.Provider value={{ Shepherd }}>
      {children}
    </ShepherdJourneyContext.Provider>
  );
};
