/**
 * A Decorator that logs Entry, Exit, and Errors of an async method.
 */
export function Trace(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        const fnName = `${target.constructor.name}.${propertyKey}`;
        console.log(`[➡️ ENTER] ${fnName}`, args);
        
        try {
            // Execute the original function
            const result = await originalMethod.apply(this, args);
            
            console.log(`[⬅️ EXIT ] ${fnName} returned:`, result);
            return result;
        } catch (error) {
            console.error(`[❌ ERROR] ${fnName} failed:`, error);
            throw error;
        }
    };

    return descriptor;
}