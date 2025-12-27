"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEvent } from "@/hooks/events";
import { registerForEvent } from "@/services/registrations";
import { ArrowLeft, Calendar, MapPin, User, Mail, GraduationCap, BookOpen, Users, FileText } from "lucide-react";
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
}

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
const courseOptions = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BBA", "MBA", "Other"];
const departmentOptions = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Chemical", "Other"];
const sectionOptions = ["A", "B", "C", "D", "E", "F", "Other"];

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

  // Move all useState hooks to the top, before any conditional returns
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
  });

  // Use ref to access current form data in callbacks
  const formDataRef = useRef(formData);

  // Update ref when formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Pre-fill form with user profile data if available
  useEffect(() => {
    console.log("Pre-fill useEffect triggered", { profile: !!profile, hasProfile: !!profile?.name });
    if (profile) {
      setFormData(prev => ({
        ...prev,
        "Name": profile.name || "",
        "College Email ID": profile.email || "",
        "Personal Email ID": profile.email || "",
        "Contact Number": profile.contactDetails || "12",
      }));
    }
  }, [profile]);

  // Set a timeout for authentication to prevent infinite loading
  useEffect(() => {
    if (user && !profile && !loading) {
      const timer = setTimeout(() => {
        console.log("Authentication timeout - user exists but profile not loaded");
        setAuthTimeout(true);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timer);
    }
  }, [user, profile, loading]);

  // Move all useCallback hooks to the top, before any conditional returns
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof RegistrationFormData]: value // Type assertion for dynamic key
    }));
  }, []);

  const generateQRCode = useCallback(async (registrationId: string) => {
    console.log("generateQRCode called with:", registrationId);
    try {
      const qrData = JSON.stringify({
        registrationId,
        eventId,
        eventTitle: event?.title,
        userName: formDataRef.current["Name"],
        timestamp: new Date().toISOString()
      });

      console.log("Generating QR code for data:", qrData);
      const qrCodeDataURL = await QRCode.toDataURL(qrData);

      console.log("QR code generated, updating state");
      setQrCodeData(qrCodeDataURL);
      setShowQRCode(true);
      console.log("State updated successfully");
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  }, [eventId, event?.title]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !event) {
      console.error("Missing user or event:", { user: !!user, event: !!event });
      return;
    }

    // Basic validation
    if (!formDataRef.current["Name"] || !formDataRef.current["College Email ID"] || !formDataRef.current["Contact Number"]) {
      toast.error("Please fill in all required fields");
      console.error("Validation failed:", {
        name: formDataRef.current["Name"],
        email: formDataRef.current["College Email ID"],
        contact: formDataRef.current["Contact Number"]
      });
      return;
    }

    console.log("Starting registration process");
    console.log("Form data:", formDataRef.current);
    console.log("User:", user.uid);
    console.log("Event ID:", eventId);

    setIsSubmitting(true);

    try {
      // Transform form data to match database schema with spaces in keys
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
        "Registration No.": "", // This will be auto-generated
      };

      console.log("Calling registerForEvent with data:", transformedData);
      console.log("Data type:", typeof transformedData);
      console.log("Data keys:", Object.keys(transformedData));

      const registrationId = await registerForEvent(transformedData, eventId, user.uid);

      console.log("registerForEvent returned:", registrationId);

      if (registrationId) {
        console.log("Registration successful, generating QR code");
        toast.success("Registration successful!");
        await generateQRCode(registrationId);
      } else {
        console.log("User already registered for this event");
        toast.error("You are already registered for this event");
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      toast.error("Registration failed. Please try again.");
    } finally {
      console.log("Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  }, [user, event, eventId, generateQRCode]);

  // Debug logging
  console.log("EventRegistrationPage render:", {
    eventId,
    loading,
    isLoading,
    hasUser: !!user,
    hasProfile: !!profile,
    userRole: profile?.role,
    userEmail: user?.email,
    profileName: profile?.name,
    eventError,
    authTimeout
  });

  // Handle event loading error
  if (eventError) {
    console.error("Event loading error:", eventError);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Event</h1>
            <p className="text-gray-600">There was an error loading the event. Please try again.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-[#FF5900] text-white rounded-lg hover:bg-[#E54D00] transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle authentication timeout
  if (authTimeout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Issue</h1>
            <p className="text-gray-600 mb-4">There seems to be an issue with your authentication. Please try refreshing your profile or logging in again.</p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setAuthTimeout(false);
                  // Force a profile refresh
                  if (user) {
                    window.location.reload();
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Profile
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2 bg-[#FF5900] text-white rounded-lg hover:bg-[#E54D00] transition-colors"
              >
                Login Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 border border-[#FF5900] text-[#FF5900] rounded-lg hover:bg-[#FF5900] hover:text-white transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Early return if still loading or user not authenticated
  if (loading || isLoading || !user || !profile) {
    console.log("Early return due to loading/not authenticated:", {
      loading,
      isLoading,
      hasUser: !!user,
      hasProfile: !!profile
    });

    // If we have a user but no profile and we're not loading, this might be a profile loading issue
    if (user && !profile && !loading) {
      console.log("User authenticated but profile not loaded - this might be a profile loading issue");
    }

    let statusMessage = "Loading...";
    if (loading) statusMessage = "Loading authentication...";
    else if (isLoading) statusMessage = "Loading event...";
    else if (!user) statusMessage = "Checking authentication...";
    else if (!profile) statusMessage = "Loading user profile...";

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FF5900] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg mb-4">{statusMessage}</p>

            {/* Show debug info in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 p-4 rounded-lg text-left text-sm max-w-md mx-auto">
                <h3 className="font-semibold mb-2">Debug Info:</h3>
                <div>Auth Loading: {loading ? 'Yes' : 'No'}</div>
                <div>Event Loading: {isLoading ? 'Yes' : 'No'}</div>
                <div>User: {user ? `Yes (${user.email})` : 'No'}</div>
                <div>Profile: {profile ? `Yes (${profile.role})` : 'No'}</div>
                <div>User ID: {user?.uid || 'None'}</div>

                {/* Manual refresh button if user exists but profile doesn't */}
                {user && !profile && !loading && (
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    Force Refresh Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Early return if user is an organizer (they can't register)
  if (profile.role === "organizer") {
    console.log("User is organizer, redirecting to event page");
    router.replace(`/events/${eventId}`);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Redirecting organizers to event page...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600">The event you&apos;re trying to register for doesn&apos;t exist.</p>
          </div>
        </div>
      </div>
    );
  }

  if (showQRCode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <button
                onClick={() => setShowQRCode(false)}
                className="flex items-center gap-2 text-[#FF5900] hover:text-[#E54D00] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Form
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
              <p className="text-gray-600">You have been registered for {event.title}</p>
            </div>

            <div className="mb-6">
              <img src={qrCodeData} alt="Registration QR Code" className="mx-auto border-4 border-gray-200 rounded-lg" />
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Name:</strong> {formData["Name"]}</p>
              <p><strong>Event:</strong> {event.title}</p>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => router.push(`/events/${eventId}`)}
                className="w-full px-6 py-3 bg-[#FF5900] text-white font-semibold rounded-lg hover:bg-[#E54D00] transition-colors"
              >
                View Event Details
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 border-2 border-[#FF5900] text-[#FF5900] font-semibold rounded-lg hover:bg-[#FF5900] hover:text-white transition-colors"
              >
                Browse More Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/events/${eventId}`)}
            className="flex items-center gap-2 text-[#FF5900] hover:text-[#E54D00] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Event
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Registration</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#FF5900]" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#FF5900]" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#FF5900]" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Registration Form</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF5900]" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="Name"
                    value={formData["Name"]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="Contact Number"
                    value={formData["Contact Number"]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                    placeholder="Enter your contact number"
                  />
                </div>
              </div>
            </div>

            {/* Email Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#FF5900]" />
                Email Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="collegeEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    College Email *
                  </label>
                  <input
                    type="email"
                    id="collegeEmail"
                    name="College Email ID"
                    value={formData["College Email ID"]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                    placeholder="Enter your college email"
                  />
                </div>

                <div>
                  <label htmlFor="personalEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Email
                  </label>
                  <input
                    type="email"
                    id="personalEmail"
                    name="Personal Email ID"
                    value={formData["Personal Email ID"]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                    placeholder="Enter your personal email"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#FF5900]" />
                Academic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    id="course"
                    name="Course"
                    value={formData["Course"]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    id="department"
                    name="Department"
                    value={formData["Department"]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                    Section *
                  </label>
                  <select
                    id="section"
                    name="Section"
                    value={formData["Section"]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                  >
                    <option value="">Select Section</option>
                    {sectionOptions.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Study *
                  </label>
                  <select
                    id="yearOfStudy"
                    name="Year of Study"
                    value={formData["Year of Study"]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="Specialization"
                  value={formData["Specialization"]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                  placeholder="Enter your specialization (if any)"
                />
              </div>
            </div>

            {/* Faculty Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF5900]" />
                Faculty Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="faNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    FA Number *
                  </label>
                  <input
                    type="text"
                    id="faNumber"
                    name="FA Number"
                    value={formData["FA Number"]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                    placeholder="Enter your FA number"
                  />
                </div>

                <div>
                  <label htmlFor="facultyAdvisor" className="block text-sm font-medium text-gray-700 mb-2">
                    Faculty Advisor *
                  </label>
                  <input
                    type="text"
                    id="facultyAdvisor"
                    name="Faculty Advisor"
                    value={formData["Faculty Advisor"]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF5900] focus:outline-none transition-colors"
                    placeholder="Enter your faculty advisor name"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-[#FF5900] text-white font-semibold text-lg rounded-lg hover:bg-[#E54D00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Registration...
                  </>
                ) : (
                  <>
                    <FileText className="w-6 h-6" />
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
