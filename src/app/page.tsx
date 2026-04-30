"use client";

import Image from "next/image";
import { Phone, X, Mail } from "lucide-react";
import { useState, FormEvent, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AOS from "aos";
import "aos/dist/aos.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

// Centralized EmailJS Configuration
// Replace these with your actual credentials
const EMAILJS_SERVICE_ID = "service_5ukbpwr";
const EMAILJS_TEMPLATE_ID = "template_9st8lw3";
const EMAILJS_PUBLIC_KEY = "QpkBmnT4LJ4PGyWTX";

const sendEmail = async (data: { name: string; mobile: string; email: string; message: string }) => {
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      from_name: data.name,
      mobile_no: data.mobile,
      reply_to: data.email,
      message: data.message,
    },
    EMAILJS_PUBLIC_KEY
  );
};

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    requirements: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ name: "", mobile: "", email: "" });

  // Header Scroll State
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHeaderVisible(false); // Scrolling down
      } else {
        setIsHeaderVisible(true); // Scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  // Contact Form State
  const [contactData, setContactData] = useState({ name: "", mobile: "", email: "", requirements: "" });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  // Slider State
  const sliderData = [
    { id: 1, img: "/daily-living-slider-1.jpg", text: "Grand Clubhouse For Social And Private Use" },
    { id: 2, img: "/daily-living-slider-2.jpg", text: "Swimming Pool, Fitness, And Wellness Zones" },
    { id: 3, img: "/daily-living-slider-3.jpg", text: "Landscaped Greens And Walking Tracks" },
    { id: 4, img: "/daily-living-slider-4.jpg", text: "Sports Courts, Kids' Areas, And Leisure Spaces" },
  ];

  const slickSettings = {
    className: "centric-slider",
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
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
        }
      }
    ]
  };

  // Scroll Animation State
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // General Entrance Animations (No ScrollTrigger for the whole page)
  useGSAP(() => {
    // Header
    gsap.from("header", { y: -50, opacity: 0, duration: 1, ease: "power3.out", clearProps: "all" });

    // Hero Section
    gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".hero-box", { y: 50, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
    gsap.from(".hero-form", { x: 50, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
  }, []);

  // Map Section GSAP Refs
  const headingRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLDivElement>(null);
  const mapFrameObj = useRef({ frame: 0 });

  useGSAP(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Responsive folder and canvas sizing
    const isMobile = window.innerWidth < 1024;
    const folder = isMobile ? "map-mobile" : "map-desktop";
    const totalFrames = isMobile ? 121 : 303;
    const maxIndex = totalFrames - 1;

    // Set default canvas aspect ratio (will be overridden by first image loaded)
    canvas.width = isMobile ? 1080 : 1920;
    canvas.height = isMobile ? 1920 : 1080;

    const images: HTMLImageElement[] = [];

    const renderCanvas = () => {
      const index = Math.min(Math.max(Math.round(mapFrameObj.current.frame), 0), maxIndex);
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
      const img = new window.Image();
      const paddedIndex = i.toString().padStart(5, '0');

      if (isMobile) {
        img.src = `/${folder}/_Map__${paddedIndex}.webp`;
      } else {
        img.src = `/${folder}/Landscape_Map_${paddedIndex}.webp`;
      }

      img.onload = () => {
        if (i === 0) renderCanvas();
      };
      images.push(img);
    }
    
    window.addEventListener("resize", renderCanvas);

    // Initialize GSAP states
    gsap.set(headingRef.current, { opacity: 0, y: 50 });
    gsap.set(pillsRef.current, { opacity: 0, y: 80 });
    gsap.set(paraRef.current, { opacity: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: isMobile ? "+=1500" : "+=3000",
        pin: true,
        scrub: true
      }
    });

    // 1. Map Animation
    tl.to(mapFrameObj.current, {
      frame: maxIndex,
      snap: "frame",
      ease: "none",
      duration: 4,
      onUpdate: renderCanvas
    }, 0);

    // 2. Heading Fades In
    tl.to(headingRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power2.out"
    }, 0);

    // 3. Text Boxes Fades In
    tl.to(pillsRef.current, {
      opacity: 1,
      y: 0,
      duration: 2.0,
      ease: "power2.out"
    }, 0.5);

    // 4. Paragraph Fades In
    tl.to(paraRef.current, {
      opacity: 1,
      y: 0,
      duration: 2.0,
      ease: "power2.out"
    }, 1.0);

    tl.to({}, { duration: 0.5 });

  }, { scope: containerRef });

  // We Help Section GSAP Refs
  const helpSectionRef = useRef<HTMLDivElement>(null);
  const helpHeadingRef = useRef<HTMLDivElement>(null);
  const helpPillsRef = useRef<HTMLDivElement>(null);
  const helpImageRef = useRef<HTMLImageElement>(null);
  const helpParaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initialize GSAP states
    gsap.set(helpHeadingRef.current, { opacity: 0, y: 50 });
    gsap.set(helpPillsRef.current?.children ? Array.from(helpPillsRef.current.children) : [], { opacity: 0, x: -50 });
    gsap.set(helpImageRef.current, { opacity: 0, x: 50 });
    gsap.set(helpParaRef.current, { opacity: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: helpSectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    // 1. Heading Fades In
    tl.to(helpHeadingRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    // 2. Left Pills fade in stagger
    if (helpPillsRef.current?.children) {
      tl.to(Array.from(helpPillsRef.current.children), {
        opacity: 1,
        x: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4");
    }

    // 3. Right Image Fades In
    tl.to(helpImageRef.current, {
      opacity: 1,
      x: 0,
      duration: 1.0,
      ease: "power2.out"
    }, "<"); // Starts at same time as pills

    // 4. Paragraph Fades In
    tl.to(helpParaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4");
  }, { scope: helpSectionRef });

  const validateModal = () => {
    const newErrors: Record<string, string> = {};
    if (!modalData.name.trim()) newErrors.name = "Name is required";
    if (!modalData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!modalData.email.trim()) newErrors.email = "Email is required";
    setModalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateModal()) return;

    setIsModalSubmitting(true);
    try {
      await sendEmail({
        name: modalData.name,
        mobile: modalData.mobile,
        email: modalData.email,
        message: "Requested to download layout from Get A Closer Look section",
      });

      setIsModalOpen(false);
      setModalData({ name: "", mobile: "", email: "" });
      router.push("/thank-you");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to process your request. Please try again.");
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const validateContactForm = () => {
    const newErrors: Record<string, string> = {};
    if (!contactData.name.trim()) newErrors.name = "Name is required";
    if (!contactData.mobile.trim()) newErrors.mobile = "Phone number is required";
    if (!contactData.email.trim()) newErrors.email = "Email is required";
    if (!contactData.requirements.trim()) newErrors.requirements = "Requirements are required";

    setContactErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateContactForm()) return;

    setIsContactSubmitting(true);

    try {
      await sendEmail({
        name: contactData.name,
        mobile: contactData.mobile,
        email: contactData.email,
        message: contactData.requirements,
      });

      router.push("/thank-you");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to process your request. Please try again.");
    } finally {
      setIsContactSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.requirements.trim()) newErrors.requirements = "Requirements are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await sendEmail({
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        message: formData.requirements,
      });

      router.push("/thank-you");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send your inquiry. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="font-sans bg-hf-navy text-white overflow-hidden">

      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"} ${hasScrolled ? "bg-[#161F48]/95 backdrop-blur-md shadow-lg py-4 sm:py-6" : "bg-transparent py-6 sm:py-8"}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-row justify-between items-center gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="Sobha Rivana"
              width={200}
              height={80}
              className="w-auto h-10 sm:h-16 object-contain drop-shadow-md"
              priority
            />
          </div>

          {/* Contact Buttons */}
          <div className="flex flex-row gap-3 sm:gap-4 w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center justify-center sm:gap-3 p-2.5 sm:px-8 sm:py-3 rounded-full border border-hf-gold bg-hf-navy/80 backdrop-blur-sm text-white transition-all duration-300 hover:bg-hf-gold hover:text-hf-navy cursor-pointer"
            >
              <Phone className="w-5 h-5 shrink-0 text-hf-gold group-hover:text-hf-navy transition-colors" />
              <span className="hidden sm:inline-block text-[14px] sm:text-[16px] font-light tracking-wide">9999991036</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center justify-center sm:gap-3 p-2.5 sm:px-8 sm:py-3 rounded-full border border-hf-gold bg-hf-navy/80 backdrop-blur-sm text-white transition-all duration-300 hover:bg-hf-gold hover:text-hf-navy cursor-pointer"
            >
              <Mail className="w-5 h-5 shrink-0 text-hf-gold group-hover:text-hf-navy transition-colors" />
              <span className="hidden sm:inline-block text-[14px] sm:text-[16px] font-light tracking-wide">info@hfrealtors.com</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Wrapper with Background */}
      <div className="relative w-full ">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full z-0 bg-[url('/hero-bg.jpg')] bg-cover bg-bottom"
        >
          {/* Subtle dark overlay for text readability, no solid gradients blocking the image */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Hero Layout (Two Columns) */}
        <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-[200px] sm:pt-40 lg:pt-56 pb-16 lg:pb-24 flex flex-col lg:flex-row gap-12 items-center">

          {/* Left Column (Text & Bottom Info Box) */}
          <div className="flex-1 flex flex-col justify-between w-full pb-8 lg:pb-0 gap-16 lg:gap-60">

            {/* Top Heading */}
            <div className="relative hero-title">
              <h1 className="relative z-10 text-[28px] sm:text-5xl lg:text-[3.5rem] font-sans font-semibold leading-[1.2] tracking-tight max-w-2xl drop-shadow-lg bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent">
                Own a Home Where Quality Is Engineered, Not Promised.
              </h1>
            </div>

            {/* Bottom Info Box */}
            <div className="hero-box bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-[2rem] p-5 sm:p-6 md:p-8 w-full max-w-xl shadow-2xl">
              <p className="text-[16px] sm:text-xl md:text-2xl font-medium mb-6 md:mb-8 leading-snug">
                Low-density high-rise living, backed by a developer that builds everything in-house.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setIsModalOpen(true)} className="w-full bg-white text-black font-semibold px-4 py-2.5 sm:px-6 sm:py-3 text-[13px] sm:text-base rounded-xl hover:bg-gray-100 transition-colors shadow-lg cursor-pointer">
                  Get Price & Availability
                </button>
                <button onClick={() => setIsModalOpen(true)} className="w-full bg-white text-black font-semibold px-4 py-2.5 sm:px-6 sm:py-3 text-[13px] sm:text-base rounded-xl hover:bg-gray-100 transition-colors shadow-lg cursor-pointer">
                  Speak to an Advisor
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="hero-form w-full lg:w-[40%] xl:w-[450px] shrink-0 pb-12 flex items-center lg:items-end">
            <div className="w-full bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-2xl">
              <h2 className="text-[22px] sm:text-2xl font-semibold text-center mb-5 sm:mb-6 drop-shadow-md bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent">Own a Premium Address</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border border-white/40 focus:border-white rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 text-[14px] sm:text-base text-white placeholder-white/70 outline-none transition-colors"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1 ml-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Mobile No."
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-transparent border border-white/40 focus:border-white rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 text-[14px] sm:text-base text-white placeholder-white/70 outline-none transition-colors"
                  />
                  {errors.mobile && <p className="text-red-400 text-sm mt-1 ml-1">{errors.mobile}</p>}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border border-white/40 focus:border-white rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 text-[14px] sm:text-base text-white placeholder-white/70 outline-none transition-colors"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1 ml-1">{errors.email}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full bg-transparent border border-white/40 focus:border-white rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 text-[14px] sm:text-base text-white placeholder-white/70 outline-none transition-colors"
                  />
                  {errors.requirements && <p className="text-red-400 text-sm mt-1 ml-1">{errors.requirements}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[80%] sm:w-1/2 mx-auto mt-2 bg-sobha-rivana hover:brightness-110 text-[13px] sm:text-base text-white font-medium py-2.5 sm:py-3.5 rounded-xl transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>

        </section>
      </div>

      {/* Mobile Overview Image */}
      <section data-aos="fade-up" data-aos-duration="1000" className="w-full md:hidden flex justify-center items-center pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="w-full"
        >
          <Image src="/overview-mobile.jpg" alt="Sobha Rivana Overview" width={1080} height={1080} className="w-full h-auto object-cover" />
        </motion.div>
      </section>

      {/* Overview Section */}
      <section className="fade-up-section relative w-full bg-transparent hidden md:flex flex-col justify-center items-center py-16 md:py-32">

        {/* Building Background Image with fade masks */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="w-full h-full bg-[url('/overview.png')] bg-cover bg-center bg-no-repeat">
          </div>
          {/* Top & Bottom Fade Masks to blend into background */}
          <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#161F48] via-[#161F48]/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[#161F48] via-[#161F48]/80 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Floating Glassmorphic Features */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center items-center gap-4 py-12 md:py-0 min-h-[50vh] md:min-h-[800px]">
          {/* Mobile: stacked layout. Desktop: absolute positioned floating layout */}

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative md:absolute md:top-[55%] md:left-[5%] lg:left-[10%] bg-white/[0.15] backdrop-blur-xl border border-white/30 px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full md:w-auto text-center"
          >
            <p className="text-white text-[14px] sm:text-base md:text-lg font-medium tracking-wide">Sector 1, Greater Noida West</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="relative md:absolute md:top-[50%] md:right-[5%] lg:right-[10%] bg-white/[0.15] backdrop-blur-xl border border-white/30 px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full md:w-auto text-center"
          >
            <p className="text-white text-[14px] sm:text-base md:text-lg font-medium tracking-wide">12-acre planned development</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="relative md:absolute md:top-[70%] md:left-[2%] lg:left-[8%] bg-white/[0.15] backdrop-blur-xl border border-white/30 px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full md:w-auto text-center"
          >
            <p className="text-white text-[14px] sm:text-base md:text-lg font-medium tracking-wide">~1375 apartments with low-density planning</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="relative md:absolute md:top-[65%] md:right-[5%] lg:right-[12%] bg-white/[0.15] backdrop-blur-xl border border-white/30 px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full md:w-auto text-center"
          >
            <p className="text-white text-[14px] sm:text-base md:text-lg font-medium tracking-wide">8 high-rise towers (G+45)</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="relative md:absolute md:bottom-[5%] md:left-1/2 md:-translate-x-1/2 bg-white/[0.15] backdrop-blur-xl border border-white/30 px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full md:w-auto text-center"
          >
            <p className="text-white text-[14px] sm:text-base md:text-lg font-medium tracking-wide">2, 3, and 4 BHK residences</p>
          </motion.div>

        </div>
      </section>

      {/* Problems Section */}
      <section className="relative w-full py-16 md:py-24 bg-hf-navy overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 opacity-40">
          <div className="w-full h-full bg-[url('/architectural-blueprint.png')] bg-cover bg-top bg-no-repeat mix-blend-screen"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-[24px] sm:text-4xl lg:text-[2.75rem] font-semibold mb-16 max-w-4xl leading-tight text-white">
            Why most luxury homes don&apos;t feel<br className="hidden sm:block" /> premium after possession?
          </h2>

          <div className="problems-grid grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {/* Item 1 */}
            <div data-aos="fade-up" data-aos-delay="0" className="problem-item bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-8 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-3 sm:gap-6 hover:bg-white/10 transition-all duration-300 shadow-xl text-center sm:text-left">
              <Image src="/luxury-homes-icon-1.png" alt="Crowded towers" width={56} height={56} className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 object-contain drop-shadow-md" />
              <p className="text-[13px] sm:text-[1.15rem] font-medium leading-snug text-white">Crowded<br className="hidden sm:block" /> towers</p>
            </div>

            {/* Item 2 */}
            <div data-aos="fade-up" data-aos-delay="100" className="problem-item bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-8 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-3 sm:gap-6 hover:bg-white/10 transition-all duration-300 shadow-xl text-center sm:text-left">
              <Image src="/luxury-homes-icon-2.png" alt="Inconsistent construction quality" width={56} height={56} className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 object-contain drop-shadow-md" />
              <p className="text-[13px] sm:text-[1.15rem] font-medium leading-snug text-white">Inconsistent<br className="hidden sm:block" /> construction quality</p>
            </div>

            {/* Item 3 */}
            <div data-aos="fade-up" data-aos-delay="200" className="problem-item bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-8 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-3 sm:gap-6 hover:bg-white/10 transition-all duration-300 shadow-xl text-center sm:text-left">
              <Image src="/luxury-homes-icon-3.png" alt="Overpromised amenities" width={56} height={56} className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 object-contain drop-shadow-md" />
              <p className="text-[13px] sm:text-[1.15rem] font-medium leading-snug text-white">Overpromised<br className="hidden sm:block" /> amenities</p>
            </div>

            {/* Item 4 */}
            <div data-aos="fade-up" data-aos-delay="0" className="problem-item bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-8 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-3 sm:gap-6 hover:bg-white/10 transition-all duration-300 shadow-xl text-center sm:text-left">
              <Image src="/luxury-homes-icon-4.png" alt="Execution delays" width={56} height={56} className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 object-contain drop-shadow-md" />
              <p className="text-[13px] sm:text-[1.15rem] font-medium leading-snug text-white">Execution<br className="hidden sm:block" /> delays</p>
            </div>

            {/* Item 5 */}
            <div data-aos="fade-up" data-aos-delay="100" className="problem-item bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-8 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-3 sm:gap-6 hover:bg-white/10 transition-all duration-300 shadow-xl text-center sm:text-left">
              <Image src="/luxury-homes-icon-5.png" alt="On paper, everything looks similar" width={56} height={56} className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 object-contain drop-shadow-md" />
              <p className="text-[13px] sm:text-[1.15rem] font-medium leading-snug text-white">On paper,<br className="hidden sm:block" /> everything looks similar.</p>
            </div>

            {/* Item 6 */}
            <div data-aos="fade-up" data-aos-delay="200" className="problem-item bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-8 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-3 sm:gap-6 hover:bg-white/10 transition-all duration-300 shadow-xl text-center sm:text-left">
              <Image src="/luxury-homes-icon-6.png" alt="In reality, very few projects deliver consistency" width={56} height={56} className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 object-contain drop-shadow-md" />
              <p className="text-[13px] sm:text-[1.15rem] font-medium leading-snug text-white">In reality, very few<br className="hidden sm:block" /> projects deliver consistency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get A Closer Look Section */}
      <section className="closer-look-section relative w-full min-h-[60vh] md:min-h-[700px] py-16 md:py-24 flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 w-full h-full z-0 opacity-10 bg-[url('/get-a-closer-look-bg.png')] bg-cover bg-top"></div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div data-aos="fade-up" className="closer-look-card relative w-full rounded-2xl overflow-hidden shadow-2xl group border border-white/10 aspect-square sm:aspect-video lg:aspect-[2.2/1] flex flex-col items-center justify-center">
            {/* Middle Image as Background */}
            <div className="absolute inset-0 w-full h-full">
              <Image src="/get-a-closer.jpg" alt="Layout Plan" fill className="object-cover" />
            </div>

            <div className="relative z-10 px-4 sm:px-6 flex flex-col items-center justify-center text-center">
              <h2 className="text-[24px] sm:text-4xl md:text-[2.75rem] font-semibold mb-6 text-[#F4D068] drop-shadow-md">
                Get A Closer Look
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#4a5fbd] hover:bg-[#3a4ca0] text-white text-[14px] sm:text-base font-medium px-4 py-2 sm:px-8 sm:py-2.5 rounded-lg transition-colors shadow-lg"
              >
                Download layout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Low Density Section */}
      <section className="fade-up-section relative w-full py-16 md:py-24 border-t border-white/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 w-full h-full z-0 opacity-10 bg-[url('/architectural-blueprint.png')] bg-cover bg-center mix-blend-screen"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          <h2 data-aos="fade-down" className="text-[24px] sm:text-4xl md:text-[3.5rem] leading-tight font-semibold mb-16 bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent drop-shadow-md">
            Low Density In A High-Growth<br className="hidden sm:block" /> Market
          </h2>

          <div data-aos="zoom-in" className="w-full max-w-5xl mx-auto mb-16">
            <Image
              src="/low-density.png"
              alt="Low Density Layout"
              width={1200}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>

          <p data-aos="fade-up" className="text-[14px] sm:text-2xl font-medium text-white leading-snug">
            Space Is No Longer A Given In NCR.<br />
            Here, It Is Planned.
          </p>
        </div>
      </section>

      {/* Daily Living Slider Section */}
      <section className="fade-up-section relative w-full py-16 md:py-24 bg-[#161F48] overflow-hidden">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-16 text-center">
          <h2 data-aos="fade-down" className="text-[24px] sm:text-4xl md:text-[3.5rem] leading-tight font-semibold mb-2 sm:mb-6 bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent drop-shadow-md">
            Built For Daily Living, Not Just<br className="hidden sm:block" /> Brochure Value
          </h2>
        </div>

        <div data-aos="fade-up" className="relative w-full max-w-[100vw] mx-auto overflow-hidden py-2 sm:py-8">
          <Slider {...slickSettings}>
            {sliderData.map((slide) => (
              <div key={slide.id} className="outline-none">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden group mx-auto">
                  <Image src={slide.img} alt={slide.text} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161F48]/90 via-[#161F48]/30 to-transparent"></div>
                  <p className="absolute bottom-10 left-10 right-10 text-white font-semibold text-[14px] sm:text-2xl lg:text-3xl leading-snug drop-shadow-md z-10 text-left">
                    {slide.text}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 mt-8 sm:mt-16 text-center">
          <p data-aos="fade-up" className="text-[14px] sm:text-2xl font-medium text-white leading-snug">
            Everything Is Integrated Within The Development.<br />
            You Don&apos;t Step Out For Basic Lifestyle Needs.
          </p>
        </div>
      </section>

      {/* Scroll Animated Map Section */}
      <section ref={containerRef} className="relative w-full min-h-screen bg-[#161F48] overflow-hidden flex flex-col justify-center items-center gap-6 sm:gap-12 py-16 md:py-24">

        {/* Canvas Background */}
        <div className="absolute inset-0 w-full h-full z-0 opacity-60 mix-blend-screen pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full object-cover"></canvas>
          <div className="absolute inset-0 bg-gradient-to-t from-[#161F48] via-transparent to-[#161F48]"></div>
        </div>

        {/* Heading - sequence starts here */}
        <div
          ref={headingRef}
          className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center pointer-events-none mt-4 sm:mt-10"
        >
          <h2 className="text-[24px] sm:text-4xl md:text-[3.5rem] leading-tight font-semibold bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent drop-shadow-md">
            Positioned In One Of NCR&apos;s Fastest-<br className="hidden sm:block" /> Evolving Residential Corridors
          </h2>
        </div>

        {/* Center Map Items Block */}
        <div
          ref={pillsRef}
          className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pointer-events-none"
        >
          {/* Desktop Layout for Pins */}
          <div className="hidden lg:flex w-full justify-between items-center relative h-full">

            {/* Left Column */}
            <div className="flex flex-col gap-16 justify-center h-full items-start">
              <div className="bg-[#161F48]/40 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full shadow-2xl ml-8 pointer-events-auto hover:bg-[#161F48]/60 transition-colors">
                <p className="text-white text-lg font-medium text-center whitespace-nowrap">Close to Noida, Delhi, and Ghaziabad</p>
              </div>
              <div className="bg-[#161F48]/40 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full shadow-2xl -ml-8 pointer-events-auto hover:bg-[#161F48]/60 transition-colors">
                <p className="text-white text-lg font-medium text-center whitespace-nowrap">Upcoming metro connectivity nearby</p>
              </div>
              <div className="bg-[#161F48]/40 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full shadow-2xl ml-8 pointer-events-auto hover:bg-[#161F48]/60 transition-colors">
                <p className="text-white text-lg font-medium text-center whitespace-nowrap">Access to FNG Expressway and major road networks</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-center h-full items-end">
              <div className="bg-[#161F48]/40 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full shadow-2xl mr-8 pointer-events-auto hover:bg-[#161F48]/60 transition-colors">
                <p className="text-white text-lg font-medium text-center whitespace-nowrap">Sector 1, Greater Noida West</p>
              </div>
            </div>
          </div>

          {/* Mobile Layout (simplified stack) */}
          <div className="flex lg:hidden flex-col items-center gap-4 w-full justify-center mt-8 px-2">
            <div className="bg-[#161F48]/40 backdrop-blur-md border border-white/30 px-5 py-3 rounded-2xl sm:rounded-full shadow-xl pointer-events-auto text-center w-[95%] sm:w-auto">
              <p className="text-white font-medium text-[14px] sm:text-base">Close to Noida, Delhi, & Ghaziabad</p>
            </div>
            <div className="bg-[#161F48]/40 backdrop-blur-md border border-white/30 px-5 py-3 rounded-2xl sm:rounded-full shadow-xl pointer-events-auto text-center w-[95%] sm:w-auto">
              <p className="text-white font-medium text-[14px] sm:text-base">Upcoming metro connectivity nearby</p>
            </div>
            <div className="bg-[#161F48]/40 backdrop-blur-md border border-white/30 px-5 py-3 rounded-2xl sm:rounded-full shadow-xl pointer-events-auto text-center w-[95%] sm:w-auto">
              <p className="text-white font-medium text-[14px] sm:text-base">Access to FNG Expressway</p>
            </div>
            <div className="bg-[#161F48]/40 backdrop-blur-md border border-white/30 px-5 py-3 rounded-2xl sm:rounded-full shadow-xl pointer-events-auto text-center w-[95%] sm:w-auto">
              <p className="text-white font-medium text-[14px] sm:text-base">Sector 1, Greater Noida West</p>
            </div>
          </div>
        </div>

        {/* Bottom Paragraph */}
        <div
          ref={paraRef}
          className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center mb-4 sm:mb-10 pointer-events-none"
        >
          <p className="text-[14px] sm:text-2xl lg:text-3xl font-medium text-white leading-snug drop-shadow-md">
            This Location Is Driven By Expansion, Not Saturation.<br className="hidden sm:block" />
            That Matters For Both Living And Appreciation.
          </p>
        </div>

      </section>

      {/* We Help Section */}
      <section ref={helpSectionRef} className="relative w-full bg-[#161F48] overflow-hidden py-16 md:py-24">

        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40 mix-blend-screen">
          <Image src="/we-help-blueprint.png" alt="Blueprint Background" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161F48] via-transparent to-[#161F48]"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
          {/* Heading */}
          <div
            ref={helpHeadingRef}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-[24px] sm:text-4xl md:text-[3.5rem] leading-tight font-semibold bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent drop-shadow-md">
              We Help You Choose Within The<br className="hidden sm:block" /> Project, Not Just The Project
            </h2>
          </div>

          {/* Two Column Content */}
          <div className="flex flex-col lg:flex-row w-full items-center justify-center gap-12 lg:gap-4 max-w-5xl mx-auto">

            {/* Left Column (Pills) */}
            <div ref={helpPillsRef} className="flex flex-col gap-4 lg:gap-6 w-full lg:w-7/12 px-2 sm:px-0">
              <div className="w-[95%] sm:w-fit bg-transparent backdrop-blur-md border border-white/30 px-6 py-3 rounded-2xl sm:rounded-full shadow-2xl lg:ml-8 hover:bg-white/5 transition-colors">
                <p className="text-white text-[14px] sm:text-base lg:text-lg font-medium">Unit selection based on yield potential</p>
              </div>
              <div className="w-[95%] sm:w-fit bg-transparent backdrop-blur-md border border-white/30 px-6 py-3 rounded-2xl sm:rounded-full shadow-2xl lg:-ml-4 hover:bg-white/5 transition-colors">
                <p className="text-white text-[14px] sm:text-base lg:text-lg font-medium">Price benchmarking across towers and phases</p>
              </div>
              <div className="w-[95%] sm:w-fit bg-transparent backdrop-blur-md border border-white/30 px-6 py-3 rounded-2xl sm:rounded-full shadow-2xl lg:ml-2 hover:bg-white/5 transition-colors">
                <p className="text-white text-[14px] sm:text-base lg:text-lg font-medium">Future value and resale positioning</p>
              </div>
              <div className="w-[95%] sm:w-fit bg-transparent backdrop-blur-md border border-white/30 px-6 py-3 rounded-2xl sm:rounded-full shadow-2xl lg:ml-12 hover:bg-white/5 transition-colors">
                <p className="text-white text-[14px] sm:text-base lg:text-lg font-medium">End-to-end support till closure</p>
              </div>
            </div>

            {/* Right Column (Image) */}
            <div className="w-full lg:w-5/12 flex justify-center lg:justify-start relative mt-8 lg:mt-0 lg:-ml-8 px-6 sm:px-0">
              <img ref={helpImageRef} src="/we-help-right.png" alt="Real Estate Agents" className="object-contain w-[80%] sm:w-[60%] lg:w-full h-auto drop-shadow-2xl relative z-10" />
              {/* Full Width Gradient Mask for Image Baseline */}
              <div className="absolute bottom-[-2px] left-[-100vw] right-[-100vw] h-24 sm:h-40 bg-gradient-to-t from-[#161F48] via-[#161F48]/80 to-transparent pointer-events-none z-20"></div>
            </div>
          </div>

          {/* Bottom Paragraph */}
          <div
            ref={helpParaRef}
            className="text-center mt-12 lg:mt-16"
          >
            <p className="text-[14px] sm:text-2xl font-medium text-white leading-snug drop-shadow-md">
              No Generic Recommendations.<br className="hidden sm:block" />
              Only What Fits Your Objective.
            </p>
          </div>
        </div>

      </section>

      {/* Decisions Matter Section */}
      <section className="decisions-section w-full bg-[#161F48] py-16 md:py-24 flex flex-col items-center justify-center overflow-hidden">
        {/* Heading */}
        <div data-aos="fade-down" className="decisions-content text-center px-4 sm:px-6 mb-8 max-w-5xl mx-auto">
          <h2 className="text-[24px] sm:text-3xl lg:text-[2.5rem] font-semibold text-white leading-tight">
            If You Are Considering Sobha Rivana, Early<br className="hidden sm:block" /> Decisions Matter.
          </h2>
        </div>

        {/* Buttons */}
        <div data-aos="fade-up" className="decisions-content flex flex-col sm:flex-row gap-4 sm:gap-6 px-4 sm:px-6 z-10 relative">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 sm:px-8 sm:py-3.5 rounded-xl bg-[#4A5EBF] hover:bg-[#3B4C9D] text-white font-semibold shadow-xl transition-colors text-[14px] sm:text-base w-full sm:w-auto min-w-[160px]"
          >
            Get Pricing
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 sm:px-8 sm:py-3.5 rounded-xl bg-[#4A5EBF] hover:bg-[#3B4C9D] text-white font-semibold shadow-xl transition-colors text-[14px] sm:text-base w-full sm:w-auto min-w-[160px]"
          >
            Schedule a call
          </button>
        </div>

        {/* Image */}
        <div data-aos="zoom-in" className="w-full relative px-0 flex justify-center ">
          <img src="/decisions-matter-bg.png" alt="City Skyline Graph" className="w-full max-w-[1920px] h-auto object-cover opacity-90" />
        </div>

        {/* Bottom Text */}
        <div data-aos="fade-up" className="decisions-content text-center px-4 sm:px-6 mt-12 z-10 relative">
          <p className="text-[14px] sm:text-2xl font-medium text-white leading-snug drop-shadow-md">
            No Generic Recommendations.<br className="hidden sm:block" />
            Only What Fits Your Objective.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section w-full bg-[#161F48] py-16 md:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch justify-center">

          {/* Left Column (Image & Overlay Text) */}
          <div data-aos="fade-right" className="contact-image w-full lg:w-1/2 relative min-h-[400px] lg:min-h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <Image src="/contact.jpg" alt="Living Room" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161F48]/95 via-[#161F48]/30 to-transparent"></div>

            <div className="absolute bottom-0 left-0 w-full px-4 py-4 sm:p-12">
              <h3 className="text-[24px] sm:text-3xl lg:text-4xl font-semibold text-white leading-snug drop-shadow-lg">
                A Well-Built Home Is Not Obvious<br />
                On Day One.<br />
                It Becomes Clear Over Time.
              </h3>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div data-aos="fade-left" className="contact-form w-full lg:w-5/12 flex flex-col justify-center py-6">
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-3 sm:gap-6">

              <div>
                <div className="relative rounded-xl p-[1px] bg-gradient-to-b from-hf-gold to-hf-gold-2">
                  {!contactData.name && (
                    <span className="absolute left-[13px] top-[11px] sm:left-[21px] sm:top-[17px] text-[14px] sm:text-base pointer-events-none bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent">
                      Name
                    </span>
                  )}
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="w-full block bg-[#161F48] rounded-[11px] px-3 py-2.5 sm:px-5 sm:py-4 text-[14px] sm:text-base text-white outline-none transition-colors"
                  />
                </div>
                {contactErrors.name && <p className="text-red-400 text-sm mt-1.5 ml-1">{contactErrors.name}</p>}
              </div>

              <div>
                <div className="relative rounded-xl p-[1px] bg-gradient-to-b from-hf-gold to-hf-gold-2">
                  {!contactData.email && (
                    <span className="absolute left-[13px] top-[11px] sm:left-[21px] sm:top-[17px] text-[14px] sm:text-base pointer-events-none bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent">
                      Email
                    </span>
                  )}
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full block bg-[#161F48] rounded-[11px] px-3 py-2.5 sm:px-5 sm:py-4 text-[14px] sm:text-base text-white outline-none transition-colors"
                  />
                </div>
                {contactErrors.email && <p className="text-red-400 text-sm mt-1.5 ml-1">{contactErrors.email}</p>}
              </div>

              <div>
                <div className="relative rounded-xl p-[1px] bg-gradient-to-b from-hf-gold to-hf-gold-2">
                  {!contactData.mobile && (
                    <span className="absolute left-[13px] top-[11px] sm:left-[21px] sm:top-[17px] text-[14px] sm:text-base pointer-events-none bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent">
                      Phone No.
                    </span>
                  )}
                  <input
                    type="tel"
                    value={contactData.mobile}
                    onChange={(e) => setContactData({ ...contactData, mobile: e.target.value })}
                    className="w-full block bg-[#161F48] rounded-[11px] px-3 py-2.5 sm:px-5 sm:py-4 text-[14px] sm:text-base text-white outline-none transition-colors"
                  />
                </div>
                {contactErrors.mobile && <p className="text-red-400 text-sm mt-1.5 ml-1">{contactErrors.mobile}</p>}
              </div>

              <div>
                <div className="relative rounded-xl p-[1px] bg-gradient-to-b from-hf-gold to-hf-gold-2">
                  {!contactData.requirements && (
                    <span className="absolute left-[13px] top-[11px] sm:left-[21px] sm:top-[17px] text-[14px] sm:text-base pointer-events-none bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent">
                      Fill in your requirements
                    </span>
                  )}
                  <textarea
                    value={contactData.requirements}
                    onChange={(e) => setContactData({ ...contactData, requirements: e.target.value })}
                    rows={4}
                    className="w-full block bg-[#161F48] rounded-[11px] px-3 py-2.5 sm:px-5 sm:py-4 text-[14px] sm:text-base text-white outline-none transition-colors resize-none"
                  />
                </div>
                {contactErrors.requirements && <p className="text-red-400 text-sm mt-1.5 ml-1">{contactErrors.requirements}</p>}
              </div>

              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  disabled={isContactSubmitting}
                  className="px-4 py-2 sm:px-12 sm:py-3.5 bg-[#00474E] hover:bg-[#005e66] text-white text-[13px] sm:text-base font-medium rounded-lg transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-48"
                >
                  {isContactSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="fade-up-section relative w-full bg-[#161F48] pt-12 pb-24 sm:pt-16 sm:pb-32 px-4 sm:px-6 overflow-hidden min-h-[300px] flex items-center">

        {/* Layer 1: Giant Watermark Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none z-0">
          <span className="text-[14vw] sm:text-[160px] md:text-[200px] lg:text-[280px] font-semibold text-[#CCA14D]/30 leading-none tracking-[0.22em] whitespace-nowrap lowercase">
            realtors
          </span>
        </div>

        {/* Layer 2: Bottom Gradient Fade (masks the bottom half of the watermark) */}
        <div className="absolute bottom-0 left-0 w-full h-[200px] sm:h-[250px] bg-gradient-to-b from-[#161F48]/0 to-[#161F48] pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 lg:gap-6">

          {/* Logo */}
          <div className="w-56 sm:w-64 shrink-0 flex justify-center lg:justify-start">
            <Image src="/hf-realtor-logo.png" alt="Head Field Realtors" width={256} height={70} className="w-full h-auto object-contain" />
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-2 items-center lg:items-start text-center lg:text-left shrink-0">
            <a href="#" className="text-white/90 hover:text-hf-gold transition-colors text-[14px] sm:text-base font-medium">About Head Field</a>
            <a href="#" className="text-white/90 hover:text-hf-gold transition-colors text-[14px] sm:text-base font-medium">Our Expertise</a>
            <a href="#" className="text-white/90 hover:text-hf-gold transition-colors text-[14px] sm:text-base font-medium">Our Approach</a>
            <a href="#" className="text-white/90 hover:text-hf-gold transition-colors text-[14px] sm:text-base font-medium">Contact</a>
          </nav>

          {/* Social Icons */}
          <div className="relative flex gap-5 items-center justify-center shrink-0 py-6">
            <a href="#" className="text-hf-gold hover:text-hf-gold-2 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="text-hf-gold hover:text-hf-gold-2 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="#" className="text-hf-gold hover:text-hf-gold-2 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          {/* Contact Pills */}
          <div className="flex flex-col gap-4 shrink-0 w-full sm:w-auto">
            <div className="rounded-full p-[1px] bg-gradient-to-b from-hf-gold to-hf-gold-2 shadow-lg">
              <a href="mailto:info@hfrealtors.com" className="flex items-center justify-center gap-3 bg-[#161F48] rounded-full px-4 py-2 sm:px-8 sm:py-2.5 text-white/90 hover:text-white transition-colors text-[14px] sm:text-base font-medium w-full lg:w-[240px]">
                <Mail className="w-5 h-5 shrink-0 text-hf-gold" strokeWidth={2} />
                info@hfrealtors.com
              </a>
            </div>

            <div className="rounded-full p-[1px] bg-gradient-to-b from-hf-gold to-hf-gold-2 shadow-lg">
              <a href="tel:9999991036" className="flex items-center justify-center gap-3 bg-[#161F48] rounded-full px-4 py-2 sm:px-8 sm:py-2.5 text-white/90 hover:text-white transition-colors text-[14px] sm:text-base font-medium w-full lg:w-[240px]">
                <Phone className="w-5 h-5 shrink-0 text-hf-gold" strokeWidth={2} />
                9999991036
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-md bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute z-3 top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-[22px] sm:text-2xl font-semibold text-center mt-6 sm:mt-0 mb-5 sm:mb-6 px-4 sm:px-0 drop-shadow-md bg-gradient-to-b from-hf-gold to-hf-gold-2 bg-clip-text text-transparent">Own a Premium Address</h2>

            <form onSubmit={handleModalSubmit} className="flex flex-col gap-3 sm:gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  className="w-full bg-transparent border border-white/40 focus:border-white rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 text-[14px] sm:text-base text-white placeholder-white/70 outline-none transition-colors"
                />
                {modalErrors.name && <p className="text-red-400 text-sm mt-1 ml-1">{modalErrors.name}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Mobile No."
                  value={modalData.mobile}
                  onChange={(e) => setModalData({ ...modalData, mobile: e.target.value })}
                  className="w-full bg-transparent border border-white/40 focus:border-white rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 text-[14px] sm:text-base text-white placeholder-white/70 outline-none transition-colors"
                />
                {modalErrors.mobile && <p className="text-red-400 text-sm mt-1 ml-1">{modalErrors.mobile}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={modalData.email}
                  onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
                  className="w-full bg-transparent border border-white/40 focus:border-white rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 text-[14px] sm:text-base text-white placeholder-white/70 outline-none transition-colors"
                />
                {modalErrors.email && <p className="text-red-400 text-sm mt-1 ml-1">{modalErrors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={isModalSubmitting}
                className="w-[80%] sm:w-1/2 mx-auto mt-2 bg-sobha-rivana hover:brightness-110 text-[13px] sm:text-base text-white font-medium py-2.5 sm:py-3.5 rounded-xl transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isModalSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
