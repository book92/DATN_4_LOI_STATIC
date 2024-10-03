import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';

const BLUE_COLOR = '#0000CD';

const Error = ({ route, navigation }) => {
    const { device } = route.params;
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userreport, setUserreport] = useState('');

    useEffect(() => {
        setUserreport(device.user);
        setLoading(false);
    }, [device]);

    const addErrorReport = async () => {
        if (!description.trim()) {
            setError('Mô tả không được để trống');
            return;
        }

        setError('');

        try {
            await firestore().collection('ERROR').add({
                deviceName: device.name,
                fixday: "Đã tiếp nhận",
                state: "Error",
                description,
                reportday: new Date().toString(),
                userreport,
            });
            Alert.alert('Thông báo', 'Hệ thống đã ghi nhận và sẽ gửi phản hồi sớm nhất!');
            navigation.goBack();
        } catch (error) {
            console.error("Lỗi:", error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi báo cáo.');
        }
    }

    const renderInput = (label, value, onChangeText = null, editable = false, multiline = false) => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && styles.multilineInput]}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                multiline={multiline}
                mode="outlined"
                outlineColor={BLUE_COLOR}
                theme={{ colors: { primary: BLUE_COLOR, text: 'black' } }}
                textColor="black"
            />
        </View>
    );

    if (loading) {
        return <View style={styles.container}><Text>Đang tải...</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Báo Lỗi</Text>
            <View style={styles.formContainer}>
                {renderInput("Tên thiết bị", device.name)}
                {renderInput("Người báo lỗi", userreport)}
                {renderInput("Ngày báo", new Date().toString())}
                {renderInput("Mô tả", description, setDescription, true, true)}
                {error ? <HelperText type="error" style={styles.errorText}>{error}</HelperText> : null}
                <View style={styles.buttonContainer}>
                    <Button 
                        mode="contained" 
                        onPress={addErrorReport} 
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Gửi
                    </Button>
                    <Button 
                        mode="contained" 
                        onPress={() => navigation.goBack()} 
                        style={[styles.button, styles.cancelButton]}
                        labelStyle={styles.buttonLabel}
                    >
                        Huỷ
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: "center",
        color: BLUE_COLOR,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: BLUE_COLOR,
    },
    input: {
        backgroundColor: 'white',
    },
    multilineInput: {
        height: 100,
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: BLUE_COLOR,
    },
    cancelButton: {
        backgroundColor: '#FF0000',
    },
    buttonLabel: {
        color: 'white',
        fontSize: 16,
    },
});

export default Error;