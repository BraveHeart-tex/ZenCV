import * as motion from 'motion/react-m';

interface SuggestionGroupHeadingProps {
  children: React.ReactNode;
}

export const SuggestionGroupHeading = ({
  children,
}: SuggestionGroupHeadingProps) => {
  return (
    <motion.h3
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.2 }}
      className='scroll-m-20 text-lg font-semibold tracking-tight'
    >
      {children}
    </motion.h3>
  );
};
