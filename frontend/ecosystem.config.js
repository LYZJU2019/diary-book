module.exports = {
  apps: [
    {
      name: "juejue-vite-h5",
      script: "juejue-vite-h5-server.js",
    },
  ],
  deploy: {
    production: {
      user: "root",
      host: "47.106.245.77",
      ref: "origin/master",
      repo: "git@github.com:LYZJU2019/diary-book.git",
      path: "~/diary-book/frontend",
      "post-deploy":
        "git reset --hard && git checkout master && git pull && nvm use 16.20.1 && npm i --production=false && pm2 startOrReload ecosystem.config.js", // -production=false 下载全量包
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
