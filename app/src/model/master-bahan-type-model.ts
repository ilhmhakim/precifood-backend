import { MasterBahanType } from '@prisma/client';

export type MasterBahanTypeResponse = {
  id: number;
  name: string;
};

export function toMasterBahanTypeResponse(
  masterBahanType: MasterBahanType
): MasterBahanTypeResponse {
  return {
    id: masterBahanType.id,
    name: masterBahanType.name,
  };
}
