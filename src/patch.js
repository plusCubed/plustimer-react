import { options } from 'preact';

let r = Promise.resolve();
options.debounceRendering = f => r.then(f);
