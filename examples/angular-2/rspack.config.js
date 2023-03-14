const path = require("path");
const rimraf = require('rimraf');
const execSync = require('child_process').execSync;

module.exports = {
    mode: "development",
    devtool: false,
    context: path.resolve(__dirname),
    entry: {
        app: path.resolve(__dirname, "dist-ngc/main.js"),
    },
    stats: 'normal',
    builtins: {
        html: [
            {
                template: path.resolve(__dirname, "src/index.html"),
                filename: path.resolve(__dirname, "dist", "index.html"),
            },
        ],
    },
    resolve: {
        extensions: [".js"]
    },
    plugins: [
        {
            apply: (compiler) => {
                compiler.hooks.afterEnvironment.tap("AngularTemplate_afterEnvironment", () => {
                    const code = execSync('./node_modules/.bin/ngc');
                    const error = code.toString('utf8');
                    if (error) {
                        throw Error(`ngc error: ${error}`);
                    }
                });
                compiler.hooks.done.tap("AngularTemplate_done", () => {
                    rimraf(path.resolve(__dirname, "dist-ngc"));
                });
            },
        },
      ]
}
