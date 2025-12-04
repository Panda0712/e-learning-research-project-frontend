import { Mail, MapPin, PhoneCall } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    comment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="flex-1 bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#F2F2F2] px-20 py-6">
        <div className="flex items-center gap-2 text-[16px]">
          <a
            href="/"
            className="text-[#737A86] font-poppins hover:text-[#4D5756] transition-colors cursor-pointer"
          >
            Home
          </a>
          <span className="text-[#737A86]">›</span>
          <span className="text-[#737A86] font-poppins">Contacts</span>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="px-20 py-16">
        <div className="grid grid-cols-3 gap-8 mb-16">
          {/* Mail Address Card */}
          <div className="bg-white rounded-lg p-8 flex flex-col items-center text-center shadow-md">
            <div className="w-16 h-16 bg-[#704FE6] rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-[24px] font-semibold text-[#000000] mb-2">
              Mail Address
            </h3>
            <p className="text-[16px] text-[#737A86] font-poppins">
              HiEntertainment@gmail.com
            </p>
          </div>

          {/* Office Address Card */}
          <div className="bg-white rounded-lg p-8 flex flex-col items-center text-center shadow-md">
            <div className="w-16 h-16 bg-[#704FE6] rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-[24px] font-semibold text-[#000000] mb-2">
              Office address
            </h3>
            <p className="text-[16px] text-[#737A86] font-poppins">
              Digital Agency Network
            </p>
            <p className="text-[16px] text-[#737A86] font-poppins">
              Eastbourne Terrace
            </p>
          </div>

          {/* Phone Number Card */}
          <div className="bg-white rounded-lg p-8 flex flex-col items-center text-center shadow-md">
            <div className="w-16 h-16 bg-[#704FE6] rounded-lg flex items-center justify-center mb-4">
              <PhoneCall className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-[24px] font-semibold text-[#000000] mb-2">
              Phone Number
            </h3>
            <p className="text-[16px] text-[#737A86] font-poppins">
              +100000000000
            </p>
            <p className="text-[16px] text-[#737A86] font-poppins">
              +100000000000
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg p-12 shadow-md">
          <h2 className="text-[40px] font-semibold text-[#4D5756] mb-2">
            Drop Us a Line
          </h2>
          <p className="text-[14px] text-[#737A86] mb-8 font-poppins">
            Your email address will not be published. Required fields are marked{" "}
            <span className="text-red-500">*</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#F2F2F2] rounded-lg text-[16px] 
                         text-[#737A86] font-poppins placeholder-[#737A86] 
                         focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                required
              />
            </div>

            {/* Email and Phone Fields */}
            <div className="grid grid-cols-2 gap-6">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="px-6 py-4 bg-[#F2F2F2] rounded-lg text-[16px] 
                         text-[#737A86] font-poppins placeholder-[#737A86] 
                         focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="px-6 py-4 bg-[#F2F2F2] rounded-lg text-[16px] 
                         text-[#737A86] font-poppins placeholder-[#737A86] 
                         focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
              />
            </div>

            {/* Subject Field */}
            <div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#F2F2F2] rounded-lg text-[16px] 
                         text-[#737A86] font-poppins placeholder-[#737A86] 
                         focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
              />
            </div>

            {/* Comment Field */}
            <div>
              <textarea
                name="comment"
                placeholder="Comment"
                value={formData.comment}
                onChange={handleChange}
                rows={6}
                className="w-full px-6 py-4 bg-[#F2F2F2] rounded-lg text-[16px] 
                         text-[#737A86] font-poppins placeholder-[#737A86] 
                         focus:outline-none focus:ring-2 focus:ring-[#704FE6] 
                         resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-8 py-4 bg-[#704FE6] text-white text-[16px] font-medium 
                       rounded-lg hover:bg-[#5F3DD4] transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
