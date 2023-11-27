import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common"
import { Observable, map } from "rxjs"

export function Serialize(){
    return UseInterceptors(new SerializeInterceptor())
}

export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: any) => {
                //run something before something is sent out
                if(!data){
                    return {
                        status: false,
                        data: {}
                    }
                }

                return {
                    status: true,
                    data: data
                }
            })
        )
    }
}