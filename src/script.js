// Récupération du bouton "Dark Mode"
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Ajout d'un écouteur d'événement pour le clic sur le bouton "Dark Mode"
darkModeToggle.addEventListener('click', () => {
	// Basculement entre les classes 'dark-mode' et 'light-mode' sur l'élément body
	document.body.classList.toggle('dark-mode');
	// Changer le texte du bouton en fonction du mode
	if (document.body.classList.contains('dark-mode')) {
		darkModeToggle.textContent = 'Light mode';
	} else {
		darkModeToggle.textContent = 'Dark mode';
	}
});

