document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // 0. Preloader
    // =============================================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3 seconds
    setTimeout(() => {
        if (preloader) preloader.classList.add('hidden');
    }, 3000);

    // =============================================
    // 1. Sticky Navbar & Scroll Styling
    // =============================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // =============================================
    // 2. Mobile Menu Toggle (Drawer Samping HP)
    // =============================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const mobileNavClose = document.getElementById('mobileNavClose');

    function updateHamburgerIcon(isOpen) {
        if (!hamburger) return;
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        }
    }

    function openMenu() {
        if (!navLinks) return;
        navLinks.classList.add('active');
        if (hamburger) hamburger.classList.add('active');
        updateHamburgerIcon(true);
        document.body.classList.add('mobile-drawer-open');
    }

    function closeMenu() {
        if (!navLinks) return;
        navLinks.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        updateHamburgerIcon(false);
        document.body.classList.remove('mobile-drawer-open');
    }

    function toggleMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (navLinks && navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (hamburger && navLinks) {
        // Mendukung click dan touchstart tanpa blocking
        hamburger.addEventListener('click', toggleMenu);

        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMenu();
            });
        }

        // Tutup menu otomatis saat link navigasi di-klik
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Tutup menu jika user mengetuk di luar drawer (tanpa butuh overlay yang menghalangi layar)
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                    closeMenu();
                }
            }
        });

        // Tutup dengan tombol Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // =============================================
    // 3. Active Nav Link on Scroll
    // =============================================
    const sections = document.querySelectorAll('section[id], header[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function setActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNav);

    // =============================================
    // 4. Scroll Reveal Animation (Bidirectional Arc Entrance)
    // Masuk dari kiri melengkung ke atas (Scroll Turun & Scroll Naik)
    // =============================================
    const reveals = document.querySelectorAll('.reveal');

    // Sinkronkan inline transition-delay menjadi animation-delay agar stagger tetap berjalan mulus
    reveals.forEach(el => {
        if (el.style.transitionDelay) {
            el.style.animationDelay = el.style.transitionDelay;
        }
    });

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    // Ketika elemen keluar dari pandangan layar (baik lewat atas atau lewat bawah),
                    // lepaskan class active agar animasi lengkung dari kiri berulang saat di-scroll kembali
                    entry.target.classList.remove('active');
                }
            });
        }, {
            root: null,
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback untuk browser lama
        function handleScrollReveal() {
            const windowHeight = window.innerHeight;
            reveals.forEach(el => {
                const rect = el.getBoundingClientRect();
                const inView = (rect.top <= windowHeight - 60) && (rect.bottom >= 60);
                if (inView) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
        }
        window.addEventListener('scroll', handleScrollReveal, { passive: true });
        handleScrollReveal();
    }

    // Schedule items animation (aktif dua arah saat scroll naik/turun)
    const scheduleItems = document.querySelectorAll('.schedule-item');
    if (scheduleItems.length > 0) {
        if ('IntersectionObserver' in window) {
            const scheduleObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, (index % 4) * 90);
                    } else {
                        entry.target.classList.remove('visible');
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

            scheduleItems.forEach(item => scheduleObserver.observe(item));
        } else {
            function handleScheduleScroll() {
                const windowHeight = window.innerHeight;
                scheduleItems.forEach((item, index) => {
                    const rect = item.getBoundingClientRect();
                    if (rect.top < windowHeight - 60 && rect.bottom > 60) {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 90);
                    } else {
                        item.classList.remove('visible');
                    }
                });
            }
            window.addEventListener('scroll', handleScheduleScroll, { passive: true });
            handleScheduleScroll();
        }
    }

    // =============================================
    // 5. Number Counter Animation for Stats
    // =============================================
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // =============================================
    // 5B. SPMB Slot & Quota Counter Animation (SD 75, SMP 20, SMK 20)
    // Runs every time user enters the section ("setiap masuk bertambah angka 1 sampai terisi")
    // =============================================
    const quotaCard = document.getElementById('heroQuotaCard');
    if (quotaCard) {
        const quotaCounters = quotaCard.querySelectorAll('.quota-counter');
        const progressBars = quotaCard.querySelectorAll('.quota-progress-bar');
        const animFrameMap = new Map();

        function animateQuotaNumber(element, target, duration = 1600) {
            if (animFrameMap.has(element)) {
                cancelAnimationFrame(animFrameMap.get(element));
            }

            const startTime = performance.now();
            const startVal = 1;

            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic: fast initial rise, smooth settle at final target
                const ease = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.round(startVal + (target - startVal) * ease);

                element.textContent = currentVal;

                if (progress < 1) {
                    const frameId = requestAnimationFrame(step);
                    animFrameMap.set(element, frameId);
                } else {
                    element.textContent = target;
                    animFrameMap.delete(element);
                }
            }

            const frameId = requestAnimationFrame(step);
            animFrameMap.set(element, frameId);
        }

        function resetQuotaAnimation() {
            quotaCounters.forEach(counter => {
                if (animFrameMap.has(counter)) {
                    cancelAnimationFrame(animFrameMap.get(counter));
                    animFrameMap.delete(counter);
                }
                counter.textContent = '1';
            });
            progressBars.forEach(bar => {
                bar.style.width = '0%';
            });
            quotaCard.classList.remove('quota-animated');
        }

        function startQuotaAnimation() {
            quotaCard.classList.add('quota-animated');
            // Give a slight 180ms delay so card arc reveal settles first
            setTimeout(() => {
                quotaCounters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
                    animateQuotaNumber(counter, target, 1600);
                });
                progressBars.forEach(bar => {
                    const fill = bar.getAttribute('data-fill') || '100%';
                    bar.style.width = fill;
                });
            }, 180);
        }

        const quotaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startQuotaAnimation();
                } else {
                    resetQuotaAnimation();
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        quotaObserver.observe(quotaCard);
    }

    // =============================================
    // 6. Back to Top Button
    // =============================================
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============================================
    // 7. Gallery Filter & Horizontal Auto-Moving Slider
    // =============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryTrack = document.getElementById('gallerySliderTrack');
    const galleryPrevBtn = document.getElementById('galleryPrevBtn');
    const galleryNextBtn = document.getElementById('galleryNextBtn');

    let galleryAutoInterval = null;
    let galleryScrollDirection = 1; // 1 = kanan, -1 = kiri
    let isGalleryInteracting = false;

    // Filter Kategori Galeri
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.4s ease both';
                } else {
                    item.classList.add('hidden');
                }
            });

            // Reset scroll posisi awal secara halus saat filter berganti
            if (galleryTrack) {
                galleryTrack.scrollTo({ left: 0, behavior: 'smooth' });
                galleryScrollDirection = 1;
            }
        });
    });

    // Otomatis Bergerak ke Kiri & Kanan (Auto-Moving Slider Lebih Smooth)
    function autoMoveGallery() {
        if (!galleryTrack || isGalleryInteracting) return;
        const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
        if (maxScroll <= 5) return;

        const firstItem = galleryTrack.querySelector('.gallery-item:not(.hidden)');
        const step = firstItem ? firstItem.offsetWidth + 20 : 330;

        if (galleryScrollDirection === 1) {
            // Bergerak ke kanan
            const nextLeft = galleryTrack.scrollLeft + step;
            if (nextLeft >= maxScroll - 12) {
                galleryTrack.scrollTo({ left: maxScroll, behavior: 'smooth' });
                galleryScrollDirection = -1; // Balik arah ke kiri
            } else {
                galleryTrack.scrollTo({ left: nextLeft, behavior: 'smooth' });
            }
        } else {
            // Bergerak ke kiri
            const prevLeft = galleryTrack.scrollLeft - step;
            if (prevLeft <= 12) {
                galleryTrack.scrollTo({ left: 0, behavior: 'smooth' });
                galleryScrollDirection = 1; // Balik arah ke kanan
            } else {
                galleryTrack.scrollTo({ left: prevLeft, behavior: 'smooth' });
            }
        }
    }

    function startGalleryAutoMove() {
        if (galleryAutoInterval) clearInterval(galleryAutoInterval);
        galleryAutoInterval = setInterval(autoMoveGallery, 3000);
    }

    function stopGalleryAutoMove() {
        if (galleryAutoInterval) clearInterval(galleryAutoInterval);
    }

    // Tombol Panah Navigasi Manual Galeri
    if (galleryPrevBtn && galleryTrack) {
        galleryPrevBtn.addEventListener('click', () => {
            const firstItem = galleryTrack.querySelector('.gallery-item:not(.hidden)');
            const step = firstItem ? firstItem.offsetWidth + 20 : 330;
            const targetLeft = Math.max(0, galleryTrack.scrollLeft - step);
            galleryTrack.scrollTo({ left: targetLeft, behavior: 'smooth' });
            galleryScrollDirection = -1;
            stopGalleryAutoMove();
            startGalleryAutoMove();
        });
    }

    if (galleryNextBtn && galleryTrack) {
        galleryNextBtn.addEventListener('click', () => {
            const firstItem = galleryTrack.querySelector('.gallery-item:not(.hidden)');
            const step = firstItem ? firstItem.offsetWidth + 20 : 330;
            const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
            const targetLeft = Math.min(maxScroll, galleryTrack.scrollLeft + step);
            galleryTrack.scrollTo({ left: targetLeft, behavior: 'smooth' });
            galleryScrollDirection = 1;
            stopGalleryAutoMove();
            startGalleryAutoMove();
        });
    }

    // Jeda otomatis saat kursor mouse di atas slider atau layar disentuh
    if (galleryTrack) {
        galleryTrack.addEventListener('mouseenter', () => { isGalleryInteracting = true; });
        galleryTrack.addEventListener('mouseleave', () => { isGalleryInteracting = false; });
        galleryTrack.addEventListener('touchstart', () => { isGalleryInteracting = true; }, { passive: true });
        galleryTrack.addEventListener('touchend', () => { 
            setTimeout(() => { isGalleryInteracting = false; }, 2000); 
        }, { passive: true });

        // Mouse Drag Support untuk Laptop/Desktop
        let isDown = false;
        let startX, scrollLeftVal;

        galleryTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            isGalleryInteracting = true;
            galleryTrack.classList.add('grabbing');
            startX = e.pageX - galleryTrack.offsetLeft;
            scrollLeftVal = galleryTrack.scrollLeft;
        });

        document.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                if (galleryTrack) galleryTrack.classList.remove('grabbing');
                setTimeout(() => { isGalleryInteracting = false; }, 2000);
            }
        });

        galleryTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - galleryTrack.offsetLeft;
            const walk = (x - startX) * 1.5;
            galleryTrack.scrollLeft = scrollLeftVal - walk;
        });

        startGalleryAutoMove();
    }

    // =============================================
    // 8. Testimonial Slider & Dynamic Management
    // =============================================
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    let currentSlide = 0;
    let autoSlideInterval = null;

    // Active Panitia session restore
    window.activePanitia = sessionStorage.getItem('attamam_active_panitia') || null;
    const modBtn = document.getElementById('btnOpenModerationModal');
    const modBtnLabel = document.getElementById('modBtnLabel');
    if (window.activePanitia) {
        if (modBtn) modBtn.classList.add('active-session');
        if (modBtnLabel) modBtnLabel.textContent = `Panel Moderasi (${window.activePanitia})`;
    }

    // Default Testimonials
    const DEFAULT_TESTIMONIALS = [
        {
            id: 'default-1',
            name: 'Bapak Ahmad Fauzan',
            role: 'Orang tua siswa SD (Paket A)',
            rating: 5,
            text: "Alhamdulillah, anak saya berkembang sangat baik di At-Tamam. Tidak hanya hafalan Qur'an yang bertambah, tapi juga adab dan akhlaknya jauh lebih baik. Saya sangat bersyukur memilih sekolah ini.",
            isDefault: true,
            date: '15 Agustus 2026'
        },
        {
            id: 'default-2',
            name: 'Bapak Muhammad Rizki',
            role: 'Orang tua siswa SMP (Paket B)',
            rating: 5,
            text: "Kurikulum yang menyeimbangkan ilmu agama dan umum menjadi alasan utama saya memilih At-Tamam. Anak saya jadi semangat belajar dan sudah hafal 3 juz dalam waktu 2 tahun. Masya Allah.",
            isDefault: true,
            date: '2 September 2026'
        },
        {
            id: 'default-3',
            name: 'Bapak Hendra Wijaya',
            role: 'Orang tua siswa SMK (Paket C)',
            rating: 4.8,
            text: "Sekolah dengan biaya terjangkau tapi kualitas luar biasa. Ustadz-ustadznya kompeten dan sabar dalam membimbing anak-anak. Fasilitas ekskul seperti panahan dan karate juga sangat baik.",
            isDefault: true,
            date: '20 September 2026'
        }
    ];

    // Helper: Escape HTML to prevent XSS
    function escapeHtmlText(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Helper: Generate star HTML for cards
    function generateStarsHtml(rating) {
        let stars = '';
        const numRating = Math.round(Number(rating) || 5);
        for (let i = 1; i <= 5; i++) {
            if (i <= numRating) {
                stars += '<i class="fa-solid fa-star"></i>';
            } else {
                stars += '<i class="fa-regular fa-star"></i>';
            }
        }
        return stars;
    }

    // Storage access
    window.getDeletedIds = function() {
        try {
            return JSON.parse(localStorage.getItem('attamam_deleted_testimonials') || '[]');
        } catch (e) {
            return [];
        }
    };

    window.getCustomTestimonials = function() {
        try {
            return JSON.parse(localStorage.getItem('attamam_custom_testimonials') || '[]');
        } catch (e) {
            return [];
        }
    };

    window.getAllActiveTestimonials = function() {
        const deletedIds = window.getDeletedIds();
        const activeDefaults = DEFAULT_TESTIMONIALS.filter(item => !deletedIds.includes(item.id));
        const activeCustoms = window.getCustomTestimonials().filter(item => !deletedIds.includes(item.id));
        return [...activeDefaults, ...activeCustoms];
    };

    // Create Testimonial Card element
    function createTestimonialCard(item) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.setAttribute('data-id', item.id);
        const ratingVal = Number(item.rating) || 5;
        const formattedScore = ratingVal.toFixed(1);
        const starsHtml = generateStarsHtml(ratingVal);

        // Quick delete button if Panitia is logged in
        const quickDeleteBtn = window.activePanitia
            ? `<button type="button" class="btn-card-quick-delete" onclick="handleDeleteTestimonial('${item.id}', '${escapeHtmlText(item.name)}')" title="Hapus testimoni ini (${window.activePanitia})">
                   <i class="fa-solid fa-trash"></i> Hapus
               </button>`
            : '';

        card.innerHTML = `
            ${quickDeleteBtn}
            <div class="testimonial-card-header">
                <div class="testimonial-quote"><i class="fa-solid fa-quote-left"></i></div>
                <div class="testimonial-rating">
                    <div class="rating-stars">${starsHtml}</div>
                    <span class="rating-score">${formattedScore}</span>
                </div>
            </div>
            <p class="testimonial-text">${escapeHtmlText(item.text)}</p>
            <div class="testimonial-author">
                <div class="author-avatar"><i class="fa-solid fa-user"></i></div>
                <div>
                    <h5>${escapeHtmlText(item.name)}</h5>
                    <span>${escapeHtmlText(item.role)}</span>
                </div>
            </div>
        `;
        return card;
    }

    function getSlidesCount() {
        if (!track) return 0;
        return track.querySelectorAll('.testimonial-card').length;
    }

    function renderDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const total = getSlidesCount();
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = `dot ${i === currentSlide ? 'active' : ''}`;
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', `Testimoni ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        const total = getSlidesCount();
        if (total === 0) return;
        currentSlide = (index + total) % total;
        if (track) {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }
    }

    function autoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            const total = getSlidesCount();
            if (total > 1) {
                goToSlide((currentSlide + 1) % total);
            }
        }, 5500);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlide();
    }

    // Render all active testimonials to slider
    window.renderSliderTestimonials = function(targetIndex) {
        if (!track) return;
        track.innerHTML = '';
        const allItems = window.getAllActiveTestimonials();
        
        if (allItems.length === 0) {
            track.innerHTML = `
                <div class="testimonial-card text-center" style="padding: 50px 20px;">
                    <i class="fa-solid fa-comments" style="font-size: 40px; color: var(--accent); margin-bottom: 15px; opacity: 0.6;"></i>
                    <h4 style="color: white; margin-bottom: 8px;">Belum Ada Testimoni Aktif</h4>
                    <p style="color: rgba(255,255,255,0.7); font-size: 14px;">Silakan tulis ulasan pertama Anda atau klik tombol Panitia untuk mereset testimoni awal.</p>
                </div>
            `;
            if (dotsContainer) dotsContainer.innerHTML = '';
            return;
        }

        allItems.forEach(item => {
            track.appendChild(createTestimonialCard(item));
        });

        renderDots();
        const total = getSlidesCount();
        const indexToGo = (typeof targetIndex === 'number') 
            ? Math.min(targetIndex, total - 1) 
            : Math.min(currentSlide, total - 1);
        goToSlide(Math.max(0, indexToGo));
        resetAutoSlide();
    };

    // Initial render
    window.renderSliderTestimonials(0);

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            const total = getSlidesCount();
            if (Math.abs(diff) > 50 && total > 0) {
                if (diff > 0 && currentSlide < total - 1) {
                    goToSlide(currentSlide + 1);
                } else if (diff < 0 && currentSlide > 0) {
                    goToSlide(currentSlide - 1);
                }
                resetAutoSlide();
            }
        }, { passive: true });
    }

    // Expose slider controls to window
    window.refreshTestimonialSlider = function(targetIndex) {
        window.renderSliderTestimonials(targetIndex);
    };

    window.addTestimonialToDOM = function(item) {
        const totalBefore = getSlidesCount();
        window.renderSliderTestimonials(totalBefore);
    };

    // =============================================
    // Star Rating Picker Interactive Logic
    // =============================================
    const starsPicker = document.getElementById('starsPicker');
    const testiRatingInput = document.getElementById('testiRating');
    const ratingLabelText = document.getElementById('ratingLabelText');

    const ratingDescriptions = {
        1: '1.0 • Kurang Memuaskan',
        2: '2.0 • Cukup / Perlu Ditingkatkan',
        3: '3.0 • Baik',
        4: '4.0 • Sangat Baik & Direkomendasikan',
        5: '5.0 • Sangat Memuaskan & Luar Biasa'
    };

    function updateStarDisplay(val) {
        if (!starsPicker) return;
        const stars = starsPicker.querySelectorAll('i');
        stars.forEach((star, idx) => {
            if (idx < val) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        if (ratingLabelText) {
            ratingLabelText.textContent = ratingDescriptions[val] || `${val}.0 • Sangat Memuaskan`;
        }
    }

    if (starsPicker) {
        const starIcons = starsPicker.querySelectorAll('i');
        starIcons.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const hoverVal = parseInt(star.getAttribute('data-rating')) || 5;
                updateStarDisplay(hoverVal);
            });

            star.addEventListener('click', () => {
                const selectedVal = parseInt(star.getAttribute('data-rating')) || 5;
                if (testiRatingInput) testiRatingInput.value = selectedVal;
                updateStarDisplay(selectedVal);
            });
        });

        starsPicker.addEventListener('mouseleave', () => {
            const currentVal = parseInt(testiRatingInput ? testiRatingInput.value : 5) || 5;
            updateStarDisplay(currentVal);
        });
    }

    // Testimonial modal backdrop & Escape handling
    const testimonialModal = document.getElementById('testimonialModal');
    if (testimonialModal) {
        testimonialModal.addEventListener('click', (e) => {
            if (e.target === testimonialModal) {
                closeTestimonialModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && testimonialModal.classList.contains('active')) {
                closeTestimonialModal();
            }
        });
    }

    // =============================================
    // 9. Mobile Section Tabs (Biaya & Brosur)
    // =============================================
    function initMobileSectionTabs(containerId, cardSelector) {
        const tabsContainer = document.getElementById(containerId);
        if (!tabsContainer) return;

        const tabButtons = tabsContainer.querySelectorAll('.sec-tab-btn');
        const cards = document.querySelectorAll(cardSelector);

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetJenjang = btn.getAttribute('data-tab-target');
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                cards.forEach(card => {
                    if (card.getAttribute('data-jenjang') === targetJenjang) {
                        card.classList.add('mobile-active');
                    } else {
                        card.classList.remove('mobile-active');
                    }
                });
            });
        });
    }

    initMobileSectionTabs('mobilePricingTabs', '.pricing-grid .pricing-card');

    // =============================================
    // 9A. Brosur SPMB Horizontal Slider & Animasi (Laptop & HP)
    // =============================================
    const brochureTrack = document.getElementById('brochuresSliderTrack');
    const brochurePrevBtn = document.getElementById('brochurePrevBtn');
    const brochureNextBtn = document.getElementById('brochureNextBtn');
    const brochureDots = document.querySelectorAll('.brochure-dot');
    const brochureCards = document.querySelectorAll('.brochures-slider-track .brochure-card');

    let currentBrochureIndex = 0;
    let isBrochureInteracting = false;
    let brochureAutoInterval = null;
    let brochureScrollDirection = 1; // 1 = kanan, -1 = kiri

    function goToBrochure(index, smooth = true) {
        if (!brochureCards.length || !brochureTrack) return;
        if (index < 0) index = 0;
        if (index >= brochureCards.length) index = brochureCards.length - 1;

        currentBrochureIndex = index;

        // Hitung posisi tepat kartu tunggal (tampil satu per satu secara presisi)
        const trackWidth = brochureTrack.clientWidth;
        const targetScrollLeft = index * trackWidth;

        brochureTrack.scrollTo({
            left: targetScrollLeft,
            behavior: smooth ? 'smooth' : 'auto'
        });

        // Update status aktif pada tombol dot
        brochureDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });

        // Update status aktif & animasi glow pada kartu
        brochureCards.forEach((card, idx) => {
            card.classList.toggle('active-slide', idx === index);
        });
    }

    // Navigasi lewat Tombol Panah Kiri & Kanan
    if (brochurePrevBtn) {
        brochurePrevBtn.addEventListener('click', () => {
            const newIdx = currentBrochureIndex > 0 ? currentBrochureIndex - 1 : brochureCards.length - 1;
            goToBrochure(newIdx);
            resetBrochureAutoSlide();
        });
    }

    if (brochureNextBtn) {
        brochureNextBtn.addEventListener('click', () => {
            const newIdx = currentBrochureIndex < brochureCards.length - 1 ? currentBrochureIndex + 1 : 0;
            goToBrochure(newIdx);
            resetBrochureAutoSlide();
        });
    }

    // Navigasi lewat Klik Dots (SD, SMP, SMK)
    brochureDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'), 10) || 0;
            goToBrochure(idx);
            resetBrochureAutoSlide();
        });
    });

    // Deteksi Scroll Manual (Swipe di HP atau Drag Mouse di Laptop)
    if (brochureTrack) {
        let brochureScrollDebounce = null;
        brochureTrack.addEventListener('scroll', () => {
            if (brochureScrollDebounce) clearTimeout(brochureScrollDebounce);
            brochureScrollDebounce = setTimeout(() => {
                const trackWidth = brochureTrack.clientWidth || 1;
                const closestIndex = Math.round(brochureTrack.scrollLeft / trackWidth);
                const clampedIndex = Math.max(0, Math.min(brochureCards.length - 1, closestIndex));

                if (clampedIndex !== currentBrochureIndex) {
                    currentBrochureIndex = clampedIndex;
                    brochureDots.forEach((dot, idx) => {
                        dot.classList.toggle('active', idx === clampedIndex);
                    });
                    brochureCards.forEach((card, idx) => {
                        card.classList.toggle('active-slide', idx === clampedIndex);
                    });
                }
            }, 50);
        }, { passive: true });

        // Auto-Slide Otomatis Berganti Setiap 5 Detik (Bisa di-pause saat kursor di atasnya)
        function autoMoveBrochures() {
            if (!brochureTrack || isBrochureInteracting) return;
            if (brochureCards.length <= 1) return;

            if (brochureScrollDirection === 1) {
                if (currentBrochureIndex >= brochureCards.length - 1) {
                    brochureScrollDirection = -1;
                    goToBrochure(currentBrochureIndex - 1);
                } else {
                    goToBrochure(currentBrochureIndex + 1);
                }
            } else {
                if (currentBrochureIndex <= 0) {
                    brochureScrollDirection = 1;
                    goToBrochure(currentBrochureIndex + 1);
                } else {
                    goToBrochure(currentBrochureIndex - 1);
                }
            }
        }

        function startBrochureAutoMove() {
            if (brochureAutoInterval) clearInterval(brochureAutoInterval);
            brochureAutoInterval = setInterval(autoMoveBrochures, 5000);
        }

        function resetBrochureAutoSlide() {
            if (brochureAutoInterval) clearInterval(brochureAutoInterval);
            startBrochureAutoMove();
        }

        // Jeda otomatis saat disentuh (HP) atau di-hover kursor (Laptop/PC)
        brochureTrack.addEventListener('mouseenter', () => { isBrochureInteracting = true; });
        brochureTrack.addEventListener('mouseleave', () => { isBrochureInteracting = false; });
        brochureTrack.addEventListener('touchstart', () => { isBrochureInteracting = true; }, { passive: true });
        brochureTrack.addEventListener('touchend', () => {
            setTimeout(() => { isBrochureInteracting = false; }, 2500);
        }, { passive: true });

        // Mouse Drag Support untuk Laptop & Desktop
        let isBrochureDown = false;
        let brochureStartX, brochureScrollStart;

        brochureTrack.addEventListener('mousedown', (e) => {
            isBrochureDown = true;
            isBrochureInteracting = true;
            brochureTrack.classList.add('grabbing');
            brochureStartX = e.pageX - brochureTrack.offsetLeft;
            brochureScrollStart = brochureTrack.scrollLeft;
        });

        document.addEventListener('mouseup', () => {
            if (isBrochureDown) {
                isBrochureDown = false;
                if (brochureTrack) brochureTrack.classList.remove('grabbing');
                setTimeout(() => { isBrochureInteracting = false; }, 2000);
            }
        });

        brochureTrack.addEventListener('mousemove', (e) => {
            if (!isBrochureDown) return;
            e.preventDefault();
            const x = e.pageX - brochureTrack.offsetLeft;
            const walk = (x - brochureStartX) * 1.5;
            brochureTrack.scrollLeft = brochureScrollStart - walk;
        });

        // Jalankan auto-slide awal untuk brosur
        startBrochureAutoMove();
    }

    // =============================================
    // 9B. Smooth Scroll for all anchor links
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href === '#!') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                // Offset penyesuaian untuk sticky navbar di HP & Desktop
                const isMobile = window.innerWidth <= 768;
                const offset = isMobile ? 70 : 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // =============================================
    // 10. Floating WhatsApp Multi-Contact Widget
    // =============================================
    const waTriggerBtn = document.getElementById('waTriggerBtn');
    const waPopup = document.getElementById('waPopup');
    const waPopupClose = document.getElementById('waPopupClose');
    const waTooltip = document.getElementById('waTooltip');
    const waWidget = document.getElementById('waWidget');
    const waTopCallout = document.getElementById('waTopCallout');
    const faqTriggerBtn = document.getElementById('faqTriggerBtn');
    let waCalloutDismissed = false;
    let waCalloutAutoTimer = null;
    let waPopupAutoTimer = null;

    // Sembunyikan tooltip kecil saat callout pesan panitia aktif di atas WA
    if (waTopCallout && waTooltip) {
        waTooltip.classList.add('hidden');
    }

    // Fungsi timer 5 detik untuk sembunyikan pop up callout WA
    function startWaCalloutTimer() {
        if (waCalloutAutoTimer) clearTimeout(waCalloutAutoTimer);
        waCalloutAutoTimer = setTimeout(() => {
            if (!waCalloutDismissed && waTopCallout && !waTopCallout.classList.contains('hidden')) {
                closeWaCallout();
            }
        }, 5000);
    }

    // Jalankan hitung mundur 5 detik sembunyikan notice pop up WA
    startWaCalloutTimer();

    // Fungsi tutup floating notice di atas logo WA
    window.closeWaCallout = function (e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (waCalloutAutoTimer) clearTimeout(waCalloutAutoTimer);
        waCalloutDismissed = true;
        if (waTopCallout) {
            waTopCallout.classList.add('hidden');
        }
        if (waTooltip && (!waPopup || !waPopup.classList.contains('show'))) {
            waTooltip.classList.remove('hidden');
        }
    };

    // Fungsi timer 5 detik untuk auto-hide popup dialog kontak WA
    function startWaPopupTimer() {
        if (waPopupAutoTimer) clearTimeout(waPopupAutoTimer);
        waPopupAutoTimer = setTimeout(() => {
            if (waPopup && waPopup.classList.contains('show')) {
                closeWaPopup();
            }
        }, 5000);
    }

    function toggleWaPopup() {
        if (!waPopup) return;
        const isOpen = waPopup.classList.contains('show');
        if (isOpen) {
            closeWaPopup();
        } else {
            openWaPopup();
        }
    }

    function openWaPopup() {
        if (!waPopup || !waTriggerBtn) return;
        waPopup.classList.add('show');
        waPopup.setAttribute('aria-hidden', 'false');
        waTriggerBtn.classList.add('active');
        waTriggerBtn.setAttribute('aria-expanded', 'true');
        if (waTooltip) {
            waTooltip.classList.add('hidden');
        }
        if (waTopCallout) {
            waTopCallout.classList.add('hidden');
        }
        if (faqTriggerBtn) {
            faqTriggerBtn.classList.add('hidden');
        }
        // Auto-hide popup kontak setelah 5 detik
        startWaPopupTimer();
    }
    window.openWaPopup = openWaPopup;

    function closeWaPopup() {
        if (!waPopup || !waTriggerBtn) return;
        if (waPopupAutoTimer) clearTimeout(waPopupAutoTimer);
        waPopup.classList.remove('show');
        waPopup.setAttribute('aria-hidden', 'true');
        waTriggerBtn.classList.remove('active');
        waTriggerBtn.setAttribute('aria-expanded', 'false');
        if (waTopCallout && !waCalloutDismissed) {
            waTopCallout.classList.remove('hidden');
        } else if (waTooltip && waCalloutDismissed) {
            waTooltip.classList.remove('hidden');
        }
        if (faqTriggerBtn) {
            faqTriggerBtn.classList.remove('hidden');
        }
    }
    window.closeWaPopup = closeWaPopup;

    if (waTopCallout) {
        waTopCallout.addEventListener('click', (e) => {
            if (e.target.closest('.wa-callout-close')) return;
            openWaPopup();
        });
        // Jeda timer 5 detik saat kursor mengarah ke callout, lanjutkan saat kursor pergi
        waTopCallout.addEventListener('mouseenter', () => {
            if (waCalloutAutoTimer) clearTimeout(waCalloutAutoTimer);
        });
        waTopCallout.addEventListener('mouseleave', () => {
            if (!waCalloutDismissed) startWaCalloutTimer();
        });
    }

    if (waTriggerBtn && waPopup) {
        waTriggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWaPopup();
        });

        if (waPopupClose) {
            waPopupClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeWaPopup();
            });
        }

        if (waTooltip) {
            waTooltip.addEventListener('click', (e) => {
                e.stopPropagation();
                openWaPopup();
            });
        }

        // Jeda auto-hide popup jika kursor sedang di dalam kotak kontak
        waPopup.addEventListener('mouseenter', () => {
            if (waPopupAutoTimer) clearTimeout(waPopupAutoTimer);
        });
        waPopup.addEventListener('mouseleave', () => {
            if (waPopup.classList.contains('show')) startWaPopupTimer();
        });
        waPopup.addEventListener('touchstart', () => {
            if (waPopupAutoTimer) clearTimeout(waPopupAutoTimer);
        }, { passive: true });

        // Close on clicking outside widget
        document.addEventListener('click', (e) => {
            if (waWidget && !waWidget.contains(e.target)) {
                closeWaPopup();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && waPopup.classList.contains('show')) {
                closeWaPopup();
            }
        });

        // =============================================
        // 10.1 Mode Jam Kerja & Mode Offline (Lewat Pk 17.00 WIB)
        // =============================================
        function checkBusinessHours() {
            const now = new Date();
            const hour = now.getHours();
            const min = now.getMinutes();
            // Mode offline aktif jika lewat jam 17:00 (17:00 - 07:30)
            const isOffline = (hour >= 17 || hour < 7 || (hour === 7 && min < 30));

            const statusIndicator = document.getElementById('waStatusIndicator');
            const statusText = document.getElementById('waStatusText');
            const offlineBanner = document.getElementById('waOfflineBanner');
            const calloutDesc = document.getElementById('waCalloutDesc');
            const calloutTag = document.getElementById('waCalloutTag');
            const tooltipSpan = document.querySelector('#waTooltip span');
            const actionBadges = document.querySelectorAll('.wa-action-badge');

            if (isOffline) {
                if (statusIndicator) statusIndicator.classList.add('offline');
                if (statusText) statusText.textContent = 'Mode Offline • Dibalas Besok';
                if (offlineBanner) offlineBanner.style.display = 'flex';
                if (calloutDesc) {
                    calloutDesc.innerHTML = 'Layanan chat saat ini <strong>mode offline</strong> (lewat pk 17.00 WIB). Bapak/Ibu <strong>tetap bisa mengirim chat sekarang</strong>, <em>insya Allah akan dibalas besok ya Bapak/Ibu</em>.';
                }
                if (calloutTag) {
                    calloutTag.innerHTML = '<i class="fa-solid fa-moon"></i> Mode Offline • Tetap Bisa Chat';
                }
                if (tooltipSpan) {
                    tooltipSpan.textContent = 'Mode Offline (Tetap Bisa Chat)';
                }
                actionBadges.forEach(badge => {
                    badge.classList.add('badge-offline');
                    badge.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Chat (Offline)';
                });
            } else {
                if (statusIndicator) statusIndicator.classList.remove('offline');
                if (statusText) statusText.textContent = 'Online • Siap Membantu';
                if (offlineBanner) offlineBanner.style.display = 'none';
                if (calloutDesc) {
                    calloutDesc.textContent = 'Silahkan hubungi tim panitia untuk menjawab pertanyaan seputar SPMB AtTamam putra lebih lanjut.';
                }
                if (calloutTag) {
                    calloutTag.innerHTML = '<i class="fa-solid fa-headset"></i> Layanan Panitia SPMB';
                }
                if (tooltipSpan) {
                    tooltipSpan.textContent = 'Tanya Panitia SPMB';
                }
                actionBadges.forEach(badge => {
                    badge.classList.remove('badge-offline');
                    badge.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Chat';
                });
            }
        }

        checkBusinessHours();
        // Cek berkala status jam operasional setiap 1 menit
        setInterval(checkBusinessHours, 60000);
    }

    // Event Klik Floating FAQ: Smooth Scroll ke section #faq dan buka pertanyaan pertama
    if (faqTriggerBtn) {
        faqTriggerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const faqSection = document.getElementById('faq');
            if (faqSection) {
                const offset = 80;
                const top = faqSection.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });

                // Buka pertanyaan pertama jika belum terbuka
                const firstFaq = faqSection.querySelector('.faq-item');
                if (firstFaq && !firstFaq.classList.contains('open')) {
                    firstFaq.classList.add('open');
                }
            }
        });
    }

    // =============================================
    // 11. SPMB Registration Lock, Countdown & Modal
    // Target Opening: 19 Oktober 2026 00:00:00 WIB
    // =============================================
    const SPMB_OPEN_DATE = new Date('2026-10-19T00:00:00');
    const spmbModal = document.getElementById('spmbModal');
    const spmbModalClose = document.getElementById('spmbModalClose');
    const btnModalDismiss = document.getElementById('btnModalDismiss');
    const btnModalWa = document.getElementById('btnModalWa');
    const spmbButtons = document.querySelectorAll('.spmb-btn');

    function isSpmbOpen() {
        return new Date() >= SPMB_OPEN_DATE;
    }

    function openSpmbModal() {
        if (!spmbModal) return;
        spmbModal.classList.add('active');
        spmbModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeSpmbModal() {
        if (!spmbModal) return;
        spmbModal.classList.remove('active');
        spmbModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Intercept all SPMB registration buttons when locked
    spmbButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!isSpmbOpen()) {
                e.preventDefault();
                openSpmbModal();
            }
        });
    });

    if (spmbModalClose) {
        spmbModalClose.addEventListener('click', closeSpmbModal);
    }

    if (btnModalDismiss) {
        btnModalDismiss.addEventListener('click', closeSpmbModal);
    }

    // Connect modal WA button to our WA multi-contact widget
    if (btnModalWa) {
        btnModalWa.addEventListener('click', () => {
            closeSpmbModal();
            setTimeout(() => {
                if (typeof openWaPopup === 'function') {
                    openWaPopup();
                } else {
                    window.open('https://wa.me/6282174425677?text=Assalamu%27alaikum%20Ustadz%2C%20saya%20bermaksud%20ingin%20konsultasi%20pendaftaran%20di%20PKBM%20Tahfizh%20At-Tamam%20Putra%20Unit%20Padat%20Karya.%20Mohon%20arahan%20dan%20informasinya%20mengenai%20pendaftaran%20serta%20kegiatan%20belajar%20di%20At-Tamam%20Padat%20Karya%20ya%20Ustadz.%20Jazakallahu%20khairan.', '_blank');
                }
            }, 300);
        });
    }

    // Close on clicking outside modal card or pressing ESC
    if (spmbModal) {
        spmbModal.addEventListener('click', (e) => {
            if (e.target === spmbModal) {
                closeSpmbModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && spmbModal && spmbModal.classList.contains('active')) {
            closeSpmbModal();
        }
    });

    // Real-time Countdown Timer updater
    function updateSpmbCountdown() {
        const now = new Date();
        const diff = SPMB_OPEN_DATE - now;

        if (diff <= 0) {
            // Registration is Officially OPEN!
            const cdBox = document.getElementById('spmbCountdownBox');
            if (cdBox) {
                const title = document.getElementById('cdTitle');
                const desc = document.getElementById('cdDesc');
                const pill = document.getElementById('cdStatusPill');
                if (title) title.textContent = 'Alhamdulillah, Pendaftaran SPMB Telah Dibuka!';
                if (desc) desc.textContent = 'Silakan klik tombol di bawah untuk mengisi formulir pendaftaran online resmi.';
                if (pill) {
                    pill.innerHTML = '<i class="fa-solid fa-lock-open"></i> Pendaftaran Resmi Dibuka';
                    pill.style.background = 'rgba(74, 222, 128, 0.2)';
                    pill.style.color = '#4ade80';
                    pill.style.borderColor = 'rgba(74, 222, 128, 0.4)';
                }
                const timerEl = document.getElementById('spmbCountdownTimer');
                if (timerEl) timerEl.style.display = 'none';
            }

            // Remove lock icon from buttons
            document.querySelectorAll('.spmb-lock-icon').forEach(icon => {
                icon.className = 'fa-solid fa-arrow-right';
            });

            // Update hero badge
            const heroBadge = document.getElementById('heroSpmbBadge');
            if (heroBadge) {
                heroBadge.innerHTML = '<i class="fa-solid fa-graduation-cap"></i> SPMB 2027/2028 • Pendaftaran Dibuka!';
            }

            // Update hero countdown pill
            const heroCdPill = document.getElementById('heroCountdownPill');
            if (heroCdPill) {
                heroCdPill.innerHTML = '<span class="hero-cd-badge" style="color: #4ade80;"><i class="fa-solid fa-lock-open"></i> Pendaftaran Resmi Dibuka!</span>';
                heroCdPill.style.borderColor = 'rgba(74, 222, 128, 0.45)';
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const pad = (n) => String(n).padStart(2, '0');

        // Modal Timer Elements
        const mCdDays = document.getElementById('modalCdDays');
        const mCdHours = document.getElementById('modalCdHours');
        const mCdMinutes = document.getElementById('modalCdMinutes');
        const mCdSeconds = document.getElementById('modalCdSeconds');
        if (mCdDays) mCdDays.textContent = pad(days);
        if (mCdHours) mCdHours.textContent = pad(hours);
        if (mCdMinutes) mCdMinutes.textContent = pad(minutes);
        if (mCdSeconds) mCdSeconds.textContent = pad(seconds);

        // Hero Mini Timer Elements
        const hCdDays = document.getElementById('heroCdDays');
        const hCdHours = document.getElementById('heroCdHours');
        const hCdMinutes = document.getElementById('heroCdMinutes');
        const hCdSeconds = document.getElementById('heroCdSeconds');
        if (hCdDays) hCdDays.textContent = pad(days);
        if (hCdHours) hCdHours.textContent = pad(hours);
        if (hCdMinutes) hCdMinutes.textContent = pad(minutes);
        if (hCdSeconds) hCdSeconds.textContent = pad(seconds);
    }

    updateSpmbCountdown();
    setInterval(updateSpmbCountdown, 1000);

    // =============================================
    // 7. About Section Interactive Profile Tabs
    // =============================================
    const aboutTabBtns = document.querySelectorAll('.about-tab-btn');
    const aboutTabPanels = document.querySelectorAll('.about-tab-panel');

    if (aboutTabBtns.length > 0) {
        aboutTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-about-target');
                if (!targetId) return;

                aboutTabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                aboutTabPanels.forEach(p => {
                    p.classList.remove('active');
                });

                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // =============================================
    // 8. SPMB Materi Tes Per Jenjang Tabs (SD, SMP, SMK)
    // =============================================
    const materiTabBtns = document.querySelectorAll('.materi-tab-btn');
    const materiPanes = document.querySelectorAll('.materi-pane');

    if (materiTabBtns.length > 0) {
        materiTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-materi-target');
                if (!targetId) return;

                // Reset status semua tombol tab
                materiTabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });

                // Reset status semua panel konten materi
                materiPanes.forEach(pane => {
                    pane.classList.remove('active');
                });

                // Aktifkan tab yang dipilih
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                // Tampilkan panel konten materi yang sesuai dengan animasi
                const targetPane = document.getElementById(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }
});

// =============================================
// GLOBAL FUNCTIONS (called from HTML onclick)
// =============================================

// --- FAQ Accordion ---
function toggleFaq(element) {
    const faqItem = element.closest('.faq-item');
    const isOpen = faqItem.classList.contains('open');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
    });

    // Toggle current
    if (!isOpen) {
        faqItem.classList.add('open');
    }
}

// --- Gallery Lightbox ---
let lightboxIndex = 0;
let lightboxImages = [];

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const img = element.querySelector('img');
    const caption = element.querySelector('h4') ? element.querySelector('h4').textContent : '';
    
    // Collect all visible gallery items
    lightboxImages = [];
    document.querySelectorAll('.gallery-item:not(.hidden)').forEach((item, idx) => {
        lightboxImages.push({
            src: item.querySelector('img').src,
            caption: item.querySelector('h4') ? item.querySelector('h4').textContent : ''
        });
        if (item === element) lightboxIndex = idx;
    });

    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    lightboxIndex += direction;
    if (lightboxIndex < 0) lightboxIndex = lightboxImages.length - 1;
    if (lightboxIndex >= lightboxImages.length) lightboxIndex = 0;
    updateLightbox();
}

function updateLightbox() {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    if (lightboxImages[lightboxIndex]) {
        lightboxImg.src = lightboxImages[lightboxIndex].src;
        lightboxCaption.textContent = lightboxImages[lightboxIndex].caption;
    }
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// Close lightbox clicking outside image
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) closeLightbox();
});

// =============================================
// TESTIMONIAL MODAL & SUBMISSION HANDLERS
// =============================================
function openTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const nameInput = document.getElementById('testiName');
            if (nameInput) nameInput.focus();
        }, 150);
    }
}

function closeTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// =============================================
// BAD WORDS FILTER (KATA KOTOR & TIDAK PANTAS)
// =============================================
const FORBIDDEN_WORDS = [
    // Hewan/makian kasar
    'anjing', 'ajg', 'anjir', 'anjrit', 'asw', 'asu', 'babi', 'bb', 'celeng', 'monyet', 'kunyuk',
    // Alat kelamin/asusila/kotor
    'kontol', 'kntl', 'memek', 'mmk', 'jembut', 'pepek', 'pantek', 'itil', 'peli', 'tetek', 'toket', 'tete',
    'ngentot', 'entot', 'ngewe', 'ewe', 'bokep', 'porn', 'porno', 'lendir', 'sange', 'lonte', 'perek', 'pelacur',
    'jablay', 'pukimak', 'kimak', 'cabul', 'mesum', 'vagina', 'penis',
    // Umpatan/cacian kasar
    'bangsat', 'bgst', 'bajingan', 'brengsek', 'kampret', 'bangke', 'tai', 'taik', 'tahi', 'sialan', 'bedebah',
    'biadab', 'keparat', 'goblok', 'gblk', 'tolol', 'tll', 'bodoh', 'idiot', 'bego', 'dungu', 'pekok',
    'jancuk', 'jancok', 'dancok', 'setan', 'iblis', 'dajjal', 'laknat',
    // Fitnah & tuduhan jahat
    'penipu', 'nipu', 'scam', 'scammer', 'haram jadah'
];

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function detectInappropriateContent(str) {
    if (!str) return { detected: false, words: [] };
    const lower = str.toLowerCase();
    
    // Normalisasi leetspeak/variasi huruf
    const normalized = lower
        .replace(/0/g, 'o')
        .replace(/1/g, 'i')
        .replace(/3/g, 'e')
        .replace(/4/g, 'a')
        .replace(/5/g, 's')
        .replace(/7/g, 't')
        .replace(/@/g, 'a')
        .replace(/\$/g, 's')
        .replace(/!/g, 'i');

    const cleanTokens = normalized.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    const compact = normalized.replace(/[^a-z0-9]/g, '');

    const detected = [];

    FORBIDDEN_WORDS.forEach(word => {
        const regex = new RegExp(`(^|\\s)${word}(\\s|$)`, 'i');
        if (cleanTokens.includes(word) || regex.test(normalized)) {
            if (!detected.includes(word)) detected.push(word);
        } else if (word.length >= 4 && compact.includes(word)) {
            if (!detected.includes(word)) detected.push(word);
        }
    });

    return {
        detected: detected.length > 0,
        words: detected
    };
}

function handleTestimonialSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const nameInput = document.getElementById('testiName');
    const roleInput = document.getElementById('testiRole');
    const ratingInput = document.getElementById('testiRating');
    const textInput = document.getElementById('testiText');

    const name = nameInput ? nameInput.value.trim() : '';
    const role = roleInput ? roleInput.value : 'Orang tua siswa';
    const rating = ratingInput ? parseInt(ratingInput.value) || 5 : 5;
    const text = textInput ? textInput.value.trim() : '';

    if (!name || !text) {
        alert('Mohon lengkapi nama dan ulasan testimoni Bapak / Ibu.');
        return;
    }

    // Deteksi Kata Kotor & Tidak Baik
    const badCheckName = detectInappropriateContent(name);
    const badCheckText = detectInappropriateContent(text);

    if (badCheckName.detected || badCheckText.detected) {
        const foundWords = [...badCheckName.words, ...badCheckText.words].join(', ');
        alert(
            '[Pemberitahuan Adab] Afwan Bapak / Ibu, sistem mendeteksi adanya kata-kata yang kurang pantas.\n\n' +
            'Kata yang terdeteksi: "' + foundWords + '"\n\n' +
            'Mohon gunakan kata-kata yang santun, adab islami yang baik, dan saling membangun. Testimoni tidak dapat dikirimkan.'
        );
        if (textInput) {
            textInput.style.borderColor = '#ef4444';
            textInput.focus();
        }
        return;
    }

    const newTestimonial = {
        id: 'custom-' + Date.now(),
        name,
        role,
        rating,
        text,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    // Save to localStorage
    try {
        const raw = localStorage.getItem('attamam_custom_testimonials');
        const list = raw ? JSON.parse(raw) : [];
        list.push(newTestimonial);
        localStorage.setItem('attamam_custom_testimonials', JSON.stringify(list));
    } catch (err) {
        console.warn('Could not save to localStorage:', err);
    }

    // Refresh Slider to show new card
    if (typeof window.renderSliderTestimonials === 'function') {
        const totalNow = window.getAllActiveTestimonials ? window.getAllActiveTestimonials().length : 1;
        window.renderSliderTestimonials(totalNow - 1);
    }

    // Reset Form fields
    const form = document.getElementById('testimonialForm');
    if (form) form.reset();
    if (ratingInput) ratingInput.value = '5';
    const starsPicker = document.getElementById('starsPicker');
    if (starsPicker) {
        starsPicker.querySelectorAll('i').forEach(s => s.classList.add('active'));
    }
    const ratingLabel = document.getElementById('ratingLabelText');
    if (ratingLabel) {
        ratingLabel.textContent = '5.0 • Sangat Memuaskan & Luar Biasa';
    }

    // Close Modal
    closeTestimonialModal();

    // Smooth scroll to testimonial section
    const section = document.getElementById('testimonial');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Alert feedback
    alert('Jazakumullahu khairan Bapak/Ibu, semoga menjadi amal yang baik ya.');
}

// =============================================
// MODERASI TESTIMONI OLEH 3 PANITIA PROMOSI
// (Iksan Aksola, Rohman Dwi Saputra, Aidil Saputra)
// =============================================
const PANITIA_VALID_PINS = ['191026'];

function openModerationModal() {
    if (window.activePanitia) {
        openModerationPanelModal();
    } else {
        openModerationLoginModal();
    }
}

function openModerationLoginModal() {
    const modal = document.getElementById('moderationLoginModal');
    const errorMsg = document.getElementById('loginErrorMsg');
    if (errorMsg) errorMsg.style.display = 'none';
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const pinInput = document.getElementById('panitiaPin');
            if (pinInput) {
                pinInput.value = '';
                pinInput.focus();
            }
        }, 150);
    }
}

function closeModerationLoginModal() {
    const modal = document.getElementById('moderationLoginModal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

function handleModerationLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const panitiaSelect = document.getElementById('panitiaSelect');
    const pinInput = document.getElementById('panitiaPin');
    const errorMsg = document.getElementById('loginErrorMsg');

    const selectedName = panitiaSelect ? panitiaSelect.value : 'Panitia Promosi';
    const enteredPin = pinInput ? pinInput.value.trim() : '';

    if (PANITIA_VALID_PINS.includes(enteredPin)) {
        window.activePanitia = selectedName;
        sessionStorage.setItem('attamam_active_panitia', selectedName);

        // Update button status in section
        const modBtn = document.getElementById('btnOpenModerationModal');
        const modBtnLabel = document.getElementById('modBtnLabel');
        if (modBtn) modBtn.classList.add('active-session');
        if (modBtnLabel) modBtnLabel.textContent = `Panel Moderasi (${selectedName})`;

        closeModerationLoginModal();
        openModerationPanelModal();

        // Refresh slider so quick delete buttons appear
        if (typeof window.renderSliderTestimonials === 'function') {
            window.renderSliderTestimonials();
        }
    } else {
        if (errorMsg) errorMsg.style.display = 'block';
        if (pinInput) {
            pinInput.focus();
            pinInput.select();
        }
    }
}

function openModerationPanelModal() {
    const modal = document.getElementById('moderationPanelModal');
    const nameHeading = document.getElementById('panitiaWelcomeName');
    if (nameHeading && window.activePanitia) {
        nameHeading.textContent = `Panitia Promosi: ${window.activePanitia}`;
    }
    renderModerationList();
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeModerationPanelModal() {
    const modal = document.getElementById('moderationPanelModal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

function renderModerationList() {
    const listEl = document.getElementById('moderationList');
    const countEl = document.getElementById('modTotalTesti');
    if (!listEl) return;

    const allItems = (typeof window.getAllActiveTestimonials === 'function')
        ? window.getAllActiveTestimonials()
        : [];

    if (countEl) countEl.textContent = allItems.length;

    if (allItems.length === 0) {
        listEl.innerHTML = `
            <div style="text-align: center; padding: 40px 15px; color: #64748b;">
                <i class="fa-solid fa-folder-open" style="font-size: 36px; margin-bottom: 10px; color: #cbd5e1;"></i>
                <p>Tidak ada testimoni aktif saat ini. Anda dapat menekan tombol <strong>Reset ke Testimoni Awal</strong> di atas.</p>
            </div>
        `;
        return;
    }

    listEl.innerHTML = '';
    allItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'moderation-item';

        const typeBadge = item.isDefault
            ? `<span class="mod-type-badge default"><i class="fa-solid fa-bookmark"></i> Testimoni Bawaan</span>`
            : `<span class="mod-type-badge custom"><i class="fa-solid fa-user-pen"></i> Kiriman Orang Tua</span>`;

        const safeName = item.name.replace(/'/g, "\\'");

        itemEl.innerHTML = `
            <div class="mod-item-top">
                <div class="mod-item-author">
                    <h5>${escapeHtml(item.name)}</h5>
                    <span>${escapeHtml(item.role)}</span>
                </div>
                <div class="mod-item-meta">
                    <span class="mod-rating-tag"><i class="fa-solid fa-star"></i> ${Number(item.rating).toFixed(1)}</span>
                    ${typeBadge}
                </div>
            </div>
            <p class="mod-item-text">"${escapeHtml(item.text)}"</p>
            <div class="mod-item-bottom">
                <span class="mod-item-date"><i class="fa-regular fa-calendar"></i> ${item.date || '-'}</span>
                <button type="button" class="btn-delete-testi" onclick="handleDeleteTestimonial('${item.id}', '${safeName}')">
                    <i class="fa-solid fa-trash"></i> Hapus Testimoni
                </button>
            </div>
        `;
        listEl.appendChild(itemEl);
    });
}

function handleDeleteTestimonial(id, personName) {
    const panitiaName = window.activePanitia || 'Panitia Promosi';
    const isConfirm = confirm(`[Konfirmasi Penghapusan] Apakah Anda (${panitiaName}) yakin ingin menghapus testimoni dari "${personName}"?`);
    if (!isConfirm) return;

    try {
        // 1. Simpan ke daftar deleted IDs
        const deletedRaw = localStorage.getItem('attamam_deleted_testimonials');
        const deletedList = deletedRaw ? JSON.parse(deletedRaw) : [];
        if (!deletedList.includes(id)) {
            deletedList.push(id);
            localStorage.setItem('attamam_deleted_testimonials', JSON.stringify(deletedList));
        }

        // 2. Hapus juga dari custom testimonials jika ada
        const customRaw = localStorage.getItem('attamam_custom_testimonials');
        if (customRaw) {
            const customList = JSON.parse(customRaw);
            const filteredCustom = customList.filter(item => item.id !== id);
            localStorage.setItem('attamam_custom_testimonials', JSON.stringify(filteredCustom));
        }

        // 3. Render ulang slider & panel moderasi
        if (typeof window.renderSliderTestimonials === 'function') {
            window.renderSliderTestimonials();
        }
        renderModerationList();

        alert(`[Berhasil] Alhamdulillah, testimoni dari "${personName}" telah berhasil dihapus dari website oleh ${panitiaName}.`);
    } catch (err) {
        console.error('Error deleting testimonial:', err);
        alert('Terjadi kesalahan saat menghapus testimoni.');
    }
}

function resetDefaultTestimonials() {
    const isConfirm = confirm('Apakah Anda yakin ingin mengembalikan 3 testimoni awal bawaan sekolah ke tampilan website?');
    if (!isConfirm) return;

    try {
        localStorage.removeItem('attamam_deleted_testimonials');
        if (typeof window.renderSliderTestimonials === 'function') {
            window.renderSliderTestimonials(0);
        }
        renderModerationList();
        alert('[Berhasil] Alhamdulillah, seluruh testimoni bawaan sekolah telah dikembalikan seperti semula.');
    } catch (err) {
        console.error('Error resetting testimonials:', err);
    }
}

function logoutPanitia() {
    sessionStorage.removeItem('attamam_active_panitia');
    window.activePanitia = null;

    const modBtn = document.getElementById('btnOpenModerationModal');
    const modBtnLabel = document.getElementById('modBtnLabel');
    if (modBtn) modBtn.classList.remove('active-session');
    if (modBtnLabel) modBtnLabel.textContent = 'Kelola / Hapus Testimoni (Panitia)';

    closeModerationPanelModal();

    // Re-render slider to remove quick delete buttons
    if (typeof window.renderSliderTestimonials === 'function') {
        window.renderSliderTestimonials();
    }

    alert('Anda telah keluar dari mode Panitia Promosi.');
}

// Escape listener for modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModerationLoginModal();
        closeModerationPanelModal();
        if (typeof closeLeaderQuoteModal === 'function') {
            closeLeaderQuoteModal();
        }
    }
});

// =============================================
// STRUKTUR ORGANISASI: VIEW TOGGLE & QUOTE MODAL
// =============================================
const leaderQuotesData = {
    yayasan: {
        name: "Jamelri Andesta, S.Pd.I.",
        role: "Ketua Yayasan Waqof At-Tamam",
        badge: "Badan Penyelenggara",
        icon: "fa-solid fa-user-shield",
        avatarClass: "avatar-yayasan",
        quote: "Yayasan Waqof At-Tamam didirikan dengan niat ikhlas menghadirkan wadah pendidikan Islam bermanhaj salaf yang kokoh di Kota Pekanbaru. Kami berkomitmen menjaga amanah wakaf kaum muslimin serta memastikan seluruh siswa putra dibimbing di atas fondasi iman, aqidah shahihah, dan adab sunnah yang mulia.",
        points: [
            "Pengarah kebijakan makro, visi lembaga & manhaj salaf",
            "Pengelolaan aset wakaf & pengembangan gedung belajar",
            "Penjaminan akuntabilitas legalitas SK Kemenkumham RI"
        ]
    },
    pkbm: {
        name: "Muhammad Fattoni, S.Pd.",
        role: "Kepala PKBM Tahfizh At-Tamam Putra",
        badge: "Pimpinan Satuan Pendidikan",
        icon: "fa-solid fa-user-tie",
        avatarClass: "avatar-pkbm",
        quote: "Pendidikan kesetaraan di PKBM Tahfizh At-Tamam Putra dirancang agar siswa mendapatkan hak legalitas ijazah formal negara (Paket A, B, C dan Dapodik resmi) tanpa mengurangi kedalaman ilmu syar'i dan capaian target hafalan Al-Qur'an. Keduanya berjalan beriringan dengan standar mutu terbaik.",
        points: [
            "Penanggung jawab operasional seluruh jenjang satuan pendidikan",
            "Integrasi kurikulum nasional kesetaraan & kurikulum diniyyah",
            "Sinkronisasi data Dapodik induk & koordinasi Dinas Pendidikan"
        ]
    },
    sd: {
        name: "Febri Dwi Ramadhan",
        role: "Kepala Sekolah SD (Paket A)",
        badge: "Tingkat SD / Paket A",
        icon: "fa-solid fa-graduation-cap",
        avatarClass: "avatar-sd",
        quote: "Usia sekolah dasar adalah fase emas penanaman adab dan kecintaan membaca Al-Qur'an. Di jenjang SD/Paket A, kami mengedepankan keteladanan, bacaan tahsin yang tartil, target hafalan 10 juz yang realistis, serta pembiasaan ibadah harian dengan bimbingan penuh kasih sayang.",
        points: [
            "Fokus pondasi adab sebelum ilmu & kecakapan calistung dasar",
            "Halaqah Al-Qur'an intensif dengan target capaian 10 Juz",
            "Pembiasaan shalat berjama'ah, dzikir & akhlak sunnah harian"
        ]
    },
    smp: {
        name: "Muhammad Fattah Putra Perdana",
        role: "Kepala Sekolah SMP (Paket B)",
        badge: "Tingkat SMP / Paket B",
        icon: "fa-solid fa-book-open",
        avatarClass: "avatar-smp",
        quote: "Masa SMP merupakan transisi krusial pembentukan kepribadian remaja. Kami menggembleng siswa putra agar memiliki jati diri pemuda muslim yang tangguh, mempercepat akselerasi hafalan mutqin (5 Juz), menguasai dasar bahasa Arab, dan mandiri dalam bersikap.",
        points: [
            "Pembentukan karakter pemuda muslim beradab & berdisiplin",
            "Akselerasi tahfizh 5 Juz mutqin & kajian hadits mutun",
            "Kesiapan akademik menghadapi evaluasi kesetaraan jenjang SMP"
        ]
    },
    smk: {
        name: "Doni Zulhardi, S.Kom.",
        role: "Kepala Sekolah SMK (Paket C)",
        badge: "Tingkat SMK / Paket C",
        icon: "fa-solid fa-laptop-code",
        avatarClass: "avatar-smk",
        quote: "Tantangan zaman menuntut generasi muslim yang cakap teknologi dan mandiri secara ekonomi. Di tingkat SMK/Paket C, siswa kami bekali keahlian vokasi IT terapan, etos wirausaha, dan hafalan 3 juz mutqin agar siap berkarir profesional maupun lanjut ke perguruan tinggi.",
        points: [
            "Keahlian vokasi IT, komputasi terapan & wirausaha mandiri",
            "Penjagaan hafalan 3 Juz mutqin & adab profesional sunnah",
            "Kesiapan sertifikasi kejuruan, magang kerja & kuliah"
        ]
    }
};

window.openLeaderQuote = function(leaderKey) {
    const data = leaderQuotesData[leaderKey];
    if (!data) return;

    const modal = document.getElementById('leaderQuoteModal');
    if (!modal) return;

    const nameEl = document.getElementById('lqName');
    const roleEl = document.getElementById('lqRole');
    const badgeEl = document.getElementById('lqBadge');
    const quoteEl = document.getElementById('lqQuoteText');
    const iconEl = document.getElementById('lqIcon');
    const circleEl = document.getElementById('lqAvatarCircle');
    const pointsListEl = document.getElementById('lqPointsList');

    if (nameEl) nameEl.textContent = data.name;
    if (roleEl) roleEl.textContent = data.role;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (quoteEl) quoteEl.textContent = `"${data.quote}"`;

    if (iconEl) {
        iconEl.className = data.icon;
    }
    if (circleEl) {
        circleEl.className = `org-avatar-circle ${data.avatarClass}`;
    }

    if (pointsListEl) {
        pointsListEl.innerHTML = data.points
            .map(p => `<li><i class="fa-solid fa-circle-check"></i> <span>${p}</span></li>`)
            .join('');
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

window.closeLeaderQuoteModal = function() {
    const modal = document.getElementById('leaderQuoteModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

// Tutup modal jika klik di area overlay gelap
const leaderModalOverlay = document.getElementById('leaderQuoteModal');
if (leaderModalOverlay) {
    leaderModalOverlay.addEventListener('click', (e) => {
        if (e.target === leaderModalOverlay) {
            closeLeaderQuoteModal();
        }
    });
}

// Switch View: Bagan Pohon vs Rincian Tupoksi
window.switchOrgView = function(viewMode) {
    const treeView = document.getElementById('orgViewTree');
    const tupoksiView = document.getElementById('orgViewTupoksi');
    const btnTree = document.getElementById('btnViewTree');
    const btnTupoksi = document.getElementById('btnViewTupoksi');

    if (!treeView || !tupoksiView || !btnTree || !btnTupoksi) return;

    if (viewMode === 'tupoksi') {
        treeView.classList.remove('active');
        tupoksiView.classList.add('active');
        btnTree.classList.remove('active');
        btnTupoksi.classList.add('active');
    } else {
        tupoksiView.classList.remove('active');
        treeView.classList.add('active');
        btnTupoksi.classList.remove('active');
        btnTree.classList.add('active');
    }
};

// =============================================
// BROCHURE MODAL & FALLBACK LOGIC
// =============================================
window.openBrochureModal = function(imgSrc, captionText) {
    const modal = document.getElementById('brochureModal');
    const modalImg = document.getElementById('brochureModalImg');
    const modalCaption = document.getElementById('brochureModalCaption');
    const modalDl = document.getElementById('brochureModalDl');
    const modalNewTab = document.getElementById('brochureModalNewTab');

    if (!modal || !modalImg) return;

    modalImg.src = imgSrc;
    if (modalCaption) modalCaption.textContent = captionText;
    if (modalDl) {
        modalDl.href = imgSrc;
        modalDl.download = imgSrc.split('/').pop();
    }
    if (modalNewTab) {
        modalNewTab.href = imgSrc;
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

window.closeBrochureModal = function() {
    const modal = document.getElementById('brochureModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

// Handle placeholder ramah jika file gambar belum tersedia
window.handleBrochureError = function(imgEl, level) {
    imgEl.style.display = 'none';
    const parent = imgEl.parentElement;
    if (parent && !parent.querySelector('.brochure-waiting-box')) {
        const ph = document.createElement('div');
        ph.className = 'brochure-waiting-box';
        const levelUpper = level.toUpperCase();
        ph.onclick = function() { window.notifyBrochureUpdate(levelUpper); };
        ph.innerHTML = `
            <div class="waiting-shimmer"></div>
            <div class="waiting-content">
                <div class="waiting-icon-wrap">
                    <div class="waiting-icon-glow"></div>
                    <i class="fa-solid fa-hourglass-half waiting-icon"></i>
                </div>
                <h5 class="waiting-title">Brosur Sedang Disiapkan</h5>
                <p class="waiting-message">
                    Mohon menunggu ya Bapak/Ibu, insya Allah brosur akan segera di-update.
                </p>
                <span class="waiting-pill">
                    <i class="fa-solid fa-clock-rotate-left"></i> Segera Di-update
                </span>
            </div>
        `;
        parent.appendChild(ph);
    }
};

// Toast Notifikasi Ramah Brosur
let brochureToastTimeout = null;
window.notifyBrochureUpdate = function(level) {
    const levelName = level === 'SD' ? 'SD (Paket A)' : level === 'SMK' ? 'SMK (Paket C)' : level;
    let toast = document.getElementById('brochureToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'brochureToast';
        toast.className = 'brochure-toast';
        toast.innerHTML = `
            <div class="brochure-toast-icon">
                <i class="fa-solid fa-bell"></i>
            </div>
            <div class="brochure-toast-text">
                <h6 id="brochureToastTitle">Informasi Brosur SPMB</h6>
                <p id="brochureToastDesc"></p>
            </div>
            <button type="button" class="brochure-toast-close" onclick="closeBrochureToast()" aria-label="Tutup">&times;</button>
        `;
        document.body.appendChild(toast);
    }

    const titleEl = document.getElementById('brochureToastTitle');
    const descEl = document.getElementById('brochureToastDesc');
    if (titleEl) titleEl.textContent = `Brosur Tingkat ${levelName}`;
    if (descEl) descEl.textContent = 'Mohon menunggu ya Bapak/Ibu, insya Allah brosur akan segera di-update.';

    toast.classList.add('active');

    if (brochureToastTimeout) clearTimeout(brochureToastTimeout);
    brochureToastTimeout = setTimeout(() => {
        closeBrochureToast();
    }, 4500);
};

window.closeBrochureToast = function() {
    const toast = document.getElementById('brochureToast');
    if (toast) {
        toast.classList.remove('active');
    }
};

// Overlay click & Escape key listener for brochure modal
const brochureModalOverlay = document.getElementById('brochureModal');
if (brochureModalOverlay) {
    brochureModalOverlay.addEventListener('click', (e) => {
        if (e.target === brochureModalOverlay) {
            closeBrochureModal();
        }
    });
}



