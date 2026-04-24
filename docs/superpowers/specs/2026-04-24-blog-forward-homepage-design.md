# EasySpain — Blog-Forward Homepage Redesign

*Date: 2026-04-24*  
*Status: Approved*

---

## Goal

Превратить главную страницу easyspain.solutions из статичной визитки в контентный хаб:
- Люди видят полезные статьи → читают → доверяют → обращаются
- Блог становится инструментом органического распространения
- Воронка (WA / TG / Instagram) остаётся активной

---

## Scope

### In scope
1. `index.html` — реструктуризация блоков, новая секция блога, новый блок соцсетей
2. Все 19 статей в `blog/*.html` — добавить Instagram в CTA-блок

### Out of scope
- `blog/index.html` — без изменений
- City pages (`barcelona.html` и др.) — без изменений
- SEO meta, Schema.org, GA4, modal форма — без изменений
- `articles-data.js` — без изменений

---

## Page Structure (index.html)

Новый порядок блоков сверху вниз (max-width: 420px сохраняется):

```
[Hero]           — avatar, name, badge, tagline, cities (компактнее на 10-15%)
[CTA]            — «Бесплатная консультация» золотая кнопка (без изменений)
─────────────────
[Blog section]   — «Читай · разбирайся · обращайся» + 4 карточки + «Все 19 статей →»
─────────────────
[Services grid]  — 2×3, без изменений
─────────────────
[Contact row]    — WA + TG (без изменений)
[Social row]     — TG канал + Instagram (новый вид, 2 кнопки)
[Footer]
```

---

## Blog Section (новый компонент)

### Заголовок секции
```
ЧИТАЙ · РАЗБИРАЙСЯ · ОБРАЩАЙСЯ
```
(section-label стиль: 10px, uppercase, #4A5570)

### 4 статьи на главной (hardcoded slugs)
Выбраны из разных категорий — показывают ширину экспертизы:

| # | Slug | Категория |
|---|------|-----------|
| 1 | `nie-tie-ispaniya` | Документы |
| 2 | `vnzh-ispaniya` | ВНЖ |
| 3 | `bank-nerezident` | Финансы |
| 4 | `autonomo-ispaniya` | Работа/Налоги |

Данные рендерятся из глобального `ARTICLES` (articles-data.js, уже подключён).

### Карточка статьи (article-card)

Структура (стопкой, не сеткой):
```html
<a class="article-card" href="/blog/{slug}.html">
  <span class="article-cat cat-{cat}">{tag}</span>
  <span class="article-title">{title}</span>
  <span class="article-meta">~{time} мин чтения</span>
</a>
```

CSS:
- Полная ширина, padding 14px 16px
- border-radius: 12px, background: #1F2638, border: 1px solid #2A3350
- Hover: border-color → #C4952A (золотой), translateX(3px)
- `.article-title`: 14px, font-weight: 600, #C8D0E0, max 2 строки (line-clamp: 2)
- `.article-meta`: 11px, #4A5570

### Цвета категорий (cat-* классы)

| cat | Цвет бейджа | Hex |
|-----|-------------|-----|
| `vnzh` | синий | `rgba(38,160,218,0.15)` / text `#26A0DA` |
| `docs` | золотой | `rgba(196,149,42,0.15)` / text `#C4952A` |
| `finance` | зелёный | `rgba(52,199,89,0.15)` / text `#34C759` |
| `work` | фиолетовый | `rgba(175,82,222,0.15)` / text `#AF52DE` |
| `life` | оранжевый | `rgba(255,149,0,0.15)` / text `#FF9500` |
| `social` | розовый | `rgba(255,45,85,0.15)` / text `#FF2D55` |

### «Все 19 статей» ссылка
```html
<a class="blog-all-link" href="/blog/">Все 19 статей →</a>
```
CSS: 13px, #7B8BA8, text-align right, hover → #C4952A

---

## Social Row (замена resource-row)

Текущий resource-row (3 иконки: Блог, Канал, Instagram) заменяется на 2 нормальные кнопки:

```html
<div class="social-row">
  <a class="social-btn tg-channel" href="https://t.me/easyspainuaru" target="_blank">
    <span class="social-icon">📢</span>
    <div class="social-inner">
      <span class="social-title">Telegram-канал</span>
      <span class="social-sub">Полезное каждый день</span>
    </div>
  </a>
  <a class="social-btn instagram" href="https://instagram.com/easyspain_solutions" target="_blank">
    <span class="social-icon">📸</span>
    <div class="social-inner">
      <span class="social-title">Instagram</span>
      <span class="social-sub">@easyspain_solutions</span>
    </div>
  </a>
</div>
```

CSS: grid 1fr 1fr, gap 8px — такой же стиль как contact-row но визуально легче (border прозрачнее, background темнее). Это «подписаться», не «написать».

---

## Instagram CTA в статьях (blog/*.html)

В каждой из 19 статей в CTA-блоке добавляется третья кнопка рядом с WA и TG:

```html
<a class="btn btn-ig" href="https://instagram.com/easyspain_solutions" target="_blank">
  <span class="btn-icon">📸</span>
  <div class="btn-inner">
    <span class="btn-title">Следи в Instagram</span>
    <span class="btn-sub-text">Новости и лайфхаки каждый день</span>
  </div>
</a>
```

CSS `.btn-ig`:
- background: #1F2638, border: 1px solid #2D3650
- color: #EDF1F8
- Hover: background #263045 (нейтральный — это охват, не конверсия)

Расположение: после TG-кнопки, до footer. Кнопки в стопку (flex-direction: column), все full-width.

---

## JavaScript (index.html)

Небольшой inline-скрипт для рендера 4 карточек из ARTICLES:

```javascript
const FEATURED = ['nie-tie-ispaniya','vnzh-ispaniya','bank-nerezident','autonomo-ispaniya'];

function renderBlogCards() {
  const container = document.getElementById('blog-cards');
  FEATURED.forEach(slug => {
    const a = ARTICLES.find(x => x.slug === slug);
    if (!a) return;
    container.innerHTML += `
      <a class="article-card" href="/blog/${a.slug}.html">
        <span class="article-cat cat-${a.cat}">${a.tag}</span>
        <span class="article-title">${a.title}</span>
        <span class="article-meta">~${a.time} мин чтения</span>
      </a>`;
  });
}
```

`articles-data.js` подключается в `<head>` перед этим скриптом.

---

## Files Changed

| Файл | Изменение |
|------|-----------|
| `index.html` | Новая секция блога, новый social-row, подключить articles-data.js |
| `blog/nie-tie-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/vnzh-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/bank-nerezident.html` | + Instagram кнопка в CTA |
| `blog/autonomo-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/temporalnaya-zashita.html` | + Instagram кнопка в CTA |
| `blog/vossoedineniye-semi-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/viza-tsifrovogo-nomada-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/padron-municipal.html` | + Instagram кнопка в CTA |
| `blog/apostil-perevod.html` | + Instagram кнопка в CTA |
| `blog/zamena-prav-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/perevod-deneg-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/neobanki-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/irpf-nalogi-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/otkryt-sl-biznes-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/meditsinskaya-strahovka-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/tarjeta-sanitaria-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/arenda-zhilya-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/pokupka-nedvizhimosti-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/shkola-deti-ispaniya.html` | + Instagram кнопка в CTA |
| `blog/socialnye-posobiya-ispaniya.html` | + Instagram кнопка в CTA |

---

## What Does NOT Change

- SEO meta tags, canonical URLs, og:image
- Schema.org LocalBusiness / Blog markup
- Google Analytics (GA4 G-8F3TB9QMLY)
- Modal lead form (весь JS + HTML)
- Services grid (6 тайлов)
- WA + TG contact-row
- `blog/index.html`
- City pages
- `articles-data.js`
- Цветовая схема: #171C28 bg, #C4952A gold, #EDF1F8 text
- max-width: 420px

---

## Success Criteria

1. На главной видны 4 статьи с категориями и временем чтения
2. Клик по карточке открывает статью
3. В каждой статье 3 CTA кнопки: WA + TG + Instagram
4. TG-канал и Instagram видны как нормальные кнопки, не иконки
5. Страница рендерится без JS-ошибок
6. Мобильный вид (375px) выглядит чисто
