// backend/src/utils/validators.js
// This file is a wrapper around the middleware validation
// to avoid circular dependencies

import validate, { commonValidations } from '../middleware/validate.js';

export { validate, commonValidations };
export default validate;