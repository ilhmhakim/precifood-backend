import {
  CreateMasterBahanRequest,
  DeleteMasterBahanRequest,
  GetMasterBahanRequest,
  MasterBahanResponse,
  UpdateBahanApprovalRequest,
  UpdateMasterBahanRequest,
} from '../model/master-bahan-model';
import { MasterBahanService } from '../service/master-bahan-service';
import { UserRequest } from '../type/user';
import { NextFunction, Request, Response } from 'express';

// TODO : stript nutrition-related fields from request
export class MasterBahanController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateMasterBahanRequest =
        req.body as CreateMasterBahanRequest;
      const response: MasterBahanResponse =
        await MasterBahanService.createNewBahan(
          request,
          req.user.id,
          req.user.role
        );

      res.status(201).json({
        message: 'Bahan berhasil dibuat',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response: MasterBahanResponse[] =
        await MasterBahanService.getAllMasterBahan();

      res.status(200).json({
        message: `Berhasil mendapatkan semua bahan (${response.length} bahan)`,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request: GetMasterBahanRequest = {
        id: parseInt(req.params.id),
      };

      const response: MasterBahanResponse =
        await MasterBahanService.getMasterBahan(request);

      res.status(200).json({
        message: `Berhasil mendapatkan bahan ${response.id} ${response.name} ${response.type_name}`,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateMasterBahanRequest = {
        id: parseInt(req.params.id),
        ...req.body,
      };

      const response: MasterBahanResponse =
        await MasterBahanService.updateMasterBahan(
          request,
          req.user.id,
          req.user.role
        );

      res.status(200).json({
        message: `Bahan ${response.name} berhasil diperbarui`,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: DeleteMasterBahanRequest = {
        id: parseInt(req.params.id),
      };

      await MasterBahanService.deleteMasterBahan(request);

      res.status(200).json({
        message: 'Bahan berhasil dihapus',
        data: 'Bahan berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBahanApproval(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: UpdateBahanApprovalRequest =
        req.body as UpdateBahanApprovalRequest;
      request.bahan_id = Number(req.params.id);

      await MasterBahanService.updateBahanApproval(request);

      res.status(200).json({
        message: 'Success!',
      });
    } catch (e) {
      next(e);
    }
  }
}
