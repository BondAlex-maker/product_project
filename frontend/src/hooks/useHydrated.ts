import { useEffect, useState } from "react";

/** Возвращает true только на клиенте, после первой отрисовки */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
