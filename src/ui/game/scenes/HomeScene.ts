'use client';

import Phaser from 'phaser';
import { Player } from '../objects/Player';

export class HomeScene extends Phaser.Scene {
  mainPlayer: Player | null = null;

  constructor() {
    super({ key: 'HomeScene' });
  }

  preload() {
    console.log('HomeScene Preload');
    Player.preload(this);

    this.load.image('rugs', '/assets/2d/CozyInterior/basics/rugs.png');
    this.load.image('curtains', '/assets/2d/CozyInterior/basics/curtains.png');
    this.load.image(
      'wallpapers',
      '/assets/2d/CozyInterior/basics/wallpapers.png',
    );

    this.load.tilemapTiledJSON('homeMap', '/assets/2d/house1_v1.json');
  }

  create() {
    const map = this.make.tilemap({
      key: 'homeMap',
    });

    const rugsTileset = map.addTilesetImage('rugs', 'rugs');
    const curtainsTileset = map.addTilesetImage('curtains', 'curtains');
    const wallpapersTileset = map.addTilesetImage('wallpapers', 'wallpapers');

    map.createLayer(
      'FloorLayer1',
      wallpapersTileset as Phaser.Tilemaps.Tileset,
      0,
      0,
    );
    map.createLayer(
      'FloorLayer3',
      wallpapersTileset as Phaser.Tilemaps.Tileset,
      0,
      0,
    );
    map.createLayer(
      'BorderLayer1',
      wallpapersTileset as Phaser.Tilemaps.Tileset,
      0,
      0,
    );

    map.createLayer(
      'FloorLayer2',
      [rugsTileset, wallpapersTileset] as Phaser.Tilemaps.Tileset[],
      0,
      0,
    );
    map.createLayer(
      'WallLayer1',
      wallpapersTileset as Phaser.Tilemaps.Tileset,
      0,
      0,
    );
    map.createLayer(
      'WindowLayer1',
      curtainsTileset as Phaser.Tilemaps.Tileset,
      0,
      0,
    );
    map.createLayer(
      'WindowLayer2',
      curtainsTileset as Phaser.Tilemaps.Tileset,
      0,
      0,
    );
    map.createLayer(
      'BorderLayer3',
      wallpapersTileset as Phaser.Tilemaps.Tileset,
      0,
      0,
    );
    map.createLayer(
      'RugsLayer1',
      [wallpapersTileset, rugsTileset] as Phaser.Tilemaps.Tileset[],
      0,
      0,
    );
    map.createLayer(
      'BorderLayer2',
      wallpapersTileset as Phaser.Tilemaps.Tileset,
      0,
      0,
    );

    this.mainPlayer = new Player({
      scene: this,
      x: 350,
      y: 340,
      textureKey: 'Basic Charakter Spritesheet',
    }).setOrigin(0, 0);
    this.mainPlayer.create();

    this.cameras.main.setZoom(2, 2);
    this.cameras.main.setBounds(0, 0, 1600, 1600, true);
    this.cameras.main.startFollow(this.mainPlayer, true, 2, 2);

    if (this.physics) {
      this.physics.world.bounds.height = 1900;
      this.physics.world.bounds.width = 1900;
    }

    // todo
    this.createObjectCollisions();
  }

  createObjectCollisions() {
    // todo
  }

  // @ts-ignore
  update(time: number, delta: number): void {
    if (this.mainPlayer) {
      this.mainPlayer.update();
    }
  }
}
