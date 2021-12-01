import * as firebase from 'firebase'

// export default class FirebaseUtil {
//     static getUserData = (userUid) => {
//         let tempData = {}
//         try {
//             firebase
//                 .firestore()
//                 .collection('users')
//                 .doc(userUid)
//                 .get()
//                 .then((doc) => {
//                     tempData = { ...tempData, ...doc.data() }
//                     console.log('tempData', tempData)
//                 })
//         } catch (error) {
//             console.log('error', error)
//         }
//     }
// }
