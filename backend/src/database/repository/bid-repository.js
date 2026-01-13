import { BaseRepository } from "./base-repository.js";
import { BidModel } from "../models/index.js";
import { MapMongoError } from "../../utils/map-mongo-error.js";

class GigRepository extends BaseRepository {
    constructor() {
        super(BidModel);
    }

}

export { GigRepository };
