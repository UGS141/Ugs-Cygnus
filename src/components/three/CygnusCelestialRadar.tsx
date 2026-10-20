import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Compass, RotateCw, Eye, Maximize2, Minimize2 } from "lucide-react";

interface CygnusCelestialRadarProps {
  activeCategory?: string;
  onSelectCoordinatePin?: (pinIndex: number) => void;
  className?: string;
}

export const CygnusCelestialRadar: React.FC<CygnusCelestialRadarProps> = ({
  activeCategory = "all",
  onSelectCoordinatePin,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [radarSpeed, setRadarSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState(false);

  // Scratch memory objects outside render loop for zero-GC allocation
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080A14");
    scene.fog = new THREE.FogExp2("#080A14", 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 6.5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Mandatory Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Studio PBR Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.2); // Warm key light
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x00f5d4, 0x080a14, 0.9); // Cool cyan to dark ground
    scene.add(hemiLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.5, 12);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // 4. Procedural Canvas Texture for Radar Dial & Markings (Zero 404s)
    const dialCanvas = document.createElement("canvas");
    dialCanvas.width = 512;
    dialCanvas.height = 512;
    const dialCtx = dialCanvas.getContext("2d");
    if (dialCtx) {
      dialCtx.clearRect(0, 0, 512, 512);
      dialCtx.strokeStyle = "rgba(0, 245, 212, 0.4)";
      dialCtx.lineWidth = 4;
      dialCtx.beginPath();
      dialCtx.arc(256, 256, 240, 0, Math.PI * 2);
      dialCtx.stroke();

      dialCtx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      dialCtx.lineWidth = 2;
      dialCtx.beginPath();
      dialCtx.arc(256, 256, 170, 0, Math.PI * 2);
      dialCtx.stroke();

      dialCtx.beginPath();
      dialCtx.arc(256, 256, 100, 0, Math.PI * 2);
      dialCtx.stroke();

      // Cardinal tick marks
      dialCtx.strokeStyle = "rgba(0, 245, 212, 0.7)";
      for (let a = 0; a < 360; a += 15) {
        const rad = (a * Math.PI) / 180;
        const len = a % 90 === 0 ? 25 : a % 45 === 0 ? 15 : 8;
        dialCtx.beginPath();
        dialCtx.moveTo(256 + Math.cos(rad) * (240 - len), 256 + Math.sin(rad) * (240 - len));
        dialCtx.lineTo(256 + Math.cos(rad) * 240, 256 + Math.sin(rad) * 240);
        dialCtx.stroke();
      }

      // Compass labels
      dialCtx.fillStyle = "#00F5D4";
      dialCtx.font = "bold 20px 'Sora', sans-serif";
      dialCtx.textAlign = "center";
      dialCtx.fillText("N · 000°", 256, 36);
      dialCtx.fillText("S · 180°", 256, 496);
      dialCtx.fillText("E", 496, 262);
      dialCtx.fillText("W", 28, 262);
    }

    const dialTexture = new THREE.CanvasTexture(dialCanvas);
    dialTexture.colorSpace = THREE.SRGBColorSpace;
    dialTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 5. Composite 8-Part Procedural Subject (THREE.Group)
    const cygnusRig = new THREE.Group();
    cygnusRig.position.set(0, 0, 0);
    scene.add(cygnusRig);

    // Part 1: Heavy Pedestal Ring (Titanium finish)
    const baseGeo = new THREE.TorusGeometry(2.3, 0.08, 16, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x181e32,
      metalness: 0.92,
      roughness: 0.18,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = 0.08;
    cygnusRig.add(baseMesh);

    // Part 2: Holographic Grid Floor Disk
    const floorGeo = new THREE.CircleGeometry(2.3, 64);
    const floorMat = new THREE.MeshBasicMaterial({
      map: dialTexture,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0.09;
    cygnusRig.add(floorMesh);

    // Part 3: Soft Radial Contact Shadow Grounding Plane
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext("2d");
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.65)");
      grad.addColorStop(0.5, "rgba(0, 0, 0, 0.25)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.2), shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.01;
    scene.add(contactShadow);

    // Part 4 & 5: Dual Gyroscope Orbital Rings (Cyan & Blue)
    const gyroGroup = new THREE.Group();
    gyroGroup.position.y = 1.2;
    cygnusRig.add(gyroGroup);

    const outerGyroGeo = new THREE.TorusGeometry(1.4, 0.04, 16, 64);
    const outerGyroMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f5d4,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      emissive: 0x00f5d4,
      emissiveIntensity: 0.25,
    });
    const outerGyroMesh = new THREE.Mesh(outerGyroGeo, outerGyroMat);
    gyroGroup.add(outerGyroMesh);

    const innerGyroGeo = new THREE.TorusGeometry(1.05, 0.035, 16, 48);
    const innerGyroMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.8,
      emissive: 0x2563eb,
      emissiveIntensity: 0.3,
    });
    const innerGyroMesh = new THREE.Mesh(innerGyroGeo, innerGyroMat);
    innerGyroMesh.rotation.y = Math.PI / 2;
    gyroGroup.add(innerGyroMesh);

    // Part 6: Transmissive Core Cygnus Optical Prism Beacon
    const prismGeo = new THREE.OctahedronGeometry(0.5, 0);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      roughness: 0.08,
      ior: 1.65,
      thickness: 1.2,
      attenuationColor: new THREE.Color(0x00f5d4),
      attenuationDistance: 0.8,
      clearcoat: 1.0,
      emissive: 0x00f5d4,
      emissiveIntensity: 0.35,
    });
    const prismMesh = new THREE.Mesh(prismGeo, prismMat);
    prismMesh.castShadow = true;
    gyroGroup.add(prismMesh);

    // Part 7: Radar Sweep Fan Line
    const sweepGeo = new THREE.BufferGeometry();
    const sweepPositions = new Float32Array([0, 0.1, 0, 0, 0.1, 2.3]);
    sweepGeo.setAttribute("position", new THREE.BufferAttribute(sweepPositions, 3));
    const sweepMat = new THREE.LineBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.85 });
    const sweepLine = new THREE.Line(sweepGeo, sweepMat);
    cygnusRig.add(sweepLine);

    // Part 8: Spatial Coordinate Target Pins (Real-world map anchors)
    const pinGroup = new THREE.Group();
    cygnusRig.add(pinGroup);

    const pinCoords = [
      { angle: 0.4, dist: 1.8, color: 0x00f5d4, label: "Restaurant" },
      { angle: 1.7, dist: 1.5, color: 0x38bdf8, label: "Tech Store" },
      { angle: 3.2, dist: 1.9, color: 0x8b5cf6, label: "Dental Clinic" },
      { angle: 4.8, dist: 1.6, color: 0x00f5d4, label: "Salon & Spa" },
    ];

    const pinHeadGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pinStemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8);

    pinCoords.forEach((p, idx) => {
      const pinObj = new THREE.Group();
      const x = Math.cos(p.angle) * p.dist;
      const z = Math.sin(p.angle) * p.dist;
      pinObj.position.set(x, 0.1, z);

      const headMat = new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const headMesh = new THREE.Mesh(pinHeadGeo, headMat);
      headMesh.position.y = 0.45;

      const stemMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
      const stemMesh = new THREE.Mesh(pinStemGeo, stemMat);
      stemMesh.position.y = 0.225;

      pinObj.add(stemMesh);
      pinObj.add(headMesh);
      pinGroup.add(pinObj);
    });

    // 6. Pointer Drag / Hover Smooth Damping
    const onPointerDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
    };
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = nx * 1.5;
      mouseRef.current.targetY = ny * 0.8;
    };
    const onPointerUp = () => {
      mouseRef.current.isDown = false;
    };

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    // 7. Lossless 60fps Loop with Exponential Damping
    let animId: number;
    let lastTime = performance.now();
    let sweepAngle = 0;

    const animate = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (!isPaused) {
        // Gyro rotations
        outerGyroMesh.rotation.x += 0.8 * dt * radarSpeed;
        outerGyroMesh.rotation.z += 0.5 * dt * radarSpeed;
        innerGyroMesh.rotation.y += 1.1 * dt * radarSpeed;
        innerGyroMesh.rotation.x += 0.6 * dt * radarSpeed;
        prismMesh.rotation.y += 1.4 * dt * radarSpeed;

        // Radar sweep
        sweepAngle += 1.8 * dt * radarSpeed;
        sweepLine.rotation.y = sweepAngle;

        // Bobbing core
        gyroGroup.position.y = 1.2 + Math.sin(currentTime * 0.002) * 0.08;
      }

      // Camera exponential damping towards mouse target
      const k = 4.5;
      const smoothFactor = 1 - Math.exp(-k * dt);
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * smoothFactor;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * smoothFactor;

      camera.position.x = mouseRef.current.x * 2.2;
      camera.position.y = 3.8 + mouseRef.current.y * 1.2;
      camera.lookAt(0, 0.9, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      renderer.dispose();
      scene.clear();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [radarSpeed, isPaused]);

  return (
    <div
      ref={mountRef}
      className={`relative rounded-2xl overflow-hidden border border-[#1E253E] bg-[#080A14] ${
        isFullscreen ? "fixed inset-4 z-50 shadow-2xl" : "w-full h-[320px] sm:h-[380px]"
      } ${className}`}
    >
      {/* Viewport-First Compact Dock (<15% footprint, solid rgba surfaces over WebGL) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0C0F1E]/90 border border-[#212A45] rounded-full px-3 py-1 text-xs text-slate-300 pointer-events-auto shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
          <span className="font-semibold text-white">CYGNUS 3D Spatial Radar</span>
          <span className="text-slate-500 hidden sm:inline">· Studio PBR Beacon</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setRadarSpeed(radarSpeed === 1 ? 2 : radarSpeed === 2 ? 0.5 : 1)}
            className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#0E1324]/90 border border-[#242D4B] text-slate-300 hover:text-white"
            title="Toggle Scan Speed"
          >
            {radarSpeed}x
          </button>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-full bg-[#0E1324]/90 border border-[#242D4B] text-slate-300 hover:text-white"
            title={isPaused ? "Resume Scan" : "Freeze Radar"}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isPaused ? "text-amber-400" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-full bg-[#0E1324]/90 border border-[#242D4B] text-slate-300 hover:text-white"
            title="Toggle Size"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom telemetry overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 pointer-events-none">
        <span className="bg-[#0C0F1E]/80 px-2 py-0.5 rounded border border-[#1E253E]">
          Active Coordinates: Lat 28.6139° N · Lng 77.2090° E
        </span>
        <span className="bg-[#0C0F1E]/80 px-2 py-0.5 rounded border border-[#1E253E] hidden sm:inline">
          Drag to inspect 3D celestial beacon
        </span>
      </div>
    </div>
  );
};

export default CygnusCelestialRadar;
