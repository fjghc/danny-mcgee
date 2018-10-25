import { common } from './common';

export interface DmIconDefinition {
  prefix: string;
  iconName: string;
  icon: Array<any>;
}

export function createIconDefinition(iconName: string, svgPathData: string, width: number = 512, height: number = 512) {
  return {
    prefix: common.prefix,
    iconName: iconName,
    icon: [
      width,
      height,
      common.ligatures,
      common.unicode,
      svgPathData
    ]
  };
}
