import * as process from "process";

function parseBool(value: string): boolean {
    return value.toLowerCase() === 'true';
}

export function getEnv<Type>(name: string, fallback: Type): Type {
    const env = process.env[name];

    if ( env === '' || env === undefined) {
        return fallback;
    }

    switch (typeof fallback) {
        case 'string':
            return env as Type;
        case 'boolean':
            return parseBool(env) as Type;
        case 'number':
            const parsedNumber = parseInt(env, 10);
            if (isNaN(parsedNumber)) {
                return fallback;
            }
            return parsedNumber as Type;
        default:
            return fallback;
    }
}