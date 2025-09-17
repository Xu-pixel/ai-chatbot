import type { authClient } from '@/lib/auth-client';
import { betterFetch } from '@better-fetch/fetch';
import { cookies } from 'next/headers';

type Session = typeof authClient.$Infer.Session;

// 缓存存储
let sessionCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 1000; // 30秒缓存时间

export async function auth() {
  const now = Date.now();

  // 如果缓存存在且未过期，直接返回缓存的会话
  if (sessionCache && now - lastFetchTime < CACHE_DURATION) {
    return sessionCache;
  }

  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: 'http://localhost:3000',
      headers: {
        cookie: (await cookies()).toString(),
      },
    },
  );

  // 定义一个类型转换工具类型，将 Session 转换为更易用的格式
  type SessionTransformer<T> = T extends {
    user: infer UserType;
    session: infer SessionType;
  }
    ? SessionType & { user: UserType }
    : never;

  // 最终的会话类型，可以为 null
  type NewSession = SessionTransformer<NonNullable<Session>> | null;
  const newSession: NewSession = session?.session as any;
  if (newSession && session?.user) {
    newSession.user = session.user;
  }

  // 更新缓存和最后获取时间
  sessionCache = newSession;
  lastFetchTime = now;

  return newSession;
}
