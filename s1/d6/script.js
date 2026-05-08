// Nav: click any link to move .is-active
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('is-active'));
    link.classList.add('is-active');
  });
});
