"use client";

import { useEffect, useRef } from "react";

export default function CyberAttackGlobe() {
  const globeRef = useRef(null);

  // Dummy API call
  async function fetchAttackData() {
    return [
      {
        id: 1,
        source: { lat: 40.7128, lng: -74.0060, country: "USA" },
        target: { lat: 55.7558, lng: 37.6173, country: "Russia" },
        type: "DDoS"
      },
      {
        id: 2,
        source: { lat: 35.6895, lng: 139.6917, country: "Japan" },
        target: { lat: 48.8566, lng: 2.3522, country: "France" },
        type: "Malware"
      }
    ];
  }

  useEffect(() => {
    let world;

    async function initGlobe() {
      // ⭐ Dynamic import to avoid "window is not defined"
      const Globe = (await import("globe.gl")).default;

      world = Globe()
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
        .backgroundColor("#000011")
        .arcColor((d) =>
          d.type === "DDoS"
            ? ["#ff0000", "#ff6600"]
            : ["#00aaff", "#0088ff"]
        )
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashInitialGap(() => Math.random())
        .arcDashAnimateTime(1500)
        .arcAltitude(0.25)
        .pointColor(() => "rgba(255,0,0,0.9)")   // FIXED
        .pointAltitude(0.04)
        .pointsMerge(true);

      world(globeRef.current);

      async function loadAttacks() {
        const data = await fetchAttackData();

        const attacks = data.map((a) => ({
          startLat: a.source.lat,
          startLng: a.source.lng,
          endLat: a.target.lat,
          endLng: a.target.lng,
          type: a.type,
        }));

        const points = data.map((a) => ({
          lat: a.source.lat,
          lng: a.source.lng,
        }));

        world.arcsData(attacks);
        world.pointsData(points);
      }

      loadAttacks();
      const interval = setInterval(loadAttacks, 3000);

      function onResize() {
        world.width(window.innerWidth);
        world.height(window.innerHeight);
      }

      window.addEventListener("resize", onResize);

      return () => {
        clearInterval(interval);
        window.removeEventListener("resize", onResize);
      };
    }

    initGlobe();
  }, []);

  return (
    <div
      ref={globeRef}
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    />
  );
}
