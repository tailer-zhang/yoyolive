const path = require("path");
const addPath = (dir) => path.join(__dirname, dir);
const cracoLess = require("craco-less");

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    alias: {
      "@": addPath("src"),
    },
  },
  babel: {
    plugins: [
      //第一个 style 为 true ,需要配置 craco-less一起才能生效
      ["import", { libraryName: "antd", style: true }],
    ],
  },
  plugins: [
    {
      plugin: cracoLess,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              "primary-color": "#FF8462",
              "link-color": "#FF8462",
              "border-color-base": "#F7B9A3",
              "text-color": '#666666',
              "border-width-base": '2px'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
