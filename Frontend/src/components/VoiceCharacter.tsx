import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { EmotionTone } from '../types';

interface VoiceCharacterProps {
  state: 'idle' | 'listening' | 'speaking';
  emotion: EmotionTone;
}

const EMOTION_LABEL: Record<EmotionTone, string> = {
  calm: 'Calm',
  stressed: 'Stressed',
  sad: 'Sad',
  anxious: 'Anxious',
  happy: 'Happy',
  confused: 'Confused',
  neutral: 'Neutral'
};

const STANDING_SRC = '/models/Female Standing Pose.glb';
const TALKING_SRC  = '/models/Talking.glb';

// Each GLB has a different default front direction — pass rotationY per model
function Character({ src, rotationY }: { src: string; rotationY: number }) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(src);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    const g = group.current;
    if (!g) return;

    g.visible = false;

    // Reset to neutral before measuring — the scene is cached by useGLTF so it
    // carries scale/position from the previous mount. Without this reset the
    // bounding box measurement compounds on the previous scale every remount.
    g.scale.setScalar(1);
    g.position.set(0, 0, 0);
    g.rotation.y = 0;

    // Reset skeleton to bind pose so animation-deformed bones don't skew the
    // bounding box height, which would produce a different scale each time.
    g.traverse((child) => {
      const s = child as THREE.SkinnedMesh;
      if (s.isSkinnedMesh) s.skeleton.pose();
    });

    const box = new THREE.Box3().setFromObject(g);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const targetHeight = 2.1;
    const scale = size.y > 0 ? targetHeight / size.y : 1;

    g.scale.setScalar(scale);
    const scaledBox = new THREE.Box3().setFromObject(g);
    g.position.set(-center.x * scale, -scaledBox.min.y, -center.z * scale);
    g.rotation.y = rotationY;

    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]!.reset().play();
    }

    const raf = requestAnimationFrame(() => { g.visible = true; });
    return () => { cancelAnimationFrame(raf); };
  }, [scene, actions, names, rotationY]);

  return <primitive ref={group} object={scene} dispose={null} />;
}

useGLTF.preload(STANDING_SRC);
useGLTF.preload(TALKING_SRC);

export function VoiceCharacter({ state, emotion }: VoiceCharacterProps) {
  const src = state === 'idle' ? STANDING_SRC : TALKING_SRC;

  // Both models face the camera by default — no rotation needed.
  const rotationY = 0;

  const statusText =
    state === 'listening' ? 'Meena is listening'  :
    state === 'speaking'  ? 'Meena is speaking'   :
                            'Meena is ready to help';

  return (
    <div className="w-full max-w-[34rem] mx-auto flex flex-col items-center gap-3">
      {/* Canvas box — isolate so WebGL never bleeds over sibling DOM elements */}
      <div
        className="w-full relative rounded-[2rem] border border-mc-border bg-mc-surface-solid shadow-2xl overflow-hidden"
        style={{ height: '30rem', isolation: 'isolate' }}
      >
        <Canvas
          camera={{ position: [0, 1.0, 3.2], fov: 52 }}
          gl={{ alpha: true, antialias: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={1.4} />
          <directionalLight position={[3, 5, 3]} intensity={1.5} castShadow />
          <directionalLight position={[-2, 2, -1]} intensity={0.5} />

          <Suspense fallback={null}>
            <Character key={src} src={src} rotationY={rotationY} />
            <Environment preset="apartment" />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            target={[0, 0.9, 0]}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </div>

      {/* Status badges live OUTSIDE the canvas — no overlap with character feet */}
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-mc-border/80 bg-mc-bg/90 px-4 py-2 text-sm font-medium text-mc-text shadow-sm"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${
            state === 'listening' ? 'bg-emerald-400' :
            state === 'speaking'  ? 'bg-amber-400 animate-pulse' :
                                    'bg-sky-400'
          }`} />
          {statusText}
        </motion.div>

        <div className="rounded-full bg-mc-surface-solid/90 px-3 py-2 text-xs font-medium text-mc-text-muted shadow-sm border border-mc-border">
          Mood: {EMOTION_LABEL[emotion]}
        </div>
      </div>
    </div>
  );
}
