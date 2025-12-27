"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFirebaseAuth, getDb } from "@/lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Upload, Mail, Lock, User, Phone, Linkedin, Github, Building2, Terminal, Rocket, Layout, Database, Smartphone, Globe, Code2, Cpu } from "lucide-react";
import { UNIVERSITIES, INTERESTS, TECH_STACKS } from "@/lib/constants";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

// --- Types ---
interface RegistrationFormData {
  // Step 1
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
  // Step 2
  profileImage: File | null;
  profileImagePreview: string | null;
  university: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  // Step 3
  interests: string[];
  techStack: string[];
}

export default function RegisterPage() {
  const router = useRouter();

  // --- State ---
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
    profileImage: null,
    profileImagePreview: null,
    university: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    interests: [],
    techStack: []
  });

  // OTP State
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpSheet, setShowOtpSheet] = useState(false);
  const [otpHash, setOtpHash] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        profileImage: file,
        profileImagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // --- OTP Logic ---

  const sendOTP = async () => {
    if (!formData.email) return toast.error("Please enter an email address");
    if (!formData.name) return toast.error("Please enter your name");

    // Strictly Allow only .edu.in
    if (!formData.email.trim().toLowerCase().endsWith(".edu.in")) {
      return toast.error("Only institutional emails ending in .edu.in are allowed.");
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, name: formData.name })
      });

      const data = await res.json();

      if (data.success) {
        setOtpHash(data.hash);
        setShowOtpSheet(true);
        toast.success("Verification code sent to your email!");
      } else {
        toast.error(data.message || "Failed to send verification code.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    const code = otpInput.join("");
    if (code.length !== 6) {
      return toast.error("Please enter the complete 6-digit code");
    }

    const loadingToast = toast.loading("Verifying...");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: code,
          hash: otpHash
        })
      });

      const data = await res.json();

      if (data.success) {
        setIsEmailVerified(true);
        setShowOtpSheet(false);
        toast.success("Email Verified Successfully!", { id: loadingToast });
      } else {
        toast.error(data.message || "Invalid Code", { id: loadingToast });
        setOtpInput(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error(error);
      toast.error("Verification failed", { id: loadingToast });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpInput[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // --- Navigation ---

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (!formData.email.toLowerCase().endsWith(".edu.in")) {
      toast.error("Only institutional emails ending in .edu.in are allowed.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!formData.agreedToTerms) {
      toast.error("You must agree to the Terms & Conditions");
      return false;
    }
    if (!isEmailVerified) {
      toast.error("Please verify your email address");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.university || !formData.phone) {
      toast.error("Please fill in required fields (University, Phone)");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => {
    if (step > 1) setStep(prev => (prev - 1) as 1 | 2 | 3);
  };

  // --- Final Submission ---

  const handleSignUp = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Creating your profile...");

    try {
      const auth = getFirebaseAuth();
      const db = getDb();
      const storage = getStorage();

      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Upload Profile Image (if exists)
      let profileImageUrl = "";
      if (formData.profileImage) {
        toast.loading("Uploading profile picture...", { id: toastId });
        const imageRef = ref(storage, `profile-images/${user.uid}`);
        await uploadBytes(imageRef, formData.profileImage);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      // 3. Extract College ID
      // Example: user@srmist.edu.in -> srmist
      const domain = formData.email.split('@')[1]; // srmist.edu.in
      const collegeCode = domain ? domain.toLowerCase().replace(".edu.in", "") : "unknown";
      const finalCollegeCode = collegeCode || "unknown";

      // 4. Create Firestore Document
      toast.loading("Finalizing account...", { id: toastId });

      const userProfile = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: "user",
        userType: "user",

        // College Details
        university: formData.university,
        collegeId: finalCollegeCode, // e.g. "srmist"
        collegeEmail: formData.email,

        // Profile
        profileImageURL: profileImageUrl,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,

        // Tags
        interests: formData.interests,
        techStack: formData.techStack,

        // Metadata
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        isApproved: true,
        isEmailVerified: true // We verified via OTP
      };

      await setDoc(doc(db, "users", user.uid), userProfile);

      // 5. Send Firebase Verification Email
      await sendEmailVerification(user);

      toast.success("Account created successfully!", { id: toastId });
      router.push("/profile");

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Registration failed", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Steps ---

  return (
    <div className="min-h-screen bg-[#0E0E10] text-zinc-100 flex items-center justify-center p-4 font-sans selection:bg-[#FF5900]/30">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            Join ThriveUp
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">Create your account in 3 simple steps</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
            <div
              className="h-full bg-[#FF5900] transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step Indicator */}
          <div className="flex justify-between mb-8 relative">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${step >= s
                  ? "bg-[#FF5900] border-[#FF5900] text-white"
                  : "bg-zinc-900 border-zinc-700 text-zinc-500"
                  }`}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span className={`text-xs font-medium uppercase tracking-wider ${step >= s ? "text-zinc-300" : "text-zinc-600"}`}>
                  {s === 1 ? "Basic Info" : s === 2 ? "Profile" : "Interests"}
                </span>
              </div>
            ))}
            {/* Connecting Line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-zinc-800 -z-0" />
          </div>

          {/* Forms */}
          <div className="min-h-[400px]">

            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-zinc-500" size={18} />
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#FF5900] focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">College Email</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isEmailVerified}
                          className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#FF5900] focus:outline-none transition-colors ${isEmailVerified ? "opacity-60 cursor-not-allowed" : ""}`}
                          placeholder="john@srm.edu.in"
                        />
                        {isEmailVerified && <Check className="absolute right-3 top-3 text-green-500" size={18} />}
                      </div>
                    </div>
                  </div>
                </div>

                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={isLoading}
                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors border border-white/5"
                  >
                    {isLoading ? "Sending Code..." : "Verify Email Address"}
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#FF5900] focus:outline-none transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#FF5900] focus:outline-none transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    id="terms"
                    className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-[#FF5900] focus:ring-[#FF5900] focus:ring-offset-zinc-900"
                  />
                  <label htmlFor="terms" className="text-sm text-zinc-400">
                    I agree to the <Link href="#" className="text-[#FF5900] hover:underline">Terms of Service</Link> & <Link href="#" className="text-[#FF5900] hover:underline">Privacy Policy</Link>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: Profile */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                {/* Photo Upload */}
                <div className="flex justify-center mb-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-zinc-800 border-2 border-dashed border-zinc-600 group-hover:border-[#FF5900] transition-colors relative">
                      {formData.profileImagePreview ? (
                        <img src={formData.profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
                          <Upload size={24} className="mb-1" />
                          <span className="text-[10px] font-bold uppercase">Upload</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute bottom-0 right-0 p-2 bg-[#FF5900] rounded-full text-white shadow-lg pointer-events-none">
                      <User size={14} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">University</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-zinc-500" size={18} />
                    <select
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#FF5900] focus:outline-none transition-colors appearance-none"
                    >
                      <option value="" className="text-zinc-500">Select your University</option>
                      {UNIVERSITIES.map(uni => (
                        <option key={uni} value={uni} className="bg-zinc-900">{uni}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-zinc-500" size={18} />
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#FF5900] focus:outline-none transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">LinkedIn (Optional)</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 text-zinc-500" size={18} />
                      <input
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#FF5900] focus:outline-none transition-colors"
                        placeholder="linkedin.com/in/..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">GitHub (Optional)</label>
                    <div className="relative">
                      <Github className="absolute left-3 top-3 text-zinc-500" size={18} />
                      <input
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#FF5900] focus:outline-none transition-colors"
                        placeholder="github.com/..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Interests & Tech Stack */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

                <div className="space-y-3">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Rocket className="text-[#FF5900]" size={20} /> Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map(item => {
                      const isSelected = formData.interests.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              interests: isSelected
                                ? prev.interests.filter(i => i !== item)
                                : [...prev.interests, item]
                            }));
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${isSelected
                            ? "bg-[#FF5900] border-[#FF5900] text-white shadow-lg shadow-[#FF5900]/20"
                            : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                            }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Cpu className="text-[#FF5900]" size={20} /> Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACKS.map(item => {
                      const isSelected = formData.techStack.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              techStack: isSelected
                                ? prev.techStack.filter(i => i !== item)
                                : [...prev.techStack, item]
                            }));
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${isSelected
                            ? "bg-white text-black border-white shadow-lg"
                            : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                            }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/5">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-medium flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div className="flex-1">
                <p className="text-zinc-500 text-sm">
                  Already a member? <Link href="/login" className="text-[#FF5900] hover:underline">Sign In</Link>
                </p>
              </div>
            )}

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg"
              >
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSignUp}
                disabled={isLoading}
                className="px-8 py-3 rounded-xl bg-[#FF5900] text-white font-bold hover:bg-[#E54D00] transition-colors flex items-center gap-2 shadow-lg shadow-[#FF5900]/25"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                {!isLoading && <Rocket size={16} />}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* OTP Sheet Modal */}
      {showOtpSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0E0E10] border border-zinc-800 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#FF5900]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF5900]/20">
                <Mail className="text-[#FF5900]" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verify Email</h2>
              <p className="text-zinc-400 text-sm">
                We've sent a 6-digit code to <span className="text-white font-medium">{formData.email}</span>
              </p>
            </div>

            <div className="flex justify-between gap-2 mb-8">
              {otpInput.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 bg-zinc-900 border border-zinc-700 rounded-xl text-center text-2xl font-bold text-white focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] outline-none transition-all"
                />
              ))}
            </div>

            <button
              onClick={verifyOTP}
              className="w-full py-4 bg-[#FF5900] text-white font-bold rounded-xl hover:bg-[#E54D00] transition-colors mb-4"
            >
              Verify Code
            </button>

            <button
              onClick={() => setShowOtpSheet(false)}
              className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
