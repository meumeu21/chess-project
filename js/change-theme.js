document.addEventListener('DOMContentLoaded', function () {
  const themePopup = document.getElementById('theme-popup');
  const themeOptions = document.querySelectorAll('.theme-option');
  const closePopupButton = document.getElementById('close-popup');

  themeOptions.forEach(option => {
    option.addEventListener('click', function () {
      const selectedTheme = this.getAttribute('data-theme');
      document.body.classList.remove('gray-theme', 'coral-theme', 'default-theme');
      if (selectedTheme === 'coral') {
        document.body.classList.add('coral-theme');
      }
      if (selectedTheme === 'gray') {
        document.body.classList.add('gray-theme');
      }
      themePopup.classList.remove('show');
    });
  });

  closePopupButton.addEventListener('click', function () {
    themePopup.classList.remove('show');
  });
});

document.getElementById('open-theme-popup').addEventListener('click', function () {
  const themePopup = document.getElementById('theme-popup');
  themePopup.classList.add('show');
});

document.addEventListener('DOMContentLoaded', function () {
  const savedTheme = localStorage.getItem('selectedTheme') || 'default';
  document.body.classList.add(savedTheme + '-theme');
});

