import { Mail, MapPin, PhoneCall } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { contactService } from "../../apis/contact";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      comment: formData.comment.trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.subject ||
      !payload.comment
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await contactService.submitContactAPI(payload);
      toast.success("Your message has been sent.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        comment: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_28%,#f8f5ff_100%)]">
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-90 bg-[radial-gradient(circle_at_top_left,rgba(112,79,230,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(25,86,106,0.16),transparent_32%)]" />

        <div className="px-4 pb-12 pt-6 sm:px-8 lg:px-12 xl:px-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-4xl border border-white/70 bg-white/75 px-6 py-8 shadow-[0_24px_80px_rgba(34,40,84,0.08)] backdrop-blur-sm sm:px-8 lg:px-10 lg:py-10">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium sm:text-[15px]">
              <a
                href="/"
                className="font-poppins text-[#6B7280] transition-colors hover:text-[#19566A]"
              >
                Home
              </a>
              <span className="text-[#9CA3AF]">/</span>
              <span className="font-poppins text-[#19566A]">Contact</span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-end">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#704FE6]">
                  Contact us
                </span>
                <h1 className="mt-5 text-4xl font-semibold leading-tight text-[#163541] sm:text-5xl lg:text-[58px]">
                  Let&apos;s build a smoother learning experience together.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#64748B] sm:text-lg">
                  Whether you have a question, feedback, or a partnership idea,
                  our team is ready to listen and support you quickly.
                </p>
              </div>

              <div className="grid gap-4 rounded-[28px] border border-[#E8ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f6f8fc_100%)] p-5 shadow-[0_18px_50px_rgba(24,39,75,0.08)] sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl bg-[#F8FAFC] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                    Reply time
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[#163541]">
                    Within 24 hours
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F8FAFC] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                    Support
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[#163541]">
                    Friendly & dedicated
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F8FAFC] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#704FE6]">
                    Best for
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[#163541]">
                    Learners & partners
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-20 sm:px-8 lg:px-12 xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="group rounded-[28px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_18px_55px_rgba(24,39,75,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(24,39,75,0.14)]">
                <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#704FE6_0%,#8C72F0_100%)] shadow-[0_16px_30px_rgba(112,79,230,0.28)]">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-[26px] font-semibold text-[#163541]">
                  Mail Address
                </h3>
                <p className="mt-3 text-[16px] leading-7 text-[#64748B]">
                  HiEntertainment@gmail.com
                </p>
                <p className="mt-2 text-sm font-medium text-[#704FE6]">
                  Best for general inquiries and support
                </p>
              </div>

              <div className="group rounded-[28px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_18px_55px_rgba(24,39,75,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(24,39,75,0.14)]">
                <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#19566A_0%,#2E7C95_100%)] shadow-[0_16px_30px_rgba(25,86,106,0.24)]">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-[26px] font-semibold text-[#163541]">
                  Office Address
                </h3>
                <p className="mt-3 text-[16px] leading-7 text-[#64748B]">
                  Digital Agency Network
                </p>
                <p className="text-[16px] leading-7 text-[#64748B]">
                  Eastbourne Terrace
                </p>
                <p className="mt-2 text-sm font-medium text-[#19566A]">
                  Visit us for partnership and business meetings
                </p>
              </div>

              <div className="group rounded-[28px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_18px_55px_rgba(24,39,75,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(24,39,75,0.14)] md:col-span-2 xl:col-span-1">
                <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#F59E0B_0%,#F97316_100%)] shadow-[0_16px_30px_rgba(245,158,11,0.26)]">
                  <PhoneCall className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-[26px] font-semibold text-[#163541]">
                  Phone Number
                </h3>
                <p className="mt-3 text-[16px] leading-7 text-[#64748B]">
                  +100000000000
                </p>
                <p className="text-[16px] leading-7 text-[#64748B]">
                  +100000000000
                </p>
                <p className="mt-2 text-sm font-medium text-[#C56A0B]">
                  Reach us directly for urgent assistance
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)]">
              <div className="relative overflow-hidden rounded-4xl bg-[linear-gradient(155deg,#173744_0%,#19566A_45%,#704FE6_100%)] p-8 text-white shadow-[0_22px_70px_rgba(26,38,78,0.22)] sm:p-10">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/90">
                    Why contact us
                  </span>
                  <h2 className="mt-6 text-3xl font-semibold leading-tight sm:text-[38px]">
                    We&apos;re here to help you move forward with confidence.
                  </h2>
                  <p className="mt-5 text-[15px] leading-8 text-white/80">
                    Share your issue, idea, or feedback and our team will get
                    back with a clear and thoughtful response.
                  </p>

                  <div className="mt-10 space-y-4">
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                        Reliable support
                      </p>
                      <p className="mt-2 text-base leading-7 text-white">
                        Clear communication, fast follow-up, and practical help
                        for every message you send.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                        Human-first experience
                      </p>
                      <p className="mt-2 text-base leading-7 text-white">
                        We review each request carefully so your conversation
                        feels personal, not automated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-4xl border border-white/80 bg-white/95 p-6 shadow-[0_24px_80px_rgba(34,40,84,0.10)] backdrop-blur-sm sm:p-8 lg:p-10">
                <div className="max-w-2xl">
                  <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#704FE6]">
                    Send a message
                  </span>
                  <h2 className="mt-5 text-[34px] font-semibold leading-tight text-[#163541] sm:text-[42px]">
                    Drop Us a Line
                  </h2>
                  <p className="mt-3 text-[15px] leading-7 text-[#64748B]">
                    Your email address will not be published. Required fields
                    are marked{" "}
                    <span className="font-semibold text-red-500">*</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#E7ECF3] bg-[#F8FAFC] px-5 py-4 text-[16px] text-[#314155] placeholder-[#8A94A6] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-300 focus:border-[#704FE6] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#704FE6]/10"
                      required
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#E7ECF3] bg-[#F8FAFC] px-5 py-4 text-[16px] text-[#314155] placeholder-[#8A94A6] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-300 focus:border-[#704FE6] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#704FE6]/10"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone (Optional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#E7ECF3] bg-[#F8FAFC] px-5 py-4 text-[16px] text-[#314155] placeholder-[#8A94A6] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-300 focus:border-[#704FE6] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#704FE6]/10"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject *"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#E7ECF3] bg-[#F8FAFC] px-5 py-4 text-[16px] text-[#314155] placeholder-[#8A94A6] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-300 focus:border-[#704FE6] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#704FE6]/10"
                    />
                  </div>

                  <div>
                    <textarea
                      name="comment"
                      placeholder="Write your message here *"
                      value={formData.comment}
                      onChange={handleChange}
                      rows={7}
                      className="w-full resize-none rounded-2xl border border-[#E7ECF3] bg-[#F8FAFC] px-5 py-4 text-[16px] leading-7 text-[#314155] placeholder-[#8A94A6] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-300 focus:border-[#704FE6] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#704FE6]/10"
                    />
                  </div>

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-6 text-[#7C8798]">
                      We usually respond with a helpful answer as soon as
                      possible.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#704FE6_0%,#5B3FD2_100%)] px-8 py-4 text-[16px] font-semibold text-white shadow-[0_18px_35px_rgba(112,79,230,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(112,79,230,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
