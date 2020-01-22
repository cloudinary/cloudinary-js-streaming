const presets = [
  [
    "@babel/env"
  ],
];

const plugins = [
  ["@babel/plugin-transform-runtime", {
    "regenerator": true
  }]
];

module.exports = { presets, plugins};

