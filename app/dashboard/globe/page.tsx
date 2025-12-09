"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import CyberAttackGlobe from "@/components/CyberAttackGlobe";

export default function GlobePage() {
  return (
    <DashboardLayout>
      <div className="relative w-full h-[calc(100vh-0px)] overflow-hidden rounded-lg border border-green-500/20 bg-black">
        
        {/* 3D Cyber Attack Globe */}
        <CyberAttackGlobe />

        {/* Overlay Label */}
        <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-sm rounded border border-green-500/40 text-green-400 font-mono text-sm">
          <span className="animate-pulse">●</span> LIVE CYBER ATTACK SIMULATION
        </div>
      </div>
    </DashboardLayout>
  );
}
