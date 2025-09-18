import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import {
  GetMenuRecipeRequest,
  GetMenuRecipeResponse,
  RefreshMenuNutritionRequest,
  SetMenuRecipeRequest,
} from '../model/menu-model';
import { RecipeValidation } from '../validation/recipe-validation';
import { Validation } from '../validation/validation';
import { MenuService } from './menu-service';
import { Menu, Prisma, Recipe, RecipeItemType } from '@prisma/client';

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
    // Fetch recipes along with their related Menu
    const recipes = await prisma.recipe.findMany({
      where: { menu_id: menuId },
      select: {
        item_id: true,
        item_type: true,
        quantity_grams: true,
        Menu: true, // This will include the related Menu object
      },
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

    let calory: Prisma.Decimal = new Prisma.Decimal(0);
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

      const factor = new Prisma.Decimal(m.bdd)
        .div(100)
        .times(new Prisma.Decimal(quantity).div(100));

      totalWeightInGram = new Prisma.Decimal(totalWeightInGram)
        .plus(quantity)
        .toNumber();

      calory = new Prisma.Decimal(calory).plus(
        new Prisma.Decimal(m.calory).times(factor)
      );

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

    const data = {
      weight_per_portion: new Prisma.Decimal(totalWeightInGram)
        .div(recipes[0].Menu.portion)
        .toNumber(),
      weight_with_bdd: Math.round(totalWeightInGram),
      calory: new Prisma.Decimal(calory.toNumber()),
      protein: new Prisma.Decimal(protein.toNumber()),
      fat: new Prisma.Decimal(fat.toNumber()),
      carbohydrate: new Prisma.Decimal(carbohydrate.toNumber()),
      fiber: new Prisma.Decimal(fiber.toNumber()),
      natrium: new Prisma.Decimal(natrium.toNumber()),
      cholesterol: new Prisma.Decimal(cholesterol.toNumber()),
      sfa: new Prisma.Decimal(sfa.toNumber()),
      mufa: new Prisma.Decimal(mufa.toNumber()),
      pufa: new Prisma.Decimal(pufa.toNumber()),
    };

    console.log(`Recalculated nutrition for menu ${recipes[0].Menu.name}:`);
    console.log('weight_per_portion:', data.weight_per_portion);
    console.log('weight_with_bdd:', data.weight_with_bdd);
    console.log('calory:', data.calory.toString());
    console.log('protein:', data.protein.toString());
    console.log('fat:', data.fat.toString());
    console.log('carbohydrate:', data.carbohydrate.toString());
    console.log('fiber:', data.fiber.toString());
    console.log('natrium:', data.natrium.toString());
    console.log('cholesterol:', data.cholesterol.toString());
    console.log('sfa:', data.sfa.toString());
    console.log('mufa:', data.mufa.toString());
    console.log('pufa:', data.pufa.toString());

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

  static async getMenuRecipe(
    request: GetMenuRecipeRequest
  ): Promise<GetMenuRecipeResponse> {
    const menu: Menu = await MenuService.checkMenuExist(
      request.menu_id,
      request.restaurant_id
    );

    if (request.role === 'Restoran') {
      if (menu.restaurant_id !== request.restaurant_id) {
        throw new ResponseError(403, 'Menu bukan milik Restaurant Anda');
      }
    }

    const recipeItems: Recipe[] = await prismaClient.recipe.findMany({
      where: {
        menu_id: request.menu_id,
      },
    });

    const bahanIds = recipeItems
      .filter((item) => item.item_type === RecipeItemType.bahan)
      .map((item) => item.item_id);
    const bumbuIds = recipeItems
      .filter((item) => item.item_type === RecipeItemType.bumbu)
      .map((item) => item.item_id);
    const [bahanItems, bumbuItems] = await Promise.all([
      bahanIds.length > 0
        ? prismaClient.masterBahan.findMany({
            where: { id: { in: bahanIds } },
            select: { id: true, name: true },
          })
        : Promise.resolve([]),
      bumbuIds.length > 0
        ? prismaClient.masterBumbu.findMany({
            where: { id: { in: bumbuIds } },
            select: { id: true, name: true },
          })
        : Promise.resolve([]),
    ]);

    const bahanMap = new Map(bahanItems.map((item) => [item.id, item.name]));
    const bumbuMap = new Map(bumbuItems.map((item) => [item.id, item.name]));

    const items = recipeItems.map((item) => ({
      item_id: item.item_id,
      item_name:
        item.item_type === RecipeItemType.bahan
          ? bahanMap.get(item.item_id) || 'Unknown'
          : bumbuMap.get(item.item_id) || 'Unknown',
      item_type: (item.item_type === RecipeItemType.bahan
        ? 'bahan'
        : 'bumbu') as 'bahan' | 'bumbu',
      quantity_grams: item.quantity_grams,
    }));

    return {
      menu_id: menu.id,
      menu_name: menu.name,
      items: items,
    } as GetMenuRecipeResponse;
  }

  static async refreshMenuNutrition(
    request: RefreshMenuNutritionRequest
  ): Promise<Menu> {
    const payload: RefreshMenuNutritionRequest = Validation.validate(
      RecipeValidation.REFRESHNUTRITION,
      request
    );

    const menu: Menu = await MenuService.checkMenuExist(
      payload.menu_id,
      payload.restaurant_id
    );

    await prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
      await this.recalculateNutritionInternal(tx, payload.menu_id);
    });

    return menu;
  }
}
