import { Module, Controller, Get } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PrismaService } from './prisma.service';
import { ProfileResolver } from './profile.resolver';
import { typeDefs } from './schema';

@Controller('health')
class HealthController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() async check() {
    await this.prisma.profile.findUniqueOrThrow({ where: { id: 'vlad' } });
    return { status: 'ok' };
  }
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typeDefs,
      playground: false,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true, includeCookies: false })],
    }),
  ],
  controllers: [HealthController],
  providers: [PrismaService, ProfileResolver],
})
export class AppModule {}
