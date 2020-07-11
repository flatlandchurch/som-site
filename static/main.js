const toggleMenuState = (e) => {
  e.preventDefault();
  const menu = document.querySelector('.menu');
  const isOpen = menu.style.display === 'block';
  menu.style.display = isOpen ? 'none' : 'block';
};

(() => {
  document.getElementById('open-menu').addEventListener('click', toggleMenuState);
  document.getElementById('close-menu').addEventListener('click', toggleMenuState);
})();
