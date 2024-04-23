module.exports = [
  {
    context: ['/tiles/dark-matter/**'],
    target: 'https://basemaps.cartocdn.com',
    changeOrigin: true,
    pathRewrite: {
      '^/tiles/dark-matter': ''
    }
  }
];
