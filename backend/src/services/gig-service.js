import { BaseService } from "./base-service.js";
import { GigRepository } from "../database/repository/index.js";
import { DatabaseError, NotFoundError, UnauthorizedError } from "../utils/app-errors.js";

class GigService extends BaseService {
    constructor() {
        super(new GigRepository());
    }

    async create(userInputs) {
        const payload = {
            clientId: userInputs.userId,
            title: userInputs.title,
            description: userInputs.description,
            budget: userInputs.budget,
            deadline: userInputs.deadline,
            status: "open",
        };

        const result = await super.create(payload);
        if (!result) throw new DatabaseError({});
        return result;
    }

    async update(id, userInputs) {
        const gig = await super.getById(id);
        if (!gig) throw new NotFoundError("Gig not found");
        if (String(gig.clientId) !== String(userInputs.userId))
            throw new UnauthorizedError("You are not allowed to update this gig");

        const updatePayload = { ...userInputs };
        delete updatePayload.userId;
        delete updatePayload.id;

        const result = await super.update(id, updatePayload);
        if (!result) throw new DatabaseError({});
        return result;
    }

    async getAll(userInputs) {
        const filter = { status: "open" };
        if (userInputs.search)
            filter.title = { $regex: userInputs.search, $options: "i" };
        const result = await super.paginate(filter, {
            page: userInputs.page,
            limit: userInputs.limit,
            sort: { createdAt: -1 },
        });
        console.log(JSON.stringify(result));
        
        if(!result?.pagination?.totalItems) throw new NotFoundError("No gigs found");
        return result;
    }

    async getById(id) {
        const result = await super.getById(id);
        if (!result) throw new NotFoundError("Gig not found");
        return result;
    }
}

export { GigService };
