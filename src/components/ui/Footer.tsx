import { Link } from "react-router-dom";
import FacebookIcon from "../../assets/facebook.svg?react";
import InstagramIcon from "../../assets/instagram.svg?react";
import Logo from "/logo.png";

const Footer = () => {
  return (
    <footer
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_35%,#f7f4ff_100%)] 
    px-4 pt-16 text-[#163541] sm:px-8 lg:px-12 xl:px-20"
    >
      <div
        className="absolute inset-x-0 top-0 h-40 
      bg-[radial-gradient(circle_at_top_left,rgba(112,79,230,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(80,180,220,0.14),transparent_28%)]"
      />
      <div className="absolute -right-30 top-16 h-72 w-72 rounded-full bg-[#704FE6]/10 blur-3xl" />
      <div className="absolute bottom-0 -left-30 h-72 w-72 rounded-full bg-[#2E7C95]/8 blur-3xl" />

      <div className="relative mx-auto max-w-8xl">
        <div
          className="rounded-4xl border border-white/70 
        bg-white/85 px-6 py-8 shadow-[0_26px_70px_rgba(34,40,84,0.08)] 
        backdrop-blur-sm sm:px-8 sm:py-10 lg:px-10 lg:py-12"
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="max-w-xl">
              <div className="inline-flex items-end gap-3">
                <div
                  className="flex h-17 w-17 items-center justify-center rounded-[22px] 
                border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f4f7fb_100%)] 
                shadow-[0_18px_35px_rgba(34,40,84,0.10)]"
                >
                  <img src={Logo} className="h-13 w-13 object-contain" alt="" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#704FE6]">
                    Edu platform
                  </p>
                  <h1 className="text-[34px] font-bold leading-none text-[#163541]">
                    Learn
                  </h1>
                </div>
              </div>

              <p className="mt-6 max-w-lg text-[17px] leading-8 text-[#64748B]">
                A learning space built to make studying feel clearer, more
                modern, and more connected from the first click to the final
                lesson.
              </p>

              <p
                className="mt-3 text-[17px] font-poppins leading-7 text-[#64748B] 
              transition-colors hover:text-[#19566A]"
              >
                Inline: technical_eduLearn@gmail.com
              </p>

              <div
                className="mt-8 rounded-[28px] border border-[#E7ECF3] 
              bg-[linear-gradient(145deg,#ffffff_0%,#f8faff_100%)] 
              p-5 shadow-[0_16px_40px_rgba(34,40,84,0.06)]"
              >
                <p className="text-[22px] font-semibold text-[#163541]">
                  Connect with us
                </p>
                <p className="mt-2 text-[15px] leading-7 text-[#64748B]">
                  Follow our channels for updates, community moments, and
                  helpful learning content.
                </p>

                <div className="mt-5 flex items-center gap-4">
                  <Link to="https://facebook.com" className="cursor-pointer">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full 
                    border border-[#DCE7F0] bg-white transition duration-300 
                    hover:-translate-y-0.5 hover:border-[#704FE6]/20 hover:bg-[#704FE6]/5 
                    hover:shadow-[0_18px_28px_rgba(112,79,230,0.14)]"
                    >
                      <FacebookIcon className="h-6 w-6 fill-[#19566A]" />
                    </div>
                  </Link>
                  <Link to="https://instagram.com" className="cursor-pointer">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full 
                    border border-[#DCE7F0] bg-white transition duration-300 hover:-translate-y-0.5 
                    hover:border-[#704FE6]/20 hover:bg-[#704FE6]/5 hover:shadow-[0_18px_28px_rgba(112,79,230,0.14)]"
                    >
                      <InstagramIcon className="h-6 w-6 fill-[#19566A]" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <ul
                className="rounded-[26px] border border-[#E7ECF3] 
              bg-[linear-gradient(145deg,#ffffff_0%,#f9fbff_100%)] 
              p-6 shadow-[0_16px_40px_rgba(34,40,84,0.05)]"
              >
                <h3 className="text-[24px] font-bold text-[#163541]">Links</h3>
                <li
                  className="mt-5 text-[17px] font-poppins text-[#64748B] 
                transition-colors hover:text-[#19566A]"
                >
                  Home
                </li>
                <li className="mt-3 text-[17px] font-poppins text-[#64748B] transition-colors hover:text-[#19566A]">
                  Help Center
                </li>
                <li className="mt-3 text-[17px] font-poppins text-[#64748B] transition-colors hover:text-[#19566A]">
                  Services
                </li>
              </ul>

              <ul className="rounded-[26px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f9fbff_100%)] p-6 shadow-[0_16px_40px_rgba(34,40,84,0.05)]">
                <h3 className="text-[24px] font-bold text-[#163541]">
                  Resource
                </h3>
                <li className="mt-5 text-[17px] font-poppins text-[#64748B] transition-colors hover:text-[#19566A]">
                  About Us
                </li>
                <li className="mt-3 text-[17px] font-poppins text-[#64748B] transition-colors hover:text-[#19566A]">
                  Carrier
                </li>
                <li className="mt-3 text-[17px] font-poppins text-[#64748B] transition-colors hover:text-[#19566A]">
                  Legal Notice
                </li>
              </ul>

              <ul className="rounded-[26px] border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f9fbff_100%)] p-6 shadow-[0_16px_40px_rgba(34,40,84,0.05)] sm:col-span-2 xl:col-span-1">
                <h3 className="text-[24px] font-bold text-[#163541]">
                  Contact
                </h3>
                <li className="mt-5 text-[17px] font-poppins leading-7 text-[#64748B] transition-colors hover:text-[#19566A]">
                  280 An Duong Vuong
                </li>
                <li className="mt-3 text-[17px] font-poppins leading-7 text-[#64748B] transition-colors hover:text-[#19566A]">
                  Hotline: 0123456789
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#E6EBF2] py-8">
          <p className="text-center text-[15px] font-medium tracking-[0.06em] text-[#7C8798] sm:text-[16px]">
            @Copyright 2025 by EduLearn
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
