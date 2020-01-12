// TODO get the link from package.json
module.exports = {
  sources: {
    repoUrl: 'https://github.com/4ban/git8'
  },
  oauth: {
    clientId: process.env.GITHUB_CLIENT_ID || 'clientID',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'clientSecret',
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scope: 'repo, notifications',
    useBasicAuthorizationHeader: false,
    redirectUri: 'http://localhost:8080/oauth/callback'
  }
}
