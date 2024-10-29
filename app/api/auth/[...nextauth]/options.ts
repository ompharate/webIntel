import User from "@/models/user";
import connectToDb from "@/util/mongo";
import { NextAuthOptions } from "next-auth";
import { Session as NextAuthSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Session extends NextAuthSession {
  user: User;
}

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_ID!,
      clientSecret: process.env.NEXT_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      if (user) {
        await connectToDb();

        let existingUser = await User.findOne({ email: user.email });
        console.log(existingUser);
        if (!existingUser) {
          existingUser = await User.create({
            email: user.email,
            name: user.name,
            activePlan: ["free"],
            googleId: user.id,
          });
        }

        token.id = existingUser.id;
      }
      return token;
    },

    async session({ session, token }): Promise<Session> {
      if (token.id && session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
        } as User;
      }
      return session as Session;
    },
  },
};