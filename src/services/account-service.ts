import superlogin, {
  ConfigurationOptions,
  Session
} from '@pluscubed/superlogin-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/forkJoin';

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
      providers: ['wca'],
      checkExpired: true
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
    return Observable.fromPromise(superlogin.authenticate()).map(session => {
      //Workaround for production server behind caddy proxy
      if (process.env.NODE_ENV === 'production') {
        session.userDBs['user'] = session.userDBs['user']
          .replace('http', 'https')
          .replace('127.0.0.1:5984', 'timer-sync.pluscubed.com');
      }
      superlogin.checkRefresh();
      return session;
    });
  }

  login(): Observable<any> {
    return Observable.fromPromise(superlogin.socialAuth('wca')).flatMap(() =>
      Observable.empty()
    );
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
