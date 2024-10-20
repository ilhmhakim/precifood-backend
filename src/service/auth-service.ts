import {LoginUserRequest, toUserResponse, UserResponse} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import bcrypt from "bcrypt";
import {UserPayload} from "../type/user";
import {issueToken} from "../middleware/auth-middleware";
import {AuthValidation} from "../validation/auth-validation";

export class AuthService {

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(AuthValidation.LOGIN, request);

        let user = await prismaClient.user.findUnique({
            where: {
                email: loginRequest.email
            }
        });

        if (!user) {
            throw new ResponseError(401, "Email atau password salah");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError(401, "Email atau password salah");
        }

        // User authenticate
        const userPayload: UserPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const token = issueToken(userPayload);

        // Response
        const response = toUserResponse(user);
        response.token = token!;
        return response;
    }
}