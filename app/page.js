'use client';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', service: 'Console Repair', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus('Message sent! I will be in touch soon.');
      setFormData({ name: '', email: '', service: 'Console Repair', message: '' });
    } else {
      setStatus('Error sending message. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-400 mb-4">JP's Tech Garage</h1>
          <p className="text-xl text-gray-300">Expert Repairs & Custom Builds</p>
        </header>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 border-b border-gray-700 pb-2">Services Offered</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            <li className="bg-gray-800 p-4 rounded-lg shadow-md">🎮 Console Repair</li>
            <li className="bg-gray-800 p-4 rounded-lg shadow-md">📱 Phone Repair</li>
            <li className="bg-gray-800 p-4 rounded-lg shadow-md">💻 Computer & Laptop Repair</li>
            <li className="bg-gray-800 p-4 rounded-lg shadow-md">⚙️ Custom PC Building</li>
            <li className="bg-gray-800 p-4 rounded-lg shadow-md md:col-span-2">🎨 Console Customization (Switches, Shells, & More)</li>
          </ul>
        </section>

        {/* Contact & Booking Form */}
        <section className="bg-gray-800 p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-semibold mb-6">Request a Service</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <input
              type="text" required placeholder="Your Name"
              className="w-full p-3 rounded bg-gray-100"
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email" required placeholder="Your Email"
              className="w-full p-3 rounded bg-gray-100"
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <select
              className="w-full p-3 rounded bg-gray-100"
              value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            >
              <option value="Console Repair">Console Repair</option>
              <option value="Phone Repair">Phone Repair</option>
              <option value="Computer/Laptop Repair">Computer/Laptop Repair</option>
              <option value="Custom PC Build">Custom PC Build</option>
              <option value="Console Customization">Console Customization</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              required placeholder="Describe the issue or what you want built/customized..." rows="4"
              className="w-full p-3 rounded bg-gray-100"
              value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded transition-colors">
              Send Request
            </button>
            {status && <p className="text-center text-white mt-4">{status}</p>}
          </form>
        </section>
      </div>
    </main>
  );
}