import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { isEmpty, validDOB, validateEmail } from '../utills/validation';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import InputWithLabel from '../components/InputWithLabel';
import PrimaryButton from '../components/PrimaryButton';
import { data } from '../utills/data';
import Toast from 'react-native-toast-message';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [dOB, setDOB] = useState('');
    const [loader, setLoader] = useState(false)
    const navigation = useNavigation();
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
    const usersCollection = firestore().collection('Users');

    const createUserInFirestore = async () => {
        try {
            setLoader(true)
            usersCollection.add({
                email: email,
                password: password,
                name: name,
                dOB: dOB,
                favItem:[],
            })
                .then(() => {
                    setLoader(false)
                });
        } catch (e) {
            setLoader(false)
            console.log(e);
        }
    }


    const userValid = () => {
        Keyboard.dismiss();
        if (isEmpty(name)) {
            Toast.show({
                type: 'error',
                text1: 'Name is required!',
            });
            return false;
        } else if (isEmpty(email)) {
            Toast.show({
                type: 'error',
                text1: 'Email is required!',
            });
            return false;
        }else if (!validateEmail(email)) {
            Toast.show({
                type: 'error',
                text1: 'Enter valid email!',
            });
            return false;
        } else if (isEmpty(password)) {
            Toast.show({
                type: 'error',
                text1: 'Password is required!',
            });
            return false;
        } else if (password.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Enter valid password!',
            });
            return false;
        } else if (isEmpty(dOB)) {
            Toast.show({
                type: 'error',
                text1: 'Date of birth is required!',
            });
            return false;
        } else if (!validDOB(dOB)) {
            Toast.show({
                type: 'error',
                text1: 'Enter valid dOB!',
            });
            return false;
        }

            return true;
        
    }


    const requestSignup = () => {
        if (userValid()) {
            try {
                setLoader(true)
                auth()
                    .createUserWithEmailAndPassword(email.toLowerCase(), password)
                    .then(() => {
                        createUserInFirestore();
                        Toast.show({
                            type: 'success',
                            text1: 'SignUp Successfully!',
                        });
                        navigation.navigate('Home')
                        setEmail('');
                        setPassword('');
                        setDOB('');
                        setName('');
                        setLoader(false)
                    })
                    .catch(error => {
                        if (error.code === 'auth/email-already-in-use') {
                            Toast.show({
                                type: 'error',
                                text1: 'That email address is already in use!',
                            });
                        }
                        if (error.code === 'auth/invalid-email') {
                            Toast.show({
                                type: 'error',
                                text1: 'That email address is invalid!',
                            });
                        }
                        setLoader(false)
                        console.log(error);
                    });
            } catch (e) {
                console.log(e);
                setLoader(false)
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset} >
                <Text style={styles.heading}>{'Create New\n Account'}</Text>
                <Text style={styles.subHeading}>{'Allready Registered?'}<Text
                    onPress={() => navigation.navigate('SignIn')}
                    style={styles.orangeText}> Log in here</Text></Text>
                <View style={{ justifyContent: "center", alignItems: 'center' }}>
                    <InputWithLabel
                        label={'NAME'}
                        placeholder={"Dimpal Suthar"}
                        value={name}
                        onChangeText={text => setName(text)} />
                    <InputWithLabel
                        label={'EMAIL'}
                        placeholder={"hello@gmail.com"}
                        value={email}
                        keyboardType={'email-address'}
                        onChangeText={text => setEmail(text)} />
                    <InputWithLabel
                        label={'PASSWORD'}
                        placeholder={"Password"}
                        value={password}
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)} />
                    <InputWithLabel
                        label={'DATE OF BIRTH'}
                        placeholder={"20/09/2001"}
                        value={dOB}
                        onChangeText={text => setDOB(text)} />
                </View>
                <PrimaryButton onPress={requestSignup} label={'Sign Up'} />
            </KeyboardAvoidingView>
            <Loader visible={loader} />
        </SafeAreaView>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    heading: { fontSize: 25, textAlign: 'center', fontWeight: "bold", marginBottom: 40 },
    subHeading: { fontSize: 18, textAlign: 'center', fontWeight: "500", marginBottom: 40 },
    orangeText: { color: 'orange', fontWeight: "bold" },
})