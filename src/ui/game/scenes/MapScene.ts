'use client';

import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { ShadowFish } from '../objects/ShadowFish';
import { House } from '../objects/House';

export class MapScene extends Phaser.Scene {
  mainPlayer: Player | null = null;
  shadowFishA: ShadowFish | null = null;
  house: House | null = null;

  constructor() {
    super({ key: 'MapScene' });
  }

  preload() {
    console.log('MapScene Preload');
    Player.preload(this);
    ShadowFish.preload(this);
    // House.preload(this);
    //new map
    this.load.image(
      'Water',
      '/assets/2d/Sprout/Tilesets/ground tiles/Water.png',
    );
    this.load.image(
      'Light_Grass',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Grass_tiles_v2.png',
    );
    this.load.image(
      'Darken_Grass',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Darker_Grass_Tiles_v2.png',
    );
    this.load.image(
      'Light_Grass_Layer',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Grass_Tile_layers2.png',
    );
    this.load.image('Boats', '/assets/2d/Sprout/Objects/Boats.png');
    this.load.image(
      'Dirt',
      '/assets/2d/Sprout/Tilesets/ground tiles/Old tiles/Tilled Dirt.png',
    );
    this.load.image(
      'Darken_Grass_Layer',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Darker_Grass_Tile_Layers2.png',
    );
    this.load.image(
      'Light_Hill',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Grass_Hill_Tiles_v2.png',
    );
    this.load.image(
      'Darken_Hill',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Darker_Grass_Hills_Tiles_v2.png',
    );
    this.load.image(
      'Darken_Hill_Slope',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Darker_Grass_Hill_Tiles_Slopes_v2.png',
    );
    this.load.image(
      'Light_Hill_Slope',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Grass_Hill_Tiles_Slopes v.2.png',
    );
    this.load.image(
      'Bush',
      '/assets/2d/Sprout/Tilesets/ground tiles/New tiles/Bush_Tiles.png',
    );
    this.load.image(
      'Chest',
      '/assets/2d/Sprout/Tilesets/Building parts/Chest.png',
    );
    this.load.image(
      'Fence',
      '/assets/2d/Sprout/Tilesets/Building parts/Fences.png',
    );
    this.load.image(
      'Farming_Plant',
      '/assets/2d/Sprout/Objects/Farming Plants.png',
    );
    this.load.image(
      'House',
      '/assets/2d/Sprout/Tilesets/Building parts/Wooden House.png',
    );
    this.load.image(
      'Room',
      '/assets/2d/Sprout/Tilesets/Building parts/Basic Furniture.png',
    );
    this.load.image(
      'Animal_Drink',
      '/assets/2d/Sprout/Tilesets/Building parts/Animal Structures/Water tray.png',
    );
    this.load.image(
      'Chicken_House',
      '/assets/2d/Sprout/Tilesets/Building parts/Animal Structures/Chikcen_Houses.png',
    );
    this.load.image(
      'Trees',
      '/assets/2d/Sprout/Objects/Trees, stumps and bushes.png',
    );
    this.load.image(
      'Plants',
      '/assets/2d/Sprout/Objects/Mushrooms, Flowers, Stones.png',
    );
    this.load.image(
      'Water_Object',
      '/assets/2d/Sprout/Objects/Water Objects.png',
    );
    this.load.image('Sign', '/assets/2d/Sprout/Objects/signs.png');
    this.load.image('Well', '/assets/2d/Sprout/Objects/Water well.png');
    this.load.image('Blanket', '/assets/2d/Sprout/Objects/Piknik blanket.png');
    this.load.image(
      'Barn',
      '/assets/2d/Sprout/Tilesets/Building parts/Animal Structures/Barn structures.png',
    );
    this.load.image(
      'Bridge',
      '/assets/2d/Sprout/Tilesets/Building parts/Wood Bridge.png',
    );
    this.load.image(
      'Stone_Path',
      '/assets/2d/Sprout/Tilesets/Building parts/STONE PATH.png',
    );
    this.load.image('Work', '/assets/2d/Sprout/Objects/work station.png');
    this.load.image('Collison', '/assets/2d/Sprout/Objects/Piknik basket.png');
    this.load.tilemapTiledJSON('map', '/assets/2d/bigMap.json');
  }

  create() {
    const map = this.make.tilemap({
      key: 'map',
    });
    const xOffset = 0;
    const yOffset = 0;

    const water = map.addTilesetImage('Water', 'Water');
    const lightGrass = map.addTilesetImage('Light_Grass', 'Light_Grass');
    const darkenGrass = map.addTilesetImage('Darken_Grass', 'Darken_Grass');
    const lightGrassLayer = map.addTilesetImage(
      'Light_Grass_Layer',
      'Light_Grass_Layer',
    );
    const boat = map.addTilesetImage('Boats', 'Boats');
    const dirt = map.addTilesetImage('Dirt', 'Dirt');
    const darkenGrassLayer = map.addTilesetImage(
      'Darken_Grass_Layer',
      'Darken_Grass_Layer',
    );
    const lightHill = map.addTilesetImage('Light_Hill', 'Light_Hill');
    const darkenHill = map.addTilesetImage('Darken_Hill', 'Darken_Hill');
    const darkenHillSlope = map.addTilesetImage(
      'Darken_Hill_Slope',
      'Darken_Hill_Slope',
    );
    const lightHillSlope = map.addTilesetImage(
      'Light_Hill_Slope',
      'Light_Hill_Slope',
    );
    const bush = map.addTilesetImage('Bush', 'Bush');
    const chest = map.addTilesetImage('Chest', 'Chest');
    const fence = map.addTilesetImage('Fence', 'Fence');
    const farmingPlant = map.addTilesetImage('Farming_Plant', 'Farming_Plant');
    const house = map.addTilesetImage('House', 'House');
    const room = map.addTilesetImage('Room', 'Room');
    const animalDrink = map.addTilesetImage('Animal_Drink', 'Animal_Drink');
    const chickenHouse = map.addTilesetImage('Chicken_House', 'Chicken_House');
    const tree = map.addTilesetImage('Trees', 'Trees');
    const plants = map.addTilesetImage('Plants', 'Plants');
    const waterObject = map.addTilesetImage('Water_Object', 'Water_Object');
    const sign = map.addTilesetImage('Sign', 'Sign');
    const well = map.addTilesetImage('Well', 'Well');
    const blanket = map.addTilesetImage('Blanket', 'Blanket');
    const barn = map.addTilesetImage('Barn', 'Barn');
    const bridge = map.addTilesetImage('Bridge', 'Bridge');
    const stonePath = map.addTilesetImage('Stone_Path', 'Stone_Path');
    const work = map.addTilesetImage('Work', 'Work');
    const collison = map.addTilesetImage('Collison', 'Collison');

    map.createLayer(
      'water',
      [water, water] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'light_grass',
      [lightGrass, lightGrass] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'darken_grass',
      [darkenGrass, darkenGrass] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'light_grass_layer',
      [lightGrassLayer, lightGrassLayer] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'boat',
      [boat, boat] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'dirt',
      [dirt, dirt] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'darken_grass_layer',
      [darkenGrassLayer, darkenGrassLayer] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'light_hill',
      [lightHill, lightHill] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'darken_hill',
      [darkenHill, darkenHill] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'darken_hill_slope',
      [darkenHillSlope, darkenHillSlope] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'light_hill_slope',
      [lightHillSlope, lightHillSlope] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'bush',
      [bush, bush] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'chest',
      [chest, chest] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'fence',
      [fence, fence] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'farming_plant',
      [farmingPlant, farmingPlant] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'house',
      [house, house] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'room',
      [room, room] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'animal_drink',
      [animalDrink, animalDrink] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'chicken_house',
      [chickenHouse, chickenHouse] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'plants',
      [plants, plants] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'water_object',
      [waterObject, waterObject] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'sign',
      [sign, sign] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'well',
      [well, well] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'blanket',
      [blanket, blanket] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'barn',
      [barn, barn] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'bridge',
      [bridge, bridge] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'stone_path',
      [stonePath, stonePath] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'work',
      [work, work] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );
    this.mainPlayer = new Player({
      scene: this,
      x: 350,
      y: 370,
      textureKey: 'Basic Charakter Spritesheet',
    }).setOrigin(0, 0);

    this.mainPlayer.create();

    map.createLayer(
      'tree',
      [tree, tree] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    map.createLayer(
      'front_tree',
      [tree, tree] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );

    const mapCollison = map.createLayer(
      'collison',
      [collison, collison] as Phaser.Tilemaps.Tileset[],
      xOffset,
      yOffset,
    );
    mapCollison?.setVisible(false);
    mapCollison?.setCollisionByProperty({ collides: true });
    // @ts-ignore
    this.physics.add.collider(this.mainPlayer, mapCollison);

    // @ts-ignore
    this.mainPlayer.body.setCollideWorldBounds(true);
    this.cameras.main.setZoom(3, 3);
    this.cameras.main.setBounds(0, 0, 1920, 1100, true);
    this.cameras.main.startFollow(this.mainPlayer, true, 2, 2);

    if (this.physics) {
      this.physics.world.bounds.height = 1100;
      this.physics.world.bounds.width = 1920;
    }

    this.createObjectCollisions();
  }

  HomeSceneTransition() {
    this.cameras.main.fadeOut(500, 0, 0, 0, (_: any, progress: number) => {
      if (progress === 1) {
        this.scene.switch('HomeScene');
      }
    });
  }

  createObjectCollisions() {
    // const platform = this.physics.add.staticGroup();
    // platform.create(400, 240, 'House');
    // @ts-ignore
    // this.physics.add.collider(this.mainPlayer, platform, () =>
    //   this.HomeSceneTransition(),
    // );
  }

  // @ts-ignore
  update(time: number, delta: number): void {
    if (this.mainPlayer) {
      this.mainPlayer.update();
    }
  }
}
