import superlogin from '@pluscubed/superlogin-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/forkJoin';

export class AccountService {
  private static ENDPOINT = process.env.NODE_ENV === 'production'
    ? 'https://timer-sync.pluscubed.com'
    : 'https://localhost:4000';

  private authSession$: Subject<any>;

  constructor() {
    const config = {
      serverUrl: AccountService.ENDPOINT,
      socialUrl: AccountService.ENDPOINT + '/auth',
      baseUrl: '/auth',
      storage: 'local',
      providers: ['wca']
    };
    superlogin.configure(config);

    this.authSession$ = new Subject();

    const listener = (e: MessageEvent) => {
      if (e.origin === AccountService.ENDPOINT) {
        this.authSession$.next(e.data);
      }
    };
    window.addEventListener('message', listener);
  }

  login(): Observable<any> {
    // Workaround superlogin-client expecting direct window.opener call
    return Observable.fromPromise(superlogin.socialAuth('wca'));
  }
}
