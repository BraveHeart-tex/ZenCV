import { domAnimation, LazyMotion } from 'motion/react';

const LazyMotionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
};

export default LazyMotionWrapper;
