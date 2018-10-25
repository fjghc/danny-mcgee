import { common } from './common';

export interface DmIconDefinition {
  prefix: string;
  iconName: string;
  icon: Array<any>;
}

export function createIconDefinition(iconName: string, svgPathData: string) {
  return {
    prefix: common.prefix,
    iconName: iconName,
    icon: [
      common.width,
      common.height,
      common.ligatures,
      common.unicode,
      svgPathData
    ]
  };
}
