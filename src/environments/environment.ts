// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAZvhx8QqGbNJ7GHutT3MTRllYg60eNAD8',
    authDomain: 'dicey-400c0.firebaseapp.com',
    databaseURL: 'https://dicey-400c0.firebaseio.com',
    projectId: 'dicey-400c0',
    storageBucket: 'dicey-400c0.appspot.com',
    messagingSenderId: '784246923433'

  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
