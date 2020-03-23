import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [TasksModule,
    MongooseModule.forRoot('mongodb+srv://rentoruser:325519@nest-rest-api-iamce.mongodb.net/test?retryWrites=true&w=majority')
  ]

})
export class AppModule { }
