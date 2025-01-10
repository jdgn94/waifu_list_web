import { ImageType } from './image_type'
import { WaifuRarity } from './waifu_rarity'

export interface WaifuImage {
  id: number;
  waifuId: number;
  rarityId: number;
  userId?: string;
  imageTypeId: number;
  points: number;
  publicId: string;
  publicUrl: string;
  createdAt: Date;
  updatedAt: Date;
  waifuRarity?: WaifuRarity;
  imageType?: ImageType;
  imageFile?: File;
}
