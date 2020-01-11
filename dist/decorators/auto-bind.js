export function AutoBindContext(target, methodName, descriptor) {
    const originalMethod = descriptor.value;
    return {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        }
    };
}
//# sourceMappingURL=auto-bind.js.map