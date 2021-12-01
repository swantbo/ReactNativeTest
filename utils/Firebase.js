import * as firebase from 'firebase'

export function getUserData(userUid) {
    let userData
    firebase
        .firestore()
        .collection('users')
        .doc(userUid)
        .get()
        .then((doc) => {
            userData = { ...doc.data() }
            return userData
        })
    return userData
}
