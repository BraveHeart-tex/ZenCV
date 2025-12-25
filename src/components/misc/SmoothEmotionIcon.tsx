interface SmoothEmotionIconProps {
  size?: number;
  expression: 'happy' | 'neutral' | 'sad';
  className?: string;
}

export const SmoothEmotionIcon = ({
  size = 24,
  expression = 'happy',
  className = '',
}: SmoothEmotionIconProps) => {
  const getColors = () => {
    switch (expression) {
      case 'happy':
        return { bg: '#4ade80', face: '#15803d' };
      case 'neutral':
        return { bg: '#fbbf24', face: '#92400e' };
      case 'sad':
        return { bg: '#fb7185', face: '#9f1239' };
      default:
        return { bg: '#e5e7eb', face: '#4b5563' };
    }
  };

  const { bg: bgColor, face: faceColor } = getColors();

  const getExpressionPath = () => {
    switch (expression) {
      case 'happy':
        return (
          <path
            d='M 25 65 Q 50 85 75 65'
            fill='none'
            stroke={faceColor}
            strokeWidth='6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        );
      case 'neutral':
        return (
          <line
            x1='25'
            y1='65'
            x2='75'
            y2='65'
            stroke={faceColor}
            strokeWidth='6'
            strokeLinecap='round'
          />
        );
      case 'sad':
        return (
          <path
            d='M 25 75 Q 50 55 75 75'
            fill='none'
            stroke={faceColor}
            strokeWidth='6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        );
      default:
        return null;
    }
  };

  const getEyes = () => {
    if (expression === 'happy') {
      return (
        <>
          <path
            d='M 25 40 Q 32.5 30 40 40'
            fill='none'
            stroke={faceColor}
            strokeWidth='6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M 60 40 Q 67.5 30 75 40'
            fill='none'
            stroke={faceColor}
            strokeWidth='6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </>
      );
    }
    return (
      <>
        <circle cx='32.5' cy='40' r='5' fill={faceColor} />
        <circle cx='67.5' cy='40' r='5' fill={faceColor} />
      </>
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      role='img'
      aria-label='Emotion Icon'
    >
      <circle cx='50' cy='50' r='45' fill={bgColor} />
      {getEyes()}
      {getExpressionPath()}
    </svg>
  );
};
