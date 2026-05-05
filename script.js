// Initialize Lucide Icons
lucide.createIcons();

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
});

// Centralized EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_5ukbpwr";
const EMAILJS_TEMPLATE_ID = "template_9st8lw3";
const EMAILJS_PUBLIC_KEY = "QpkBmnT4LJ4PGyWTX";

emailjs.init(EMAILJS_PUBLIC_KEY);

const sendEmail = async (data) => {
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      from_name: data.name,
      mobile_no: data.mobile,
      reply_to: data.email,
      message: data.message,
    }
  );
};

// Header Scroll State
const header = document.getElementById('site-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
        header.classList.add('bg-[#161F48]/95', 'backdrop-blur-md', 'shadow-lg', 'py-4', 'sm:py-6');
        header.classList.remove('bg-transparent', 'py-6', 'sm:py-8');
    } else {
        header.classList.remove('bg-[#161F48]/95', 'backdrop-blur-md', 'shadow-lg', 'py-4', 'sm:py-6');
        header.classList.add('bg-transparent', 'py-6', 'sm:py-8');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.remove('translate-y-0');
        header.classList.add('-translate-y-full');
    } else {
        header.classList.remove('-translate-y-full');
        header.classList.add('translate-y-0');
    }

    lastScrollY = currentScrollY;
}, { passive: true });

// Modals
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close');
const modalOpenBtns = document.querySelectorAll('.modal-open');

modalOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.remove('hidden');
    });
});

modalCloseBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Entrance Animations
gsap.from("header", { y: -50, opacity: 0, duration: 1, ease: "power3.out", clearProps: "all" });
gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
gsap.from(".hero-box", { y: 50, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
gsap.from(".hero-form", { x: 50, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });

// Help Section
const helpSection = document.getElementById('help-section');
if (helpSection) {
    const tlHelp = gsap.timeline({
        scrollTrigger: {
            trigger: helpSection,
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    tlHelp.fromTo("#help-heading", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
          .fromTo("#help-pills > div", { opacity: 0, x: -50 }, { opacity: 1, x: 0, stagger: 0.15, duration: 0.8, ease: "power2.out" }, "-=0.4")
          .fromTo("#help-image", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.0, ease: "power2.out" }, "<")
          .fromTo("#help-para", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");
}

// Map Sequence Animation
const canvas = document.getElementById("map-canvas");
if (canvas) {
    const context = canvas.getContext("2d");
    const isMobile = window.innerWidth < 1024;
    const folder = isMobile ? "map-mobile" : "map-desktop";
    const totalFrames = isMobile ? 121 : 303;
    const maxIndex = totalFrames - 1;
    
    canvas.width = isMobile ? 1080 : 1920;
    canvas.height = isMobile ? 1920 : 1080;
    
    const images = [];
    let mapFrameObj = { frame: 0 };
    
    const renderCanvas = () => {
        const index = Math.min(Math.max(Math.round(mapFrameObj.frame), 0), maxIndex);
        const img = images[index];
        if (img && img.complete) {
            const rect = canvas.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                if (canvas.width !== rect.width || canvas.height !== rect.height) {
                    canvas.width = rect.width;
                    canvas.height = rect.height;
                }
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (img.naturalWidth && img.naturalHeight) {
                const imgRatio = img.naturalWidth / img.naturalHeight;
                const canvasRatio = canvas.width / canvas.height;
                let drawWidth = canvas.width;
                let drawHeight = canvas.height;
                let offsetX = 0;
                let offsetY = 0;
                if (imgRatio > canvasRatio) {
                    drawWidth = canvas.height * imgRatio;
                    offsetX = (canvas.width - drawWidth) / 2;
                } else {
                    drawHeight = canvas.width / imgRatio;
                    offsetY = (canvas.height - drawHeight) / 2;
                }
                context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            } else {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        }
    };
    
    for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(5, '0');
        if (isMobile) {
            img.src = `./public/${folder}/_Map__${paddedIndex}.webp`;
        } else {
            img.src = `./public/${folder}/Landscape_Map_${paddedIndex}.webp`;
        }
        img.onload = () => {
            if (i === 0) renderCanvas();
        };
        images.push(img);
    }
    
    window.addEventListener("resize", renderCanvas);
    
    gsap.set("#map-heading", { opacity: 0, y: 50 });
    gsap.set("#map-pills", { opacity: 0, y: 80 });
    gsap.set("#map-para", { opacity: 0, y: 50 });
    
    const tlMap = gsap.timeline({
        scrollTrigger: {
            trigger: "#map-container",
            start: "top top",
            end: isMobile ? "+=1500" : "+=3000",
            pin: true,
            scrub: true
        }
    });
    
    tlMap.to(mapFrameObj, {
        frame: maxIndex,
        snap: "frame",
        ease: "none",
        duration: 4,
        onUpdate: renderCanvas
    }, 0);
    
    tlMap.to("#map-heading", { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0);
    tlMap.to("#map-pills", { opacity: 1, y: 0, duration: 2.0, ease: "power2.out" }, 0.5);
    tlMap.to("#map-para", { opacity: 1, y: 0, duration: 2.0, ease: "power2.out" }, 1.0);
    tlMap.to({}, { duration: 0.5 });
}

// Initialize Slick Carousel
$(document).ready(function(){
    $('.desktop-slider').slick({
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        centerMode: true,
        centerPadding: "20%",
        arrows: false,
    });
    $('.mobile-slider').slick({
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        centerMode: false,
        arrows: false,
    });
});

// Form Submissions
const handleFormSubmit = async (e, data, btnElement) => {
    e.preventDefault();
    const originalText = btnElement.innerText;
    btnElement.innerText = "Submitting...";
    btnElement.disabled = true;
    try {
        await sendEmail(data);
        window.location.href = "./thank-you.html";
    } catch (error) {
        console.error("Failed to send email:", error);
        alert("Failed to process your request. Please try again.");
        btnElement.innerText = originalText;
        btnElement.disabled = false;
    }
};

const heroForm = document.getElementById('hero-form');
if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('hero-name').value,
            mobile: document.getElementById('hero-mobile').value,
            email: document.getElementById('hero-email').value,
            message: document.getElementById('hero-requirements').value
        };
        if(!data.name || !data.mobile || !data.email || !data.message) {
            alert("Please fill all fields.");
            return;
        }
        handleFormSubmit(e, data, heroForm.querySelector('button[type="submit"]'));
    });
}

const modalForm = document.getElementById('modal-form');
if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('modal-name').value,
            mobile: document.getElementById('modal-mobile').value,
            email: document.getElementById('modal-email').value,
            message: "Requested to download layout from Get A Closer Look section"
        };
        if(!data.name || !data.mobile || !data.email) {
            alert("Please fill all fields.");
            return;
        }
        handleFormSubmit(e, data, modalForm.querySelector('button[type="submit"]'));
    });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('contact-name').value,
            mobile: document.getElementById('contact-mobile').value,
            email: document.getElementById('contact-email').value,
            message: document.getElementById('contact-requirements').value
        };
        if(!data.name || !data.mobile || !data.email || !data.message) {
            alert("Please fill all fields.");
            return;
        }
        handleFormSubmit(e, data, contactForm.querySelector('button[type="submit"]'));
    });
}

// Refresh AOS after all assets and GSAP ScrollTriggers are loaded
window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    if (typeof AOS !== 'undefined') AOS.refresh();
});
