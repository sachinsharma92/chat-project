'use client';

import Phaser from 'phaser';
import { Player } from '../objects/Player';

export class MapScene extends Phaser.Scene {
  mainPlayer: Player | null = null;

  constructor() {
    super({ key: 'MapScene' });
  }

  preload() {
    console.log('MapScene Preload');
    Player.preload(this);

    // assets

    // Water
    this.load.image(
      'Water',
      '/assets/2d/Sprout/Tilesets/ground tiles/Water.png',
    );

    // Soil_Ground_Tiles
    this.load.image(
      'Soil_Ground_Tiles',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Soil_Ground_Tiles.png',
    );

    // Mushrooms, Flowers, Stones
    this.load.image(
      'Mushrooms, Flowers, Stones',
      '/assets/2d/Sprout/Objects/Mushrooms, Flowers, Stones.png',
    );

    // Grass_Tile_layers2
    this.load.image(
      'Grass_Tile_layers2',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Grass_Tile_layers2.png',
    );

    // Grass_Tile_Layers
    this.load.image(
      'Grass_Tile_Layers',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Grass_Tile_Layers.png',
    );

    // Bush_Tiles
    this.load.image(
      'Bush_Tiles',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Bush_Tiles.png',
    );

    this.load.tilemapTiledJSON('map', '/assets/2d/spaceMap.json');
  }

  create() {
    const map = this.make.tilemap({
      key: 'map',
    });
    const xOffset = 0;
    const yOffset = 0;

    const WaterTileset = map.addTilesetImage('Water', 'Water');
    const SoilGroundTileset = map.addTilesetImage(
      'Soil_Ground_Tiles',
      'Soil_Ground_Tiles',
    );
    const GrassLayers2Tileset = map.addTilesetImage(
      'Grass_Tile_layers2',
      'Grass_Tile_layers2',
    );
    const GrassLayerTileset = map.addTilesetImage(
      'Grass_Tile_Layers',
      'Grass_Tile_Layers',
    );
    const BushTileset = map.addTilesetImage('Bush_Tiles', 'Bush_Tiles');
    const MushroomFlowersAndStonesTileset = map.addTilesetImage(
      'Mushrooms, Flowers, Stones',
      'Mushrooms, Flowers, Stones',
    );

    // WaterLayer1
    map.createLayer(
      'WaterLayer1',
      WaterTileset as Phaser.Tilemaps.Tileset,
      xOffset,
      yOffset,
    );

    // LandLayer1
    map.createLayer(
      'LandLayer1',
      SoilGroundTileset as Phaser.Tilemaps.Tileset,
      xOffset,
      yOffset,
    );

    // GrassLayer1
    map.createLayer(
      'GrassLayer1',
      GrassLayerTileset as Phaser.Tilemaps.Tileset,
      xOffset,
      yOffset,
    );

    // GrassLayer2
    map.createLayer(
      'GrassLayer2',
      GrassLayers2Tileset as Phaser.Tilemaps.Tileset,
      xOffset,
      yOffset,
    );

    // GrassLayer3
    map.createLayer(
      'GrassLayer3',
      [GrassLayers2Tileset, GrassLayerTileset] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    // BushLayer1
    map.createLayer(
      'BushLayer1',
      BushTileset as Phaser.Tilemaps.Tileset,
      xOffset,
      yOffset,
    );

    // BushLayer2
    map.createLayer(
      'BushLayer2',
      BushTileset as Phaser.Tilemaps.Tileset,
      xOffset,
      yOffset,
    );

    // FlowersLayer1
    map.createLayer(
      'FlowersLayer1',
      MushroomFlowersAndStonesTileset as Phaser.Tilemaps.Tileset,
      xOffset,
      yOffset,
    );

    this.mainPlayer = new Player({
      scene: this,
      x: 600,
      y: 600,
      textureKey: 'Basic Charakter Spritesheet',
    }).setOrigin(0, 0);
    this.mainPlayer.create();

    // @ts-ignore
    this.mainPlayer.body.setCollideWorldBounds(true);
    this.cameras.main.setZoom(2, 2);
    this.cameras.main.setBounds(0, 0, 1088, 1088, true);
    this.cameras.main.startFollow(this.mainPlayer, true, 2, 2);

    if (this.physics) {
      this.physics.world.bounds.height = 1088;
      this.physics.world.bounds.width = 1088;
    }
  }

  // @ts-ignore
  update(time: number, delta: number): void {
    if (this.mainPlayer) {
      this.mainPlayer.update();
    }
  }
}
