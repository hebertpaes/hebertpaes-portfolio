"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Instituto3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0b1020");

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 2000);
    camera.position.set(80, 100, 180);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 60;
    controls.maxDistance = 500;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x1f2937, 0.9);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(120, 200, 100);
    scene.add(dir);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(420, 420),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95, metalness: 0.1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);

    const lot = new THREE.Mesh(
      new THREE.PlaneGeometry(52, 26),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 })
    );
    lot.rotation.x = -Math.PI / 2;
    lot.position.y = 0.02;
    scene.add(lot);

    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x9ca3af,
      metalness: 0.55,
      roughness: 0.4,
      clearcoat: 0.5,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.8,
      transparent: true,
      opacity: 0.78,
    });

    const floors = 22;
    const floorHeight = 4.1;
    const towerHeight = floors * floorHeight;

    const core = new THREE.Mesh(new THREE.BoxGeometry(26, towerHeight, 18), baseMat);
    core.position.y = towerHeight / 2;
    scene.add(core);

    const facade = new THREE.Mesh(new THREE.BoxGeometry(28.5, towerHeight + 0.8, 20.5), glassMat);
    facade.position.y = towerHeight / 2;
    scene.add(facade);

    const briseMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.4, roughness: 0.6 });
    for (let i = 0; i < floors; i++) {
      const y = i * floorHeight + 2;
      const brise = new THREE.Mesh(new THREE.BoxGeometry(30, 0.16, 0.45), briseMat);
      brise.position.set(0, y, 10.8);
      scene.add(brise);
    }

    const panoShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.2, towerHeight + 10, 24),
      new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transmission: 0.92, roughness: 0.1, transparent: true, opacity: 0.7 })
    );
    panoShaft.position.set(17, (towerHeight + 10) / 2, 0);
    scene.add(panoShaft);

    const cabin = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 3.2, 20),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.5, roughness: 0.3 })
    );
    cabin.position.set(17, 4, 0);
    scene.add(cabin);

    const roofGarden = new THREE.Mesh(
      new THREE.BoxGeometry(23, 0.7, 15),
      new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.95 })
    );
    roofGarden.position.set(0, towerHeight + 0.6, 0);
    scene.add(roofGarden);

    const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.6, roughness: 0.3 });
    for (let i = 0; i < 8; i++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.2), solarPanelMat);
      panel.position.set(-8 + i * 2.2, towerHeight + 1.1, 6);
      panel.rotation.x = -0.22;
      scene.add(panel);
    }

    const ramp = new THREE.Mesh(
      new THREE.TorusGeometry(12, 1.8, 20, 120, Math.PI * 1.9),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 })
    );
    ramp.rotation.x = Math.PI / 2;
    ramp.position.set(0, 9, -16);
    scene.add(ramp);

    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      cabin.position.y = 4 + ((Math.sin(t * 0.45) + 1) / 2) * (towerHeight - 8);
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-[520px] w-full rounded-2xl border border-white/10" />;
}
