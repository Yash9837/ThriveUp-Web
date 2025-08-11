"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { RoleGate } from "@/components/AuthGate";
import { useEventRegistrations } from "@/hooks/registrations";
import { useEvent } from "@/hooks/events";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, Calendar, MapPin, Clock, Mail, Phone, GraduationCap, User, FileText, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { RegistrationDoc } from "@/types/models";

interface RegistrationDetailModalProps {
  registration: RegistrationDoc;
  isOpen: boolean;
  onClose: () => void;
}

function RegistrationDetailModal({ registration, isOpen, onClose }: RegistrationDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Registration Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF5900]" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <p className="text-gray-900 font-medium">{registration["Name"]}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Contact Number</label>
                  <p className="text-gray-900 font-medium">{registration["Contact Number"]}</p>
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">College Email</label>
                  <p className="text-gray-900 font-medium">{registration["College Email ID"]}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Personal Email</label>
                  <p className="text-gray-900 font-medium">{registration["Personal Email ID"]}</p>
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">Course</label>
                  <p className="text-gray-900 font-medium">{registration["Course"]}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                  <p className="text-gray-900 font-medium">{registration["Department"]}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Section</label>
                  <p className="text-gray-900 font-medium">{registration["Section"]}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Year of Study</label>
                  <p className="text-gray-900 font-medium">{registration["Year of Study"]}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Specialization</label>
                  <p className="text-gray-900 font-medium">{registration["Specialization"] || "Not specified"}</p>
                </div>
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">FA Number</label>
                  <p className="text-gray-900 font-medium">{registration["FA Number"]}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Faculty Advisor</label>
                  <p className="text-gray-900 font-medium">{registration["Faculty Advisor"]}</p>
                </div>
              </div>
            </div>

            {/* Registration Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF5900]" />
                Registration Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Registration ID</label>
                  <p className="text-gray-900 font-medium font-mono text-sm">{registration.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Registration Date</label>
                  <p className="text-gray-900 font-medium">
                    {registration.timestamp ? format(registration.timestamp.toDate(), 'PPP') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#FF5900] text-white rounded-lg hover:bg-[#E54D00] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventRegistrationsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params?.id as string;
  const { registrations, isLoading } = useEventRegistrations(eventId);
  const { event } = useEvent(eventId);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const openModal = (registration: RegistrationDoc) => {
    setSelectedRegistration(registration);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRegistration(null);
  };

  const exportToCSV = () => {
    if (!registrations || registrations.length === 0) return;

    setExportLoading(true);
    
    try {
      const headers = [
        "Name",
        "College Email ID", 
        "Personal Email ID",
        "Contact Number",
        "Course",
        "Department",
        "Section",
        "Specialization",
        "Year of Study",
        "FA Number",
        "Faculty Advisor",
        "Registration No.",
        "Registration Date"
      ];

      const csvData = registrations.map((registration: RegistrationDoc) => [
        registration["Name"] || "",
        registration["College Email ID"] || "",
        registration["Personal Email ID"] || "",
        registration["Contact Number"] || "",
        registration["Course"] || "",
        registration["Department"] || "",
        registration["Section"] || "",
        registration["Specialization"] || "",
        registration["Year of Study"] || "",
        registration["FA Number"] || "",
        registration["Faculty Advisor"] || "",
        registration["Registration No."] || "",
        registration.timestamp ? format(registration.timestamp.toDate(), "MMM dd, yyyy") : ""
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map(row => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event?.title || 'Event'}_Registrations.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <RoleGate role="organizer">
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/organizer/events')}
              className="flex items-center gap-2 text-[#FF5900] hover:text-[#E54D00] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to My Events
            </button>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">Event Registrations</h1>
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportToCSV}
                    disabled={registrations.length === 0 || exportLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>
              
              {event && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#FF5900]" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#FF5900]" />
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
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#FF5900]" />
                    <div>
                      <p className="text-sm text-gray-600">Registrations</p>
                      <p className="font-medium">{registrations.length}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Registrations List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Registered Students</h2>
            </div>
            
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 border-4 border-[#FF5900] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading registrations...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No registrations yet</p>
                <p className="text-gray-500">Students will appear here once they register for this event.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Academic Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrations.map((registration, index) => (
                      <tr key={registration.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-[#FF5900] flex items-center justify-center text-white font-semibold">
                                {registration["Name"]?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {registration["Name"] || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {registration["College Email ID"] || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center gap-1 mb-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {registration["Contact Number"] || "N/A"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {registration["Personal Email ID"] || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">{registration["Course"] || "N/A"}</div>
                            <div className="text-gray-500">
                              {registration["Department"]} - {registration["Section"]}
                            </div>
                            <div className="text-gray-500">{registration["Year of Study"]}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.timestamp ? format(registration.timestamp.toDate(), 'MMM dd, yyyy') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openModal(registration)}
                            className="flex items-center gap-2 text-[#FF5900] hover:text-[#E54D00] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Registration Detail Modal */}
      {selectedRegistration && (
        <RegistrationDetailModal
          registration={selectedRegistration}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </RoleGate>
  );
}


