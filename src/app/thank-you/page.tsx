import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-hf-navy text-white flex items-center justify-center font-sans">
      <div className="bg-hf-royal-blue/50 backdrop-blur-md border border-hf-gold/30 p-12 rounded-3xl text-center max-w-lg mx-4">
        <CheckCircle className="w-20 h-20 text-hf-gold mx-auto mb-6" />
        <h1 className="font-serif text-4xl mb-4">Thank You!</h1>
        <p className="text-gray-300 mb-8 font-light tracking-wide text-lg">
          Your inquiry has been successfully submitted. One of our premium property advisors will contact you shortly.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-hf-gold text-hf-navy px-8 py-3 rounded-full font-medium hover:bg-white transition-colors duration-300"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
