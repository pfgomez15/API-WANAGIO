import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';

import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';


class App{
    public app: express.Application;

    constructor(controllers: Controller[]){
        this.app = express();
        this.conectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen(){
        this.app.listen(process.env.PORT, ()=>{
            console.log(`App listen on the port ${process.env.PORT}`);
        });
    }

    private initializeMiddlewares(){
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended:true}));
        this.app.use(cookieParser());

    }

    private initializeControllers(controllers:Controller[]){
        controllers.forEach((controller) => {
            this.app.use('/',controller.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
      }

    public conectToTheDatabase(){
        const{
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH,
        } = process.env;

        mongoose.connect(`mongodb://${MONGO_PATH}`,{useNewUrlParser:true, useUnifiedTopology: true});
    }
}

export default App;