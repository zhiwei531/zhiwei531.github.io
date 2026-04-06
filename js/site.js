(() => {
  const body = document.body;
  const page = body.dataset.page || "en";
  const content = document.getElementById("content");
  const sidebar = document.getElementById("sidebar");

  function createParagraphs(paragraphs = []) {
    return paragraphs
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  }

  function createMetaLines(metas = []) {
    return metas
      .map((meta) => `<div class="meta">${meta}</div>`)
      .join("");
  }

  function createStandaloneLinks(links = []) {
    return links
      .map(
        (link) =>
          `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`
      )
      .join("");
  }

  function createItems(items = []) {
    return items
      .map((item) => {
        const heading = item.headingHtml ? `<div>${item.headingHtml}</div>` : "";
        const metas = createMetaLines(item.metas);
        const paragraphs = createParagraphs(item.paragraphs);
        const links = createStandaloneLinks(item.links);

        return `
          <div class="item"${item.id ? ` id="${item.id}"` : ""}>
            ${heading}
            ${metas}
            ${paragraphs}
            ${links}
          </div>
        `;
      })
      .join("");
  }

  function createSection(section) {
    return `
      <section id="${section.id}">
        <h2>${section.title}</h2>
        ${createParagraphs(section.paragraphs)}
        ${createItems(section.items)}
      </section>
    `;
  }

  function createHero(hero) {
    const details = (hero.details || [])
      .map(
        (detail) =>
          `<p><strong>${detail.label}:</strong> ${detail.text}</p>`
      )
      .join("");

    const contacts = (hero.contacts || [])
      .map(
        (contact) =>
          `${contact.label}: <a href="${contact.href}"${
            contact.external ? ` target="_blank" rel="noopener noreferrer"` : ""
          }>${contact.text}</a>`
      )
      .join(" · ");

    return `
      <header class="hero" id="${hero.id}">
        <div class="hero-card">
          <div class="hero-top">
            <div class="hero-photo">
              <img src="${hero.photoSrc}" alt="${hero.photoAlt}" class="profile" />
            </div>

            <div class="name-block">
              <h1 class="${hero.nameClass || "name-en"}">${hero.name}</h1>
              <div class="name-sub">${hero.subtitle}</div>
            </div>
          </div>

          <div class="hero-content">
            ${createParagraphs(hero.paragraphs)}
            ${details}
            <p class="contact">${contacts}</p>
          </div>
        </div>
      </header>
    `;
  }

  function createNavItems(items = []) {
    return items
      .map((item) => {
        const children = item.children?.length
          ? `<ul class="subnav">${createNavItems(item.children)}</ul>`
          : "";

        return `
          <li>
            <a href="#${item.id}" class="${item.className || ""}">${item.label}</a>
            ${children}
          </li>
        `;
      })
      .join("");
  }

  function applyMeta(meta) {
    if (!meta) return;

    if (meta.lang) {
      document.documentElement.lang = meta.lang;
    }

    if (meta.title) {
      document.title = meta.title;
    }

    if (meta.description) {
      const description = document.querySelector('meta[name="description"]');
      if (description) {
        description.setAttribute("content", meta.description);
      }
    }

    const toggle = document.querySelector(".sidebar-toggle");
    if (toggle) {
      if (meta.sidebarToggleLabel) {
        toggle.setAttribute("aria-label", meta.sidebarToggleLabel);
      }
      if (meta.sidebarToggleText) {
        toggle.textContent = meta.sidebarToggleText;
      }
    }

    if (sidebar && meta.sidebarAriaLabel) {
      sidebar.setAttribute("aria-label", meta.sidebarAriaLabel);
    }
  }

  async function renderPage() {
    if (!content || !sidebar) return;

    try {
      const response = await fetch(`data/${page}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load data/${page}.json`);
      }

      const data = await response.json();
      applyMeta(data.meta);

      sidebar.innerHTML = `<ul>${createNavItems(data.nav)}</ul>`;
      content.innerHTML = [
        createHero(data.hero),
        ...(data.sections || []).map(createSection)
      ].join("");

      document.dispatchEvent(new CustomEvent("site:rendered"));
    } catch (error) {
      console.error(error);
      content.innerHTML =
        '<section><h2>Content unavailable</h2><p>The page data could not be loaded.</p></section>';
    }
  }

  renderPage();
})();
