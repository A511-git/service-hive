import { MapMongoError } from "../../utils/map-mongo-error.js";

class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(userInputs) {
        try {
            return await this.model.create(userInputs);
        } catch (err) {
            throw MapMongoError(err);
        }
    }

    async update(id, userInputs) {
        try {
            return await this.model.findByIdAndUpdate(id, userInputs);
        } catch (err) {
            throw MapMongoError(err);
        }
    }

    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (err) {
            throw MapMongoError(err);
        }
    }

    async getById(id) {
        try {
            return await this.model.findById(id);
        } catch (err) {
            throw MapMongoError(err);
        }
    }

    async findOne(filter) {
        try {
            return await this.model.findOne(filter);
        } catch (err) {
            throw MapMongoError(err);
        }
    }

    async find(filter) {
        try {
            return await this.model.find(filter);
        } catch (err) {
            throw MapMongoError(err);
        }
    }

    async getAll({ filter, sort, limit, skip }) {
        const [items, totalCount] = await Promise.all([
            this.model.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),

            this.model.countDocuments(filter)
        ]);

        const page = Math.floor(skip / limit) + 1;
        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: items,
            meta: {
                count: items.length,
                totalCount,
                limit,
                skip,
                page,
                totalPages,
                hasNextPage: skip + limit < totalCount,
                hasPrevPage: skip > 0
            }
        };
    }

}

export { BaseRepository };
