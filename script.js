document.addEventListener('DOMContentLoaded', () => {
    // --- UTILITIES ---
    const select = (el) => document.querySelector(el);
    const selectAll = (el) => document.querySelectorAll(el);

    // --- STATE ---
    const state = {
        introPlayed: false,
        scratchedCount: 0,
        isMusicPlaying: false,
        theme: 'day',
        currentCarouselSlide: 0
    };

    // --- INTRO VIDEO ---
    const introScreen = select('#intro-screen');
    const introVideo = select('#intro-video');
    const skipBtn = select('#skip-video');
    const mainSite = select('#main-site');
    const topNav = select('#top-nav');
    const musicBtn = select('#music-toggle');
    const bgMusic = select('#bg-music');

    const revealSite = () => {
        if (state.introPlayed) return;
        state.introPlayed = true;
        
        introScreen.style.transition = 'opacity 1s ease';
        introScreen.style.opacity = '0';
        
        setTimeout(() => {
            introScreen.classList.add('hidden');
            mainSite.classList.remove('hidden');
            topNav.classList.remove('hidden');
            musicBtn.classList.remove('hidden');

            // Trigger Hero Animations
            const coupleNames = select('.couple-names');
            coupleNames.style.transition = 'all 1s ease';
            coupleNames.style.opacity = '1';
            coupleNames.style.transform = 'translateY(0)';

            setTimeout(() => {
                select('.hero-ornament').style.opacity = '1';
                select('.hero-ornament').style.transition = 'opacity 1s ease';
            }, 500);

            // Initial Confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#C9A84C', '#C0C0C0']
            });

            // Start Floating Petals
            startPetals();

            // Attempt Music
            toggleMusic(true);
        }, 1000);
    };

    // First interaction plays video
    document.addEventListener('click', function startIntro() {
        if (state.introPlayed) return;
        
        introVideo.play().catch(e => {
            console.log("Autoplay blocked or error:", e);
            revealSite();
        });
        
        // Show skip button after 2 seconds
        setTimeout(() => skipBtn.classList.remove('hidden'), 2000);
        
        document.removeEventListener('click', startIntro);
    }, { once: true });

    introVideo.onended = revealSite;
    skipBtn.onclick = (e) => {
        e.stopPropagation();
        revealSite();
    };

    // Fallback reveal
    setTimeout(() => {
        if (!state.introPlayed) revealSite();
    }, 3500);

    // --- MUSIC TOGGLE ---
    const toggleMusic = (play) => {
        if (play) {
            bgMusic.play().then(() => {
                state.isMusicPlaying = true;
                musicBtn.classList.add('playing');
            }).catch(e => console.log("Music play error:", e));
        } else {
            bgMusic.pause();
            state.isMusicPlaying = false;
            musicBtn.classList.remove('playing');
        }
    };

    musicBtn.onclick = () => toggleMusic(!state.isMusicPlaying);

    // --- THEME TOGGLE ---
    const themeToggle = select('#theme-toggle');
    themeToggle.onclick = () => {
        const body = document.body;
        const isNight = body.classList.toggle('night-mode');
        state.theme = isNight ? 'night' : 'day';
        select('.theme-icon').textContent = isNight ? '☀️' : '🌙';
        select('.theme-label').textContent = isNight ? 'Day' : 'Night';
    };

    // --- SCRATCH CARDS ---
    const scratchCards = selectAll('.scratch-card');
    const scratchReveal = select('#reveal-after-scratch');
    const countdownSection = select('#countdown');

    scratchCards.forEach(card => {
        const canvas = card.querySelector('.scratch-canvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX, lastY;

        // Init Canvas
        const initCanvas = () => {
            canvas.width = card.offsetWidth;
            canvas.height = card.offsetHeight;

            // Gold Shimmer Gradient
            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, '#C9A84C');
            grad.addColorStop(0.5, '#FFD700');
            grad.addColorStop(1, '#C9A84C');

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'destination-out';
        };

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const scratch = (x, y) => {
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.fill();
            checkProgress();
        };

        const checkProgress = () => {
            if (card.dataset.completed === 'true') return;
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let transparent = 0;
            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] === 0) transparent++;
            }
            const percent = (transparent / (pixels.length / 4)) * 100;
            if (percent > 60) {
                card.dataset.completed = 'true';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                state.scratchedCount++;
                if (state.scratchedCount === 3) {
                    revealDate();
                }
            }
        };

        canvas.addEventListener('mousedown', (e) => { isDrawing = true; const p = getPos(e); scratch(p.x, p.y); });
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const p = getPos(e);
            scratch(p.x, p.y);
        });
        window.addEventListener('mouseup', () => isDrawing = false);

        canvas.addEventListener('touchstart', (e) => { isDrawing = true; const p = getPos(e); scratch(p.x, p.y); });
        canvas.addEventListener('touchmove', (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const p = getPos(e);
            scratch(p.x, p.y);
        });
        window.addEventListener('touchend', () => isDrawing = false);

        // Delay initialization until visible
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initCanvas();
                    obs.unobserve(canvas);
                }
            });
        });
        obs.observe(canvas);
    });

    const revealDate = () => {
        scratchReveal.classList.remove('hidden');

        // Sustainable Confetti
        const end = Date.now() + (5 * 1000);
        const colors = ['#FFD700', '#C9A84C', '#C0C0C0'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Reveal Countdown
        setTimeout(() => {
            countdownSection.classList.remove('hidden');
            countdownSection.scrollIntoView({ behavior: 'smooth' });
            startCountdown();
        }, 2000);
    };

    // --- ADD TO CALENDAR ---
    const calendarBtn = select('#add-to-calendar');
    calendarBtn.onclick = (e) => {
        e.preventDefault();
        const details = {
            text: 'Holy Matrimony: Ijeoma & Kenechi',
            dates: '20260725T080000Z/20260725T140000Z', // 9AM WAT is 8AM UTC
            location: 'Catholic Church of the Transfiguration, VGC, Lagos, Nigeria',
            details: 'Join us for the Holy Matrimony of Ijeoma and Kenechi.'
        };
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(details.text)}&dates=${details.dates}&details=${encodeURIComponent(details.details)}&location=${encodeURIComponent(details.location)}`;
        window.open(url, '_blank');
    };

    // --- COUNTDOWN TIMER ---
    const startCountdown = () => {
        const weddingDate = new Date('July 25, 2026 09:00:00').getTime();
        
        const update = () => {
            const now = new Date().getTime();
            const diff = weddingDate - now;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            select('#days').textContent = String(days).padStart(2, '0');
            select('#hours').textContent = String(hours).padStart(2, '0');
            select('#minutes').textContent = String(mins).padStart(2, '0');
            select('#seconds').textContent = String(secs).padStart(2, '0');
        };

        setInterval(update, 1000);
        update();
    };

    // --- CAROUSEL ---
    const track = select('#carousel-slots');
    const slides = selectAll('.carousel-slide');
    const nextBtn = select('.carousel-nav.next');
    const prevBtn = select('.carousel-nav.prev');
    const dotsNav = select('.carousel-dots');

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(i));
        dotsNav.appendChild(dot);
    });

    const moveToSlide = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        state.currentCarouselSlide = index;
        selectAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    nextBtn.onclick = () => {
        let index = (state.currentCarouselSlide + 1) % slides.length;
        moveToSlide(index);
    };

    prevBtn.onclick = () => {
        let index = (state.currentCarouselSlide - 1 + slides.length) % slides.length;
        moveToSlide(index);
    };

    // Auto play
    let carouselInterval = setInterval(() => nextBtn.click(), 4000);
    select('#moments-carousel').onmouseenter = () => clearInterval(carouselInterval);
    select('#moments-carousel').onmouseleave = () => carouselInterval = setInterval(() => nextBtn.click(), 4000);

    // --- RSVP FORM ---
    const rsvpForm = select('#rsvp-form');
    const rsvpSuccess = select('#rsvp-success');
    const venueMap = select('#venue-map');

    rsvpForm.onsubmit = async (e) => {
        e.preventDefault();
        
        const name = select('#guest-name').value;
        const phone = select('#guest-phone').value;

        if (!name || !phone) {
            rsvpForm.classList.add('shake');
            setTimeout(() => rsvpForm.classList.remove('shake'), 500);
            return;
        }

        // Netlify submission
        const formData = new FormData(rsvpForm);
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
        .then(() => {
            rsvpForm.classList.add('hidden');
            rsvpSuccess.classList.remove('hidden');

            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#C9A84C', '#C0C0C0']
            });

            setTimeout(() => {
                venueMap.classList.remove('hidden');
                venueMap.scrollIntoView({ behavior: 'smooth' });
            }, 600);
        })
        .catch((error) => alert(error));
    };

    // --- PHOTO UPLOADS & LOCALSTORAGE ---
    const handleFileUpload = (input, previewContainer, storageKey) => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;

                    // Update UI
                    previewContainer.innerHTML = `<img src="${dataUrl}" style="width:100%; height:100%; object-fit:cover;">`;

                    // Persist (Try/Catch for QuotaExceededError)
                    try {
                        localStorage.setItem(storageKey, dataUrl);
                    } catch (e) {
                        console.warn("Local storage full, could not save image.");
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        previewContainer.addEventListener('click', () => input.click());
    };

    // Load Persisted Images
    const loadPersisted = () => {
        // Carousel
        selectAll('.carousel-slide').forEach((slide, i) => {
            const input = slide.querySelector('.file-input');
            const key = `carousel_${i}`;
            handleFileUpload(input, slide, key);

            const saved = localStorage.getItem(key);
            if (saved) slide.innerHTML = `<img src="${saved}" style="width:100%; height:100%; object-fit:cover;">`;
        });

        // Gallery
        selectAll('.gallery-slot').forEach((slot, i) => {
            const input = slot.querySelector('.file-input');
            const key = `gallery_${i}`;
            handleFileUpload(input, slot, key);

            const saved = localStorage.getItem(key);
            if (saved) slot.innerHTML = `<img src="${saved}" style="width:100%; height:100%; object-fit:cover;">`;

            slot.addEventListener('click', (e) => {
                if (slot.querySelector('img')) {
                    e.stopPropagation();
                    openLightbox(slot.querySelector('img').src);
                }
            });
        });

        // Final Thank You
        const finalSlot = select('.final-image-slot');
        const finalInput = finalSlot.querySelector('.file-input');
        handleFileUpload(finalInput, finalSlot, 'final_thankyou');
        const savedFinal = localStorage.getItem('final_thankyou');
        if (savedFinal) finalSlot.innerHTML = `<img src="${savedFinal}" style="width:100%; height:100%; object-fit:cover;">`;
    };

    loadPersisted();

    // --- LIGHTBOX ---
    const lightbox = select('#lightbox');
    const lightboxImg = select('.lightbox-img');
    const closeLightbox = select('.close-lightbox');

    const openLightbox = (src) => {
        lightboxImg.src = src;
        lightbox.classList.remove('hidden');
    };

    closeLightbox.onclick = () => lightbox.classList.add('hidden');
    lightbox.onclick = (e) => { if (e.target === lightbox) lightbox.classList.add('hidden'); };

    // --- FLOATING PETALS ---
    const startPetals = () => {
        const createPetal = () => {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.innerHTML = '✦';
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.fontSize = (Math.random() * 10 + 10) + 'px';
            petal.style.opacity = Math.random();
            petal.style.transition = `transform ${Math.random() * 5 + 5}s linear, top ${Math.random() * 5 + 5}s linear`;

            document.body.appendChild(petal);

            setTimeout(() => {
                petal.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 100 - 50}px)`;
                petal.style.top = '110vh';
            }, 10);

            setTimeout(() => petal.remove(), 10000);
        };

        setInterval(createPetal, 500);
    };

    // --- SCROLL ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    selectAll('section, .gallery-slot, .form-section').forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });
});
