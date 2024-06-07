(function() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'night') {
        document.documentElement.classList.add('night');
        themeToggle.textContent = 'Switch to Light Mode';
    } else {
        themeToggle.textContent = 'Switch to Night Mode';
    }

    themeToggle.addEventListener('click', function () {
        document.documentElement.classList.toggle('night'); 
        
        if (document.documentElement.classList.contains('night')) {
            localStorage.setItem('theme', 'night'); 
            themeToggle.textContent = 'Switch to Light Mode';
        } else {
            localStorage.setItem('theme', 'day');
            themeToggle.textContent = 'Switch to Night Mode';
        }
    });
})();
