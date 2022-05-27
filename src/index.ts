import { Task } from './entities/Task';
import "reflect-metadata";
import express, {Express} from "express";
import {ApolloServer} from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { TaskResolver } from "./resolvers/task";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import {createConnection} from "typeorm";


const main = async() =>{


    const conn = await createConnection({
        type:"postgres",
        database:"todolist-graphql-db",//rename the db to your suitable name
        entities:[Task], //represent table
        logging:true,//see sequel code being run by typeorm(behind the scenes) useful in debugging but disable in production
        synchronize:true, //  auto migrate set it to true
        username:"",
        password:"",
        port:54//prefered postgres port number
    })



    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[TaskResolver],
            validate:false,
        }),
        plugins:[ApolloServerPluginLandingPageGraphQLPlayground()]
    });

    await apolloServer.start();
    const app: Express  = express();

    apolloServer.applyMiddleware({app});

    app.get('/',(_req,res)=>res.send("hello world"))

    const PORT = process.env.PORT || 8000;
    app.listen(PORT,() => console.log(`Server started on port ${PORT}`));
}


main().catch((err)=>console.error(err))