const isNullable = (data) => {
    return data === null || data === undefined || data === '';
}

const isString = (data) => {
    return typeof data === 'string';
}

const validateIsScript = (data) => {
    const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const eventHandlerPattern = /on\w+=["'].*?["']/gi;
    const srcPattern = /\bsrc\s*=\s*["'].*?["']/gi;
    return !(scriptPattern.test(data) || eventHandlerPattern.test(data) || srcPattern.test(data));
}

const isSQLInjection = (data) => {
    data = data.toLowerCase();
    const sqlPattern = /(\b(select|union|drop|insert|update|delete|alter|exec|execute|fetch|grant|revoke|truncate|backup|restore)\b|--|;|\/\*|\*\/)/gi;
    return sqlPattern.test(data);
}

module.exports = {
    isNullable,
    isString,
    validateIsScript,
    isSQLInjection
}