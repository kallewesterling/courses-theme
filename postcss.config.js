module.exports = {
  plugins: [
    // Bundle all @import statements
    require('postcss-import')({
      path: ['production']
    }),

    // Add vendor prefixes for browser compatibility
    require('autoprefixer'),

    // Minify CSS (production only)
    process.env.NODE_ENV === 'production' &&
      require('cssnano')({
        preset: ['default', {
          discardComments: {
            removeAll: true  // Remove all comments
          }
        }]
      })
  ].filter(Boolean)
};
