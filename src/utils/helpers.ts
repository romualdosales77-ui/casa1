import { SiteData } from '../types';
import { INITIAL_SITE_DATA } from '../data/initialData';

const STORAGE_KEY = 'vitrine_pro_data_gamedev_v1';

export function loadSiteData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SITE_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_SITE_DATA,
      ...parsed,
      banner: { ...INITIAL_SITE_DATA.banner, ...(parsed.banner || {}) },
      pix: { ...INITIAL_SITE_DATA.pix, ...(parsed.pix || {}) },
      presentation: { ...INITIAL_SITE_DATA.presentation, ...(parsed.presentation || {}) },
      products: Array.isArray(parsed.products) ? parsed.products : INITIAL_SITE_DATA.products,
      usefulLinks: Array.isArray(parsed.usefulLinks) ? parsed.usefulLinks : INITIAL_SITE_DATA.usefulLinks,
    };
  } catch (err) {
    console.error('Error reading localStorage', err);
    return INITIAL_SITE_DATA;
  }
}

export function saveSiteData(data: SiteData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving to localStorage', err);
  }
}

export function resetSiteData(): SiteData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting localStorage', err);
  }
  return INITIAL_SITE_DATA;
}

export function formatCurrencyBRL(value: number): string {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Normalizes video links into embeddable URLs (YouTube, Vimeo, etc.)
 */
export function getEmbedVideoUrl(url?: string): { isEmbed: boolean; url: string; isDirectVideo: boolean } {
  if (!url || !url.trim()) {
    return { isEmbed: false, url: '', isDirectVideo: false };
  }

  const trimmed = url.trim();

  // YouTube watch format: youtube.com/watch?v=ID
  const ytWatchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return {
      isEmbed: true,
      url: `https://www.youtube-nocookie.com/embed/${ytWatchMatch[1]}?autoplay=0&rel=0`,
      isDirectVideo: false,
    };
  }

  // YouTube Shorts: youtube.com/shorts/ID
  const ytShortsMatch = trimmed.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/i);
  if (ytShortsMatch && ytShortsMatch[1]) {
    return {
      isEmbed: true,
      url: `https://www.youtube-nocookie.com/embed/${ytShortsMatch[1]}?autoplay=0&rel=0`,
      isDirectVideo: false,
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      isEmbed: true,
      url: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
      isDirectVideo: false,
    };
  }

  // Direct video files (.mp4, .webm, .ogg)
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
    return {
      isEmbed: false,
      url: trimmed,
      isDirectVideo: true,
    };
  }

  // If already an embed iframe URL
  if (trimmed.includes('/embed/')) {
    return {
      isEmbed: true,
      url: trimmed,
      isDirectVideo: false,
    };
  }

  return {
    isEmbed: false,
    url: trimmed,
    isDirectVideo: false,
  };
}

/**
 * Reads an uploaded file as a DataURL (base64)
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
