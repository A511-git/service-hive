import { BaseService } from "./base-service.js";
import { BidRepository, GigRepository } from "../database/repository/index.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/app-errors.js";

class BidService extends BaseService {
    constructor() {
        super(new BidRepository());
        this.gigRepo = new GigRepository();
    }

    async create(userInputs) {
        const gig = await this.gigRepo.getById(userInputs.gigId);
        if (!gig) throw new NotFoundError("Gig not found");

        if (gig.status !== "open")
            throw new BadRequestError("Bidding is closed for this gig");
        if (String(gig.clientId) === String(userInputs.freelancerId))
            throw new BadRequestError("Client cannot bid on their own gig");

        const payload = {
            gigId: userInputs.gigId,
            freelancerId: userInputs.freelancerId,
            message: userInputs.message,
            price: userInputs.price,
            status: "pending",
        };

        return super.create(payload);
    }

    async getAll(userInputs) {
        const gig = await this.gigRepo.getById(userInputs.gigId);
        if (!gig) throw new NotFoundError("Gig not found");
        if (String(gig.clientId) !== String(userInputs.userId))
            throw new UnauthorizedError("You are not allowed to view this gig");
        return super.find({ gigId: userInputs.gigId });
    }

    async hire(userInputs) {
        return this.repository.hire(userInputs);
    }
}

export { BidService };
