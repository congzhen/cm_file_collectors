const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {

        productName: "CMCollectors",
        appId: "com.example.CMCollectors",
        win: {
          icon: "static/icon/icon.ico", //"icons/icon.ico",
          target: "zip",
        },
        extraResources: [
          {
            from: path.resolve(__dirname, "static"),
            to: "./../static/",
            filter: ["**/*"],
          },
        ],
      },
    },
  },
});
