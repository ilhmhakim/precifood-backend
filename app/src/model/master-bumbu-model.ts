import { MasterBumbu } from '@prisma/client';

export type CreateMasterBumbuRequest = {
  name: string;
  cooking_type?: string | null;
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

export type UpdateMasterBumbuRequest = {
  id: number;
  name?: string;
  cooking_type?: string | null;
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

export type GetMasterBumbuRequest = {
  id: number;
};

export type DeleteMasterBumbuRequest = {
  id: number;
};

export type MasterBumbuResponse = {
  id: number;
  name: string;
  cooking_type: string | null;
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

export function toMasterBumbuResponse(
  masterBumbu: MasterBumbu
): MasterBumbuResponse {
  return {
    id: masterBumbu.id,
    name: masterBumbu.name,
    cooking_type: masterBumbu.cooking_type,
    bdd: masterBumbu.bdd,
    calory: Number(masterBumbu.calory),
    protein: Number(masterBumbu.protein),
    fat: Number(masterBumbu.fat),
    carbohydrate: Number(masterBumbu.carbohydrate),
    fiber: Number(masterBumbu.fiber),
    natrium: Number(masterBumbu.natrium),
    cholesterol: Number(masterBumbu.cholesterol),
    sfa: Number(masterBumbu.sfa),
    mufa: Number(masterBumbu.mufa),
    pufa: Number(masterBumbu.pufa),
    created_at: masterBumbu.created_at,
    updated_at: masterBumbu.updated_at,
  };
}
