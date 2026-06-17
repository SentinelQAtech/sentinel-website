import { Module }        from '@nestjs/common'
import { ConfigModule }  from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD }     from '@nestjs/core'
import { AuthModule }    from './modules/auth/auth.module'
import { UsersModule }   from './modules/users/users.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { BugsModule }    from './modules/bugs/bugs.module'
import { SprintsModule } from './modules/sprints/sprints.module'
import { TasksModule }   from './modules/tasks/tasks.module'
import { QAItemsModule } from './modules/qa-items/qa-items.module'
import { ClientsModule } from './modules/clients/clients.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { ReportsModule } from './modules/reports/reports.module'
import { PrismaModule }  from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    BugsModule,
    SprintsModule,
    TasksModule,
    QAItemsModule,
    ClientsModule,
    NotificationsModule,
    ReportsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
