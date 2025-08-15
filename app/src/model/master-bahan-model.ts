import { MasterBahan } from '@prisma/client';

export type CreateMasterBahanRequest = {
  name: string;
  type: string;
  bdd: number;
  calory: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number;
  natrium: number;
  cholesterol: number;
  sfa: number;
  mufa: number;
  pufa: number;
};

export type UpdateMasterBahanRequest = {
  id: number;
  name?: string;
  type?: string;
  bdd?: number;
  calory?: number;
  protein?: number;
  fat?: number;
  carbohydrate?: number;
  fiber?: number;
  natrium?: number;
  cholesterol?: number;
  sfa?: number;
  mufa?: number;
  pufa?: number;
};

export type GetMasterBahanRequest = {
  id: number;
};

export type DeleteMasterBahanRequest = {
  id: number;
};

export type MasterBahanResponse = {
  id: number;
  name: string;
  type: string;
  bdd: number;
  calory: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number;
  natrium: number;
  cholesterol: number;
  sfa: number;
  mufa: number;
  pufa: number;
  created_at: Date;
  updated_at: Date;
};

export function toMasterBahanResponse(
  masterBahan: MasterBahan
): MasterBahanResponse {
  return {
    id: masterBahan.id,
    name: masterBahan.name,
    type: masterBahan.type,
    bdd: masterBahan.bdd,
    calory: masterBahan.calory,
    protein: Number(masterBahan.protein),
    fat: Number(masterBahan.fat),
    carbohydrate: Number(masterBahan.carbohydrate),
    fiber: Number(masterBahan.fiber),
    natrium: Number(masterBahan.natrium),
    cholesterol: Number(masterBahan.cholesterol),
    sfa: Number(masterBahan.sfa),
    mufa: Number(masterBahan.mufa),
    pufa: Number(masterBahan.pufa),
    created_at: masterBahan.created_at,
    updated_at: masterBahan.updated_at,
  };
}
