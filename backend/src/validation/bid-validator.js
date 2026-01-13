import { BaseValidator } from "./base-validator.js";
import { BidSchema } from "./schema/index.js";

class BidValidator extends BaseValidator {
    constructor() {
        super(BidSchema);
    }
    
    hire(userInputs) {
        return this._parse(this.schema.hire, userInputs);
    }
}

export { BidValidator };
