(function() {

  const selectors = {
    menuItem: '.menu-item',
    section: 'section[data-section]',
  };


  
  // Function to update hash and menu item
  function updateHashAndMenu(sectionId) {
    history.replaceState(null, null, '#' + sectionId);
    document.querySelectorAll(selectors.menuItem).forEach(item => {
      item.classList.toggle('is-active', item.getAttribute('href') === '#' + sectionId);
    });
  }

  // Observe hash changes
  window.addEventListener('hashchange', () => {
    const sectionId = location.hash.slice(1);
    updateHashAndMenu(sectionId);
  });

  // Observe scrolling
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateHashAndMenu(entry.target.getAttribute('data-section'));
      }
    });
  }, { threshold: 0.9 }); // Set a default threshold

  // Observe all sections with individual thresholds
  document.querySelectorAll(selectors.section).forEach(section => {
    const threshold = parseFloat(section.getAttribute('data-section-threshold')) || 0.9;
    observer.observe(section, { threshold });
  });
})();