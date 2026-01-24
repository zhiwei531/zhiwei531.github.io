document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('.nav-link');

  let currentActiveId = null;
  let isAutoScrolling = false;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        if (id === currentActiveId) return;

        currentActiveId = id;

        const activeLink = document.querySelector(
          `.nav-link[href="#${id}"]`
        );
        if (!activeLink) return;

        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');

        if (isAutoScrolling) return;

        isAutoScrolling = true;

        activeLink.scrollIntoView({
          block: 'center',
          inline: 'nearest',
          behavior: 'auto'
        });

        requestAnimationFrame(() => {
          isAutoScrolling = false;
        });
      });
    },
    {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    }
  );

  sections.forEach(section => observer.observe(section));
});