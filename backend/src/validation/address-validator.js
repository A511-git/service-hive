import { ValidationError } from "../utils/app-errors.js";
import { BaseValidator } from "./base-validator.js";
import { AddressSchema } from "./schema/index.js"

class AddressValidator extends BaseValidator {
    constructor() {
        super(AddressSchema)
    }

    _parse(schema, data) {
        const result = schema.safeParse(data);
        if (!result.success) throw new ValidationError("Invalid data", result.error);
        return result.data;
    }
}

export { AddressValidator }