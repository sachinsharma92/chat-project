import React from "react";
import Soil from "./models/Soil";
import Board from "./models/Board";
import Bird from "./models/Bird";
import Cabin from "./models/Cabin";
import Campfire from "./models/Campfire";
import Villager from "./models/Villager";
import Rose, { Instances as Roses } from "./models/Rose";
import Pine, { Instances as Pines } from "./models/Pine";
import Oak, { Instances as Oaks } from "./models/Oak";
import Aspen, { Instances as Aspens } from "./models/Aspen";
import Sunflower, { Instances as Sunflowers } from "./models/Sunflower";
import Log, { Instances as Logs } from "./models/Log";

const Model = () => {
  return (
    <>
      {/* Pines */}
      <Pines castShadow receiveShadow>
        <Pine position={[4, 0, 0]} />
        <Pine position={[-5.5, 0, 4]} />
        <Pine position={[-2, 0, 10.5]} />
        <Pine position={[2.5, 0, 10.5]} />
        <Pine position={[6, 0, 5]} />
      </Pines>
      {/* Roses */}
      <Roses castShadow receiveShadow position-y={0}>
        <group position-x={0.3}>
          <Rose position={[1.8, 0.0, 5]} />
          <Rose position={[2.0, 0, 5.3]} />
          <Rose position={[2.2, 0, 5]} />
        </group>
        <group position={[-3.5, 0, 3]}>
          <Rose position={[1.8, 0.0, 5]} />
          <Rose position={[2.0, 0, 5.3]} />
          <Rose position={[2.2, 0, 5]} />
        </group>
      </Roses>
      {/* SunFlower */}
      <Sunflowers castShadow receiveShadow>
        <group>
          <Sunflower position={[-1.5, 0, 5]} />
          <Sunflower position={[-1.8, 0, 4.9]} />
          <Sunflower position={[-1.3, 0, 4.8]} />
        </group>
        <group position={[4.5, 0, 3]}>
          <Sunflower position={[-1.5, 0, 5]} />
          <Sunflower position={[-1.8, 0, 4.9]} />
          <Sunflower position={[-1.3, 0, 4.8]} />
        </group>
      </Sunflowers>
      <Soil />
      <Board position={[3.5, 0, 5]} />
      <Bird position={[6, 2, 6]} rotation={[0, -Math.PI / 2, 0]} />
      <Campfire />
      <Cabin position={[0.5, 0, 5]} />
      <Villager position={[-1, 0, 5.6]} />
      <Oaks castShadow receiveShadow>
        <Oak scale={1.5} position={[-2.3, 0, 2.5]} />
        <Oak scale={1.5} position={[-3.5, 0, 8.5]} />
        <Oak scale={1.5} position={[5.6, 0, 1.5]} />
      </Oaks>
      {/* Log */}
      <Logs receiveShadow>
        <Log position={[2, 0, 6.6]} rotation={[0, Math.PI / 2, 0]} />
        <Log position={[-1, 0, 6.6]} rotation={[0, Math.PI / 2, 0]} />
      </Logs>
      <Aspens castShadow receiveShadow>
        <Aspen position={[-2.5, 1.5, 7]} />
        <Aspen position={[-1.5, 1.5, 1]} />
        <Aspen position={[5, 1.5, 5]} rotation={[0, -0.9, 0]} />
        <Aspen position={[4.5, 1.5, 8]} />
      </Aspens>
    </>
  );
};

export default Model;
