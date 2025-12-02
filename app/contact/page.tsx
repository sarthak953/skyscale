'use client';

import { useState } from 'react';

const CONTACTS = [
  {
    icon: (
      <svg width="32" height="32" fill="none"><rect width="32" height="32" rx="8" fill="#e0e7ff"/><path d="M8 10v12h16V10H8zm8 7.5l-8-5.5m8 5.5l8-5.5m-8 5.5V10" stroke="#2563eb" strokeWidth="2"/></svg>
    ),
    label: 'Email Us',
    value: 'info@anaveedecals.com',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none"><rect width="32" height="32" rx="8" fill="#dcfce7"/><path d="M16 22c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6z" stroke="#22c55e" strokeWidth="2"/><path d="M16 18v-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    label: 'Call Us',
    value: '+91 91373 20348',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none"><rect width="32" height="32" rx="8" fill="#fef9c3"/><path d="M16 10l6 6-6 6-6-6 6-6z" stroke="#f59e42" strokeWidth="2"/></svg>
    ),
    label: 'Visit Us',
    value: '213, Kasturi Pride Complex',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle'|'success'|'error'|'loading'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) setStatus('success');
    else setStatus('error');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-2">Get in Touch</h1>
      <p className="text-center text-gray-600 mb-10">Have a question about our model kits? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl p-6 mb-10 border border-sky-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Our Location</h3>
        <p className="text-gray-700 text-center">213, Kasturi Pride Complex</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {CONTACTS.map((c, i) => (
          <div key={c.label} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100 fade-in" style={{animationDelay: `${i*80}ms`}}>
            <div className="mb-2">{c.icon}</div>
            <div className="font-semibold mb-1">{c.label}</div>
            <div className="text-gray-600 text-sm">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto border border-gray-100 fade-in">
        <h2 className="text-2xl font-bold text-center mb-2">Send Us a Message</h2>
        <p className="text-center text-gray-500 mb-6">Fill out the form below and we'll get back to you within 24 hours</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <input required type="text" placeholder="Your Name *" className="flex-1 border px-4 py-2 rounded" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            <input required type="email" placeholder="Email Address *" className="flex-1 border px-4 py-2 rounded" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
          <input required type="text" placeholder="Subject *" className="w-full border px-4 py-2 rounded" value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} />
          <textarea required placeholder="Message *" className="w-full border px-4 py-2 rounded min-h-[120px]" value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
          <button type="submit" className="w-full bg-sky-600 text-white py-3 rounded font-semibold hover:bg-sky-700 transition">
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'success' && <div className="text-green-600 text-center">Message sent! We'll get back to you soon.</div>}
          {status === 'error' && <div className="text-red-600 text-center">Something went wrong. Please try again.</div>}
        </form>
      </div>
    </div>
  );
}
