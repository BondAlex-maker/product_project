export function toAssetUrl(p?: string | null): string | null {
    if (!p) return null;
    if (/^https?:\/\//i.test(p)) return p;           
    const clean = p.replace(/^\/+/, "");             
    return `/${clean}`;                              
  }
  