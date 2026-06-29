import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Environment, ContactShadows, Html } from '@react-three/drei';

// Procedural interlocking link chain component
function ProceduralChain({ radiusX = 0.7, radiusY = 0.9, count = 40, color, linkRadius = 0.08, tubeRadius = 0.025 }) {
  const links = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radiusX;
    const y = Math.sin(angle) * radiusY;
    
    // Compute the tangent angle along the ellipse to align links along the chain curve
    const rotationZ = Math.atan2(radiusY * Math.cos(angle), -radiusX * Math.sin(angle));
    
    // Twist alternating links to interlock with each other
    const rotationX = i % 2 === 0 ? 0.5 : -0.5;
    
    links.push({ x, y, rotationZ, rotationX, id: i });
  }

  return (
    <group>
      {links.map((link) => (
        <mesh 
          key={link.id} 
          position={[link.x, link.y, 0]} 
          rotation={[link.rotationX, 0, link.rotationZ]}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[linkRadius, tubeRadius, 12, 36]} />
          <meshStandardMaterial 
            color={color} 
            roughness={0.06} 
            metalness={0.98} 
          />
        </mesh>
      ))}
    </group>
  );
}

// Procedural Model router based on the modelId
function RenderProceduralModel({ modelId }) {
  if (modelId === 'gold_necklace') {
    return (
      <group position={[0, 0.1, 0]}>
        {/* Tight gold rope chain */}
        <ProceduralChain 
          radiusX={0.62} 
          radiusY={0.78} 
          count={46} 
          color="#d4af37" // 18K gold color
          linkRadius={0.075} 
          tubeRadius={0.022} 
        />
        
        {/* Designer gold pendant */}
        <group position={[0, -0.81, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.045, 0.012, 8, 16]} />
            <meshStandardMaterial color="#d4af37" roughness={0.06} metalness={0.98} />
          </mesh>
          <mesh position={[0, -0.14, 0]} castShadow>
            <torusKnotGeometry args={[0.13, 0.045, 64, 8, 2, 3]} />
            <meshStandardMaterial color="#d4af37" roughness={0.04} metalness={1.0} />
          </mesh>
        </group>
      </group>
    );
  }

  if (modelId === 'cuban_chain') {
    return (
      <group position={[0, 0, 0]}>
        {/* Chunky Miami Cuban link chain */}
        <ProceduralChain 
          radiusX={0.65} 
          radiusY={0.82} 
          count={34} 
          color="#d4af37" 
          linkRadius={0.11} 
          tubeRadius={0.038} 
        />
      </group>
    );
  }

  if (modelId === 'chain_set') {
    return (
      <group position={[0, 0.05, 0]}>
        {/* Inner Gold Chain */}
        <ProceduralChain 
          radiusX={0.55} 
          radiusY={0.7} 
          count={34} 
          color="#d4af37" 
          linkRadius={0.065} 
          tubeRadius={0.02} 
        />
        {/* Outer Silver Chain */}
        <ProceduralChain 
          radiusX={0.7} 
          radiusY={0.88} 
          count={40} 
          color="#e2e8f0" // Sterling silver color
          linkRadius={0.085} 
          tubeRadius={0.026} 
        />
      </group>
    );
  }

  return null;
}

// Fullscreen absolute loading status
function ModelLoader() {
  return (
    <Html center>
      <div style={{
        color: '#f3f4f6',
        background: 'rgba(15, 16, 25, 0.85)',
        padding: '12px 24px',
        borderRadius: '12px',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        backdropFilter: 'blur(8px)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '13px',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: '#8b5cf6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <span>Generating Procedural Geometry...</span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Html>
  );
}

export default function JewelryViewer({ activeModel }) {
  if (!activeModel) return null;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      
      {/* 3D Canvas Viewport */}
      <Canvas shadows camera={{ position: [0, 0, 2.8], fov: 45 }}>
        {/* High-quality lighting setup for metallic reflections on white ground */}
        <ambientLight intensity={0.7} />
        <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={2} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.8} />
        
        <Suspense fallback={<ModelLoader />}>
          <Center>
            <RenderProceduralModel modelId={activeModel.modelId} />
          </Center>
          
          {/* Ambient reflections using city skybox preset */}
          <Environment preset="city" />
          
          {/* Drop shadows on the white ground for realistic depth */}
          <ContactShadows 
            position={[0, -0.65, 0]} 
            opacity={0.35} 
            scale={4.8} 
            blur={1.6} 
            far={1.2} 
          />
        </Suspense>

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          minDistance={0.8} 
          maxDistance={4.2}
          makeDefault 
        />
      </Canvas>

      {/* Floating Instructions HUD on bottom-right of white screen */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        background: 'rgba(15, 16, 25, 0.8)',
        backdropFilter: 'blur(8px)',
        padding: '8px 16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '99px',
        fontSize: '11px',
        color: '#f3f4f6',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{
          width: '12px',
          height: '16px',
          border: '1.5px solid #f3f4f6',
          borderRadius: '4px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '3px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '4px',
            backgroundColor: '#f3f4f6',
            borderRadius: '1px'
          }}></div>
        </div>
        <span>Left-click drag to rotate • Scroll to zoom</span>
      </div>

    </div>
  );
}
