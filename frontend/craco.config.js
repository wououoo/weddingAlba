module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 대소문자 구분 비활성화
      if (webpackConfig.resolve.plugins) {
        webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
          plugin => plugin.constructor.name !== 'CaseSensitivePathsPlugin'
        );
      }
      
      // 개발 모드에서 캐시 비활성화
      if (process.env.NODE_ENV === 'development') {
        webpackConfig.cache = false;
      }
      
      return webpackConfig;
    },
  },
  devServer: {
    // 개발 서버 캐시 비활성화
    hot: false,
    liveReload: false,
  },
};
