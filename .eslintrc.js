module.exports = {
    'extends': 'airbnb-base',
    // add your custom rules here
    'globals': {
        'window': true,
    },
    'rules': {
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-console': 'off',
        'indent': ['error', 4],
        'eol-last': 0,
        'arrow-body-style': 0,
        'space-before-function-paren': 0,
        'arrow-parens': 0,
        'func-names': 0,
        'no-param-reassign': 0,
        'no-unused-vars': 1,
        'no-trailing-spaces': 1,
        'no-plusplus': 0,
        'consistent-return': 0,
        'no-unreachable': 2,
        'semi': 1,
        'padded-blocks': 1,
        'max-len': [0, 200],
    }
};