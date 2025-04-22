module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-extra-parens": 0, //不允许出现不必要的圆括号
        "no-unreachable": 2, //在return，throw，continue，break语句后不允许出现不可能到达的语句
        "no-redeclare": 2, //不允许变量重复声明
        "no-unused-expressions": 2, //不允许无用的表达式
        "indent": ["error", 4],
        "space-infix-ops": ["error", { "int32Hint": false }],
        "arrow-spacing": { "before": true, "after": true },
        'no-console': "error",
        "no-alert": "error",



    }
};