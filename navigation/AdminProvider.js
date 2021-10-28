import React, { useEffect, useState} from 'react';
import * as firebase from 'firebase';

import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

export default function AdminProvider() { 
    const [admin, setAdmin] = useState(false)
    const { user } = useContext(AuthenticatedUserContext);

    firebase.firestore().collection('users').doc(user.uid).get.then((userData) => {
        let tempAdmin = userData.data().admin
        setAdmin(tempAdmin)
    })
    return (admin)
}