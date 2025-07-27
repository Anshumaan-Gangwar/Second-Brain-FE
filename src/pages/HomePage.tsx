import { Link } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";
import logo2 from "../assets/logo2.jpg";

export default function HomePage(): JSX.Element {
  const phrases = [
    "Your Second Brain.",
    "Your Idea Hub.",
    "Your Thought Garden.",
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (index === phrases.length) return;

    const timeout = setTimeout(() => {
      setText(phrases[index].substring(0, subIndex));
      if (!reverse) {
        if (subIndex < phrases[index].length) {
          setSubIndex((prev) => prev + 1);
        } else {
          setReverse(true);
          setTimeout(() => {}, 1000);
        }
      } else {
        if (subIndex > 0) {
          setSubIndex((prev) => prev - 1);
        } else {
          setReverse(false);
          setIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, reverse ? 60 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full border border-[#DDD0C8] shadow-md rounded-2xl p-10 bg-[#FDF6F0]">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#5C4033] mb-4 text-center">
          Welcome to <span className="text-[#A47148]">Conscious</span>
        </h1>

        {/* Typewriter */}
        <p className="text-lg sm:text-xl text-[#7B5E57] mb-6 text-center h-6">
          {text}
          <span className="animate-pulse">|</span>
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link to="/Signin">
            <button className="bg-[#A47148] hover:bg-[#8a5d3c] text-white px-8 py-3 rounded-full text-base sm:text-lg font-semibold transition-colors duration-300">
              Get Started
            </button>
          </Link>
        </div>

        {/* Section Divider */}
        <div className="mt-10 border-t border-[#D7CCC8] pt-6 text-center text-sm text-[#8D6E63]">
          <p>Built for mindful knowledge management.</p>
        </div>

        {/* Optional Logo */}
        <div className="mt-6 flex justify-center">
          <img
            src={logo2}
            alt="Illustration"
            className="w-20 h-20 rounded-full border-2 border-[#A47148] shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}

