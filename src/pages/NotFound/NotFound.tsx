import { motion } from "framer-motion";
import { Home, ArrowLeft, Ghost } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center 
    bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Custom Card */}
        <div
          className="relative bg-white/5 backdrop-blur-2xl border 
        border-white/10 rounded-2xl shadow-2xl p-12 text-center overflow-hidden"
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 bg-linear-to-r 
          from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl opacity-50"
          />

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Icon */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-full bg-white/10 border border-white/10"
            >
              <Ghost className="w-16 h-16 text-indigo-400" />
            </motion.div>

            {/* 404 */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-8xl font-extrabold bg-linear-to-r from-indigo-400 
              via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              404
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-semibold"
            >
              Page Not Found
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-300 max-w-md leading-relaxed"
            >
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </motion.p>

            {/* Custom Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mt-6"
            >
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-6 py-3 
                rounded-2xl bg-white text-slate-900 font-semibold hover:scale-105 
                active:scale-95 transition-transform duration-200 shadow-lg"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>

              {/* Home Button */}
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 px-6 py-3 
                rounded-2xl border border-white/20 text-white font-semibold 
                hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Home size={18} />
                Go Home
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
