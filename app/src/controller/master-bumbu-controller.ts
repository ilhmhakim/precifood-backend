import { UpdateBahanApprovalRequest } from '../model/master-bahan-model';
import {
  CreateMasterBumbuRequest,
  DeleteMasterBumbuRequest,
  GetMasterBumbuRequest,
  MasterBumbuResponse,
  UpdateMasterBumbuRequest,
} from '../model/master-bumbu-model';
import { MasterBumbuService } from '../service/master-bumbu-service';
import { UserRequest } from '../type/user';
import { NextFunction, Request, Response } from 'express';

// TODO : stript nutrition-related fields from request
export class MasterBumbuController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateMasterBumbuRequest =
        req.body as CreateMasterBumbuRequest;
      const response: MasterBumbuResponse =
        await MasterBumbuService.createNewBumbu(
          request,
          req.user.id,
          req.user.role
        );
      res.status(201).json({
        message: 'Bumbu berhasil dibuat',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response: MasterBumbuResponse[] =
        await MasterBumbuService.getAllMasterBumbu();

      res.status(200).json({
        message: `Berhasil mendapatkan semua bumbu (${response.length} bumbu)`,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request: GetMasterBumbuRequest = {
        id: parseInt(req.params.id),
      };

      const response: MasterBumbuResponse =
        await MasterBumbuService.getMasterBumbu(request);

      res.status(200).json({
        message: `Berhasil mendapatkan bumbu ${response.id} ${response.name} ${response.cooking_type || 'tanpa tipe masak'}`,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateMasterBumbuRequest = {
        id: parseInt(req.params.id),
        ...req.body,
      };
      const response: MasterBumbuResponse =
        await MasterBumbuService.updateMasterBumbu(
          request,
          req.user.id,
          req.user.role
        );
      res.status(200).json({
        message: `Bumbu ${response.name} berhasil diperbarui`,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: DeleteMasterBumbuRequest = {
        id: parseInt(req.params.id),
      };

      await MasterBumbuService.deleteMasterBumbu(request);

      res.status(200).json({
        message: 'Bumbu berhasil dihapus',
        data: 'Bumbu berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBumbuApproval(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: UpdateBahanApprovalRequest =
        req.body as UpdateBahanApprovalRequest;
      request.bahan_id = Number(req.params.id); // Note: Using bahan_id for consistency
      await MasterBumbuService.updateBumbuApproval(request);
      res.status(200).json({
        message: 'Success!',
      });
    } catch (e) {
      next(e);
    }
  }
}
