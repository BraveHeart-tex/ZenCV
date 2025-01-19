import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string, defaultState = false) => {
  const [matches, setMatches] = useState(defaultState);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const updateMatch = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', updateMatch);

    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
};
