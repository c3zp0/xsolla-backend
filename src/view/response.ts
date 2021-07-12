import {IResponse} from '../interfaces/IResponse';
import {Request, Response} from 'express';

class ApiResponse {

    send(requestManager: Request,  responseManager: Response, responseBody: IResponse): void{
        responseManager.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        responseManager.status(responseBody.responseStatus);
        responseManager.json(JSON.parse(responseBody.responseData));
    }
}

export const apiReponse: ApiResponse = new ApiResponse();