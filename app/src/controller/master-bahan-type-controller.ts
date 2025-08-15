import { MasterBahanTypeResponse } from '../model/master-bahan-type-model';
import { MasterBahanTypeService } from '../service/master-bahan-type-service';
import { NextFunction, Request, Response } from 'express';

export class MasterBahanTypeController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response: MasterBahanTypeResponse[] =
        await MasterBahanTypeService.getAllMasterBahanTypes();

      res.status(200).json({
        message: `Berhasil mendapatkan semua tipe bahan (${response.length} tipe)`,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
