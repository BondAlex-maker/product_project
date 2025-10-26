// frontend/src/helpers/url.ts
/** Делает из "uploads/..." абсолютный URL "/uploads/..." на текущем origin */
export function toAssetUrl(p?: string | null): string | null {
    if (!p) return null;
    if (/^https?:\/\//i.test(p)) return p;           // уже абсолютный
    const clean = p.replace(/^\/+/, "");             // убрали лишние слэши
    return `/${clean}`;                              // => "/uploads/..."
  }
  