export function AutoBindContext(target: any, methodName:string|number|Symbol, descriptor: PropertyDescriptor):PropertyDescriptor {
  const originalMethod = descriptor.value;
  return {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    }
  }
}


