import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    scrollToTop();

    // Beat late browser scroll restoration after async page content mounts.
    const frame = window.requestAnimationFrame(scrollToTop);
    const timeout = window.setTimeout(scrollToTop, 0);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}
