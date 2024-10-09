module.exports = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "script-src 'self' https://telegram.org;",
            },
          ],
        },
      ];
    },
  };
  
