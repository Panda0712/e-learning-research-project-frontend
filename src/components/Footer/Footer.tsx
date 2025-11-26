import { Link } from "react-router-dom";
import FacebookIcon from "../../assets/facebook.svg?react";
import InstagramIcon from "../../assets/instagram.svg?react";
import Logo from "/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#0166ff] px-20 pt-20">
      <div className="flex justify-between">
        <div className="flex flex-col gap-5 items-start">
          <div className="flex items-end">
            <img src={Logo} className="w-[65px] h-[65px]" alt="" />
            <h1 className="text-[30px] text-white font-bold leading-none">
              Learn
            </h1>
          </div>
          <p className="text-[25px] text-white font-medium font-poppins">
            Connect with us
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="https://facebook.com" className="cursor-pointer">
              <div
                className="flex items-center justify-center 
              w-10 h-10 rounded-full bg-[#327186] transition hover:opacity-85"
              >
                <FacebookIcon className="w-6 h-6 fill-white" />
              </div>
            </Link>
            <Link to="https://instagram.com" className="cursor-pointer">
              <div
                className="flex items-center justify-center 
              w-10 h-10 rounded-full bg-[#327186] transition hover:opacity-85"
              >
                <InstagramIcon className="w-6 h-6 fill-white" />
              </div>
            </Link>
          </div>
        </div>

        <div className="flex justify-between gap-30">
          <ul className="flex flex-col gap-4">
            <h3 className="font-bold text-[30px] text-white">Links</h3>
            <li className="font-regular text-[20px] font-poppins text-white">
              Home
            </li>
            <li className="font-regular text-[20px] font-poppins text-white">
              Help Center
            </li>
            <li className="font-regular text-[20px] font-poppins text-white">
              Services
            </li>
          </ul>
          <ul className="flex flex-col gap-4">
            <h3 className="font-bold text-[30px] text-white">Resource</h3>
            <li className="font-regular text-[20px] font-poppins text-white">
              About Us
            </li>
            <li className="font-regular text-[20px] font-poppins text-white">
              Carrier
            </li>
            <li className="font-regular text-[20px] font-poppins text-white">
              Legal Notice
            </li>
          </ul>
          <ul className="flex flex-col gap-4">
            <h3 className="font-bold text-[30px] text-white">Contact</h3>
            <li className="font-regular text-[20px] font-poppins text-white">
              280 An Duong Vuong
            </li>
            <li className="font-regular text-[20px] font-poppins text-white">
              Inline: technical_eduLearn@gmail.com
            </li>
            <li className="font-regular text-[20px] font-poppins text-white">
              Hotline: 0123456789
            </li>
          </ul>
        </div>
      </div>

      <div className="py-10 border-t border-white mt-40">
        <p className="font-regular text-[20px] text-white text-center">
          @Copyright 2025 by EduLearn
        </p>
      </div>
    </footer>
  );
};

export default Footer;
