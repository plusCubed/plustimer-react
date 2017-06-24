import superlogin from 'superlogin-client';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';

export class AccountService {

    constructor() {
        const config = {
            baseUrl: '/auth',
            storage: 'local',
            providers: ['wca']
        };
        superlogin.configure(config);
    }

    login(): Observable<any> {
        return Observable.create((subscriber: Subscriber<any>) => {
            superlogin.socialAuth('wca');

            subscriber.complete();
        });
    }
}