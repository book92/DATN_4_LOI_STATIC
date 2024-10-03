import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { Searchbar } from 'react-native-paper';

const BLUE_COLOR = '#0000CD';

const StaticList = ({ route }) => {
  const { chartData } = route.params;
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDevices = async () => {
      let query;
      switch (chartData.type) {
        case 'Error':
          query = firestore().collection('ERROR').where('deviceName', '==', chartData.deviceName);
          break;
        case 'User':
          query = firestore().collection('USERS').where('department', '==', chartData.department);
          break;
        case 'Device':
          if (chartData.department) {
            query = firestore().collection('DEVICES').where('departmentName', '==', chartData.department);
          } else if (chartData.user) {
            query = firestore().collection('DEVICES').where('user', '==', chartData.user);
          }
          break;
        default:
          query = firestore().collection('DEVICES');
      }

      const snapshot = await query.get();
      const devicesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevices(devicesList);
      setFilteredDevices(devicesList);
    };

    fetchDevices();
  }, [chartData]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredDevices(devices);
    } else {
      const filtered = devices.filter(device => 
        device.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDevices(filtered);
    }
  };

  const renderItem = ({ item, index }) => {
    const onPressItem = () => {
      // Điều hướng đến trang chi tiết thiết bị nếu cần
      // navigation.navigate('DeviceDetail', { deviceId: item.id });
    };

    return (
      <TouchableOpacity style={[styles.item, index !== 0 && { marginTop: 10 }]} onPress={onPressItem}>
        <View style={styles.iconContainer}>
          <Icon name="desktop" size={24} color="#000" />
        </View>
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{`${chartData.type} - ${chartData.label}`}</Text>
      <Searchbar
        placeholder="Tìm kiếm thiết bị..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchBarInput}
        iconColor={BLUE_COLOR}
        placeholderTextColor={BLUE_COLOR}
        theme={{ colors: { primary: BLUE_COLOR } }}
      />
      <FlatList
        data={filteredDevices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: BLUE_COLOR,
    marginBottom: 10,
  },
  searchBar: {
    margin: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: BLUE_COLOR,
  },
  searchBarInput: {
    color: BLUE_COLOR,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: '#e0e0e0',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginLeft: 10,
    fontSize: 18,
    color: BLUE_COLOR,
  },
});

export default StaticList;
