"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRef, useEffect } from "react"; // make sure these are imported

export default function Terminal() {
  const [logs, setLogs] = useState<string[]>([
    "💻 Welcome to Finance Terminal",
    "💡 Type 'help' to see commands",
  ]);
  const [command, setCommand] = useState("");
  const logsEndRef = useRef<HTMLDivElement>(null); // 🔹 ref for bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]); // 🔹 scrolls down whenever logs update

  const handleCommand = async (cmd: string) => {
    const args = cmd.trim().split(" ");
    const base = args[0]?.toLowerCase();

    if (base === "help") {
      setLogs((prev) => [
        ...prev,
        "📖 Commands:",
        "➡ add income <amount> <source>",
        "➡ add expense <amount> <category> <title>",
        "➡ show balance",
        "➡ show income",
        "➡ show expenses",
        "➡ clear",
      ]);
    } else if (base === "add" && args[1] === "income") {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLogs((prev) => [...prev, "❌ Not authenticated"]);
        return;
      }

      const amount = parseFloat(args[2]);
      const source = args.slice(3).join(" ") || "other";
      const { error } = await supabase
        .from("income")
        .insert([{ amount, source, user_id: user.id }]);
      setLogs((prev) => [
        ...prev,
        error
          ? `❌ ${error.message}`
          : `✅ Income of ₹${amount} (${source}) added`,
      ]);
    } else if (base === "add" && args[1] === "expense") {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLogs((prev) => [...prev, "❌ Not authenticated"]);
        return;
      }

      const amount = parseFloat(args[2]);
      const category = args[3] || "general";
      const title = args.slice(4).join(" ") || "Terminal expense";
      const { error } = await supabase
        .from("expenses")
        .insert([{ amount, category, title, user_id: user.id }]);
      setLogs((prev) => [
        ...prev,
        error
          ? `❌ ${error.message}`
          : `✅ Expense of ₹${amount} (${category}) - ${title} added`,
      ]);
    } else if (base === "show" && args[1] === "balance") {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLogs((prev) => [...prev, "❌ Not authenticated"]);
        return;
      }

      const { data: incomes } = await supabase
        .from("income")
        .select("amount")
        .eq("user_id", user.id);
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id);

      const totalIncome =
        incomes?.reduce((acc, i) => acc + Number(i.amount), 0) || 0;
      const totalExpenses =
        expenses?.reduce((acc, e) => acc + Number(e.amount), 0) || 0;

      setLogs((prev) => [
        ...prev,
        `💰 Current Balance: ₹${totalIncome - totalExpenses}`,
      ]);
    } else if (base === "show" && args[1] === "income") {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLogs((prev) => [...prev, "❌ Not authenticated"]);
        return;
      }

      const { data } = await supabase
        .from("income")
        .select("amount, source, date")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(5);
      setLogs((prev) => [
        ...prev,
        "📈 Recent Income:",
        ...(data || []).map(
          (i) =>
            `+ ₹${i.amount} (${i.source}) on ${new Date(
              i.date
            ).toLocaleDateString()}`
        ),
      ]);
    } else if (base === "show" && args[1] === "expenses") {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLogs((prev) => [...prev, "❌ Not authenticated"]);
        return;
      }

      const { data } = await supabase
        .from("expenses")
        .select("amount, category, title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);
      setLogs((prev) => [
        ...prev,
        "📉 Recent Expenses:",
        ...(data || []).map((e) => `- ₹${e.amount} (${e.category}) - ${e.title}`),
      ]);
    } else if (base === "clear") {
      setLogs(["💻 Terminal cleared. Type 'help' to see commands"]);
    } else {
      setLogs((prev) => [...prev, `❓ Unknown command: ${cmd}`]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      setLogs((prev) => [...prev, `> ${command}`]);
      handleCommand(command);
      setCommand("");
    }
  };

  return (
    <div className="bg-[#0c0c0c] text-green-400 font-mono p-4 rounded-lg w-full h-140 flex flex-col shadow-lg border border-green-500 mx-auto">
      {/* Logs → fills remaining space, scrolls inside */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1 custom-scrollbar">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
        {/* 👇 auto-scroll anchor */}
        <div ref={logsEndRef} />
      </div>

      {/* Input → pinned at bottom */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center mt-2 shrink-0 border-t border-green-700 pt-2"
      >
        <span className="text-green-500 mr-2">➤</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="flex-1 bg-transparent text-green-400 outline-none placeholder-green-700"
          autoFocus
          placeholder="Type a command..."
        />
      </form>
    </div>
  );
}
