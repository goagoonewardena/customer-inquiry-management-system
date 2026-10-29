
"use client";

import { useState } from "react";

type InquiryStatus = "New" | "In Progress" | "Resolved";

type Inquiry = {
  id: number;
  customer: string;
  subject: string;
  description: string;
  status: InquiryStatus;
  date: string;
};

const initialInquiries: Inquiry[] = [
  {
    id: 1001,
    customer: "Amara Perera",
    subject: "Payment issue",
    description: "A payment was deducted but not reflected in the account.",
    status: "New",
    date: "2026-10-28",
  },
  {
    id: 1002,
    customer: "Kasun Silva",
    subject: "Account access",
    description: "Unable to access the customer account.",
    status: "In Progress",
    date: "2026-10-27",
  },
  {
    id: 1003,
    customer: "Nethmi Fernando",
    subject: "Statement request",
    description: "Requested a copy of the latest account statement.",
    status: "Resolved",
    date: "2026-10-26",
  },
  {
    id: 1004,
    customer: "Ravindu Jayasuriya",
    subject: "Incorrect details",
    description: "The contact details on the account need to be checked.",
    status: "New",
    date: "2026-10-25",
  },
];

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredInquiries = inquiries.filter((inquiry) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      inquiry.customer.toLowerCase().includes(searchText) ||
      inquiry.subject.toLowerCase().includes(searchText) ||
      String(inquiry.id).includes(searchText);

    const matchesStatus =
      statusFilter === "All" || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function updateStatus(id: number, status: InquiryStatus) {
    setInquiries((current) =>
      current.map((inquiry) =>
        inquiry.id === id ? { ...inquiry, status } : inquiry
      )
    );
  }

  const newCount = inquiries.filter(
    (inquiry) => inquiry.status === "New"
  ).length;

  const inProgressCount = inquiries.filter(
    (inquiry) => inquiry.status === "In Progress"
  ).length;

  const resolvedCount = inquiries.filter(
    (inquiry) => inquiry.status === "Resolved"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inquiro Tracker</h1>
            <p className="mt-1 text-sm text-slate-500">
              Customer Inquiry Management System
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Staff Dashboard
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Inquiry Dashboard</h2>
          <p className="mt-2 text-slate-500">
            View and track customer inquiries in one place.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Inquiries" count={inquiries.length} />
          <SummaryCard label="New" count={newCount} />
          <SummaryCard label="In Progress" count={inProgressCount} />
          <SummaryCard label="Resolved" count={resolvedCount} />
        </div>

        {/* Search and filter */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Customer Inquiries</h3>
              <p className="mt-1 text-sm text-slate-500">
                Search and filter the inquiry list.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div>
                <label
                  htmlFor="search"
                  className="mb-1 block text-sm font-medium"
                >
                  Search
                </label>
                <input
                  id="search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, subject or ID"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-1 block text-sm font-medium"
                >
                  Filter by status
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 sm:w-44"
                >
                  <option value="All">All statuses</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Inquiry table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Inquiry ID</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-medium">
                      #{inquiry.id}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {inquiry.customer}
                    </td>

                    <td className="min-w-56 px-4 py-4">
                      <p className="font-medium">{inquiry.subject}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {inquiry.description}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                      {inquiry.date}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <select
                        aria-label={`Status for inquiry ${inquiry.id}`}
                        value={inquiry.status}
                        onChange={(event) =>
                          updateStatus(
                            inquiry.id,
                            event.target.value as InquiryStatus
                          )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}

                {filteredInquiries.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No inquiries match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </p>
        </section>
      </section>
    </main>
  );
}

function SummaryCard({
  label,
  count,
}: {
  label: string;
  count: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold">{count}</p>
    </div>
  );
}
