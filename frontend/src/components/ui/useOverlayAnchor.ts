import { useLayoutEffect, useState, useCallback, type RefObject } from 'react';

export interface OverlayAnchorRect {
  top: number;
  left: number;
  width: number;
  /** Altura máxima útil en la dirección elegida (scroll interno si el contenido es mayor) */
  maxHeight?: number;
}

export interface UseOverlayAnchorOptions {
  /**
   * Altura de referencia del overlay (px). Si no cabe debajo del ancla en el viewport,
   * se coloca arriba. La altura real se limita a `min(estimatedHeightPx, espacio disponible)`.
   */
  estimatedHeightPx: number;
  /**
   * Ancho del overlay en px (ej. calendario más ancho que el botón). Si se omite, se usa el ancho del ancla.
   * Si al alinear por la izquierda se sale por la derecha del viewport, se intenta alinear por la derecha del ancla.
   */
  overlayWidthPx?: number;
}

/**
 * Posición fixed respecto al viewport (para portales fuera de overflow).
 * Con `estimatedHeightPx`, si no cabe abajo se abre hacia arriba del ancla.
 */
export function useOverlayAnchor(
  anchorRef: RefObject<HTMLElement | null>,
  open: boolean,
  gapPx = 6,
  options?: UseOverlayAnchorOptions,
): OverlayAnchorRect | null {
  const [rect, setRect] = useState<OverlayAnchorRect | null>(null);
  const estH = options?.estimatedHeightPx;
  const overlayWpx = options?.overlayWidthPx;

  const update = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const edge = 8;
    const vw =
      typeof document !== 'undefined'
        ? document.documentElement.clientWidth
        : typeof window !== 'undefined'
          ? window.innerWidth
          : 1024;
    const overlayW = overlayWpx ?? r.width;
    let left = r.left;
    if (left + overlayW > vw - edge) {
      left = r.right - overlayW;
    }
    left = Math.max(edge, Math.min(left, vw - overlayW - edge));

    if (estH == null) {
      setRect({
        top: r.bottom + gapPx,
        left,
        width: r.width,
      });
      return;
    }

    const est = estH;
    const spaceBelow = vh - r.bottom - gapPx - edge;
    const spaceAbove = r.top - gapPx - edge;

    let placeAbove = spaceBelow < est && spaceAbove > spaceBelow;
    if (spaceBelow < est && spaceAbove < est) {
      placeAbove = spaceAbove >= spaceBelow;
    }

    const allocated = Math.min(est, placeAbove ? spaceAbove : spaceBelow);
    const rawTop = placeAbove ? r.top - gapPx - allocated : r.bottom + gapPx;
    const top = placeAbove ? Math.max(edge, rawTop) : rawTop;

    setRect({
      top,
      left,
      width: r.width,
      maxHeight: Math.max(allocated, 0),
    });
  }, [anchorRef, gapPx, estH, overlayWpx]);

  useLayoutEffect(() => {
    if (!open) {
      setRect(null);
      return;
    }

    let cancelled = false;
    const run = () => {
      if (!cancelled) update();
    };

    run();
    // Un frame: layout tras paint. Dos frames: suele bastar tras animaciones CSS del padre.
    requestAnimationFrame(() => {
      run();
      requestAnimationFrame(run);
    });
    // Pasos de formulario (p. ej. fadeSlideIn 0.3s): el ancla se mueve hasta fin de animación.
    const tFine = window.setTimeout(run, 340);

    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      cancelled = true;
      clearTimeout(tFine);
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, update]);

  return open ? rect : null;
}
