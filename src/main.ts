import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      //to make sure that incoming requests don't have extrnous request on our body.
      whitelist: true
    })
  )
  await app.listen(3000);
}

bootstrap();

// MongoDB relationship types for data modeling
// one-to-one
// one-to-many
// many-to-many

// one-to-one
// A relationship where a data entity in one set
// is connected to exactly one data enity in another set.
/* example
  {
    _id: ObjectId("hhdfhjdfhjfdhj"), 
    name: "collins",
    age: 23
  }
*/
// one-to-many
// A relationship where a data entity in one set is
// connected to any number of data entities in another set.
/* example
  {
     _id: ObjectId("hhdfhjdfhjfdhj"), 
     name: "collins",
     age: 20,
     hobiess: [
       {sports: "table tennis"},
       {movies: "sci-fi"}
     ]
  }
*/

// many-to-many
// A relationship where any number of data entities in one
// set are connected to any number of data entites in another set.
/* example
  [
     {
    _id: ObjectId("hhdfhjdfhjfdhj"), 
     name: "collins",
     age: 20,
     hobiess: [
       {sports: "table tennis"},
       {movies: "sci-fi"}
     ]
    },
    {
     _id: ObjectId("hhdfhjdfhjfdhj"), 
     name: "collins",
     age: 20,
     hobiess: [
       {sports: "table tennis"},
       {movies: "sci-fi"}
     ]
    }
  ]
*/

// Two primary ways to model data in mongodb is embedding and referencing

// Embedding eg
/*
{
  "_id":ObjectId("hhdfhjdfhjfdhj"),,
  "title": "hsdhjdhd",
  "cast": [
    {"actor": "mark", "character": "skywalker"},
    {"actor": "mark", "character": "skywalker"},
    {"actor": "mark", "character": "skywalker"},
  ]
}
*/

// Referencing
/*
  {
  "_id":"hjdhjdh",
  "title": "hsdhjdhd",
  "cast": [
    ObjectId("hhdfhjdfhjfdhj"),
    ObjectId("hhdfhjdfhjfdhj"),
    ObjectId("hhdfhjdfhjfdhj"),
  ]
}
*/