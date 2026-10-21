(() => {
  const cards = () => [...document.querySelectorAll('.archive-card')];
  const filters = [...document.querySelectorAll('[data-work-filter]')];
  const search = document.querySelector('#project-search');
  let category = 'all';
  function filterProjects() {
    const query = (search?.value || '').trim().toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let count = 0;
    for (const card of cards()) {
      const text = card.dataset.search.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      card.hidden = !(category === 'all' || card.dataset.workCategory === category) || !text.includes(query);
      if (!card.hidden) count++;
    }
    if(!document.querySelector('#project-count'))return;
    document.querySelector('#project-count').textContent = `${count} project${count === 1 ? '' : 's'}`;
    document.querySelector('#empty-projects').hidden = count > 0;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.workFilter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    filterProjects();
  }));
  search?.addEventListener('input', filterProjects);
  document.addEventListener('portfolio:updated',filterProjects);

  const dialog = document.querySelector('.artwork-dialog');
  if (!dialog) return;
  const enlarged = dialog.querySelector('img');
  let trigger;
  document.addEventListener('click', event => {
    const button=event.target.closest('.artwork-button');if(!button)return;
    const img = button.querySelector('img');
    trigger = button;
    enlarged.src = img.currentSrc || img.src;
    enlarged.alt = img.alt;
    dialog.querySelector('#lightbox-caption').textContent = img.alt;
    dialog.showModal();
    document.body.classList.add('artwork-open');
    dialog.querySelector('.lightbox-scroll').scrollTop = 0;
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('artwork-open');
    enlarged.removeAttribute('src');
    trigger?.focus({preventScroll: true});
  });
})();
