import {IResponse} from '../interfaces/IResponse';
import {Request, Response} from 'express';

class ApiResponse {

    send(requestManager: Request,  responseManager: Response, responseBody: IResponse): void{
        
    }
}

export const apiReponse: ApiResponse = new ApiResponse();