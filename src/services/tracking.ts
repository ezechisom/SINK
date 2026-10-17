declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    ttq?: {
      track: (event: string, params?: any) => void;
      page: () => void;
    };
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function initPixels(pixels: {
  metaPixelId?: string;
  tikTokPixelId?: string;
  googleAnalyticsId?: string;
}) {
  if (typeof window === 'undefined') return;

  // Meta Pixel
  if (pixels.metaPixelId && !window.fbq) {
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    const fb = (window as any).fbq;
    if (typeof fb === 'function') {
      fb('init', pixels.metaPixelId);
      fb('track', 'PageView');
    }
  }

  // Google Analytics
  if (pixels.googleAnalyticsId && !window.gtag) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${pixels.googleAnalyticsId}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', pixels.googleAnalyticsId);
  }
}

export function trackEvent(
  eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Purchase',
  params?: Record<string, any>
) {
  if (typeof window === 'undefined') return;

  // 1. Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  }

  // 2. TikTok Pixel
  if (typeof window.ttq?.track === 'function') {
    if (eventName === 'PageView') {
      window.ttq.page();
    } else if (eventName === 'Purchase') {
      window.ttq.track('PlaceAnOrder', params);
      window.ttq.track('CompletePayment', params);
    } else {
      window.ttq.track(eventName, params);
    }
  }

  // 3. Google Analytics
  if (typeof window.gtag === 'function') {
    if (eventName === 'Purchase') {
      window.gtag('event', 'purchase', {
        transaction_id: params?.orderId,
        value: params?.value,
        currency: 'NGN',
        items: [
          {
            item_name: params?.content_name || 'Premium Smart Piano Kitchen Sink',
            quantity: params?.num_items || 1,
            price: params?.value
          }
        ]
      });
    } else if (eventName === 'InitiateCheckout') {
      window.gtag('event', 'begin_checkout', params);
    } else if (eventName === 'ViewContent') {
      window.gtag('event', 'view_item', params);
    } else {
      window.gtag('event', eventName, params);
    }
  }
}
