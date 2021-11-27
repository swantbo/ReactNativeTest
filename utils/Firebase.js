import * as firebase from 'firebase';

export function getUserData(userUid) {
    console.log('testtt')
    let userData
    firebase.firestore().collection("users").doc(userUid).get().then((doc) => {
        userData = {...doc.data()}
        console.log('userData', userData)
        return userData
    })
    return userData
}