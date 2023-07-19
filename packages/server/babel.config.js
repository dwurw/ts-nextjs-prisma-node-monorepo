module.exports = function (api) {
  api.cache(true);

  const presets = [
    '@babel/preset-env',
    {
      targets: {
        esmodules: true
      }
    }
  ];
  const plugins = [
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-transform-regenerator',
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true
      }
    ]
  ];
  return {
    presets,
    plugins
  };
};
