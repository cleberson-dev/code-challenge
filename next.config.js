module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/teams',
        permanent: true
      }
    ]
  }
}