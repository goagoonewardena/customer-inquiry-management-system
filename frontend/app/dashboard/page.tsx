
"use client";

import { useState } from "react";

type InquiryStatus = "New" | "In Progress" | "Resolved";

type Inquiry = {
  id: number;
  customer: string;
  contact: string;
  subject: string;
  description: string;
  status: InquiryStatus;
  date: string;
};

const initialInquiries: Inquiry[] = [
  {
    id: 1001,
    customer: "Amara Perera",
    contact: "amara@example.com",
    subject: "Payment issue",
    description: "A payment was deducted but not reflected in the account.",
    status: "New",
    date: "2026-10-28",
  },
  {
    id: 1002,
    customer: "Kasun Silva",
    contact: "0771234567",
    subject: "Account access",
    description: "Unable to access the customer account.",
    status: "In Progress",
    date: "2026-10-27",
  },
  {
    id: 1003,
    customer: "Nethmi Fernando",
    contact: "nethmi@example.com",
    subject: "Statement request",
    description: "Requested a copy of the latest account statement.",
    status: "Resolved",
    date: "2026-10-26",
  },
  {
    id: 1004,
    customer: "Ravindu Jayasuriya",
    contact: "0719876543",
    subject: "Incorrect details",
    description: "The contact details on the account need to be checked.",
    status: "New",
    date: "2026-10-25",
  },
];

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");

  const filteredInquiries = inquiries.filter((inquiry) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      inquiry.customer.toLowerCase().includes(searchText) ||
      inquiry.subject.toLowerCase().includes(searchText) ||
      inquiry.contact.toLowerCase().includes(searchText) ||
      String(inquiry.id).includes(searchText);

    const matchesStatus =
      statusFilter === "All" || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const newCount = inquiries.filter(
    (inquiry) => inquiry.status === "New"
  ).length;

  const inProgressCount = inquiries.filter(
    (inquiry) => inquiry.status === "In Progress"
  ).length;

  const resolvedCount = inquiries.filter(
    (inquiry) => inquiry.status === "Resolved"
  ).length;

  function updateStatus(id: number, status: InquiryStatus) {
    setInquiries((current) =>
      current.map((inquiry) =>
        inquiry.id === id ? { ...inquiry, status } : inquiry
      )
    );
  }

  function handleCreateInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (
      !customer.trim() ||
      !contact.trim() ||
      !subject.trim() ||
      !description.trim()
    ) {
      setFormError("Please complete all required fields.");
      return;
    }

    const newInquiry: Inquiry = {
      id: Math.max(1000, ...inquiries.map((inquiry) => inquiry.id)) + 1,
      customer: customer.trim(),
      contact: contact.trim(),
      subject: subject.trim(),
      description: description.trim(),
      status: "New",
      date: new Date().toISOString().slice(0, 10),
    };

    setInquiries((current) => [newInquiry, ...current]);
    setSearch("");
    setStatusFilter("All");
    setCustomer("");
    setContact("");
    setSubject("");
    setDescription("");
    setShowForm(false);
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inquiro Tracker</h1>
            <p className="mt-1 text-sm text-slate-500">
              Customer Inquiry Management System
            </p>
          </div>

          <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Staff Dashboard
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Inquiry Dashboard</h2>
          <p className="mt-2 text-slate-500">
            View and manage customer inquiries in one place.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Inquiries" count={inquiries.length} />
          <SummaryCard label="New" count={newCount} />
          <SummaryCard label="In Progress" count={inProgressCount} />
          <SummaryCard label="Resolved" count={resolvedCount} />
        </div>

        {/* Inquiry management */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {/* Heading and create button */}
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Customer Inquiries</h3>
              <p className="mt-1 text-sm text-slate-500">
                Search, filter, and manage customer inquiries.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm((current) => !current);
                setFormError("");
              }}
              className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {showForm ? "Cancel" : "+ New Inquiry"}
            </button>
          </div>

          {/* Create inquiry form */}
          {showForm && (
            <form
              onSubmit={handleCreateInquiry}
              className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="customer"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="customer"
                  name="customer"
                  type="text"
                  required
                  maxLength={100}
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  placeholder="Enter customer name"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Contact Details <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  required
                  maxLength={150}
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="Email or phone number"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="subject"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  maxLength={200}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Briefly describe the issue"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  maxLength={2000}
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Enter details about the customer inquiry"
                  className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {formError && (
                <p
                  role="alert"
                  className="text-sm text-red-600 sm:col-span-2"
                >
                  {formError}
                </p>
              )}

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Inquiry
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Search and status filter */}
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-end">
            <div>
              <label
                htmlFor="search"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Search inquiries
              </label>
              <input
                id="search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, contact, subject or ID"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>

            <div>
              <label
                htmlFor="statusFilter"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Filter by status
              </label>
              <select
                id="statusFilter"
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

          {/* Inquiry table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Inquiry ID
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Customer
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Subject
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Status
                  </th>
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
                      <p className="font-medium">{inquiry.customer}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {inquiry.contact}
                      </p>
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
                        className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                      No inquiries match your search or selected status.
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
