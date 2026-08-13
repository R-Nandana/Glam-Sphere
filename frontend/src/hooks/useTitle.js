import { useEffect } from "react";

/**
 * useTitle — sets document.title per route.
 * Appends " | GlamSphere" to every title for consistent branding.
 *
 * Usage:
 *   useTitle("Your Cart");           → "Your Cart | GlamSphere"
 *   useTitle("GlamSphere");          → "GlamSphere"  (no double suffix)
 */
export default function useTitle(title) {
  useEffect(() => {
    const suffix = " | GlamSphere";
    document.title = title.endsWith("GlamSphere") ? title : `${title}${suffix}`;
    return () => {
      document.title = "GlamSphere — AI-Powered Personalised Beauty";
    };
  }, [title]);
}
