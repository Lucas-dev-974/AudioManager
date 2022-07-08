import { smanager } from './Player.js'

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInBhc3N3b3JkIjoiJDJiJDA4JEhrTkd4Y3cuYS5IQ0FuSkNSeUY4YmVzM3pMT210dk1qeVo2Y2ouV2QwUEpUNGZEUERYcWU2IiwiaWF0IjoxNjU3MjU2ODEwLCJleHAiOjE2NTc2ODg4MTB9.a4jCRvT-diyXzNnwOMSKIzrE-pSjEkvMccYk58cDT9M"
const url   = 'http://localhost:3000/api/pist/1?token=' + token

const tracks = [
    {
        src: url,
        name: 'track 1'
    }
]

smanager.laodTracks(tracks)
smanager.addTrack(tracks[0])
console.log(smanager);