"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useEvent, useUpdateEvent } from "@/hooks/events";
import { useEventAttendees } from "@/hooks/registrations";
import { ArrowLeft, Calendar, MapPin, Download, Search, BarChart, Settings, Mail, X, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { AuthGate } from "@/components/AuthGate";
import Link from "next/link";

export default function OrganizerEventManagePage() {
    const params = useParams<{ id: string }>();
    const eventId = typeof params?.id === 'string' ? params.id : '';
    const { event, isLoading: isLoadingEvent } = useEvent(eventId);
    const updateMutation = useUpdateEvent();
    const { attendees, isLoading: isLoadingRegs } = useEventAttendees(eventId);

    const [activeTab, setActiveTab] = useState<'attendees' | 'insights'>('attendees');
    const [searchQuery, setSearchQuery] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedAttendee, setSelectedAttendee] = useState<any | null>(null);

    const filteredAttendees = attendees.filter(reg => {
        const searchLower = searchQuery.toLowerCase();
        // Check profile first, then registration doc
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const name = (reg as any).profile?.name?.toLowerCase() || (reg as any)["Name"]?.toLowerCase() || "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const email = (reg as any).profile?.email?.toLowerCase() || (reg as any)["Personal Email ID"]?.toLowerCase() || "";
        return name.includes(searchLower) || email.includes(searchLower);
    });

    const downloadCSV = () => {
        if (!attendees.length) return;

        // Create CSV header
        // Flatten the object for CSV - taking profile into account if needed, or just raw data
        const headers = [
            "Name",
            "Registration No.",
            "Email",
            "Phone",
            "Course",
            "Department",
            "Section",
            "Year",
            "Specialization",
            "Faculty Advisor",
            "FA Number",
            "Status"
        ].join(",");

        const rows = attendees.map(reg => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const r = reg as any;
            const name = r.profile?.name || r["Name"] || "Unknown";
            const regNo = r["Registration No."] || "";
            const email = r.profile?.email || r["Personal Email ID"] || r["College Email ID"] || "";
            const phone = r["Contact Number"] || "";
            const course = r["Course"] || "";
            const dept = r["Department"] || "";
            const section = r["Section"] || "";
            const year = r["Year of Study"] || "";
            const spec = r["Specialization"] || "";
            const fa = r["Faculty Advisor"] || "";
            const faNo = r["FA Number"] || "";

            return [
                `"${name}"`,
                `"${regNo}"`,
                `"${email}"`,
                `"${phone}"`,
                `"${course}"`,
                `"${dept}"`,
                `"${section}"`,
                `"${year}"`,
                `"${spec}"`,
                `"${fa}"`,
                `"${faNo}"`,
                '"Confirmed"'
            ].join(",");
        });

        const csvContent = [headers, ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `attendees_${eventId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoadingEvent) {
        return (
            <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-zinc-800 border-t-brand rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <AuthGate>
            <div className="min-h-screen bg-[#0E0E10] text-zinc-100 font-sans selection:bg-brand/30 selection:text-brand-100">
                <Navbar />

                <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">

                    {/* Back Nav */}
                    <Link href="/organizer/events" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>

                    {/* Header Card */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 mb-12 flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="flex gap-6">
                            <div className="w-24 h-24 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                                {event.posterUrl ? (
                                    <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Calendar className="w-8 h-8 text-zinc-600" /></div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.location}</span>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <Link href={`/events/${eventId}`} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors">
                                        View Public Page
                                    </Link>
                                    <Link
                                        href={`/organizer/edit/${eventId}`}
                                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Settings className="w-4 h-4" /> Edit Event
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            const newStatus = !(event.isRegistrationOpen ?? true); // Default is true (open), so toggle current
                                            await updateMutation.mutateAsync({
                                                id: event.eventId,
                                                patch: { isRegistrationOpen: newStatus }
                                            });
                                        }}
                                        disabled={updateMutation.isPending}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${(event.isRegistrationOpen ?? true)
                                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                                            : "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                                            }`}
                                    >
                                        {updateMutation.isPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            (event.isRegistrationOpen ?? true) ? (
                                                <><X className="w-4 h-4" /> Stop Registration</>
                                            ) : (
                                                <><CheckCircle2 className="w-4 h-4" /> Resume Registration</>
                                            )
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Total Registrations</p>
                                <p className="text-4xl font-bold text-white">{attendees.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tabs */}
                    <div className="flex items-center gap-8 border-b border-white/5 mb-8">
                        <button
                            onClick={() => setActiveTab('attendees')}
                            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'attendees' ? 'border-brand text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Attendees
                        </button>
                        <button
                            onClick={() => setActiveTab('insights')}
                            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'insights' ? 'border-brand text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Insights
                        </button>
                    </div>

                    {/* CONTENT AREA */}
                    {activeTab === 'attendees' && (
                        <div className="space-y-6">

                            {/* Search & Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                <div className="relative max-w-md w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="Search attendees by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand/50 transition-all"
                                    />
                                </div>
                                <button
                                    onClick={downloadCSV}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 rounded-lg font-medium transition-colors"
                                >
                                    <Download className="w-4 h-4" /> Export CSV
                                </button>
                            </div>

                            {/* Table */}
                            <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-zinc-950/50 text-zinc-400 uppercase tracking-wider text-xs font-bold border-b border-white/5">
                                            <tr>
                                                <th className="px-6 py-4">Name</th>
                                                <th className="px-6 py-4">College Email</th>
                                                <th className="px-6 py-4">Phone</th>
                                                <th className="px-6 py-4">Registered At</th>
                                                <th className="px-6 py-4 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {isLoadingRegs ? (
                                                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Loading registrations...</td></tr>
                                            ) : filteredAttendees.length === 0 ? (
                                                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No attendees found matching search.</td></tr>
                                            ) : (
                                                filteredAttendees.map((reg, i) => {
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    const r = reg as any;
                                                    const name = r.profile?.name || r["Name"] || "Unknown";
                                                    const image = r.profile?.profileImageURL;
                                                    // const role = r.profile?.role || "Student"; // Unused
                                                    // const college = r.profile?.college || r["College Email ID"]; // Unused

                                                    return (
                                                        <tr
                                                            key={i}
                                                            onClick={() => setSelectedAttendee(r)}
                                                            className="hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                                                        >
                                                            <td className="px-6 py-4 font-medium text-white">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center border border-white/10 shrink-0 group-hover:border-brand/50 transition-colors">
                                                                        {image ? (
                                                                            <img src={image} alt={name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <span className="text-zinc-500 text-xs font-bold">{name.charAt(0)}</span>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-white group-hover:text-brand transition-colors">{name}</p>
                                                                        {r.profile?.tagline && <p className="text-xs text-zinc-500 truncate max-w-[150px]">{r.profile.tagline}</p>}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-zinc-400">
                                                                {r["College Email ID"] || r.profile?.email}
                                                            </td>
                                                            <td className="px-6 py-4 text-zinc-400 font-mono">{r["Contact Number"]}</td>
                                                            <td className="px-6 py-4 text-zinc-500">-</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                                                    Confirmed
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="text-center text-xs text-zinc-600 mt-4">
                                Showing {filteredAttendees.length} of {attendees.length} registrations
                            </div>
                        </div>
                    )}

                    {/* Attendee Profile Modal */}
                    {selectedAttendee && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedAttendee(null)}>
                            <div className="bg-[#0E0E10] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

                                {/* Header bg */}
                                <div className="h-32 bg-gradient-to-r from-brand/20 via-zinc-900 to-zinc-900 relative">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                    <button onClick={() => setSelectedAttendee(null)} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white hover:text-black text-white rounded-full transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-6 -mt-12 relative z-10 max-h-[80vh] overflow-y-auto">
                                    <div className="w-24 h-24 rounded-full border-4 border-[#0E0E10] bg-zinc-800 overflow-hidden shadow-xl mb-4">
                                        <img
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            src={(selectedAttendee as any).profile?.profileImageURL || "https://ui-avatars.com/api/?name=" + ((selectedAttendee as any).profile?.name || (selectedAttendee as any)["Name"] || "?")}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            alt={(selectedAttendee as any).profile?.name || "Attendee"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {(selectedAttendee as any).profile?.name || (selectedAttendee as any)["Name"]}
                                    </h2>
                                    <p className="text-zinc-300 text-sm font-medium mb-6">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {(selectedAttendee as any)["Registration No."] && <span className="text-brand font-mono mr-2">{(selectedAttendee as any)["Registration No."]}</span>}
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        <span className="opacity-70">{(selectedAttendee as any)["Course"]} / {(selectedAttendee as any)["Department"]}</span>
                                    </p>

                                    <div className="space-y-6">
                                        {/* Contact Info */}
                                        <div className="space-y-3 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Contact Details</h4>
                                            <div className="flex items-center gap-3 text-sm text-zinc-300">
                                                <Mail className="w-4 h-4 text-zinc-600" />
                                                <div className="flex flex-col">
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <span>{(selectedAttendee as any)["College Email ID"]}</span>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    {(selectedAttendee as any)["Personal Email ID"] && <span className="text-xs text-zinc-500">{(selectedAttendee as any)["Personal Email ID"]} (Personal)</span>}
                                                </div>
                                            </div>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {(selectedAttendee as any)["Contact Number"] && (
                                                <div className="flex items-center gap-3 text-sm text-zinc-300">
                                                    <span className="w-4 h-4 flex items-center justify-center font-bold text-zinc-600">#</span>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    {(selectedAttendee as any)["Contact Number"]}
                                                </div>
                                            )}
                                        </div>

                                        {/* Academic Info */}
                                        <div className="space-y-3 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Academic Details</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-zinc-500 text-xs">Year</p>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <p className="text-white">{(selectedAttendee as any)["Year of Study"]}</p>
                                                </div>
                                                <div>
                                                    <p className="text-zinc-500 text-xs">Section</p>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <p className="text-white">{(selectedAttendee as any)["Section"]}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-zinc-500 text-xs">Specialization</p>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <p className="text-white">{(selectedAttendee as any)["Specialization"] || "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Faculty Info */}
                                        <div className="space-y-3 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Faculty Advisor</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-zinc-500 text-xs">Advisor Name</p>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <p className="text-white">{(selectedAttendee as any)["Faculty Advisor"]}</p>
                                                </div>
                                                <div>
                                                    <p className="text-zinc-500 text-xs">FA Number</p>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <p className="text-white">{(selectedAttendee as any)["FA Number"]}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'insights' && (
                        <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-12 text-center">
                            <BarChart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Insights Coming Soon</h3>
                            <p className="text-zinc-500">Detailed analytics about your event&apos;s performance will be available here.</p>
                        </div>
                    )}

                </main>
            </div>
        </AuthGate>
    );
}
