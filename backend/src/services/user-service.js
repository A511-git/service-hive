import { UserRepository } from "../database/repository/index.js";
import {
    GeneratePassword,
    ValidatePassword,
    ValidateRefreshToken,
    GenerateAccessToken,
    GenerateRefreshToken
} from "../utils/index.js";
import { BaseService } from "./base-service.js"
import { NotFoundError, UnauthorizedError, DatabaseError, APIError } from "../utils/app-errors.js";


class UserService extends BaseService {
    constructor() {
        super(new UserRepository());
    }

    async register(userInputs) {
        const password = await GeneratePassword(userInputs.password, 10);
        if (!password) throw new APIError();
        const result = await this.repository.create({
            ...userInputs,
            password
        });
        if (!result) throw new DatabaseError();
        return result;
    }

    async login({ email, password }) {
        const user = await this.repository.findUserByEmail(email, true);
        if (!user) throw new UnauthorizedError("Invalid credentials");

        const valid = await ValidatePassword(password, user.password);
        if (!valid) throw new UnauthorizedError("Invalid credentials");

        const payload = { _id: user._id, email: user.email, name: user.name };

        const accessToken = GenerateAccessToken(payload);
        const refreshToken = GenerateRefreshToken(payload);

        const result = await this.repository.update(user._id, {refreshToken});
        if (!result) throw new NotFoundError('User not found');

        return {
            user,
            accessToken,
            refreshToken
        };
    }


    async refresh(token) {
        console.log("service : ");
        console.log(token);
        console.log(typeof token);
        
        const payload = ValidateRefreshToken(token);

        const user = await this.repository.findUserById(payload._id, true);
        console.log(user);
        
        if (!user || user.refreshToken !== token) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        return GenerateAccessToken({
            _id: user._id,
            email: user.email,
        });
    }


}

export { UserService };
