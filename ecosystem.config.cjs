// deploy_remote.py generates an activation config with verified absolute paths.
// This versioned specification is the operational baseline; avoid manual starts.
module.exports = {
  apps: [{
    name: 'mestrefabio',
    cwd: '/home/fabio/apps/mestrefabio/current',
    script: 'node_modules/next/dist/bin/next',
    args: ['start', '-p', '3010'],
    interpreter: '/usr/bin/node',
    env: { NODE_ENV: 'production', PORT: '3010' },
  }],
};
