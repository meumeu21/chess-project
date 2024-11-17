window.addEventListener("beforeunload", saveTheme);
document.addEventListener("DOMContentLoaded", loadTheme);

function saveTheme() {
  const theme = document.body.classList[1] || "default-theme";
  const selectedTheme = theme.includes("-theme") ? theme : "";
  const savedTheme = {
    theme: selectedTheme
  }
  localStorage.setItem('fenTheme', JSON.stringify(savedTheme));
}

function loadTheme() {
  const savedThemeFEN = localStorage.getItem('fenTheme');
  if (savedThemeFEN) {
    const theme = JSON.parse(savedThemeFEN);
    if (theme.theme) {
      const savedTheme = theme.theme;
      console.log(savedTheme);
      document.body.classList.remove('gray-theme', 'coral-theme', 'rose-theme', 'sunrise-theme', 'default-theme');
      document.body.classList.add(savedTheme);
    }
  }
}
