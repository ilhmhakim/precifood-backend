import {
  MasterBahan,
  MasterBahanApprovalLog,
  MasterBahanType,
  MasterItemStatus,
} from '@prisma/client';

export type CreateMasterBahanRequest = {
  name: string;
  type_id: number;
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
  type_id?: number;
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
  type_id: number;
  type_name: string;
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
  appproval_logs?: MasterBahanApprovalLog[];
};

export type UpdateBahanApprovalRequest = {
  bahan_id: number;
  status: string;
  reason?: string;
};

export function toMasterBahanResponse(
  masterBahan: MasterBahan & {
    type: MasterBahanType;
    approval_logs?: MasterBahanApprovalLog[];
  }
): MasterBahanResponse {
  return {
    id: masterBahan.id,
    name: masterBahan.name,
    type_id: masterBahan.type_id,
    type_name: masterBahan.type.name,
    bdd: masterBahan.bdd,
    calory: Number(masterBahan.calory),
    protein: Number(masterBahan.protein),
    fat: Number(masterBahan.fat),
    carbohydrate: Number(masterBahan.carbohydrate),
    fiber: Number(masterBahan.fiber),
    natrium: Number(masterBahan.natrium),
    cholesterol: Number(masterBahan.cholesterol),
    sfa: Number(masterBahan.sfa),
    mufa: Number(masterBahan.mufa),
    pufa: Number(masterBahan.pufa),
    status: masterBahan.status,
    appproval_logs: masterBahan.approval_logs,
    created_at: masterBahan.created_at,
    updated_at: masterBahan.updated_at,
  };
}
