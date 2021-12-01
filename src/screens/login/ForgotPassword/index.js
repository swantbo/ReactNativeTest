import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { useState } from 'react'
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    Button as RNButton,
} from 'react-native'

import { Button, InputField } from '../../../components'
import Firebase from '../../../config/firebase'

const auth = Firebase.auth()

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('')

    const onChangePassword = async () => {
        try {
            if (email !== '' && password !== '') {
                await auth.sendPasswordResetEmail(email)
            }
        } catch (error) {
            setLoginError(error.message)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style='dark-content' />
            <Text style={styles.title}>Forgot Password</Text>
            <InputField
                inputStyle={{
                    fontSize: 14,
                }}
                containerStyle={{
                    backgroundColor: '#fff',
                    marginBottom: 20,
                    borderColor: 'black',
                    borderWidth: 1,
                }}
                leftIcon='email'
                placeholder='Enter email'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Button
                onPress={onChangePassword}
                backgroundColor='#000000'
                title='Send Email'
                tileColor='#fff'
                titleSize={20}
                containerStyle={{
                    marginBottom: 24,
                }}
            />
            <RNButton
                onPress={() => navigation.navigate('Login')}
                title='Go to Login'
                color='#000000'
            />
            <ImageBackground
                source={require('../../../assets/123_1.jpeg')}
                style={styles.image}
                resizeMode='cover'
            ></ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000000',
        alignSelf: 'center',
        paddingBottom: 24,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        opacity: 0.5,
    },
})
