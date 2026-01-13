import { BaseValidator } from "./base-validator.js";
import { GigSchema } from "./schema/index.js";

class GigValidator extends BaseValidator {
    constructor() {
        super(GigSchema);
    }
}

export { GigValidator };
