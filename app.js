// Initialize Lucide icons
lucide.createIcons();

// Constants
const START_DATE = new Date('2024-09-05');
let memories = [
    {
        id: 1,
        date: '2024-05-09',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7',
        description: 'Nosso primeiro encontro'
    },
    {
        id: 2,
        date: '2024-02-14',
        image: 'https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca',
        description: 'Primeiro Dia dos Namorados juntos'
    }
];

// DOM Elements
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const addMemoryBtn = document.getElementById('addMemoryBtn');
const addMemoryForm = document.getElementById('addMemoryForm');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const choosePhotoBtn = document.getElementById('choosePhotoBtn');
const cameraInput = document.getElementById('cameraInput');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const memoryDate = document.getElementById('memoryDate');
const memoryDescription = document.getElementById('memoryDescription');
const saveMemoryBtn = document.getElementById('saveMemoryBtn');
const cancelMemoryBtn = document.getElementById('cancelMemoryBtn');
const memoriesGrid = document.getElementById('memoriesGrid');

// Timer function
function updateTimer() {
    const now = new Date();
    const difference = now.getTime() - START_DATE.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 * 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// Start timer
setInterval(updateTimer, 1000);
updateTimer();

// Music toggle
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<i data-lucide="volume-2"></i>';
    } else {
        bgMusic.play();
        musicToggle.innerHTML = '<i data-lucide="volume-x"></i>';
    }
    isPlaying = !isPlaying;
    lucide.createIcons();
});

// Memory form handlers
function showAddMemoryForm() {
    addMemoryForm.classList.remove('hidden');
}

function hideAddMemoryForm() {
    addMemoryForm.classList.add('hidden');
    resetForm();
}

function resetForm() {
    memoryDate.value = '';
    memoryDescription.value = '';
    imagePreview.src = '';
    imagePreview.classList.add('hidden');
    previewPlaceholder.style.display = 'block';
    saveMemoryBtn.disabled = true;
    if (fileInput) fileInput.value = '';
    if (cameraInput) cameraInput.value = '';
}

function validateForm() {
    saveMemoryBtn.disabled = !(
        memoryDate.value &&
        memoryDescription.value &&
        imagePreview.src &&
        !imagePreview.classList.contains('hidden')
    );
}

function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target?.result;
                imagePreview.classList.remove('hidden');
                previewPlaceholder.style.display = 'none';
                validateForm();
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione apenas arquivos de imagem.');
            e.target.value = '';
        }
    }
}

// Render memories
function renderMemories() {
    memoriesGrid.innerHTML = memories
        .map(
            (memory) => `
                <div class="memory-card">
                    <img src="${memory.image}" alt="${memory.description}">
                    <div class="memory-card-content">
                        <div class="memory-date">
                            ${new Date(memory.date).toLocaleDateString('pt-BR')}
                        </div>
                        <p class="memory-description">${memory.description}</p>
                    </div>
                    <button
                        onclick="deleteMemory(${memory.id})"
                        class="delete-memory"
                        title="Excluir memória"
                    >
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `
        )
        .join('');
    lucide.createIcons();
}

// Add new memory
function addMemory() {
    const newMemory = {
        id: memories.length + 1,
        date: memoryDate.value,
        image: imagePreview.src,
        description: memoryDescription.value
    };

    memories.push(newMemory);
    renderMemories();
    hideAddMemoryForm();
}

// Delete memory
function deleteMemory(id) {
    if (confirm('Tem certeza que deseja excluir esta memória?')) {
        memories = memories.filter(memory => memory.id !== id);
        renderMemories();
    }
}

// Event listeners
addMemoryBtn.addEventListener('click', showAddMemoryForm);
cancelMemoryBtn.addEventListener('click', hideAddMemoryForm);
saveMemoryBtn.addEventListener('click', addMemory);
takePhotoBtn.addEventListener('click', () => cameraInput.click());
choosePhotoBtn.addEventListener('click', () => fileInput.click());
cameraInput.addEventListener('change', handleImageUpload);
fileInput.addEventListener('change', handleImageUpload);
memoryDate.addEventListener('input', validateForm);
memoryDescription.addEventListener('input', validateForm);

// Initial render
renderMemories();