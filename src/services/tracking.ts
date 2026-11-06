declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    ttq?: {
      track: (event: string, params?: any, options?: any) => void;
      page: () => void;
      load?: (pixelId: string, options?: any) => void;
      identify?: (params: Record<string, any>) => void;
    };
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Extract any TikTok Test Event Code from URL (e.g. ?tiktok_test_code=TEST12345 or ?test_event_code=TEST12345)
export function getTikTokTestCode(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('test_event_code') || urlParams.get('tiktok_test_code') || urlParams.get('tt_test_event_code');
    if (code) {
      sessionStorage.setItem('tt_test_code', code);
      return code;
    }
    return sessionStorage.getItem('tt_test_code') || undefined;
  } catch (e) {
    return undefined;
  }
}

// Extract any Meta Test Event Code from URL (e.g. ?test_event_code=TEST12345 or ?meta_test_event_code=TEST12345)
export function getMetaTestCode(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('test_event_code') || urlParams.get('meta_test_event_code') || urlParams.get('fb_test_code');
    if (code) {
      sessionStorage.setItem('meta_test_code', code);
      return code;
    }
    return sessionStorage.getItem('meta_test_code') || undefined;
  } catch (e) {
    return undefined;
  }
}

// Background relay to server-side Meta Conversions API (CAPI)
export function dispatchMetaCapiEvent(
  eventName: string,
  eventId: string,
  params?: Record<string, any>,
  userData?: Record<string, any>
) {
  if (typeof window === 'undefined') return;
  try {
    const testCode = getMetaTestCode();
    fetch('/api/meta-capi/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        params,
        userData,
        testEventCode: testCode,
        sourceUrl: window.location.href
      })
    }).catch(() => {
      // Non-blocking
    });
  } catch (e) {
    // Non-blocking
  }
}

export function initPixels(pixels: {
  metaPixelId?: string;
  tikTokPixelId?: string;
  googleAnalyticsId?: string;
}) {
  if (typeof window === 'undefined') return;

  const pixelId = pixels.metaPixelId || '947636671276929';

  // 1. Meta Pixel
  if (!window.fbq) {
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
  }

  const fb = (window as any).fbq;
  if (typeof fb === 'function') {
    fb('init', pixelId);
    fb('track', 'PageView');
  }

  // 2. TikTok Pixel initialization (ID: DBMVHBRC77UASCMH7A20)
  const tikTokPixelId = pixels.tikTokPixelId || 'DBMVHBRC77UASCMH7A20';
  const tt = (window as any).ttq;

  if (!tt) {
    (function (w: any, d: any, t: any) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      ttq.methods = [
        'page',
        'track',
        'identify',
        'instances',
        'debug',
        'on',
        'off',
        'once',
        'ready',
        'alias',
        'group',
        'enableCookie',
        'disableCookie',
        'holdConsent',
        'revokeConsent',
        'grantConsent'
      ];
      ttq.setAndDefer = function (t: any, e: any) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t: any) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function (e: any, n: any) {
        var r = 'https://analytics.tiktok.com/i18n/pixel/events.js',
          o = n && n.partner;
        (ttq._i = ttq._i || {}),
          (ttq._i[e] = []),
          (ttq._i[e]._u = r),
          (ttq._t = ttq._t || {}),
          (ttq._t[e] = +new Date()),
          (ttq._o = ttq._o || {}),
          (ttq._o[e] = n || {});
        var a = d.createElement('script');
        a.type = 'text/javascript';
        a.async = !0;
        a.src = r + '?sdkid=' + e + '&lib=' + t;
        var s = d.getElementsByTagName('script')[0];
        if (s && s.parentNode) {
          s.parentNode.insertBefore(a, s);
        } else {
          d.head.appendChild(a);
        }
      };

      ttq.load(tikTokPixelId);
      ttq.page();
    })(window, document, 'ttq');
  } else {
    // Check if this pixel ID is already registered in tt._i
    const isAlreadyLoaded = tt._i && tt._i[tikTokPixelId];
    if (!isAlreadyLoaded && typeof tt.load === 'function') {
      tt.load(tikTokPixelId);
      if (typeof tt.page === 'function') {
        tt.page();
      }
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

export type TrackingEventType =
  | 'PageView'
  | 'ViewContent'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'Lead'
  | 'Contact';

export interface TrackingOptions {
  eventId?: string;
}

export function trackEvent(
  eventName: TrackingEventType,
  params?: Record<string, any>,
  options?: TrackingOptions
) {
  if (typeof window === 'undefined') return;

  // 1. Meta (Facebook) Pixel & Conversions API (CAPI) Dual-Tracking
  const effectiveEventId =
    options?.eventId || `${eventName.toLowerCase()}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  if (typeof window.fbq === 'function') {
    const metaOptions = { eventID: effectiveEventId };

    if (eventName === 'Purchase') {
      const purchaseData = {
        value: params?.value || 180000,
        currency: params?.currency || 'NGN',
        content_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
        content_type: 'product',
        num_items: params?.num_items || 1,
        order_id: params?.orderId || effectiveEventId
      };

      window.fbq('track', 'Purchase', purchaseData, metaOptions);
      dispatchMetaCapiEvent('Purchase', effectiveEventId, purchaseData);

      // Also trigger Lead event with unique eventID for advertisers optimizing for Leads
      const leadEventId = `lead-${effectiveEventId}`;
      window.fbq(
        'track',
        'Lead',
        {
          value: params?.value || 180000,
          currency: params?.currency || 'NGN',
          content_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
          num_items: params?.num_items || 1
        },
        { eventID: leadEventId }
      );
      dispatchMetaCapiEvent('Lead', leadEventId, purchaseData);
    } else if (eventName === 'InitiateCheckout') {
      const checkoutData = {
        value: params?.value || 180000,
        currency: params?.currency || 'NGN',
        content_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
        content_type: 'product',
        num_items: params?.num_items || 1
      };
      window.fbq('track', 'InitiateCheckout', checkoutData, metaOptions);
      dispatchMetaCapiEvent('InitiateCheckout', effectiveEventId, checkoutData);
    } else if (eventName === 'ViewContent') {
      const viewData = {
        value: params?.value || 180000,
        currency: 'NGN',
        content_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
        content_type: 'product'
      };
      window.fbq('track', 'ViewContent', viewData, metaOptions);
      dispatchMetaCapiEvent('ViewContent', effectiveEventId, viewData);
    } else if (eventName === 'Contact') {
      window.fbq('track', 'Contact', params, metaOptions);
      dispatchMetaCapiEvent('Contact', effectiveEventId, params);
    } else {
      window.fbq('track', eventName, params, metaOptions);
      dispatchMetaCapiEvent(eventName, effectiveEventId, params);
    }
  } else {
    // If browser fbq is blocked by adblocker, still dispatch server-side CAPI event!
    dispatchMetaCapiEvent(eventName, effectiveEventId, params);
  }

  // 2. TikTok Pixel (ID: DBMVHBRC77UASCMH7A20)
  const tt = (window as any).ttq;
  if (tt && typeof tt.track === 'function') {
    const testCode = getTikTokTestCode();
    const hasOptions = Boolean(options?.eventId || testCode);
    const ttOptions = hasOptions
      ? {
          ...(options?.eventId ? { event_id: options.eventId } : {}),
          ...(testCode ? { test_event_code: testCode } : {})
        }
      : undefined;

    if (eventName === 'PageView') {
      if (typeof tt.page === 'function') {
        tt.page();
      }
    } else if (eventName === 'Purchase') {
      const orderPayload = {
        contents: [
          {
            content_id: 'A-01',
            content_type: 'product',
            content_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
            quantity: params?.num_items || 1,
            price: params?.value || 180000
          }
        ],
        content_id: params?.orderId || 'A-01',
        content_type: 'product',
        content_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
        quantity: params?.num_items || 1,
        price: params?.value || 180000,
        value: params?.value || 180000,
        currency: params?.currency || 'NGN',
        order_id: params?.orderId
      };
      tt.track('CompletePayment', orderPayload, ttOptions);
      tt.track('PlaceAnOrder', orderPayload, ttOptions);
    } else if (eventName === 'InitiateCheckout') {
      tt.track(
        'InitiateCheckout',
        {
          contents: [
            {
              content_id: 'A-01',
              content_type: 'product',
              content_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
              quantity: params?.num_items || 1,
              price: params?.value || 180000
            }
          ],
          content_id: 'A-01',
          content_type: 'product',
          content_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
          quantity: params?.num_items || 1,
          price: params?.value || 180000,
          value: params?.value || 180000,
          currency: params?.currency || 'NGN'
        },
        ttOptions
      );
    } else if (eventName === 'ViewContent') {
      tt.track(
        'ViewContent',
        {
          contents: [
            {
              content_id: 'A-01',
              content_type: 'product',
              content_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
              quantity: 1,
              price: params?.value || 180000
            }
          ],
          content_id: 'A-01',
          content_type: 'product',
          content_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
          price: params?.value || 180000,
          value: params?.value || 180000,
          currency: params?.currency || 'NGN'
        },
        ttOptions
      );
    } else if (eventName === 'Contact') {
      tt.track('Contact', params || {}, ttOptions);
    } else {
      tt.track(eventName, params || {}, ttOptions);
    }
  }

  // 3. Google Analytics
  if (typeof window.gtag === 'function') {
    if (eventName === 'Purchase') {
      window.gtag('event', 'purchase', {
        transaction_id: params?.orderId,
        value: params?.value,
        currency: params?.currency || 'NGN',
        items: [
          {
            item_name: params?.content_name || 'A-01 Deadbolt Type Smart Lock',
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

// Direct Meta Pixel & CAPI Event Trigger for diagnostics and testing
export function trackMetaDirect(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  const eventId = `test-meta-${Date.now()}`;
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', eventName, params || {}, { eventID: eventId });
  }
  dispatchMetaCapiEvent(eventName, eventId, params);
  console.log(`[Meta Pixel & CAPI] Direct event fired: ${eventName}`, params, { eventId });
}

// Direct TikTok Event Trigger for diagnostics and testing
export function trackTikTokDirect(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  const tt = (window as any).ttq;
  if (tt && typeof tt.track === 'function') {
    const testCode = getTikTokTestCode();
    const ttOptions = testCode ? { test_event_code: testCode } : undefined;
    tt.track(eventName, params || {}, ttOptions);
    console.log(`[TikTok Pixel] Direct event tracked: ${eventName}`, params, ttOptions);
  } else {
    console.warn('[TikTok Pixel] window.ttq.track is not available yet.');
  }
}

// TikTok Advanced Matching
export function identifyTikTokUser(user: { phone?: string; email?: string; name?: string }) {
  if (typeof window === 'undefined') return;
  const tt = (window as any).ttq;
  if (tt && typeof tt.identify === 'function') {
    tt.identify({
      ...(user.phone ? { phone_number: user.phone } : {}),
      ...(user.email ? { email: user.email } : {})
    });
  }
}

