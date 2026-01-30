// ===== Navigation Toggle =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Navbar Background on Scroll =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 26, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 15, 26, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// ===== File Upload Functionality =====
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const previewImage = document.getElementById('previewImage');
const removeBtn = document.getElementById('removeBtn');
const resultPlaceholder = document.getElementById('resultPlaceholder');
const resultContent = document.getElementById('resultContent');

// Click to upload
uploadArea.addEventListener('click', function() {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', function(e) {
    handleFile(e.target.files[0]);
});

// Drag and drop
uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// Handle uploaded file
function handleFile(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.classList.add('active');
        
        // Simulate classification
        simulateClassification();
    };
    reader.readAsDataURL(file);
}

// Remove image
removeBtn.addEventListener('click', function() {
    previewImage.src = '';
    previewArea.classList.remove('active');
    uploadArea.style.display = 'block';
    fileInput.value = '';
    
    resultContent.classList.remove('active');
    resultPlaceholder.style.display = 'block';
});

// Simulate classification result
function simulateClassification() {
    // Show loading state
    resultPlaceholder.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Menganalisis gambar...</p>
    `;
    
    setTimeout(function() {
        // Generate random results for demo
        const types = ['Mild', 'Moderate', 'Severe'];
        const randomIndex = Math.floor(Math.random() * 3);
        const confidence = 75 + Math.random() * 20; // 75-95%
        
        // Generate probabilities
        let probabilities = [
            Math.random() * 30,
            Math.random() * 30,
            Math.random() * 30
        ];
        probabilities[randomIndex] = confidence;
        
        // Normalize to 100%
        const sum = probabilities.reduce((a, b) => a + b, 0);
        probabilities = probabilities.map(p => (p / sum) * 100);
        
        // Update result UI
        resultPlaceholder.style.display = 'none';
        resultContent.classList.add('active');
        
        document.getElementById('typeValue').textContent = types[randomIndex];
        document.getElementById('confidenceValue').textContent = probabilities[randomIndex].toFixed(1) + '%';
        document.getElementById('confidenceFill').style.width = probabilities[randomIndex] + '%';
        
        // Update probability list
        const probabilityList = document.getElementById('probabilityList');
        probabilityList.innerHTML = '';
        
        types.forEach((type, index) => {
            const item = document.createElement('div');
            item.className = 'probability-item';
            item.innerHTML = `
                <span class="probability-label">${type}</span>
                <div class="probability-bar">
                    <div class="probability-fill ${type.toLowerCase()}" style="width: ${probabilities[index]}%"></div>
                </div>
                <span class="probability-value">${probabilities[index].toFixed(1)}%</span>
            `;
            probabilityList.appendChild(item);
        });
        
    }, 2000);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .feature-item, .step, .type-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Add animate-in class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(99, 102, 241, 0.2);
        border-top-color: #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== Contact Form Handling =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    
    // Show success message (in real app, send to server)
    const submitBtn = contactForm.querySelector('button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Terkirim! ✓';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
    
    setTimeout(function() {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        contactForm.reset();
    }, 3000);
});

// ===== Neural Network Animation Enhancement =====
function animateNeuralNetwork() {
    const neurons = document.querySelectorAll('.neuron');
    let index = 0;
    
    setInterval(function() {
        neurons.forEach(n => n.classList.remove('active'));
        neurons[index % neurons.length].classList.add('active');
        index++;
    }, 500);
}

// Start neural network animation when visible
const nnObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNeuralNetwork();
            nnObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const neuralNetwork = document.querySelector('.neural-network');
if (neuralNetwork) {
    nnObserver.observe(neuralNetwork);
}

// ===== Typing Effect for Hero Title =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function update() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

// ===== Parallax Effect for Floating Shapes =====
window.addEventListener('mousemove', function(e) {
    const shapes = document.querySelectorAll('.floating-shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const moveX = (x - 0.5) * speed;
        const moveY = (y - 0.5) * speed;
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

console.log('🔬 AcneAI - Klasifikasi Jerawat menggunakan CNN');
console.log('📊 Website loaded successfully!');
