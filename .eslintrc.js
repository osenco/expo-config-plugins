module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "overrides": [
        {
            "files": ["src/**/*.ts"],
            "extends": ["standard-with-typescript", "jleem"],
            "parserOptions": {
                "ecmaVersion": "latest",
                "sourceType": "module"
            }
        },
        {
            "files": [".eslintrc.{js,cjs}"],
            "env": {
                "node": true
            },
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ]
}
