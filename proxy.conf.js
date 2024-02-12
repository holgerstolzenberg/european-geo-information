var defaultTarget = 'https://basemaps.cartocdn.com';
module.exports = [
  {
    context: ['/tiles/dark-matter/**'],
    target: defaultTarget,
    changeOrigin: true,
    pathRewrite: {
      '^/tiles/dark-matter': ''
    }
  }
];
