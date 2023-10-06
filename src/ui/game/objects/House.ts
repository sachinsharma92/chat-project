'use client';

import Phaser from 'phaser';

// todo
export class House extends Phaser.GameObjects.Sprite {
  type = 'House';

  constructor(props: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    textureKey: string;
  }) {
    super(props.scene, props.x, props.y, props.textureKey);
    this.scene = props.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
  }

  static preload(scene: Phaser.Scene) {
    if (!scene?.load) {
      return;
    }

    scene.load.spritesheet(
      'House',
      '/assets/2d/CozyFishing/Buildings/beachbar1.png',
      {
        frameWidth: 120,
        frameHeight: 120,
      },
    );
  }

  
}
