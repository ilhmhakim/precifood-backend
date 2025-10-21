import {
  MasterBumbu,
  MasterBumbuApprovalLog,
  MasterItemStatus,
} from '@prisma/client';

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
  status: MasterItemStatus;
  created_at: Date;
  updated_at: Date;
  approval_logs?: MasterBumbuApprovalLog[];
};

export function toMasterBumbuResponse(
  masterBumbu: MasterBumbu & { approval_logs?: MasterBumbuApprovalLog[] }
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
    status: masterBumbu.status,
    approval_logs: masterBumbu.approval_logs,
    created_at: masterBumbu.created_at,
    updated_at: masterBumbu.updated_at,
  };
}
