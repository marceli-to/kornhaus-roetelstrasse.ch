(function() {
  'use strict';

  const sections = {};
  const threshold = 300;
  let i = 0;
  let isScrollEnabled = true;

  const selectors = {
    menuItem: '.menu-item',
    section: 'section[data-section]',
  };

  // Add debounce function
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  Array.prototype.forEach.call(document.querySelectorAll(selectors.section), function(e) {
    sections[e.dataset.section] = e.offsetTop - threshold;
  });

  // Modify the handleScroll function
  const handleScroll = debounce(function() {
    if (!isScrollEnabled) return;

    var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    let activeSection = null;

    for (i in sections) {
      if (sections[i] <= scrollPosition) {
        activeSection = i;
      }
    }

    if (activeSection) {
      document.querySelectorAll(selectors.menuItem).forEach(item => {
        item.classList.toggle('is-active', item.getAttribute('href') === '/#' + activeSection);
      });
      
      // Update history state only if it's different from the current state
      if (window.location.hash !== '#' + activeSection) {
        history.replaceState(null, null, '#' + activeSection);
      }
    }
  }, 100);

  // Add click event listener to menu items
  document.querySelectorAll(selectors.menuItem).forEach(item => {
    item.addEventListener('click', function(e) {
      isScrollEnabled = false;
      
      document.querySelectorAll(selectors.menuItem).forEach(menuItem => {
        menuItem.classList.remove('is-active');
      });
      
      this.classList.add('is-active');
      
      const targetId = this.getAttribute('href').substring(2);
      history.pushState(null, null, '#' + targetId);
      
      // Re-enable scroll handling after a delay
      setTimeout(() => {
        isScrollEnabled = true;
      }, 1000);
    });
  });

  // Attach the debounced handler to the scroll event
  window.addEventListener('scroll', handleScroll);
})();