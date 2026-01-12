class BaseService {
    constructor(repository) {
        this.repository = repository;
    }

    async create(data) {
        return this.repository.create(data);
    }

    async update(id, data) {
        return this.repository.update(id, data);
    }

    async updateByProp(prop, value, data) {
        return this.repository.updateByProp(prop, value, data);
    }

    async delete(id) {
        return this.repository.delete(id);
    }

    async getById(id) {
        return this.repository.getById(id);
    }

    async findOne(filter) {
        return this.repository.findOne(filter);
    }

    async find(filter) {
        return this.repository.find(filter);
    }

    async getAll(query) {
        return this.repository.getAll(query);
    }
}

export { BaseService };