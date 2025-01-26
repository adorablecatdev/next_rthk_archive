// next.config.js
module.exports = {
  reactStrictMode: false, // Disable Strict Mode
  webpack(config)
  {
    config.module.rules.forEach((rule) =>
    {
      if (rule.oneOf)
      {
        rule.oneOf.forEach((one) =>
        {
          if (one.issuer && one.issuer.and && one.issuer.and.includes(/\.module\.css$/))
          {
            one.use.forEach((use) =>
            {
              if (use.loader.includes('css-loader'))
              {
                if (use.options.modules)
                {
                  use.options.modules.exportOnlyLocals = false;
                }
              }
            });
          }
        });
      }
    });
    return config;
  },
};