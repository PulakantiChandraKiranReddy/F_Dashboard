"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ExpenseForm() {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Insert into Supabase
    const { data, error } = await supabase.from("expenses").insert([
      {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        created_at: formData.date,
        notes: formData.notes,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error inserting expense:", error.message);
      alert("❌ Failed to add expense: " + error.message);
    } else {
      console.log("✅ Expense inserted:", data);
      alert("Expense Added ✅");
      setFormData({ title: "", amount: "", category: "", date: "", notes: "" });
    }
  };

  return (
    <div className="w-full max-w-lg bg-black/50 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white mb-6">➕ Add Expense</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm text-gray-200">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Grocery Shopping"
            required
            className="w-full px-3 py-2 rounded-lg bg-white/80 text-black"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm text-gray-200">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g. 1500"
            required
            className="w-full px-3 py-2 rounded-lg bg-white/80 text-black"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-gray-200">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-white/80 text-black"
          >
            <option value="">Select Category</option>
            <option value="Food">🍔 Food</option>
            <option value="Transport">🚌 Transport</option>
            <option value="Shopping">🛒 Shopping</option>
            <option value="Bills">💡 Bills</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Other">✨ Other</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm text-gray-200">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-white/80 text-black"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-gray-200">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional details..."
            className="w-full px-3 py-2 rounded-lg bg-white/80 text-black"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}



