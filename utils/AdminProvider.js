import React, { useState, useContext } from 'react'

import * as firebase from 'firebase';

import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

export default async function AdminProvider() { 
    //const [admin, setAdmin] = useState(false)
    const { user } = useContext(AuthenticatedUserContext);
    let admin
    await firebase.firestore().collection("users").doc(user.uid).get().then((userData) => {
        admin = userData.data().admin
    })
    return (admin)
}