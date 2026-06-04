// Chọn các phần tử cần thiết
const menuIcon = document.querySelector('#menu-icon');
const navLinks = document.querySelector('.nav-links');

// Thêm sự kiện click cho icon menu
menuIcon.onclick = () => {
    // Toggle (bật/tắt) class 'active' để hiển thị menu
    navLinks.classList.toggle('active');
};

// --- GALLERY MODAL LOGIC ---
const galleryModal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');
const galleryItems = document.querySelectorAll('.gallery-item');

// Gallery data
const galleryData = [
    {
        title: 'THPT Châu Văn Liêm - Students',
        description: 'Working with students at Châu Văn Liêm High School. Teaching STEM concepts and practical programming skills to enhance their technical abilities.'
    },
    {
        title: 'THPT Châu Văn Liêm - Teaching',
        description: 'Guiding students through hands-on learning activities. Implementing interactive teaching methods to make STEM education engaging and effective.'
    },
    {
        title: 'THPT Thực hành Sư phạm',
        description: 'Training session at the Pedagogical Practice High School. Building curriculum and sharing knowledge with students and educators.'
    },
    {
        title: 'THPT Nguyễn Văn Tây',
        description: 'Conducting STEM workshops and training programs. Demonstrating practical applications of programming and automation technologies.'
    },
    {
        title: 'THCS Long Tuyền',
        description: 'Engaging students at Long Tuyền Junior High School. Teaching fundamental STEM concepts and fostering interest in technology.'
    },
    {
        title: 'THPT Lý Tự Trọng',
        description: 'Interactive teaching session with students from Lý Tự Trọng High School. Building problem-solving and critical thinking skills.'
    },
    {
        title: 'THPT Nguyễn Việt Dũng',
        description: 'Professional development and student training at Nguyễn Việt Dũng High School. Promoting excellence in STEM education.'
    },
    {
        title: 'THPT Khánh Hòa - Session 1',
        description: 'First training session at Khánh Hòa High School. Introducing advanced STEM topics and modern educational technologies.'
    },
    {
        title: 'THPT Khánh Hòa - Session 2',
        description: 'Continuing STEM education programs at Khánh Hòa High School. Fostering collaboration and innovation among students.'
    },
    {
        title: 'THPT Trần Đại Nghĩa',
        description: 'Teaching and mentoring at Trần Đại Nghĩa High School. Supporting students in their STEM learning journey and career development.'
    },
    {
        title: 'THPT Võ Thành Trinh - Session 1',
        description: 'First engagement with Võ Thành Trinh High School students. Delivering comprehensive STEM training and technical workshops.'
    },
    {
        title: 'THPT Võ Thành Trinh - Session 2',
        description: 'Extended training program at Võ Thành Trinh High School. Building strong foundation in programming and embedded systems.'
    }
];

let currentGalleryIndex = 0;

// Open modal
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentGalleryIndex = index;
        openGalleryModal(index);
    });
});

function openGalleryModal(index) {
    const data = galleryData[index];
    modalImage.src = galleryItems[index].querySelector('img').src;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    
    updateModalNav();
    galleryModal.classList.add('active');
}

function closeGalleryModal() {
    galleryModal.classList.remove('active');
}

function updateModalNav() {
    modalPrev.disabled = currentGalleryIndex === 0;
    modalNext.disabled = currentGalleryIndex === galleryData.length - 1;
}

// Modal navigation
modalClose.addEventListener('click', closeGalleryModal);

modalPrev.addEventListener('click', () => {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        openGalleryModal(currentGalleryIndex);
    }
});

modalNext.addEventListener('click', () => {
    if (currentGalleryIndex < galleryData.length - 1) {
        currentGalleryIndex++;
        openGalleryModal(currentGalleryIndex);
    }
});

// Close modal when clicking outside
galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        closeGalleryModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (galleryModal.classList.contains('active')) {
        if (e.key === 'Escape') closeGalleryModal();
        if (e.key === 'ArrowLeft' && currentGalleryIndex > 0) {
            currentGalleryIndex--;
            openGalleryModal(currentGalleryIndex);
        }
        if (e.key === 'ArrowRight' && currentGalleryIndex < galleryData.length - 1) {
            currentGalleryIndex++;
            openGalleryModal(currentGalleryIndex);
        }
    }
});
// --- CONTACT FORM ---
function checkRateLimit() {
    const key = 'contact_submissions';
    const limit = 10;
    const window_ms = 60 * 60 * 1000;
    const data = JSON.parse(localStorage.getItem(key) || '{"count":0,"timestamp":0}');
    const now = Date.now();
    if (now - data.timestamp > window_ms) { data.count = 0; data.timestamp = now; }
    if (data.count >= limit) return false;
    data.count++;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Honeypot check
    if (document.querySelector('[name="honeypot"]').value !== '') return;

    // Rate limit check
    if (!checkRateLimit()) {
        alert('Too many submissions. Please try again later.');
        return;
    }

    // reCAPTCHA check
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        alert('Please complete the reCAPTCHA verification.');
        return;
    }

    const btn = document.getElementById('contactBtn');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const serviceID = 'default_service';
    const templateID = 'template_zbynpyh';

    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            btn.textContent = 'Sent!';
            this.reset();
            setTimeout(() => {
                btn.textContent = 'Send Message';
                btn.disabled = false;
            }, 3000);
        }, (err) => {
            btn.textContent = 'Send Message';
            btn.disabled = false;
            alert('Failed to send: ' + JSON.stringify(err));
        });
});

// --- RENDER EMAIL
window.addEventListener('DOMContentLoaded', () => {
    const encoded = 'bWFuaHRyYW4xMmExQGdtYWlsLmNvbQ==';

    const el = document.getElementById('contact-email');
    if (!el) return;

    el.textContent = 'click to reveal email';
    el.style.cursor = 'pointer';

    el.addEventListener('click', (e) => {
        e.preventDefault();
        const email = atob(encoded);
        el.textContent = email;
        el.href = 'mailto:' + email;
        el.style.cursor = 'default';
    }, { once: true }); // chỉ chạy 1 lần
});