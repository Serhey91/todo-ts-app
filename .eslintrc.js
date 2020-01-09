module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
		jquery: true
	},
	extends: ['eslint:recommended', "google"],
	globals: {
	    Atomics: "readonly",
	    SharedArrayBuffer: "readonly"
	},
	parserOptions: {
		sourceType: "module",
	  ecmaVersion: 2018
	},
	rules: {
		'linebreak-style': 0,
		'one-var': 0,
		indent: ['error', 2],
		quotes: 0,
		semi: 1,
		'no-extra-semi': 1,
		'require-jsdoc': 0,
		'no-loop-func': ['error'],
		camelcase: ['error'],
		'space-unary-ops': ['error'],
		'space-infix-ops': ['error'],
		'space-in-parens': 0,
		'no-trailing-spaces': [
			'error',
			{
				skipBlankLines: true,
			},
		],
		'no-console': 0,
		'max-len': [
			'error',
			{
				code: 150,
				ignoreComments: true,
				ignoreUrls: true,
				ignoreTemplateLiterals: true,
				ignoreRegExpLiterals: true,
			},
		],
	},
};
