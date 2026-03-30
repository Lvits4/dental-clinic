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

  const update = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

    if (estH == null) {
      setRect({
        top: r.bottom + gapPx,
        left: r.left,
        width: r.width,
      });
      return;
    }

    const est = estH;
    const edge = 8;
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
      left: r.left,
      width: r.width,
      maxHeight: Math.max(allocated, 0),
    });
  }, [anchorRef, gapPx, estH]);

  useLayoutEffect(() => {
    if (!open) {
      setRect(null);
      return;
    }
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, update]);

  return open ? rect : null;
}
