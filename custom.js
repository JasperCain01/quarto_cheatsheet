<script>
// Two small conveniences for a long single-page reference:
//   1. a filter box above the table of contents ("/" to focus)
//   2. a back-to-top button once you have scrolled past the first screen
document.addEventListener("DOMContentLoaded", function () {
  var toc = document.querySelector("nav#TOC");

  if (toc) {
    var box = document.createElement("input");
    box.type = "search";
    box.className = "toc-filter";
    box.id = "toc-filter";
    box.placeholder = "Filter sections  ( / )";
    box.setAttribute("aria-label", "Filter the table of contents");

    var heading = toc.querySelector("h2, h3, .toc-title, #toc-title");
    if (heading && heading.nextSibling) {
      toc.insertBefore(box, heading.nextSibling);
    } else {
      toc.insertBefore(box, toc.firstChild);
    }

    var empty = document.createElement("div");
    empty.className = "toc-filter-empty";
    empty.textContent = "No matching sections.";
    empty.style.display = "none";
    box.insertAdjacentElement("afterend", empty);

    var items = Array.prototype.slice.call(toc.querySelectorAll("li"));

    box.addEventListener("input", function () {
      var q = box.value.trim().toLowerCase();
      var hits = 0;

      items.forEach(function (li) {
        li.style.display = "";
      });

      if (!q) {
        empty.style.display = "none";
        return;
      }

      items.forEach(function (li) {
        var link = li.querySelector(":scope > a");
        var text = link ? link.textContent.toLowerCase() : "";
        li.dataset.tocHit = text.indexOf(q) !== -1 ? "1" : "0";
      });

      items.forEach(function (li) {
        var self = li.dataset.tocHit === "1";
        var child = li.querySelector('li[data-toc-hit="1"]') !== null;
        var parent = li.parentElement
          ? li.parentElement.closest('li[data-toc-hit="1"]')
          : null;
        var keep = self || child || parent !== null;
        li.style.display = keep ? "" : "none";
        if (self) hits += 1;
      });

      empty.style.display = hits === 0 ? "" : "none";
    });

    document.addEventListener("keydown", function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(
        (document.activeElement || {}).tagName || ""
      );
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        box.focus();
        box.select();
      }
      if (e.key === "Escape" && document.activeElement === box) {
        box.value = "";
        box.dispatchEvent(new Event("input"));
        box.blur();
      }
    });
  }

  var top = document.createElement("button");
  top.id = "back-to-top";
  top.type = "button";
  top.textContent = "↑ Top";
  top.setAttribute("aria-label", "Back to top of page");
  top.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.appendChild(top);

  var onScroll = function () {
    top.classList.toggle("visible", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
</script>
