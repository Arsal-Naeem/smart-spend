import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import User from "@/app/models/User";
import dbConnect from "@/app/lib/dbConnect";
import Category from "./app/models/Category";

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
  trustHost: true,
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
    async signIn({ profile }) {
      await dbConnect();

      const existingUser = await User.findOne({ userId: profile?.sub });

      if (!existingUser) {
        await User.create({
          userId: profile?.sub,
          name: profile?.name,
          email: profile?.email,
          currency: "USD",
        });

        //? Add default categories
        await Category.create(
          [
            {
              userId: profile?.sub,
              categoryName: "Shopping",
              totalSpend: 0,
              budget: 500,
              transactionCount: 0,
              color: "#FF0000",
            },
            {
              userId: profile?.sub,
              categoryName: "Food",
              totalSpend: 0,
              budget: 500,
              transactionCount: 0,
              color: "#00FF00",
            },
            {
              userId: profile?.sub,
              categoryName: "Transportation",
              totalSpend: 0,
              budget: 500,
              transactionCount: 0,
              color: "#0000FF",
            },
            {
              userId: profile?.sub,
              categoryName: "Healthcare",
              totalSpend: 0,
              budget: 500,
              transactionCount: 0,
              color: "#FFFF00",
            },
            {
              userId: profile?.sub,
              categoryName: "Health",
              totalSpend: 0,
              budget: 0,
              transactionCount: 0,
              color: "#FF00FF",
            },
          ]);
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.userId = token.sub;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile?.sub) {
        token.sub = profile.sub;
      }
      return token;
    },
  },
});