import { useState } from "react";

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    nationality: "",
    phone: "",
    professionalTitle: "",
    begunStudies: "",
    highestDegree: "",
    bioExperience: "",
    agreeToTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      nationality: "",
      phone: "",
      professionalTitle: "",
      begunStudies: "",
      highestDegree: "",
      bioExperience: "",
      agreeToTerms: false,
    });
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
          <a
            href="/lecturer"
            className="text-[#737A86] font-poppins hover:text-[#4D5756] transition-colors cursor-pointer"
          >
            Lecture
          </a>
          <span className="text-[#737A86]">›</span>
          <span className="text-[#737A86] font-poppins">Registration</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-20 py-16">
        <div className="bg-[#F2F2F2] rounded-lg p-12">
          <h1 className="text-[30px] font-bold text-[#190D30] mb-8">
            LECTURER REGISTRATION
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Profile Information Section */}
            <div className="mb-8">
              <h2 className="text-[18px] font-semibold text-[#190D30] mb-6">
                Profile Information
              </h2>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[14px] text-[#190D30] mb-2 font-poppins">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[14px] 
                             text-[#333931] font-poppins focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] text-[#190D30] mb-2 font-poppins">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[14px] 
                             text-[#333931] font-poppins focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                    required
                  />
                </div>
              </div>

              {/* Birth Date & Gender */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[14px] text-[#190D30] mb-2 font-poppins">
                    Birth Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[14px] 
                             text-[#333931] font-poppins focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] text-[#190D30] mb-2 font-poppins">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[14px] 
                             text-[#333931] font-poppins focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Nationality */}
              <div className="mb-6">
                <label className="block text-[14px] text-[#190D30] mb-2 font-poppins">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[14px] 
                           text-[#333931] font-poppins focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                  required
                >
                  <option value="">Viet Nam</option>
                  <option value="vietnam">Vietnam</option>
                  <option value="usa">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Phone & Professional Title */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[14px] text-[#190D30] mb-2 font-poppins">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[14px] 
                             text-[#333931] font-poppins focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] text-[#190D30] mb-2 font-poppins">
                    Professional Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="professionalTitle"
                    value={formData.professionalTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[14px] 
                             text-[#333931] font-poppins focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                    required
                  />
                </div>
              </div>

              {/* Begun Studies */}
              <div className="mb-6">
                <label className="block text-[14px] text-[#190D30] mb-2 font-poppins">
                  Begun Studies <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="begunStudies"
                  value={formData.begunStudies}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[14px] 
                           text-[#333931] font-poppins focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                  required
                />
              </div>

              {/* Highest Degree */}
              <div className="mb-6">
                <label className="block text-[14px] text-[#190D30] mb-2 font-poppins">
                  Highest Degree <span className="text-red-500">*</span>
                </label>
                <select
                  name="highestDegree"
                  value={formData.highestDegree}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[14px] 
                           text-[#333931] font-poppins focus:outline-none focus:ring-2 focus:ring-[#704FE6]"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-[14px] text-[#737A86] mb-2 font-poppins">
                  Choose File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                  <input
                    type="file"
                    className="hidden"
                    id="fileUpload"
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer text-[14px] text-[#737A86] font-poppins"
                  >
                    No File Chosen
                  </label>
                </div>
              </div>

              {/* Bio / Experience */}
              <div className="mb-6">
                <label className="block text-[14px] text-[#190D30] mb-2 font-poppins">
                  Bio / Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="bioExperience"
                  value={formData.bioExperience}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[14px] 
                           text-[#333931] font-poppins focus:outline-none focus:ring-2 focus:ring-[#704FE6] resize-none"
                  required
                />
              </div>

              {/* Agree to Terms */}
              <div className="mb-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#704FE6] border-gray-300 rounded focus:ring-[#704FE6]"
                    required
                  />
                  <span className="text-[14px] text-[#333931] font-poppins">
                    Agree To All Terms
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#704FE6] text-white text-[15px] font-medium 
                           rounded-full hover:bg-[#5F3DD4] transition-colors flex items-center gap-2"
                >
                  Submit Now
                  <span className="text-lg">→</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3 bg-[#FC6441] text-white text-[15px] font-medium 
                           rounded-full hover:bg-[#E5543A] transition-colors flex items-center gap-2"
                >
                  Cancel
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
