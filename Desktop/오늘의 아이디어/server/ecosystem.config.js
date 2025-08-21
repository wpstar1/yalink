module.exports = {
  apps: [{
    name: "vibe-coding-ideas",
    script: "server.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "256M",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000
    },
    log_date_format: "YYYY-MM-DD HH:mm Z",
    error_file: "logs/error.log",
    out_file: "logs/out.log",
    merge_logs: true
  }]
};
