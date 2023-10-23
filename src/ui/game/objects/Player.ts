'use client';

import { isChatFocused } from '@/ui/features/Chat/ChatInput';
import Phaser from 'phaser';
import { joystickProviderStoreRef } from '@/store/JoystickProvider';

export class Player extends Phaser.GameObjects.Sprite {
  keys: Record<string | number, any> | undefined | null = null;
  isDead: boolean = false;
  type = 'Player';

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
      'Basic Charakter Spritesheet',
      '/assets/2d/Characters/Basic Charakter Spritesheet.png',
      {
        frameWidth: 18,
        frameHeight: 18,
        margin: 15,
        spacing: 30,
      },
    );

    console.log('Player Preload');
  }

  create() {
    const scene = this.scene;
    const anims = this.scene.anims;
    const { LEFT, RIGHT, UP, DOWN, W, A, S, D } =
      Phaser.Input.Keyboard.KeyCodes;

    this.keys = scene.input.keyboard?.addKeys(
      {
        left: LEFT,
        right: RIGHT,
        up: UP,
        down: DOWN,
        w: W,
        a: A,
        s: S,
        d: D,
      },
      false,
    );
    this.setDisplaySize(16, 16);

    if (this.body) {
      // @ts-ignore
      this.body.setCollideWorldBounds(true);
    }

    anims.create({
      key: 'player-left',
      frames: anims.generateFrameNumbers('Basic Charakter Spritesheet', {
        start: 8,
        end: 11,
      }),
      frameRate: 8,
      repeat: -1,
    });
    anims.create({
      key: 'player-right',
      frames: anims.generateFrameNumbers('Basic Charakter Spritesheet', {
        start: 12,
        end: 15,
      }),
      frameRate: 8,
      repeat: -1,
    });
    anims.create({
      key: 'player-turn',
      frames: anims.generateFrameNumbers('Basic Charakter Spritesheet', {
        start: 4,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });

    anims.create({
      key: 'player-down',
      frames: anims.generateFrameNumbers('Basic Charakter Spritesheet', {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: 'player-idle-down',
      frames: anims.generateFrameNumbers('Basic Charakter Spritesheet', {
        start: 0,
        end: 1,
      }),
      frameRate: 3,
      repeat: -1,
    });
  }

  // @ts-ignore
  update(...args: any[]): void {
    const anims = this.anims;
    const keys = this.keys;
    const speed = 70;
    // @ts-ignore
    const direction = joystickProviderStoreRef.direction.direction;

    if (this.body) {
      // @ts-ignore
      this.body.setVelocity(0);
    }

    if (keys && !isChatFocused()) {
      const playerVelocity = new Phaser.Math.Vector2();

      // movements

      if (keys.left.isDown || keys.a.isDown || direction === 'LEFT') {
        playerVelocity.x = -1;
      } else if (keys.right.isDown || keys.d.isDown || direction === 'RIGHT') {
        playerVelocity.x = 1;
      }

      if (keys.up.isDown || keys.w.isDown || direction === 'FORWARD') {
        playerVelocity.y = -1;
      } else if (
        keys.down.isDown ||
        keys.s.isDown ||
        direction === 'BACKWARD'
      ) {
        playerVelocity.y = 1;
      }

      playerVelocity.normalize();
      playerVelocity.scale(speed);

      if (this.body) {
        // @ts-ignore
        this.body.setVelocity(playerVelocity.x, playerVelocity.y);
      }

      // animations
      if (keys.left.isDown || keys.a.isDown || direction === 'LEFT') {
        anims.play('player-left', true);
      } else if (keys.right.isDown || keys.d.isDown || direction === 'RIGHT') {
        anims.play('player-right', true);
      } else if (keys.up.isDown || keys.w.isDown || direction === 'FORWARD') {
        anims.play('player-turn', true);
      } else if (
        keys.down.isDown ||
        keys.s.isDown ||
        direction === 'BACKWARD'
      ) {
        anims.play('player-down', true);
      } else {
        anims.play('player-idle-down', true);
      }
    }
  }
}
