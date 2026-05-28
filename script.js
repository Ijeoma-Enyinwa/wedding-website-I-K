// Wedding Date Configuration
const WEDDING_DATE = new Date('July 25, 2026 09:00:00').getTime();

// DOM Elements
const introOverlay = document.getElementById('intro-overlay');
const introVideo = document.getElementById('intro-video');
const mainContent = document.getElementById('main-content');
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('background-music');
const themeToggle = document.getElementById('theme-toggle');
const rsvpForm = document.getElementById('rsvp-form');
const mapContainer = document.getElementById('map-container');
const mapMessage = document.getElementById('map-message');
const scratchCanvas = document.getElementById('scratch-canvas');
const confettiContainer = document.getElementById('confetti-container');

let isMusicPlaying = false;
let isDayTheme = true;
let isFormSubmitted = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeIntro();
    initializeCountdown();
    initializeScratchCard();
    initializeThemeToggle();
    initializeMusicToggle();
    initializeForm();
    initializeScrollAnimations();
});

// Intro Video Handler
function initializeIntro() {
    introOverlay.addEventListener('click', () => {
        // Play video
        introVideo.play().catch(error => {
            console.log('Video play error:', error);
            // If video fails, just fade out overlay
            fadeOutOverlay();
        });
        
        // Hide tap hint
        const tapHint = document.querySelector('.tap-hint');
        if (tapHint) {
            tapHint.style.display = 'none';
        }
        
        // Wait for video to end or timeout
        introVideo.onended = () => {
            fadeOutOverlay();
        };
        
        // Fallback: if video is very short or doesn't exist
        setTimeout(() => {
            if (!introOverlay.classList.contains('fade-out')) {
                fadeOutOverlay();
            }
        }, 5000);
    });
}

function fadeOutOverlay() {
    introOverlay.classList.add('fade-out');
    
    setTimeout(() => {
        introOverlay.style.display = 'none';
        mainContent.classList.remove('hidden');
        
        // Start confetti celebration
        startConfetti();
        
        // Auto-play music if user interacted
        if (isMusicPlaying) {
            backgroundMusic.play().catch(e => console.log('Audio autoplay blocked'));
        }
    }, 1000);
}

// Countdown Timer
function initializeCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = WEDDING_DATE - now;
        
        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Scratch Card Functionality
function initializeScratchCard() {
    const ctx = scratchCanvas.getContext('2d');
    const container = scratchCanvas.parentElement;
    let isDrawing = false;
    let isRevealed = false;
    
    // Set canvas size
    function resizeCanvas() {
        scratchCanvas.width = container.offsetWidth;
        scratchCanvas.height = container.offsetHeight;
        drawScratchCover();
    }
    
    function drawScratchCover() {
        // Create gold shimmer effect with hearts
        const gradient = ctx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.25, '#FFA500');
        gradient.addColorStop(0.5, '#FFD700');
        gradient.addColorStop(0.75, '#FFA500');
        gradient.addColorStop(1, '#FFD700');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        
        // Add heart patterns
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * scratchCanvas.width;
            const y = Math.random() * scratchCanvas.height;
            const size = Math.random() * 20 + 10;
            drawHeart(x, y, size);
        }
        
        // Add shimmer text
        ctx.font = 'bold 24px Lato';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText('Scratch Here!', scratchCanvas.width / 2, scratchCanvas.height / 2);
    }
    
    function drawHeart(x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y - size / 2);
        ctx.bezierCurveTo(x, y - size, x - size, y - size, x - size, y - size / 2);
        ctx.bezierCurveTo(x - size, y, x, y + size, x, y + size * 1.5);
        ctx.bezierCurveTo(x, y + size, x + size, y, x + size, y - size / 2);
        ctx.bezierCurveTo(x + size, y - size, x, y - size, x, y - size / 2);
        ctx.fill();
    }
    
    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function checkRevealPercentage() {
        if (isRevealed) return;
        
        const imageData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }
        
        const percentage = (transparentPixels / (pixels.length / 4)) * 100;
        
        if (percentage > 40) {
            isRevealed = true;
            scratchCanvas.style.transition = 'opacity 1s ease';
            scratchCanvas.style.opacity = '0';
            setTimeout(() => {
                scratchCanvas.style.display = 'none';
            }, 1000);
        }
    }
    
    // Mouse events
    scratchCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = scratchCanvas.getBoundingClientRect();
        scratch(e.clientX - rect.left, e.clientY - rect.top);
    });
    
    scratchCanvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const rect = scratchCanvas.getBoundingClientRect();
        scratch(e.clientX - rect.left, e.clientY - rect.top);
        checkRevealPercentage();
    });
    
    scratchCanvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
    
    scratchCanvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });
    
    // Touch events
    scratchCanvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        e.preventDefault();
        const rect = scratchCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    });
    
    scratchCanvas.addEventListener('touchmove', (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const rect = scratchCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        scratch(touch.clientX - rect.left, touch.clientY - rect.top);
        checkRevealPercentage();
    });
    
    scratchCanvas.addEventListener('touchend', () => {
        isDrawing = false;
    });
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

// Theme Toggle (Day/Night)
function initializeThemeToggle() {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('night-theme');
        isDayTheme = !isDayTheme;
        
        const icon = themeToggle.querySelector('i');
        if (isDayTheme) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Music Toggle
function initializeMusicToggle() {
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicToggle.classList.remove('playing');
        } else {
            backgroundMusic.play().catch(e => console.log('Audio play error:', e));
            musicToggle.classList.add('playing');
        }
        isMusicPlaying = !isMusicPlaying;
    });
}

// RSVP Form Handler
function initializeForm() {
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(rsvpForm);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission (you can replace with actual API call)
        console.log('RSVP Data:', data);
        
        // Show success message
        alert('Thank you for your RSVP! We look forward to celebrating with you!');
        
        // Reset form
        rsvpForm.reset();
        
        // Reveal map
        revealMap();
        
        // Trigger confetti
        startConfetti();
    });
}

function revealMap() {
    isFormSubmitted = true;
    mapMessage.style.display = 'none';
    mapContainer.classList.remove('hidden');
    
    // Initialize Google Maps
    initMap();
}

// Google Maps Integration
function initMap() {
    // Venue coordinates (Catholic Church of Transfiguration VGC, Lagos)
    const venueLocation = { lat: 6.4474, lng: 3.5878 }; // Approximate coordinates for VGC Lagos
    
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: venueLocation,
        styles: [
            {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    const marker = new google.maps.Marker({
        position: venueLocation,
        map: map,
        title: 'Catholic Church of Transfiguration VGC'
    });
    
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px;">
                <h3 style="color: #CC5500; margin-bottom: 5px;">Catholic Church of Transfiguration</h3>
                <p style="margin: 0;">VGC, Lagos, Nigeria</p>
                <p style="margin: 5px 0 0 0;"><strong>Time:</strong> 9:00 AM</p>
            </div>
        `
    });
    
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Confetti Effect
function startConfetti() {
    const colors = ['#FFD700', '#C0C0C0']; // Gold and Silver
    
    for (let i = 0; i < 100; i++) {
        createConfetti(colors);
    }
}

function createConfetti(colors) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    
    // Random color
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Random position
    confetti.style.left = Math.random() * 100 + 'vw';
    
    // Random animation duration
    const duration = Math.random() * 3 + 2;
    confetti.style.animationDuration = duration + 's';
    
    // Random delay
    confetti.style.animationDelay = Math.random() * 2 + 's';
    
    // Random size
    const size = Math.random() * 10 + 5;
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    
    // Add silver class randomly
    if (Math.random() > 0.5) {
        confetti.classList.add('silver');
    }
    
    confettiContainer.appendChild(confetti);
    
    // Remove after animation
    setTimeout(() => {
        confetti.remove();
    }, (duration + 2) * 1000);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Handle Google Maps API callback
window.initMap = initMap;
