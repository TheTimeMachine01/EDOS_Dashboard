import ComingSoonPage from "@/components/coming-soon";

export default function GlobePage() {
  return (
    <ComingSoonPage
      title="3D Global Threat Map"
      description="Interactive 3D globe visualization displaying real-time cyber attacks, threat origins, and global security intelligence. Experience cybersecurity like never before with immersive threat visualization."
      features={[
        "Interactive 3D Earth globe",
        "Real-time attack animations",
        "Geolocation-based threats",
        "Country-wise attack statistics",
        "Threat trajectory visualization",
        "WebGL-powered graphics ",
      ]}
      rd="view Globe"
      estimatedTime="Q2 2026"
    />
  );
}

// export default function GlobePage() {
//   const globeUrl = "https://globe.gl/example/airline-routes/us-international-outbound.html";

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4 font-mono text-green-300">3D Global Threat Map</h1>

//       <div className="w-full">
//         <iframe
//           src={globeUrl}
//           title="3D Global Threat Map"
//           className="w-full h-[70vh] md:h-[80vh] lg:h-[85vh] border-0 rounded"
//           allowFullScreen
//         />
//       </div>

//       <p className="mt-3 text-sm text-green-400 font-mono">
//         If the globe fails to load, open it in a new tab:{' '}
//         <a
//           href={globeUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="underline text-green-300"
//         >
//           View Globe
//         </a>
//       </p>
//     </div>
//   );
// }
