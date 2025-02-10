import * as motion from 'motion/react-m';

interface SuggestionsContainerProps {
  children: React.ReactNode;
}

const AnimatedSuggestionsContainer = ({
  children,
}: SuggestionsContainerProps) => {
  return (
    <motion.div
      className="md:grid-cols-2 grid gap-2 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSuggestionsContainer;
