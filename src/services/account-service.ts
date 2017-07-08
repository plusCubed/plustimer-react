import superlogin, {
  ConfigurationOptions,
  Session
} from '@pluscubed/superlogin-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/forkJoin';
import { Observer } from 'rxjs/Observer';

export class AccountService {
  private static ENDPOINT = process.env.NODE_ENV === 'production'
    ? 'https://timer-sync.pluscubed.com'
    : 'https://localhost:4000';

  private authSession$: Subject<any>;

  constructor() {
    const config: ConfigurationOptions = {
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

  authenticate(): Observable<ProfileSession> {
    return Observable.fromPromise(superlogin.authenticate());
  }

  login(): Observable<any> {
    return Observable.fromPromise(superlogin.socialAuth('wca'));
  }

  onLogin(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      superlogin.on('login', session => {
        observer.next(session);
      });
    });
  }
}

export interface Profile {
  id: string;
  displayName: string;
  emails?: [{ value: string }];
  photos?: [{ value: string; type: 'default' | 'thumbnail' }];
  wca_id: number;
}

export interface ProfileSession extends Session {
  profile: Profile;
}
