/* chart-embed.js
 *
 * Sizes iframes produced by the {{< chart >}} shortcode to their content, so a
 * short chart leaves no dead space and a tall one is not clipped.
 *
 * The embedded chart is same-origin (served from /apps/), so the parent can
 * measure the document directly. No cooperation is needed from the chart page,
 * which means plain self-contained HTML charts can be dropped into
 * static/apps/ and embedded without modification.
 *
 * Lives in static/ rather than inline in the shortcode because Hugo's JS
 * minifier rewrites inline shortcode scripts and broke the element lookup.
 */
(function () {
  'use strict';

  function measure(frame) {
    var doc;
    try {
      doc = frame.contentDocument;
    } catch (err) {
      return 0; // cross-origin; keep the fallback height
    }
    if (!doc || !doc.documentElement) return 0;
    var bodyHeight = doc.body ? doc.body.scrollHeight : 0;
    return Math.max(doc.documentElement.scrollHeight, bodyHeight);
  }

  function sizeToContent(frame) {
    var height = measure(frame);
    if (!height) return;
    // Never render shorter than the height the shortcode declared. A lazy
    // iframe can be measured before its content lays out, which would
    // otherwise collapse the chart to its padding.
    var floor = parseInt(frame.getAttribute('data-min-height') || '0', 10);
    if (floor && height < floor) height = floor;
    var previous = parseInt(frame.getAttribute('data-fitted-height') || '0', 10);
    if (Math.abs(height - previous) <= 1) return;
    frame.setAttribute('data-fitted-height', String(height));
    frame.style.height = height + 'px';
  }

  function watch(frame) {
    var fit = function () { sizeToContent(frame); };
    fit();

    var doc;
    try {
      doc = frame.contentDocument;
    } catch (err) {
      return;
    }
    if (!doc || !doc.body) return;

    // charts often reflow once webfonts land
    if (doc.fonts && doc.fonts.ready && doc.fonts.ready.then) {
      doc.fonts.ready.then(fit).catch(function () {});
    }
    var win = frame.contentWindow;
    if (win && win.ResizeObserver) {
      new win.ResizeObserver(fit).observe(doc.body);
    } else {
      // no ResizeObserver: settle with a couple of delayed re-measures
      setTimeout(fit, 150);
      setTimeout(fit, 700);
    }
  }

  // Panels that scroll internally (data-fit="off") do not grow to their content.
  // Give them a height that follows the viewport, floored at the shortcode's
  // value, so a phone shows several rows instead of one.
  function sizePanel(frame) {
    var floor = parseInt(frame.getAttribute('data-min-height') || '0', 10) || 520;
    // Do not clamp to measured content: a fixed-height flex panel always
    // measures exactly as tall as the iframe, which would pin it to the floor.
    // a phone's header eats proportionally more of the panel, so give it more screen
    var share = window.innerWidth <= 560 ? 0.88 : 0.82;
    frame.style.height = Math.max(floor, Math.round(window.innerHeight * share)) + 'px';
  }

  function attach(frame) {
    if (frame.getAttribute('data-fit') === 'off') {
      if (frame.getAttribute('data-panel-bound') !== '1') {
        frame.setAttribute('data-panel-bound', '1');
        frame.addEventListener('load', function () { sizePanel(frame); });
        var d = null;
        try { d = frame.contentDocument; } catch (e) { d = null; }
        if (d && d.readyState === 'complete') sizePanel(frame);
      }
      return;
    }
    if (frame.getAttribute('data-chart-bound') === '1') return;
    frame.setAttribute('data-chart-bound', '1');
    frame.addEventListener('load', function () { watch(frame); });
    // the iframe may already be loaded by the time this runs
    var doc = null;
    try { doc = frame.contentDocument; } catch (err) { doc = null; }
    if (doc && doc.readyState === 'complete') watch(frame);
  }

  // Expand to fill the window.
  //
  // Tries the native Fullscreen API first, then falls back to pinning the
  // figure over the viewport with CSS. The fallback matters: requestFullscreen
  // needs transient user activation and rejects with "not granted" whenever it
  // does not have it, and the CSS path has no such requirement, so the button
  // always does something.
  // While expanded the figure is moved to <body>. position:fixed is relative to
  // the nearest ancestor with a transform, filter or containment, not to the
  // viewport, and the theme has one: left in place the overlay sat ~37px low.
  // A placeholder marks where to put it back.
  function setExpanded(figure, on) {
    var frame = figure.querySelector('iframe');
    var btn = figure.querySelector('.chart-fs');
    if (on) {
      var mark = document.createElement('span');
      mark.hidden = true;
      mark.className = 'chart-placeholder';
      figure.parentNode.insertBefore(mark, figure);
      figure._placeholder = mark;
      document.body.appendChild(figure);

      frame.setAttribute('data-prev-height', frame.style.height || '');
      figure.classList.add('is-expanded');
      frame.style.height = '100%';
      document.documentElement.classList.add('chart-expanded-lock');
      if (btn) { btn.textContent = 'Close'; btn.setAttribute('aria-expanded', 'true'); }
    } else {
      figure.classList.remove('is-expanded');
      document.documentElement.classList.remove('chart-expanded-lock');

      var ph = figure._placeholder;
      if (ph && ph.parentNode) {
        ph.parentNode.insertBefore(figure, ph);
        ph.parentNode.removeChild(ph);
      }
      figure._placeholder = null;

      if (frame.hasAttribute('data-prev-height')) {
        frame.style.height = frame.getAttribute('data-prev-height');
        frame.removeAttribute('data-prev-height');
      }
      if (btn) { btn.textContent = 'Expand'; btn.setAttribute('aria-expanded', 'false'); }
      if (frame.getAttribute('data-fit') === 'off') sizePanel(frame);
      else sizeToContent(frame);
    }
  }

  function wireFullscreen(figure) {
    var btn = figure.querySelector('.chart-fs');
    if (!btn || !figure.querySelector('iframe')) return;
    btn.hidden = false;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      setExpanded(figure, !figure.classList.contains('is-expanded'));
    });
  }

  // The native Fullscreen API is deliberately not used here. requestFullscreen
  // needs transient user activation, and when it does not have it Chrome either
  // throws "TypeError: not granted" or leaves the promise pending forever, so a
  // catch-based fallback never runs and the button appears dead. The CSS
  // overlay below behaves the same from the reader's point of view, works in
  // every browser, and is testable.

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var fig = document.querySelector('.chart-embed.is-expanded');
    if (fig) setExpanded(fig, false);
  });

  function init() {
    var figures = document.querySelectorAll('.chart-embed');
    for (var j = 0; j < figures.length; j++) wireFullscreen(figures[j]);
    var frames = document.querySelectorAll('.chart-embed iframe');
    for (var i = 0; i < frames.length; i++) attach(frames[i]);
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('resize', function () {
    var frames = document.querySelectorAll('.chart-embed iframe');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].getAttribute('data-fit') === 'off') sizePanel(frames[i]);
      else sizeToContent(frames[i]);
    }
  });
})();
