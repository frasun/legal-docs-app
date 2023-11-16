import type { AuthConfig } from "@auth/core";
import CredentialsProvider from "@auth/core/providers/credentials";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import { UserRoles, getUserByEmail } from "@db/user";
import { SESSION_COOKIE } from "@utils/cookies";
import { UUID } from "mongodb";

export default {
  secret: process.env.AUTH_SECRET as string,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      // @ts-ignore
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("Missing username or password");
        }

        const user = await getUserByEmail(email);

        if (
          !user ||
          !(
            (await bcrypt.compare(password, user.password)) ||
            password === user.password
          )
        ) {
          // throw new Error("Invalid username or password");
          return null;
        }

        const cookies = cookie.parse(req.headers.get("cookie") || "");
        const ssid = cookies[SESSION_COOKIE];

        if (typeof ssid === "string" && ssid.trim() !== "") {
          return { ...user, ssid: encodeURIComponent(ssid) };
        } else {
          return user;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge:
      process.env.NODE_ENV === "production" ? 24 * 60 * 60 : 365 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      // console.log("session callback");
      // console.log({ session, token });
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          ssid: token.ssid,
          role: token.role,
        },
      };
    },
    // async signIn({ user, account, profile, email, credentials }) {
    //   console.log("signIn callback");
    //   console.log({ user, account, profile, email, credentials });
    //   return true;
    // },
    // async redirect({ url, baseUrl }) {
    //   // console.log("redirect callback", { url, baseUrl });
    //   return baseUrl;
    // },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("jwt callback");
      // console.log({ token, user, account, profile, isNewUser });
      if (user) {
        return {
          ...token,
          ssid: user.ssid,
          id: new UUID(user._id).toString(),
          role: user.role,
        };
      }
      return token;
    },
  },
} as AuthConfig;

declare module "@auth/core/types" {
  interface User {
    ssid?: string;
    _id?: UUID;
    role?: UserRoles;
  }

  interface Session {
    user?: User;
  }
}
