'use client';

import Phaser from 'phaser';

// Object for map scene
export class ShadowFish extends Phaser.GameObjects.Sprite {
  type = 'ShadowFish';

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
      'ShadowFish',
      '/assets/2d/CozyFishing/Fish Forage Items/fish_shadow.png',
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    console.log('ShadowFish Preload');
  }

  create() {
    const anims = this.scene.anims;

    anims.create({
      key: 'fish-idle',
      frames: anims.generateFrameNumbers('ShadowFish', {
        start: 0,
        end: 14,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update(): void {
    const anims = this.anims;

    if (this.body) {
      // @ts-ignore
      this.body.setVelocity(0);
    }

    if (anims) {
      anims.play('fish-idle', true);
    }
  }
}
