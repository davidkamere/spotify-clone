import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

const refreshAcessToken = async(token) => {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshAcessToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        
        console.log("Refreshed token is", refreshedToken);

        return {
            ...token,
            accessToken: refreshAcessToken.accessToken,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        }

    } catch (error) {
        console.log(error)

        return {
            ...token,
            error: "RefreshAccessTokenError"
        }
    }
}


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL
    })
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user, account}) {

        if(account && user) {
            return {
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at * 1000
            }
        }

        if (Date.now() > token.accessTokenExpires){
            console.log("Existing token is valid")
            return token;
        }

        console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
        return await refreshAcessToken(token)


    },

    async session({ session, token }){
        session.user.accessToken = token.accessToken; 
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;

        return session
    }
  }
})