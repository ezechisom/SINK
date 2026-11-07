/**
 * Standard image URL resolver and fallback handler
 * Ensures that images load seamlessly regardless of whether they are requested via
 * `/assets/aistudio/...` or `/public/assets/aistudio/...` in both dev and production.
 */

export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  // Normalize `/public/assets/` to `/assets/`
  if (url.startsWith('/public/assets/')) {
    return url.replace('/public/assets/', '/assets/');
  }
  return url;
}

export function handleImageFallback(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (!target) return;

  const currentSrc = target.currentSrc || target.src;
  
  // If failed on `/assets/`, try `/public/assets/`
  if (currentSrc.includes('/assets/aistudio/') && !currentSrc.includes('/public/assets/aistudio/')) {
    target.src = currentSrc.replace('/assets/aistudio/', '/public/assets/aistudio/');
  } 
  // If failed on `/public/assets/`, try `/assets/`
  else if (currentSrc.includes('/public/assets/aistudio/')) {
    target.src = currentSrc.replace('/public/assets/aistudio/', '/assets/aistudio/');
  }
}
