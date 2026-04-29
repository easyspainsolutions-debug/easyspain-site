/* ============================================================
   Krepko — Централизованный GA4 event-tracker для CTA-кликов.

   Подход: делегирование через [data-cta]. На любой кнопке/ссылке
   ставится атрибут data-cta="<id>" — скрипт сам ловит клик и
   шлёт в gtag событие cta_click с параметром cta_id.

   Авто-разметка для общих компонентов: site-nav (WA + 2 TG).

   Custom dimensions в GA4 Admin (зарегистрировать вручную):
   - cta_id          (event-scoped, из event parameter)
   - cta_page        (event-scoped)
   - cta_text        (event-scoped)
   ============================================================ */

(function () {
  'use strict';

  // gtag должен быть подключён выше в <head> через GA4 snippet
  function ga(eventName, params) {
    if (typeof window.gtag !== 'function') return;
    try { window.gtag('event', eventName, params); } catch (e) {}
  }

  // ── Авто-разметка nav-кнопок (header — общий для всех страниц) ──
  function autoTagNav() {
    var navWa = document.querySelector('.site-nav__wa');
    if (navWa && !navWa.hasAttribute('data-cta')) {
      navWa.setAttribute('data-cta', 'nav-wa');
    }
    document.querySelectorAll('.site-nav__tg').forEach(function (el) {
      if (el.hasAttribute('data-cta')) return;
      var href = el.getAttribute('href') || '';
      if (href.indexOf('admin_bot') !== -1) {
        el.setAttribute('data-cta', 'nav-tg-bot');
      } else {
        el.setAttribute('data-cta', 'nav-tg-channel');
      }
    });
  }

  // ── Делегирование клика ──
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-cta]');
    if (!el) return;
    var ctaId = el.getAttribute('data-cta');
    if (!ctaId) return;
    var text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    var href = el.getAttribute('href') || '';
    ga('cta_click', {
      cta_id: ctaId,
      cta_page: location.pathname,
      cta_text: text,
      cta_href: href
    });
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoTagNav);
  } else {
    autoTagNav();
  }
})();
