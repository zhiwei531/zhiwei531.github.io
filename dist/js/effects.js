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
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('.nav-link');
  const sidebar = document.getElementById('sidebar');

  let currentActiveId = null;
  let scrollTimeout = null;

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

        // 使用防抖延迟滚动，避免连续触发
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
          // 计算需要滚动的位置，使激活项居中
          const linkRect = activeLink.getBoundingClientRect();
          const sidebarRect = sidebar.getBoundingClientRect();
          
          const linkCenter = linkRect.top + linkRect.height / 2;
          const sidebarCenter = sidebarRect.top + sidebarRect.height / 2;
          
          const scrollOffset = linkCenter - sidebarCenter;
          
          // 使用 smooth 滚动，但只在必要时滚动
          if (Math.abs(scrollOffset) > 50) { // 只有偏移超过50px才滚动
            sidebar.scrollBy({
              top: scrollOffset,
              behavior: 'smooth'
            });
          }
        }, 150); // 150ms 防抖延迟
      });
    },
    {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    }
  );

  sections.forEach(section => observer.observe(section));
});