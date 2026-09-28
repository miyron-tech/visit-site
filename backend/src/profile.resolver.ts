import { Resolver, Query } from '@nestjs/graphql';
import { PrismaService } from './prisma.service';

@Resolver('Profile')
export class ProfileResolver {
  constructor(private readonly prisma: PrismaService) {}
  @Query('profile')
  async profile() {
    const profile = await this.prisma.profile.findUniqueOrThrow({
      where: { id: 'vlad' },
      include: {
        links: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        projects: { orderBy: { order: 'asc' } },
        experience: {
          orderBy: { order: 'asc' },
          include: { achievements: { orderBy: { order: 'asc' } } },
        },
      },
    });
    return {
      ...profile,
      experience: profile.experience.map(item => ({
        ...item,
        achievements: item.achievements.map(row => row.text),
      })),
    };
  }
}
