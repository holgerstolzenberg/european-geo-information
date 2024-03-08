export const environment = {
  prodMode: true,

  // as we have no backend on GitHub pages...
  tileServerUrls: [
    'https://1.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    'https://2.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    'https://3.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
  ],

  logLevel: 4, // warn

  mapProperties: {
    initialPitch: 40
  }
};
