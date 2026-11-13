"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { idCard } from "@/content/site";
import { useResolvedTheme, type ResolvedTheme } from "@/lib/useResolvedTheme";
import { cardPalette, makeBandTexture, makeCardBack, makeCardFront } from "./textures";

// Card size in world units (same 1.6 : 2.25 proportions as the texture)
const CARD_W = 1.6;
const CARD_H = 2.25;
const CARD_D = 0.02;
const CARD_R = 0.08;
const ANCHOR_Y = 1.45; // where the strap meets the card, above the card centre
const SEGMENT = 0.34; // length of each of the 3 strap segments
const BAND_W = 0.18;
const BAND_TILE = BAND_W * 8; // band texture is 8:1

// The hero is always this many world units tall, so the card scales with the
// hero height: it hangs from the navbar and ends about 72% of the way down.
const VISIBLE_H = 5.1;
const CAMERA_Z = 10;
const FOV = THREE.MathUtils.radToDeg(2 * Math.atan(VISIBLE_H / 2 / CAMERA_Z));

type Body = RefObject<RapierRigidBody>;

/* ---------------- geometry helpers ---------------- */

function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

const CARD_SHAPE = roundedRectShape(CARD_W, CARD_H, CARD_R);

/** Remap ShapeGeometry UVs to 0..1 so the canvas texture covers the face edge to edge. */
function fitUvs(g: THREE.BufferGeometry) {
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + CARD_W / 2) / CARD_W, (pos.getY(i) + CARD_H / 2) / CARD_H);
  }
  uv.needsUpdate = true;
}

/** A flat strap that follows a curve, facing the camera. */
class Ribbon extends THREE.BufferGeometry {
  private count: number;
  constructor(count: number) {
    super();
    this.count = count;
    this.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 6), 3));
    this.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(count * 4), 2));
    const index: number[] = [];
    for (let i = 0; i < count - 1; i++) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    this.setIndex(index);
  }

  update(points: THREE.Vector3[]) {
    const pos = this.attributes.position as THREE.BufferAttribute;
    const uv = this.attributes.uv as THREE.BufferAttribute;
    let length = 0;
    for (let i = 0; i < this.count; i++) {
      const p = points[i];
      const prev = points[Math.max(0, i - 1)];
      const next = points[Math.min(this.count - 1, i + 1)];
      let tx = next.x - prev.x;
      let ty = next.y - prev.y;
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl;
      ty /= tl;
      const nx = -ty * (BAND_W / 2);
      const ny = tx * (BAND_W / 2);
      if (i > 0) length += p.distanceTo(points[i - 1]);
      pos.setXYZ(i * 2, p.x + nx, p.y + ny, p.z);
      pos.setXYZ(i * 2 + 1, p.x - nx, p.y - ny, p.z);
      const u = length / BAND_TILE;
      uv.setXY(i * 2, u, 1);
      uv.setXY(i * 2 + 1, u, 0);
    }
    pos.needsUpdate = true;
    uv.needsUpdate = true;
    this.computeBoundingSphere();
  }
}

/* ---------------- textures ---------------- */

type Textures = { front: THREE.Texture; back: THREE.Texture; band: THREE.Texture };

function useCardTextures(theme: ResolvedTheme) {
  const [textures, setTextures] = useState<Textures | null>(null);

  useEffect(() => {
    let cancelled = false;
    let made: Textures | null = null;
    (async () => {
      const family = getComputedStyle(document.body).fontFamily;
      await Promise.all(
        ["400", "500", "600"].map((wt) => document.fonts.load(`${wt} 40px ${family}`).catch(() => [])),
      );
      const front = await makeCardFront(theme, family, idCard);
      made = { front, back: makeCardBack(theme, family, idCard), band: makeBandTexture(theme, family) };
      if (cancelled) {
        Object.values(made).forEach((t) => t.dispose());
        return;
      }
      setTextures(made);
    })();
    return () => {
      cancelled = true;
      if (made) Object.values(made).forEach((t) => t.dispose());
    };
  }, [theme]);

  return textures;
}

/** A press on the card must not also click a link or button underneath it. */
function swallowNextClick() {
  const stop = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
  };
  window.addEventListener("click", stop, { capture: true, once: true });
  window.setTimeout(() => window.removeEventListener("click", stop, { capture: true }), 300);
}

/* ---------------- the physics rig ---------------- */

const segmentProps: RigidBodyProps = {
  type: "dynamic",
  canSleep: true,
  colliders: false,
  angularDamping: 4,
  linearDamping: 4,
};

type V3 = [number, number, number];

type RigProps = {
  textures: Textures;
  theme: ResolvedTheme;
  still: boolean;
  stageRef: RefObject<HTMLElement | null>;
  ratioRef: RefObject<number>;
  initialRatio: number;
};

function Rig({ textures, theme, still, stageRef, ratioRef, initialRatio }: RigProps) {
  const viewport = useThree((s) => s.viewport);
  const fixed = useRef<RapierRigidBody>(null) as Body;
  const j1 = useRef<RapierRigidBody>(null) as Body;
  const j2 = useRef<RapierRigidBody>(null) as Body;
  const j3 = useRef<RapierRigidBody>(null) as Body;
  const card = useRef<RapierRigidBody>(null) as Body;

  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  // Scratch objects mutated every frame live in refs.
  const tmp = useRef({
    vec: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    ang: new THREE.Vector3(),
    rot: new THREE.Euler(),
    quat: new THREE.Quaternion(),
  });
  const lerped = useRef(new Map<Body, THREE.Vector3>());
  const curve = useRef(
    new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
  );
  const band = useRef<THREE.Mesh>(null);
  const palette = cardPalette(theme);

  // Starting positions, fixed at mount. Intro: the strap starts sideways and
  // swings down. Reduced motion: it starts hanging still.
  const [start] = useState(() => {
    const ax = (initialRatio - 0.5) * viewport.width;
    const ay = viewport.height / 2 + 0.1;
    const s = SEGMENT;
    const pos = still
      ? { j1: [ax, ay - s, 0], j2: [ax, ay - 2 * s, 0], j3: [ax, ay - 3 * s, 0], card: [ax, ay - 3 * s - ANCHOR_Y, 0] }
      : { j1: [ax + s, ay, 0], j2: [ax + 2 * s, ay, 0], j3: [ax + 3 * s, ay, 0], card: [ax + 3 * s + 0.4, ay - 0.6, 0] };
    return { anchor: [ax, ay, 0] as V3, ...(pos as Record<"j1" | "j2" | "j3" | "card", V3>) };
  });

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], SEGMENT]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], SEGMENT]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], SEGMENT]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, ANCHOR_Y, 0]]);

  // Cursor + no text selection, set on the hero so it works over text and links too
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (dragged) stage.dataset.lanyard = "grabbing";
    else if (hovered) stage.dataset.lanyard = "grab";
    else delete stage.dataset.lanyard;
  }, [hovered, dragged, stageRef]);

  useEffect(() => {
    const stage = stageRef.current;
    return () => {
      if (stage) delete stage.dataset.lanyard;
    };
  }, [stageRef]);

  // The strap geometry is rebuilt from the joint positions every frame.
  useEffect(() => {
    const mesh = band.current;
    if (!mesh) return;
    const ribbon = new Ribbon(33);
    mesh.geometry = ribbon;
    return () => ribbon.dispose();
  }, []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    const { vec, dir, ang, rot, quat } = tmp.current;
    const { width, height } = state.viewport;

    // Keep the top of the strap above the right column, even after a resize
    fixed.current?.setNextKinematicTranslation({
      x: (ratioRef.current - 0.5) * width,
      y: height / 2 + 0.1,
      z: 0,
    });

    if (dragged && card.current) {
      // Project the pointer onto the z=0 plane and move the card there
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      // Anywhere in the hero, but never past its edges
      const maxX = width / 2 - CARD_W / 2 - 0.05;
      const minY = -height / 2 + CARD_H / 2 + 0.05;
      const maxY = height / 2 - CARD_H / 2 - 0.35;
      card.current.setNextKinematicTranslation({
        x: THREE.MathUtils.clamp(vec.x - dragged.x, -maxX, maxX),
        y: THREE.MathUtils.clamp(vec.y - dragged.y, minY, maxY),
        z: vec.z - dragged.z,
      });
    }

    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    // Smooth the two middle joints so the strap doesn't jitter
    for (const r of [j1, j2]) {
      const t = r.current!.translation();
      let l = lerped.current.get(r);
      if (!l) {
        l = new THREE.Vector3(t.x, t.y, t.z);
        lerped.current.set(r, l);
      }
      const dist = Math.max(0.1, Math.min(1, l.distanceTo(t as THREE.Vector3)));
      l.lerp(t as THREE.Vector3, d * (10 + dist * 40));
    }

    const c = curve.current;
    c.points[0].copy(j3.current.translation() as THREE.Vector3);
    c.points[1].copy(lerped.current.get(j2)!);
    c.points[2].copy(lerped.current.get(j1)!);
    c.points[3].copy(fixed.current.translation() as THREE.Vector3);
    const geo = band.current?.geometry;
    if (geo instanceof Ribbon) geo.update(c.getPoints(32));

    // Gently turn the card back to face the viewer
    ang.copy(card.current.angvel() as THREE.Vector3);
    const q = card.current.rotation();
    rot.setFromQuaternion(quat.set(q.x, q.y, q.z, q.w));
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    window.getSelection()?.removeAllRanges();
    (e.target as Element).setPointerCapture(e.pointerId);
    const t = card.current!.translation();
    setDragged(new THREE.Vector3().copy(e.point).sub(new THREE.Vector3(t.x, t.y, t.z)));
  }

  function onPointerUp(e: ThreeEvent<PointerEvent>) {
    (e.target as Element).releasePointerCapture(e.pointerId);
    swallowNextClick();
    setDragged(false);
  }

  return (
    <>
      <RigidBody ref={fixed} position={start.anchor} {...segmentProps} type="kinematicPosition" />
      <RigidBody ref={j1} position={start.j1} {...segmentProps}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody ref={j2} position={start.j2} {...segmentProps}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody ref={j3} position={start.j3} {...segmentProps}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody
        ref={card}
        position={start.card}
        {...segmentProps}
        type={dragged ? "kinematicPosition" : "dynamic"}
      >
        <CuboidCollider args={[CARD_W / 2, CARD_H / 2, CARD_D / 2]} />
        <group
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {/* Card edge */}
          <mesh position={[0, 0, -CARD_D / 2]}>
            <extrudeGeometry args={[CARD_SHAPE, { depth: CARD_D, bevelEnabled: false, curveSegments: 8 }]} />
            <meshBasicMaterial color={palette.line} toneMapped={false} />
          </mesh>
          {/* Front */}
          <mesh position={[0, 0, CARD_D / 2 + 0.001]}>
            <shapeGeometry args={[CARD_SHAPE, 8]} onUpdate={fitUvs} />
            <meshBasicMaterial map={textures.front} toneMapped={false} />
          </mesh>
          {/* Back */}
          <mesh position={[0, 0, -CARD_D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
            <shapeGeometry args={[CARD_SHAPE, 8]} onUpdate={fitUvs} />
            <meshBasicMaterial map={textures.back} toneMapped={false} />
          </mesh>
          {/* Clip */}
          <mesh position={[0, CARD_H / 2 + 0.12, 0]}>
            <boxGeometry args={[0.24, 0.34, 0.06]} />
            <meshBasicMaterial color={theme === "light" ? "#374151" : "#9CA3AF"} toneMapped={false} />
          </mesh>
        </group>
      </RigidBody>

      <mesh ref={band} frustumCulled={false}>
        <meshBasicMaterial map={textures.band} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </>
  );
}

type LanyardProps = {
  active: boolean;
  stageRef: RefObject<HTMLElement | null>;
  ratioRef: RefObject<number>;
  initialRatio: number;
};

/**
 * Draggable 3D lanyard ID card. The canvas covers the whole hero but ignores
 * the mouse itself; pointer events are read from the hero, so the text and
 * buttons underneath keep working and the card can be grabbed anywhere.
 */
export default function Lanyard({ active, stageRef, ratioRef, initialRatio }: LanyardProps) {
  const theme = useResolvedTheme();
  const textures = useCardTextures(theme);
  const [still] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  return (
    <Canvas
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
      dpr={[1, 2]}
      flat
      gl={{ alpha: true, antialias: true }}
      frameloop={active ? "always" : "never"}
      eventSource={stageRef as RefObject<HTMLElement>}
      eventPrefix="client"
      style={{ pointerEvents: "none" }}
    >
      <Physics gravity={[0, -40, 0]} timeStep={1 / 60} interpolate>
        {textures ? (
          <Rig
            textures={textures}
            theme={theme}
            still={still}
            stageRef={stageRef}
            ratioRef={ratioRef}
            initialRatio={initialRatio}
          />
        ) : null}
      </Physics>
    </Canvas>
  );
}
