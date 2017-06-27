import superlogin from 'superlogin-client';
import {Observable} from 'rxjs/Observable';

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
        return Observable.fromPromise(superlogin.socialAuth('wca'));
    }
}