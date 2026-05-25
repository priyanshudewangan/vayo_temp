"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countries = [
  { value: "+1", iso: "US", label: "US +1" },
  { value: "+1", iso: "CA", label: "CA +1" },
  { value: "+44", iso: "GB", label: "GB +44" },
  { value: "+91", iso: "IN", label: "IN +91" },
  { value: "+61", iso: "AU", label: "AU +61" },
  { value: "+65", iso: "SG", label: "SG +65" },
  { value: "+971", iso: "AE", label: "AE +971" },
  { value: "+33", iso: "FR", label: "FR +33" },
  { value: "+49", iso: "DE", label: "DE +49" },
  { value: "+81", iso: "JP", label: "JP +81" },
  { value: "+82", iso: "KR", label: "KR +82" },
  { value: "+86", iso: "CN", label: "CN +86" },
  { value: "+852", iso: "HK", label: "HK +852" },
  { value: "+39", iso: "IT", label: "IT +39" },
  { value: "+34", iso: "ES", label: "ES +34" },
  { value: "+31", iso: "NL", label: "NL +31" },
  { value: "+41", iso: "CH", label: "CH +41" },
  { value: "+46", iso: "SE", label: "SE +46" },
  { value: "+64", iso: "NZ", label: "NZ +64" },
  { value: "+353", iso: "IE", label: "IE +353" },
  { value: "+60", iso: "MY", label: "MY +60" },
  { value: "+62", iso: "ID", label: "ID +62" },
  { value: "+66", iso: "TH", label: "TH +66" },
  { value: "+63", iso: "PH", label: "PH +63" },
  { value: "+84", iso: "VN", label: "VN +84" },
  { value: "+55", iso: "BR", label: "BR +55" },
  { value: "+52", iso: "MX", label: "MX +52" },
  { value: "+27", iso: "ZA", label: "ZA +27" },
  { value: "+7", iso: "RU", label: "RU +7" },
  { value: "+380", iso: "UA", label: "UA +380" },
  { value: "+48", iso: "PL", label: "PL +48" },
  { value: "+90", iso: "TR", label: "TR +90" },
  { value: "+966", iso: "SA", label: "SA +966" },
  { value: "+972", iso: "IL", label: "IL +972" },
  { value: "+20", iso: "EG", label: "EG +20" },
  { value: "+92", iso: "PK", label: "PK +92" },
  { value: "+880", iso: "BD", label: "BD +880" },
  { value: "+94", iso: "LK", label: "LK +94" },
  { value: "+977", iso: "NP", label: "NP +977" },
  { value: "+968", iso: "OM", label: "OM +968" },
  { value: "+974", iso: "QA", label: "QA +974" },
  { value: "+973", iso: "BH", label: "BH +973" },
  { value: "+965", iso: "KW", label: "KW +965" },
  { value: "+962", iso: "JO", label: "JO +962" },
  { value: "+961", iso: "LB", label: "LB +961" },
  { value: "+963", iso: "SY", label: "SY +963" },
  { value: "+212", iso: "MA", label: "MA +212" },
  { value: "+213", iso: "DZ", label: "DZ +213" },
  { value: "+216", iso: "TN", label: "TN +216" },
  { value: "+218", iso: "LY", label: "LY +218" }
];

function JoinFormContent() {
  const searchParams = useSearchParams();
  const [countryCode, setCountryCode] = useState("");
  const [iso, setIso] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phonePreview, setPhonePreview] = useState("");
  const [phoneValidation, setPhoneValidation] = useState("");
  const [phoneValidationStatus, setPhoneValidationStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastError, setToastError] = useState(false);
  const [email, setEmail] = useState("");
  
  const toastTimerRef = useRef(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    async function detectCountry() {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) return;
        const data = await response.json();
        const code = data.country_code;
        const option = countries.find(opt => opt.iso === code);
        if (option) {
          setCountryCode(option.value);
          setIso(option.iso);
        }
      } catch (error) {
        console.log("Geolocation detection failed, manual selection needed");
      }
    }
    detectCountry();
  }, []);

  const validatePhoneNumberState = (ccode, ciso, pnumber) => {
    if (!ccode || !pnumber) {
      setPhoneValidation("");
      setPhoneValidationStatus("idle");
      return false;
    }
    if (!ciso) {
      setPhoneValidation("✗ Country not supported");
      setPhoneValidationStatus("invalid");
      return false;
    }
    
    try {
      if (isValidPhoneNumber(String(pnumber), ciso)) {
        setPhoneValidation("✓ Valid phone number");
        setPhoneValidationStatus("valid");
        return true;
      }
    } catch (_) {}

    setPhoneValidation("✗ Invalid phone number");
    setPhoneValidationStatus("invalid");
    return false;
  };

  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    setPhoneNumber(rawVal);
    validatePhoneNumberState(countryCode, iso, rawVal);
    updatePreview(countryCode, rawVal);
  };

  const handleCountryChange = (selectedIso) => {
    const option = countries.find(opt => opt.iso === selectedIso);
    const val = option ? option.value : "";
    setIso(selectedIso);
    setCountryCode(val);
    validatePhoneNumberState(val, selectedIso, phoneNumber);
    updatePreview(val, phoneNumber);
  };

  const updatePreview = (ccode, pnumber) => {
    if (!ccode || !pnumber) {
      setPhonePreview("");
      return;
    }
    let fullNum = pnumber;
    if (!pnumber.startsWith("+")) {
      fullNum = ccode + pnumber;
    }
    try {
      const parsed = parsePhoneNumber(fullNum);
      if (parsed) {
        setPhonePreview(`Preview: ${parsed.formatInternational()}`);
        return;
      }
    } catch (_) {}
    setPhonePreview(`Preview: ${fullNum}`);
  };

  const showToast = (message, isErr = false) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    setToastError(isErr);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPhoneValid = validatePhoneNumberState(countryCode, iso, phoneNumber);
    if (!isPhoneValid) {
      showToast("Please enter a valid phone number.", true);
      return;
    }

    const formEl = e.target;
    const formData = new FormData(formEl);
    
    let fullPhone = phoneNumber;
    if (!phoneNumber.startsWith("+")) {
      fullPhone = countryCode + phoneNumber;
    }
    formData.set("phone", fullPhone);

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/vayocommune@gmail.com", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        showToast("Success! You've joined the waitlist.");
        formEl.reset();
        setPhoneNumber("");
        setPhonePreview("");
        setPhoneValidation("");
        setPhoneValidationStatus("idle");
        setEmail("");
      } else {
        showToast("Oops! Submission failed. Please try again.", true);
      }
    } catch (error) {
      showToast("An error occurred. Please check your connection.", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full h-14 px-5 bg-black/20 border border-white/10 rounded-2xl text-white font-sans text-base focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 focus-visible:bg-black/40 transition-all duration-300 placeholder:text-white/20";
  const labelClass = "block text-[13px] font-medium text-white/70 mb-2 ml-1";

  return (
    <>
      {/* Background Dimming Overlay */}
      <div className="fixed inset-0 bg-[#050508]/60 backdrop-blur-[8px] z-0 pointer-events-none"></div>

      <section className="flex items-start md:items-center justify-center min-h-screen relative z-10 px-4 py-24 md:py-10">
        
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
          <div className="absolute w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-[120px] animate-pulse mix-blend-screen translate-x-[-20%] translate-y-[-20%]"></div>
          <div className="absolute w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-[20%] translate-y-[20%]" style={{ animationDelay: "2s" }}></div>
        </div>

        {/* Premium Glassmorphism Card */}
        <div className="w-full max-w-xl mx-auto relative z-10 bg-white/[0.03] backdrop-blur-[40px] border border-white/[0.08] rounded-[2.5rem] p-7 md:p-12 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
          
          {/* Subtle Shine Effect */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 text-center">
              Join the Waitlist
            </h2>
            <p className="text-sm md:text-base text-white/60 mb-10 leading-relaxed font-medium text-center px-4">
              Be the first to experience something extraordinary. Get exclusive early access and special launch benefits.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className={labelClass}>First Name <span className="text-indigo-400">*</span></Label>
                  <Input 
                    type="text" 
                    id="firstName"
                    name="firstName" 
                    placeholder="Rahul" 
                    required
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className={labelClass}>Last Name <span className="text-indigo-400">*</span></Label>
                  <Input 
                    type="text" 
                    id="lastName"
                    name="lastName" 
                    placeholder="Sharma" 
                    required 
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className={labelClass}>Email Address <span className="text-indigo-400">*</span></Label>
                <Input 
                  type="email" 
                  id="email"
                  name="email" 
                  placeholder="hello@example.com" 
                  required 
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber" className={labelClass}>Phone Number <span className="text-indigo-400">*</span></Label>
                <div className="flex gap-3 relative">
                  <Select 
                    value={iso} 
                    onValueChange={handleCountryChange}
                    required
                  >
                    <SelectTrigger size="custom" id="countryCode" className="w-[140px] h-14 bg-black/20 border-white/10 rounded-2xl text-white font-sans text-base focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111116]/95 backdrop-blur-xl border-white/10 text-white max-h-[300px] rounded-xl">
                      {countries.map((c, i) => (
                        <SelectItem key={i} value={c.iso} className="focus:bg-white/10 focus:text-white cursor-pointer transition-colors rounded-lg m-1">
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex-1">
                    <Input 
                      type="tel" 
                      id="phoneNumber"
                      placeholder="98765 43210" 
                      required 
                      autoComplete="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Feedback */}
                {phoneValidation && (
                  <div className={`mt-3 text-xs md:text-sm px-4 py-2.5 rounded-xl flex items-center font-medium border transition-all duration-300 ${
                    phoneValidationStatus === "valid" ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" : 
                    phoneValidationStatus === "invalid" ? "text-red-400 bg-red-500/10 border-red-500/20" : "hidden"
                  }`}>
                    {phoneValidation}
                  </div>
                )}
                {phonePreview && (
                  <div className="mt-2 text-xs md:text-sm text-white/50 px-4 py-2 bg-white/5 border border-white/5 rounded-xl flex items-center break-all">
                    {phonePreview}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="reason" className={labelClass}>Why would you like to join?</Label>
                <Textarea 
                  id="reason"
                  name="reason" 
                  placeholder="Share your thoughts with us..." 
                  className="w-full px-5 py-4 bg-black/20 border-white/10 rounded-2xl text-white font-sans text-base focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300 min-h-[120px] resize-y placeholder:text-white/20"
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl text-base font-semibold bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : "Join early access →"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      <div className={`fixed left-1/2 -translate-x-1/2 bg-[#111116]/95 border ${toastError ? 'border-red-500/30' : 'border-white/10'} text-white px-6 py-4 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] flex items-center gap-3 z-[1000] backdrop-blur-xl transition-all duration-500 ease-out ${toastVisible ? "bottom-[40px] opacity-100 scale-100" : "-bottom-[100px] opacity-0 scale-95"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${toastError ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white"}`}>
          {toastError ? "✗" : "✓"}
        </div>
        <span className="font-medium text-sm md:text-base pr-2">{toastMessage}</span>
      </div>
    </>
  );
}

export default function JoinPage() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 h-24 bg-transparent transition-all duration-300 pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/" className="flex items-center decoration-none px-6 py-3 rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] shadow-lg hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group">
            <Image src="/assets/vayo-logo.png" alt="VAYO Logo" width={90} height={24} className="h-5 w-auto opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" priority />
          </Link>
        </div>
      </nav>
      
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
        <JoinFormContent />
      </Suspense>
    </>
  );
}
