"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEvent } from "@/hooks/events";
import { registerForEvent } from "@/services/registrations";
import { ArrowLeft, Calendar, MapPin, User, Mail, GraduationCap, BookOpen, Users, FileText, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import QRCode from "qrcode";

interface RegistrationFormData {
  "Name": string;
  "College Email ID": string;
  "Personal Email ID": string;
  "Contact Number": string;
  "Course": string;
  "Department": string;
  "Section": string;
  "Specialization": string;
  "Year of Study": string;
  "FA Number": string;
  "Faculty Advisor": string;
  "Registration No.": string;
}

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
const courseOptions = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BBA", "MBA", "Other"];

export default function EventRegistrationPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id as string;
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { event, isLoading, error: eventError } = useEvent(eventId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [authTimeout, setAuthTimeout] = useState(false);

  const [formData, setFormData] = useState<RegistrationFormData>({
    "Name": "",
    "College Email ID": "",
    "Personal Email ID": "",
    "Contact Number": "",
    "Course": "",
    "Department": "",
    "Section": "",
    "Specialization": "",
    "Year of Study": "",
    "FA Number": "",
    "Faculty Advisor": "",
    "Registration No.": "",
  });

  const formDataRef = useRef(formData);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        "Name": profile.name || "",
        "College Email ID": profile.email || "",
        "Personal Email ID": profile.email || "",
        "Contact Number": profile.contactDetails || "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (user && !profile && !loading) {
      const timer = setTimeout(() => {
        setAuthTimeout(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, profile, loading]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof RegistrationFormData]: value
    }));
  }, []);

  const generateQRCode = useCallback(async (registrationId: string) => {
    try {
      const qrData = JSON.stringify({
        registrationId,
        eventId,
        eventTitle: event?.title,
        userName: formDataRef.current["Name"],
        timestamp: new Date().toISOString()
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      setQrCodeData(qrCodeDataURL);
      setShowQRCode(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  }, [eventId, event?.title]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !event) return;

    if (!formDataRef.current["Name"] || !formDataRef.current["College Email ID"] || !formDataRef.current["Contact Number"] || !formDataRef.current["Registration No."]) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const transformedData = {
        "Name": formDataRef.current["Name"],
        "College Email ID": formDataRef.current["College Email ID"],
        "Personal Email ID": formDataRef.current["Personal Email ID"],
        "Contact Number": formDataRef.current["Contact Number"],
        "Course": formDataRef.current["Course"],
        "Department": formDataRef.current["Department"],
        "Section": formDataRef.current["Section"],
        "Specialization": formDataRef.current["Specialization"],
        "Year of Study": formDataRef.current["Year of Study"],
        "FA Number": formDataRef.current["FA Number"],
        "Faculty Advisor": formDataRef.current["Faculty Advisor"],
        "Registration No.": formDataRef.current["Registration No."],
      };

      const registrationId = await registerForEvent(transformedData, eventId, user.uid);

      if (registrationId) {
        toast.success("Registration successful!");
        await generateQRCode(registrationId);
      } else {
        toast.error("You are already registered for this event");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [user, event, eventId, generateQRCode]);

  if (eventError) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Error Loading Event</h1>
          <p className="text-zinc-400">There was an error loading the event details.</p>
          <button onClick={() => router.push('/')} className="px-6 py-2 bg-[#FF5900] text-white rounded-lg hover:bg-[#E54D00]">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (authTimeout) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-zinc-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white">Authentication Issue</h1>
          <p className="text-zinc-400">Please try refreshing your session.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700">Refresh Page</button>
            <button onClick={() => router.push('/login')} className="px-6 py-2 bg-[#FF5900] text-white rounded-lg hover:bg-[#E54D00]">Login Again</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || isLoading || !user || !profile) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-[#FF5900] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (profile.role === "organizer") {
    router.replace(`/events/${eventId}`);
    return null;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Event Not Found</h1>
          <p className="text-zinc-400">The event you requested does not exist.</p>
        </div>
      </div>
    );
  }

  if (showQRCode) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
            <CheckCircle className="text-green-500" size={32} />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">You're In!</h1>
          <p className="text-zinc-400 mb-8">Registered for <span className="text-white">{event.title}</span></p>

          <div className="bg-white p-4 rounded-xl inline-block mb-8">
            <img src={qrCodeData} alt="QR Code" className="w-48 h-48" />
          </div>

          <div className="space-y-2 text-sm text-zinc-400 bg-zinc-950/50 p-4 rounded-xl border border-white/5 mb-8">
            <p className="flex justify-between"><span>Name:</span> <span className="text-white font-medium">{formData["Name"]}</span></p>
            <p className="flex justify-between"><span>Date:</span> <span className="text-white font-medium">{event.date}</span></p>
            <p className="flex justify-between"><span>Time:</span> <span className="text-white font-medium">{event.time}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => router.push(`/events/${eventId}`)} className="px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors font-medium">
              Event Details
            </button>
            <button onClick={() => router.push('/')} className="px-4 py-3 bg-[#FF5900] text-white rounded-xl hover:bg-[#E54D00] transition-colors font-medium">
              Browse More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E10] text-zinc-100 font-sans selection:bg-[#FF5900]/30 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Navigation */}
        <button
          onClick={() => router.push(`/events/${eventId}`)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Event
        </button>

        {/* Event Header Card */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5900]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h1 className="text-4xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Event Registration
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
              <div className="p-3 bg-[#FF5900]/10 rounded-xl">
                <Calendar className="w-5 h-5 text-[#FF5900]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Date</p>
                <p className="font-medium text-white">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
              <div className="p-3 bg-[#FF5900]/10 rounded-xl">
                <BookOpen className="w-5 h-5 text-[#FF5900]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Time</p>
                <p className="font-medium text-white">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
              <div className="p-3 bg-[#FF5900]/10 rounded-xl">
                <MapPin className="w-5 h-5 text-[#FF5900]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Location</p>
                <p className="font-medium text-white">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">
            Participant Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-zinc-300 flex items-center gap-3">
                <User className="w-5 h-5 text-[#FF5900]" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" name="Name" value={formData["Name"]} onChange={handleInputChange} placeholder="John Doe" required />
                <InputGroup label="Contact Number" name="Contact Number" value={formData["Contact Number"]} onChange={handleInputChange} placeholder="+91 98765 43210" required type="tel" />
              </div>
            </div>

            {/* Email Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-zinc-300 flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#FF5900]" /> Email Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="College Email (.edu.in)" name="College Email ID" value={formData["College Email ID"]} onChange={handleInputChange} placeholder="student@srm.edu.in" required type="email" />
                <InputGroup label="Personal Email" name="Personal Email ID" value={formData["Personal Email ID"]} onChange={handleInputChange} placeholder="john@gmail.com" type="email" />
              </div>
            </div>

            {/* Academic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-zinc-300 flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-[#FF5900]" /> Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="RA Number" name="Registration No." value={formData["Registration No."]} onChange={handleInputChange} placeholder="RA12345678" required />
                <SelectGroup label="Course" name="Course" value={formData["Course"]} onChange={handleInputChange} options={courseOptions} required />

                <InputGroup label="Department" name="Department" value={formData["Department"]} onChange={handleInputChange} placeholder="CSE / IT / ECE" required />
                <InputGroup label="Section" name="Section" value={formData["Section"]} onChange={handleInputChange} placeholder="A" required />

                <SelectGroup label="Year of Study" name="Year of Study" value={formData["Year of Study"]} onChange={handleInputChange} options={yearOptions} required />

                <div className="md:col-span-2">
                  <InputGroup label="Specialization (Optional)" name="Specialization" value={formData["Specialization"]} onChange={handleInputChange} placeholder="AI/ML, Data Science, etc." />
                </div>
              </div>
            </div>

            {/* Faculty Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-zinc-300 flex items-center gap-3">
                <Users className="w-5 h-5 text-[#FF5900]" /> Faculty Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Faculty Advisor Name" name="Faculty Advisor" value={formData["Faculty Advisor"]} onChange={handleInputChange} placeholder="Dr. Smith" required />
                <InputGroup label="FA Number / Employee ID" name="FA Number" value={formData["FA Number"]} onChange={handleInputChange} placeholder="FA12345" required />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#FF5900] to-[#FF8C00] text-white font-bold text-lg rounded-xl hover:shadow-[0_0_20px_rgba(255,89,0,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Complete Registration
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Components for clean code
const InputGroup = ({ label, name, value, onChange, placeholder, required = false, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">{label} {required && <span className="text-[#FF5900]">*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] outline-none transition-all"
      placeholder={placeholder}
    />
  </div>
);

const SelectGroup = ({ label, name, value, onChange, options, required = false }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">{label} {required && <span className="text-[#FF5900]">*</span>}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:border-[#FF5900] focus:ring-1 focus:ring-[#FF5900] outline-none transition-all appearance-none"
      >
        <option value="" className="text-zinc-600">Select {label}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt} className="bg-zinc-900 text-white">{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </div>
    </div>
  </div>
);
