import { domAnimation, LazyMotion } from 'motion/react';

export const LazyMotionWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
};
