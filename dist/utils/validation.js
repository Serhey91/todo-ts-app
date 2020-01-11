export function validate(validatableInput) {
    const { value, required, minLength, maxLength, min, max } = validatableInput;
    let isValid = true;
    if (required) {
        isValid = isValid && value.toString().trim().length !== 0;
    }
    if (minLength !== undefined && typeof value === 'string') {
        isValid = isValid && value.length >= minLength;
    }
    if (maxLength !== undefined && typeof value === 'string') {
        isValid = isValid && value.length <= maxLength;
    }
    if (min !== undefined && typeof value === 'number') {
        isValid = isValid && value >= min;
    }
    if (max !== undefined && typeof value === 'number') {
        isValid = isValid && value <= max;
    }
    return isValid;
}
//# sourceMappingURL=validation.js.map