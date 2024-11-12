import {prismaClient} from "../src/application/database";

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                email: "test"
            }
        })
    }

}

export class AuthTest {
    static async loginConsumer() {

    }

    static async loginRestaurant() {

    }

    static async loginAdmin() {

    }

    static async updateEmail() {

    }

    static async updatePassword() {

    }
}

export class MenuTest {

}

export class RecommendationTest {

}

export class OrderTest {

}

export class NotificationTest {

}

