import { Home } from "lucide-react";
import ParticlesBackground from "/particles.png";
import { Link } from "react-router-dom";
import AstronautSvg from "../../assets/astronaut.svg?react";
import PlanetSvg from "../../assets/planet.svg?react";

function AccessDenied() {
  return (
    <div className="w-screen h-screen bg-[#25344C] text-white">
      <div
        className="w-full h-full flex flex-col items-center justify-center bg-repeat bg-center animate-stars"
        style={{
          backgroundImage: `url(${ParticlesBackground})`,
          backgroundSize: "contain",
          //   animation: "stars 8s linear infinite alternate",
        }}
      >
        {/* Title */}
        <h1 className="text-[55px] font-extrabold mb-2">Access Denied</h1>

        {/* Description */}
        <p className="text-[18px] leading-6.25 max-w-87.5 text-center">
          LOST IN{" "}
          <span className="relative inline-block">
            SPACE
            <span className="absolute left-0 top-[43%] w-full border-b-[3px] border-[#fdba26]" />
          </span>{" "}
          <span className="text-[#fdba26] font-medium">EduLearn</span>?
          <br />
          Hmm, looks like you do not have permission to access this page.
        </p>

        {/* Planet area */}
        <div className="w-97.5 h-97.5 relative mt-4">
          {/* Astronaut */}
          <AstronautSvg className="w-12.5 h-12.5 absolute top-5 right-6.25 animate-spin-slow" />

          {/* Planet */}
          <PlanetSvg className="w-full h-full" />
        </div>

        {/* Button */}
        <Link
          to="/"
          className="mt-4 flex items-center gap-2 border border-white px-4 py-2 
          rounded hover:text-[#fdba26] hover:border-[#fdba26] transition"
        >
          <Home size={18} />
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default AccessDenied;
