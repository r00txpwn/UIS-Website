import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function resetScrollAndFocus() {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active !== document.body) {
    active.blur();
  }

  const main = document.getElementById('main-content');
  if (main instanceof HTMLElement) {
    main.focus({ preventScroll: true });
  }

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

    resetScrollAndFocus();

    // Footer/header links stay mounted across routes; browsers re-scroll
    // focused links into view after paint, so reset again shortly after.
    const frame = window.requestAnimationFrame(resetScrollAndFocus);
    const t0 = window.setTimeout(resetScrollAndFocus, 0);
    const t1 = window.setTimeout(resetScrollAndFocus, 50);
    const t2 = window.setTimeout(resetScrollAndFocus, 200);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
