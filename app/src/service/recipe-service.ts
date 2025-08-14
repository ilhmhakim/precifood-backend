import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import { SetMenuRecipeRequest } from '../model/menu-model';
import { RecipeValidation } from '../validation/recipe-validation';
import { Validation } from '../validation/validation';
import { MenuService } from './menu-service';
import { Prisma, RecipeItemType } from '@prisma/client';

export class RecipeService {
  static async checkIfItemExists(
    itemId: number,
    itemType: RecipeItemType
  ): Promise<boolean> {
    if (itemType === RecipeItemType.bahan) {
      const item = await prismaClient.masterBahan.findUnique({
        where: { id: itemId },
      });
      if (item) {
        return true;
      }
      throw new ResponseError(404, `ID ${itemId} not found in Master Bahan`);
    } else if (itemType === RecipeItemType.bumbu) {
      const item = await prismaClient.masterBumbu.findUnique({
        where: { id: itemId },
      });
      if (item) {
        return true;
      }
      throw new ResponseError(404, `ID ${itemId} not found in Master Bumbu`);
    }
    throw new ResponseError(400, `Unknown item type ${itemType}`);
  }

  static async recalculateNutritionInternal(
    prisma: Prisma.TransactionClient,
    menuId: number
  ): Promise<void> {
    const recipes = await prisma.recipe.findMany({
      where: { menu_id: menuId },
      select: { item_id: true, item_type: true, quantity_grams: true },
    });

    if (recipes.length === 0) {
      await this.upsertNutritionZero(prisma, menuId);
      return;
    }

    const bahanIds = Array.from(
      new Set(
        recipes
          .filter((r) => r.item_type === RecipeItemType.bahan)
          .map((r) => r.item_id)
      )
    );
    const bumbuIds = Array.from(
      new Set(
        recipes
          .filter((r) => r.item_type === RecipeItemType.bumbu)
          .map((r) => r.item_id)
      )
    );

    const [masterBahan, masterBumbu] = await Promise.all([
      bahanIds.length
        ? prisma.masterBahan.findMany({ where: { id: { in: bahanIds } } })
        : Promise.resolve([] as any[]),
      bumbuIds.length
        ? prisma.masterBumbu.findMany({ where: { id: { in: bumbuIds } } })
        : Promise.resolve([] as any[]),
    ]);

    const bahanMap = new Map(masterBahan.map((m) => [m.id, m]));
    const bumbuMap = new Map(masterBumbu.map((m) => [m.id, m]));

    let calory = 0;
    let protein: Prisma.Decimal = new Prisma.Decimal(0);
    let fat: Prisma.Decimal = new Prisma.Decimal(0);
    let carbohydrate: Prisma.Decimal = new Prisma.Decimal(0);
    let fiber: Prisma.Decimal = new Prisma.Decimal(0);
    let natrium: Prisma.Decimal = new Prisma.Decimal(0);
    let cholesterol: Prisma.Decimal = new Prisma.Decimal(0);
    let sfa: Prisma.Decimal = new Prisma.Decimal(0);
    let mufa: Prisma.Decimal = new Prisma.Decimal(0);
    let pufa: Prisma.Decimal = new Prisma.Decimal(0);

    let totalWeightInGram = 0;

    // Update nutrition value from m (bahan or bumbu)
    const addFrom = (quantity: number, m: any) => {
      if (!m) return;

      const factor = (m.bdd / 100) * (quantity / 100);
      totalWeightInGram += quantity;

      calory += (m.calory as number) * factor;

      protein = protein.plus(new Prisma.Decimal(m.protein).times(factor));
      fat = fat.plus(new Prisma.Decimal(m.fat).times(factor));
      carbohydrate = carbohydrate.plus(
        new Prisma.Decimal(m.carbohydrate).times(factor)
      );
      fiber = fiber.plus(new Prisma.Decimal(m.fiber).times(factor));
      natrium = natrium.plus(new Prisma.Decimal(m.natrium).times(factor));
      cholesterol = cholesterol.plus(
        new Prisma.Decimal(m.cholesterol).times(factor)
      );
      sfa = sfa.plus(new Prisma.Decimal(m.sfa).times(factor));
      mufa = mufa.plus(new Prisma.Decimal(m.mufa).times(factor));
      pufa = pufa.plus(new Prisma.Decimal(m.pufa).times(factor));
    };

    for (const r of recipes) {
      if (r.item_type === RecipeItemType.bahan) {
        addFrom(r.quantity_grams, bahanMap.get(r.item_id));
      } else if (r.item_type === RecipeItemType.bumbu) {
        addFrom(r.quantity_grams, bumbuMap.get(r.item_id));
      } else {
        throw new ResponseError(
          400,
          `Unknown item_type ${r.item_type} for recipe item_id ${r.item_id}`
        );
      }
    }

    // Round as per Nutrition precision (macros 1dp, some 2dp)
    const r1 = (n: number) => Math.ceil(n * 10) / 10;
    const r2 = (n: number) => Math.ceil(n * 100) / 100;

    const data = {
      weight_per_portion: Math.round(totalWeightInGram),
      weight_with_bdd: Math.round(totalWeightInGram),
      calory: Math.round(calory),
      protein: new Prisma.Decimal(r1(protein.toNumber())),
      fat: new Prisma.Decimal(r1(fat.toNumber())),
      carbohydrate: new Prisma.Decimal(r1(carbohydrate.toNumber())),
      fiber: new Prisma.Decimal(r1(fiber.toNumber())),
      natrium: new Prisma.Decimal(r2(natrium.toNumber())),
      cholesterol: new Prisma.Decimal(r2(cholesterol.toNumber())),
      sfa: new Prisma.Decimal(r1(sfa.toNumber())),
      mufa: new Prisma.Decimal(r1(mufa.toNumber())),
      pufa: new Prisma.Decimal(r1(pufa.toNumber())),
    };

    const isNutritionExisting = await prisma.nutrition.findUnique({
      where: { menu_id: menuId },
    });
    if (isNutritionExisting) {
      await prisma.nutrition.update({ where: { menu_id: menuId }, data });
    } else {
      await prisma.nutrition.create({ data: { menu_id: menuId, ...data } });
    }
  }

  static async setMenuRecipe(request: SetMenuRecipeRequest): Promise<void> {
    const payload: SetMenuRecipeRequest = Validation.validate(
      RecipeValidation.SET,
      request
    );

    await MenuService.checkMenuExist(payload.menu_id, payload.restaurant_id);

    try {
      await Promise.all(
        payload.items.map((item) =>
          this.checkIfItemExists(item.item_id, item.item_type)
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new ResponseError(404, error.message);
      } else {
        throw new ResponseError(404, String(error));
      }
    }

    // TODO: refactor this to better algorithm and performance
    await prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.recipe.deleteMany({
        where: {
          menu_id: payload.menu_id,
        },
      });

      if (payload.items.length > 0) {
        await tx.recipe.createMany({
          data: payload.items.map((item) => ({
            menu_id: payload.menu_id,
            item_id: item.item_id,
            item_type: item.item_type,
            quantity_grams: item.quantity_grams,
          })),
        });
      }

      await this.recalculateNutritionInternal(tx, payload.menu_id);
    });
  }

  static async upsertNutritionZero(
    prisma: Prisma.TransactionClient,
    menuId: number
  ): Promise<void> {
    const zeros = {
      weight_per_portion: 0,
      weight_with_bdd: 0,
      calory: 0,
      protein: new Prisma.Decimal(0),
      fat: new Prisma.Decimal(0),
      carbohydrate: new Prisma.Decimal(0),
      fiber: new Prisma.Decimal(0),
      natrium: new Prisma.Decimal(0),
      cholesterol: new Prisma.Decimal(0),
      sfa: new Prisma.Decimal(0),
      mufa: new Prisma.Decimal(0),
      pufa: new Prisma.Decimal(0),
    };
    const existing = await prisma.nutrition.findUnique({
      where: { menu_id: menuId },
    });
    if (existing) {
      await prisma.nutrition.update({
        where: { menu_id: menuId },
        data: zeros,
      });
    } else {
      await prisma.nutrition.create({ data: { menu_id: menuId, ...zeros } });
    }
  }
}
