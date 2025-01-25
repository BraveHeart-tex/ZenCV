'use client';
import { BrowserRouter } from 'react-router';
import { ReactNode } from 'react';

const BrowserRouterWrapper = ({ children }: { children: ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

export default BrowserRouterWrapper;
