import { Object3D, AnimationClip } from 'three';

export interface ICampModel {
  animations: AnimationClip[] | any[];
  scene: Object3D;
}
