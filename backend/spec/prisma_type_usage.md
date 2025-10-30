import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// ====================================
// 1. 기본 모델 타입 가져오기
// ====================================

// 방법 1: Prisma.UserGetPayload 사용 (권장)
type User = Prisma.UserGetPayload<{}>;

// 방법 2: 특정 필드만 포함
type UserWithEmail = Prisma.UserGetPayload<{
select: { id: true; email: true; name: true };
}>;

// 방법 3: 관계 포함
type UserWithPosts = Prisma.UserGetPayload<{
include: { posts: true };
}>;

// 방법 4: 선택적 관계 포함
type UserWithOptionalPosts = Prisma.UserGetPayload<{
include: { posts: true; profile: true };
}>;

// ====================================
// 2. 생성/업데이트 타입
// ====================================

// 생성 시 필요한 데이터 타입
type UserCreateInput = Prisma.UserCreateInput;

// 업데이트 시 필요한 데이터 타입
type UserUpdateInput = Prisma.UserUpdateInput;

// Upsert 타입
type UserUpsertArgs = Prisma.UserUpsertArgs;

// ====================================
// 3. 쿼리 결과 타입 추론
// ====================================

// 함수에서 반환 타입 자동 추론
async function getUserWithPosts(userId: number) {
return await prisma.user.findUnique({
where: { id: userId },
include: {
posts: {
select: {
id: true,
title: true,
published: true,
}
}
},
});
}

// 반환 타입 추출
type UserWithPostsResult = Awaited<ReturnType<typeof getUserWithPosts>>;

// ====================================
// 4. Where 조건 타입
// ====================================

type UserWhereInput = Prisma.UserWhereInput;
type UserWhereUniqueInput = Prisma.UserWhereUniqueInput;

// 사용 예제
const whereCondition: UserWhereInput = {
email: {
contains: "@example.com",
},
posts: {
some: {
published: true,
},
},
};

// ====================================
// 5. 실용적인 타입 헬퍼
// ====================================

// 부분적인 사용자 타입 (모든 필드 옵셔널)
type PartialUser = Partial<User>;

// 필수 필드만 포함
type UserRequired = Required<Pick<User, 'id' | 'email'>>;

// 특정 필드 제외
type UserWithoutPassword = Omit<User, 'password'>;

// ====================================
// 6. 커스텀 타입 가드
// ====================================

function isUser(obj: any): obj is User {
return (
obj &&
typeof obj.id === 'number' &&
typeof obj.email === 'string'
);
}

// ====================================
// 7. 제네릭 함수 예제
// ====================================

async function findById<T extends { id: number }>(
model: any,
id: number
): Promise<T | null> {
return await model.findUnique({ where: { id } });
}

// 사용
const user = await findById<User>(prisma.user, 1);

// ====================================
// 8. 배치 작업 타입
// ====================================

type BatchPayload = Prisma.BatchPayload;

async function deleteMultipleUsers(ids: number[]): Promise<BatchPayload> {
return await prisma.user.deleteMany({
where: {
id: {
in: ids,
},
},
});
}

// ====================================
// 9. 트랜잭션 타입
// ====================================

async function createUserWithProfile(
userData: UserCreateInput,
profileData: Prisma.ProfileCreateInput
) {
return await prisma.$transaction(async (tx) => {
const user = await tx.user.create({
data: userData,
});

    const profile = await tx.profile.create({
      data: {
        ...profileData,
        userId: user.id,
      },
    });

    return { user, profile };

});
}

// ====================================
// 10. Validator를 사용한 타입 안전성
// ====================================

const userValidator = Prisma.validator<Prisma.UserArgs>()({
select: {
id: true,
email: true,
name: true,
},
});

type ValidatedUser = Prisma.UserGetPayload<typeof userValidator>;

// ====================================
// 11. Delegate 타입 (고급)
// ====================================

type UserDelegate = Prisma.UserDelegate;

// ====================================
// 12. 실전 예제: DTO 패턴
// ====================================

// API 응답용 DTO
export class UserResponseDto {
id: number;
email: string;
name: string | null;
createdAt: Date;

constructor(user: User) {
this.id = user.id;
this.email = user.email;
this.name = user.name;
this.createdAt = user.createdAt;
}

static fromPrisma(user: User): UserResponseDto {
return new UserResponseDto(user);
}

static fromPrismaArray(users: User[]): UserResponseDto[] {
return users.map((user) => new UserResponseDto(user));
}
}

// ====================================
// 13. 유틸리티 타입 조합
// ====================================

// 공개 프로필용 타입 (민감한 정보 제외)
type PublicUser = Omit<User, 'password' | 'googleId' | 'resetToken'>;

// API 생성 요청 타입
type CreateUserRequest = Pick<User, 'email' | 'name'> & {
password: string;
};

// API 업데이트 요청 타입
type UpdateUserRequest = Partial<Pick<User, 'name' | 'email'>>;

// ====================================
// 14. 에러 타입
// ====================================

type PrismaError = Prisma.PrismaClientKnownRequestError;

function handlePrismaError(error: unknown) {
if (error instanceof Prisma.PrismaClientKnownRequestError) {
// P2002: Unique constraint violation
if (error.code === 'P2002') {
console.log('중복된 값:', error.meta?.target);
}
}
}

// ====================================
// 15. 복잡한 쿼리 타입
// ====================================

const complexQuery = {
where: {
email: {
contains: '@',
},
},
include: {
posts: {
where: {
published: true,
},
orderBy: {
createdAt: 'desc' as const,
},
take: 5,
},
profile: true,
},
} satisfies Prisma.UserFindManyArgs;

type ComplexUserResult = Prisma.UserGetPayload<typeof complexQuery>;

// Export
export type {
User,
UserWithEmail,
UserWithPosts,
UserCreateInput,
UserUpdateInput,
UserWhereInput,
PublicUser,
CreateUserRequest,
UpdateUserRequest,
UserResponseDto,
};

export {
isUser,
findById,
createUserWithProfile,
handlePrismaError,
};
