import * as firebase from 'firebase'

export const getUserData = async (userUid) => {
    let tempData = {}
    await firebase
        .firestore()
        .collection('users')
        .doc(userUid)
        .get()
        .then((doc) => {
            tempData = { ...tempData, ...doc.data() }
        })
    console.log('tempData', tempData)
    return tempData
}
