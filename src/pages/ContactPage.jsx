import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ContactPage = () => {
  const formRef = useRef(null);

  useEffect(() => {
    // Animate form on page load
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        // loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/video/office 1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Contact Form */}
      <div className="relative z-20 flex justify-center items-center h-full px-4 bg-transparent ">
        <div
          ref={formRef}
          className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-lg"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Contact Us
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows="4"
                placeholder="Your Message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
