import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import User from "@/app/models/User";
import dbConnect from "@/app/lib/dbConnect";

// Extend the default User type
declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      name?: string;
      email?: string;
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        prompt: "consent",
        accessType: "offline",
        response_type: "code",
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();

      const existingUser = await User.findOne({ userId: profile?.sub });

      if (!existingUser) {
        await User.create({
          userId: profile?.sub,
          name: profile?.name,
          email: profile?.email,
          currency: "USD",
        });
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.userId = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (profile?.sub) {
        token.sub = profile.sub;
      }
      return token;
    },
  },
});