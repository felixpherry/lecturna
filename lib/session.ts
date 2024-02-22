import { NextAuthOptions, getServerSession } from 'next-auth';
import { db } from './db';

import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'felixpherry@gmail.com',
          required: true,
        },
        password: { label: 'Password', type: 'password', required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(
            'Harap masukkan email dan password Anda untuk melanjutkan.'
          );
        }

        const { email, password } = credentials;

        const account = await db.account.findUnique({
          where: {
            email: email,
          },
        });

        if (!account) {
          throw new Error(
            'Email atau password yang Anda masukkan tidak valid. Harap periksa kembali kredensial Anda dan coba lagi.'
          );
        }

        if (!account.password) {
          throw new Error(
            "Silakan gunakan opsi 'Masuk dengan Google' untuk mengakses akun Anda"
          );
        }

        if (account.status === 'BANNED') {
          throw new Error(
            'Akun Anda dinonaktifkan sementara. Silakan hubungi admin untuk mengaktifkan kembali akun Anda'
          );
        }

        const passwordMatch = await bcrypt.compare(password, account.password);

        if (!passwordMatch) {
          throw new Error(
            'Email atau password yang Anda masukkan tidak valid. Harap periksa kembali kredensial Anda dan coba lagi.'
          );
        }
        return account;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  theme: {
    colorScheme: 'light',
    logo: '/logo.png',
  },
  secret: process.env.NEXT_AUTH_SECRET,
  jwt: {
    encode({ secret, token }) {
      const encodedToken = jwt.sign(
        {
          ...token,
          iss: 'Lecturna',
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        },
        secret
      );

      return encodedToken;
    },
    decode({ secret, token }) {
      const decodedToken = jwt.verify(token!, secret) as JWT;
      return decodedToken;
    },
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string;

      const account = await db.account.findUnique({
        where: {
          email: email,
        },
      });

      if (!account) return { ...session };

      const { id, role, status, image } = account;
      return {
        ...session,
        user: {
          ...session.user,
          id,
          role,
          status,
          image: image || session?.user?.image,
        },
      };
    },
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') return true;

      const result = await db.account.findUnique({
        where: {
          email: user.email!,
        },
      });

      if (!result) {
        return `/login?error=${'Email tidak terdaftar'}`;
      }
      return true;
    },
  },
};

export const getCurrentUser = async () => {
  return getServerSession(authOptions);
};
