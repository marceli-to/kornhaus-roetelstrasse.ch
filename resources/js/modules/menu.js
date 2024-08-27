(function() {
  const selectors = {
    menuItem: '.menu-item',
    section: 'section[data-section]',
  };
  
  let isManualNavigation = false;
  
  // Function to update hash and menu item
  function updateHashAndMenu(sectionId) {
    if (!isManualNavigation) {
      history.replaceState(null, null, '#' + sectionId);
    }
    document.querySelectorAll(selectors.menuItem).forEach(item => {
      item.classList.toggle('is-active', item.getAttribute('href') === '#' + sectionId);
    });
  }

  // Observe hash changes
  window.addEventListener('hashchange', () => {
    const sectionId = location.hash.slice(1);
    updateHashAndMenu(sectionId);
  });

  // Handle menu item clicks
  document.querySelectorAll(selectors.menuItem).forEach(item => {
    item.addEventListener('click', (event) => {
      isManualNavigation = true;
      const sectionId = event.currentTarget.getAttribute('href').slice(1);
      updateHashAndMenu(sectionId);
      setTimeout(() => {
        isManualNavigation = false;
      }, 1000); // Reset after a short delay
    });
  });

  // Observe scrolling
  const observer = new IntersectionObserver(entries => {
    if (!isManualNavigation) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateHashAndMenu(entry.target.getAttribute('data-section'));
        }
      });
    }
  }, { threshold: 0.5 });

  const sections = document.querySelectorAll(selectors.section);
  sections.forEach((section, index) => {
    const isLastSection = index === sections.length - 1;
    const threshold = isLastSection ? 0.1 : 0.5;
    observer.observe(section, { threshold });
  });
})();