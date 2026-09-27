/* Make X embeds follow the site theme.
 *
 * widgets.js reads data-theme off the blockquote once, when it swaps it for an
 * iframe, and never looks again. So the attribute has to be set before that
 * happens, and the card has to be rebuilt from scratch when the reader flips
 * the theme toggle.
 *
 * The theme is read off the rendered background rather than a class name: this
 * theme marks an explicit choice with a class but leaves the system default
 * unmarked, so the class alone would report "light" on a dark screen.
 */
(function () {
  "use strict";

  function isDark() {
    var bg = getComputedStyle(document.body).backgroundColor;
    var parts = bg.match(/\d+/g);
    if (!parts || parts.length < 3) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    // Rec. 601 luma; anything below halfway is a dark ground.
    var luma = (0.299 * +parts[0] + 0.587 * +parts[1] + 0.114 * +parts[2]) / 255;
    return luma < 0.5;
  }

  function stamp(root) {
    var theme = isDark() ? "dark" : "light";
    var quotes = (root || document).querySelectorAll("blockquote.twitter-tweet");
    for (var i = 0; i < quotes.length; i++) {
      quotes[i].setAttribute("data-theme", theme);
    }
    return theme;
  }

  // Runs while the document is still parsing, so the blockquotes that exist
  // above this script are stamped before widgets.js can claim them.
  var current = stamp();

  function rebuild() {
    var next = isDark() ? "dark" : "light";
    if (next === current) return;
    current = next;

    var wraps = document.querySelectorAll(".x-embed");
    for (var i = 0; i < wraps.length; i++) {
      var wrap = wraps[i];
      // The original markup is kept so the card can be built again: once
      // widgets.js swaps in its iframe, the blockquote is gone.
      if (!wrap.dataset.original) {
        var quote = wrap.querySelector("blockquote.twitter-tweet");
        if (!quote) continue;
        wrap.dataset.original = quote.outerHTML;
      }
      // Hold the height so the page does not jump while the card reloads.
      wrap.style.minHeight = wrap.offsetHeight + "px";
      wrap.innerHTML = wrap.dataset.original;
    }

    stamp();
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load().then(function () {
        for (var j = 0; j < wraps.length; j++) wraps[j].style.minHeight = "";
      });
    }
  }

  function watch() {
    // Capture the original markup once the cards are in the DOM but before
    // widgets.js has replaced them.
    var wraps = document.querySelectorAll(".x-embed");
    for (var i = 0; i < wraps.length; i++) {
      var quote = wraps[i].querySelector("blockquote.twitter-tweet");
      if (quote && !wraps[i].dataset.original) {
        wraps[i].dataset.original = quote.outerHTML;
      }
    }

    var toggle = document.getElementById("theme-toggle");
    if (toggle) toggle.addEventListener("click", function () { setTimeout(rebuild, 60); });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      setTimeout(rebuild, 60);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watch);
  } else {
    watch();
  }
})();
