"use client";

import Header from "@/components/Header";
import RealtimeDashboard from "@/components/RealtimeDashboard";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Header />
      <div className="pt-16 px-4 sm:px-8 py-8">
        <RealtimeDashboard />
      </div>
    </div>
  );
}
