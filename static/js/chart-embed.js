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

  function attach(frame) {
    if (frame.getAttribute('data-chart-bound') === '1') return;
    frame.setAttribute('data-chart-bound', '1');
    frame.addEventListener('load', function () { watch(frame); });
    // the iframe may already be loaded by the time this runs
    var doc = null;
    try { doc = frame.contentDocument; } catch (err) { doc = null; }
    if (doc && doc.readyState === 'complete') watch(frame);
  }

  function init() {
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
    for (var i = 0; i < frames.length; i++) sizeToContent(frames[i]);
  });
})();
