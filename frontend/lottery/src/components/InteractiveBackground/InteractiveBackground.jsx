// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// // import { SimplexNoise } from "simplex-noise";
// // import * as SimplexNoise from "simplex-noise";
// import SimplexNoise from "simplex-noise/simplex-noise.js";


// // import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';
// import chroma from "chroma-js";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";

// const InteractiveBackground = () => {
//   const meshRef = useRef();
//   const { camera } = useThree();
//   const simplex = new SimplexNoise();

//   useEffect(() => {
//     camera.position.z = 75;
//   }, [camera]);

//   useFrame(() => {
//     const time = Date.now() * 0.0002;
//     if (meshRef.current) {
//       const positions = meshRef.current.geometry.attributes.position.array;
//       for (let i = 0; i < positions.length; i += 3) {
//         positions[i + 2] = simplex.noise4D(
//           positions[i] / 50,
//           positions[i + 1] / 50,
//           time,
//           0
//         ) * 10;
//       }
//       meshRef.current.geometry.attributes.position.needsUpdate = true;
//     }
//   });

//   return (
//     <mesh ref={meshRef} rotation={[-Math.PI / 2 - 0.2, 0, 0]} position={[0, -25, 0]}>
//       <planeGeometry args={[100, 100, 50, 50]} />
//       <meshLambertMaterial color={"white"} side={THREE.DoubleSide} />
//     </mesh>
//   );
// };

// const Lights = () => {
//   return (
//     <>
//       <ambientLight color={0x000000} />
//       <pointLight color={chroma.random().hex()} intensity={0.9} position={[0, 10, 30]} />
//       <pointLight color={chroma.random().hex()} intensity={0.9} position={[0, -10, -30]} />
//       <pointLight color={chroma.random().hex()} intensity={0.9} position={[30, 10, 0]} />
//       <pointLight color={chroma.random().hex()} intensity={0.9} position={[-30, 10, 0]} />
//     </>
//   );
// };

// const ThreeJSScene = () => {
//   return (
//     <Canvas camera={{ fov: 75, position: [0, 0, 75] }}>
//       <Lights />
//       <InteractiveBackground />
//     </Canvas>
//   );
// };

// export default ThreeJSScene;
