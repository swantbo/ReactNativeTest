import React, { useEffect, useState, useContext} from 'react';
import * as firebase from 'firebase';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';

export default async function AdminProvider() { 
    const { user } = useContext(AuthenticatedUserContext);
    let admin
    return await firebase.firestore().collection('users').doc(user.uid).get.then((userData) => {
        console.log('test admin', userData.data().admin)
        return admin = userData.data().admin
    }).catch((err) => {
        return admin = false
    })
}