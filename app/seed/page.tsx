'use client';

export default function SeedPage() {
  const seedCategories = async () => {
    const res = await fetch('/api/seed-categories', { method: 'POST' });
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  return (
    <div className="p-8">
      <h1>Database Seeding</h1>
      <button 
        onClick={seedCategories}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Seed Categories
      </button>
    </div>
  );
}