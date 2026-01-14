import { ValidationError } from "../utils/app-errors.js"
class BaseValidator {
    constructor(schema) { this.schema = schema }
    create(userInputs) {
        return this._parse(this.schema.create, userInputs);
    }

    update(userInputs) {
        return this._parse(this.schema.update, userInputs);
    }

    delete(userInputs) {
        return this._parse(this.schema.delete, userInputs);
    }

    getById(userInputs) {
        return this._parse(this.schema.getById, userInputs);
    }

    getAll(userInputs) {
        return this._parse(this.schema.getAll, userInputs);
    }

    getByProp(userInputs) {
        return this._parse(this.schema.getByProp, userInputs);
    }

    find(userInputs) {
        return this._parse(this.schema.find, userInputs);
    }


    _parse(schema, data) {
        const result = schema.strip().safeParse(data);

        if (!result.success) {
            const fieldErrors = {};

            for (const issue of result.error.issues) {
                const field = issue.path?.[0] || "general";
                if (!fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            }
            throw new ValidationError("Invalid data", fieldErrors);
        }

        return result.data;
    }

}

export { BaseValidator }