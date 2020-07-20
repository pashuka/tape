module.exports = {
  apps: [
    {
      name: "api",
      script: "./server.js",
      listen_timeout: 3000,
      kill_timeout: 3000,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
