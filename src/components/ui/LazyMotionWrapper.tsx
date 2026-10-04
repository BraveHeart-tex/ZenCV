import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';

export const LazyMotionWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <MotionConfig reducedMotion='user'>
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
};
