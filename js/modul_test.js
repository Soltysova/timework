// Najde element (kontejner) v HTML podle jeho ID "model"
const modelContainer = document.getElementById('model');

// Zkontroluje, zda byl element nalezen, než do něj vloží obsah
if (modelContainer) {
    // Vytvoří nový textový obsah "ahoj" a vloží ho dovnitř kontejneru
    modelContainer.textContent = 'ahoj';
    // Případně můžete vložit i HTML obsah:
    // modelContainer.innerHTML = '<h1>ahoj</h1>';
} else {
    console.error('Kontejner s ID "model" nebyl nalezen.');
}
