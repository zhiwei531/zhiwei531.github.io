// document.addEventListener('DOMContentLoaded', () => {
//   const sections = document.querySelectorAll('main section');
//   const navLinks = document.querySelectorAll('.nav-link');

//   let currentActiveId = null;
//   let isAutoScrolling = false;

//   const observer = new IntersectionObserver(
//     entries => {
//       entries.forEach(entry => {
//         if (!entry.isIntersecting) return;

//         const id = entry.target.id;
//         if (id === currentActiveId) return;

//         currentActiveId = id;

//         const activeLink = document.querySelector(
//           `.nav-link[href="#${id}"]`
//         );
//         if (!activeLink) return;

//         navLinks.forEach(link => link.classList.remove('active'));
//         activeLink.classList.add('active');

//         if (isAutoScrolling) return;

//         isAutoScrolling = true;

//         activeLink.scrollIntoView({
//           block: 'center',
//           inline: 'nearest',
//           behavior: 'auto'
//         });

//         requestAnimationFrame(() => {
//           isAutoScrolling = false;
//         });
//       });
//     },
//     {
//       rootMargin: '-45% 0px -45% 0px',
//       threshold: 0
//     }
//   );

//   sections.forEach(section => observer.observe(section));
// });
(() => {
  let observer = null;
  let scrollTimeout = null;

  function initSidebarToggle() {
    const toggle = document.querySelector(".sidebar-toggle");
    const sidebar = document.getElementById("sidebar");

    if (!toggle || !sidebar || toggle.dataset.bound === "true") return;

    toggle.dataset.bound = "true";

    const setExpanded = (expanded) => {
      toggle.setAttribute("aria-expanded", String(expanded));
    };

    toggle.addEventListener("click", () => {
      const expanded = document.body.classList.toggle("sidebar-visible");
      setExpanded(expanded);
    });

    sidebar.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      document.body.classList.remove("sidebar-visible");
      setExpanded(false);
    });

    setExpanded(false);
  }

  function initSectionObserver() {
    const sections = document.querySelectorAll("main header.hero, main section");
    const navLinks = document.querySelectorAll(".nav-link");
    const sidebar = document.getElementById("sidebar");

    if (!sections.length || !navLinks.length || !sidebar) return;

    if (observer) {
      observer.disconnect();
    }

    let currentActiveId = null;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;
          if (!id || id === currentActiveId) return;

          currentActiveId = id;

          const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
          if (!activeLink) return;

          navLinks.forEach((link) => link.classList.remove("active"));
          activeLink.classList.add("active");

          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }

          scrollTimeout = window.setTimeout(() => {
            const linkRect = activeLink.getBoundingClientRect();
            const sidebarRect = sidebar.getBoundingClientRect();
            const linkCenter = linkRect.top + linkRect.height / 2;
            const sidebarCenter = sidebarRect.top + sidebarRect.height / 2;
            const scrollOffset = linkCenter - sidebarCenter;

            if (Math.abs(scrollOffset) > 50) {
              sidebar.scrollBy({
                top: scrollOffset,
                behavior: "smooth"
              });
            }
          }, 150);
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initPageEffects() {
    initSidebarToggle();
    initSectionObserver();
  }

  document.addEventListener("DOMContentLoaded", initSidebarToggle);
  document.addEventListener("site:rendered", initPageEffects);
})();