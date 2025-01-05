// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useEmulators: true,
  firebase: {
    apiKey: "AIzaSyBBIoUVukid8r6s2ROsUPUqXkery7EhUTY",
    authDomain: "fir-course-874aa.firebaseapp.com",
    projectId: "fir-course-874aa",
    storageBucket: "fir-course-874aa.firebasestorage.app",
    messagingSenderId: "980891856728",
    appId: "1:980891856728:web:44fe7f6fa8dc650a15ff2d",
  },
  api: {},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
