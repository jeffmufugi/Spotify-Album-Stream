import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior:"instant" // Smooth scrolling effect
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;