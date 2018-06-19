# plusTimer PWA

Put Firebase config object in src/utils/firebaseConfig.js

Live at https://timer.pluscubed.com

Firestore data model:

users
└--$userID : {profile: {wca: {...} }}
   ├--puzzles
   |  └--$puzzleID : {name: string , categories: [string-$categoryID]}
   └--solves
      └--$solveID : {
                      puzzle: string-$puzzleID
                      category: string-$categoryID
                      timestamp: Timestamp
                      penalty: number - 0/1/2
                      time: number
                      scramble: string
                    }