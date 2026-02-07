import { PrismaModule } from './prisma.module';
import { SitesModule } from './sites/sites.module';
@Module({
  imports: [PrismaModule, UsersModule, AuthModule, SitesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
