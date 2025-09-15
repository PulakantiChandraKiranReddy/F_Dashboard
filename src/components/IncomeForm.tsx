"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function IncomeForm() {
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    description: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get current user first
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("❌ Not authenticated");
      setLoading(false);
      return;
    }

    // Insert into Supabase
    const { data, error } = await supabase.from("income").insert([
      {
        amount: parseFloat(formData.amount),
        source: formData.source,
        description: formData.description,
        date: formData.date || new Date().toISOString(),
        user_id: user.id,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error inserting income:", error.message);
      alert("❌ Failed to add income: " + error.message);
    } else {
      // console.log("✅ Income inserted:", data);
      alert("Income Added ✅");
      setFormData({ amount: "", source: "", description: "", date: "" });
    }
  };

  return (
    <div className="w-full max-w-lg bg-black/50 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white mb-6">💰 Add Income</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm text-gray-200">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g. 50000"
            required
            className="w-full px-3 py-2 rounded-lg bg-white/80 text-black"
          />
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm text-gray-200">Source</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="e.g. Salary, Freelance, Investment"
            required
            className="w-full px-3 py-2 rounded-lg bg-white/80 text-black"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-200">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Any additional details..."
            className="w-full px-3 py-2 rounded-lg bg-white/80 text-black"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm text-gray-200">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-white/80 text-black"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          {loading ? "Adding..." : "Add Income"}
        </button>
      </form>
    </div>
  );
}
