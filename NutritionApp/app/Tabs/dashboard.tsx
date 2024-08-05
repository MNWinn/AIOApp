import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View } from 'react-native';
import { Button, Text, useTheme, ActivityIndicator, Card, Divider } from 'react-native-paper';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';

const Dashboard: React.FC = () => {
  const { colors } = useTheme();
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('SignIn');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      }
      setLoading(false);
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <ActivityIndicator animating={true} color={colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.onBackground }]}>Profile</Text>
          {user && profileData ? (
            <Card style={[styles.card, { backgroundColor: colors.surface }]}>
              <Card.Content>
                <Text style={[styles.cardTitle, { color: colors.primary }]}>User Information</Text>
                <Divider style={[styles.divider, { backgroundColor: colors.onSurface }]} />
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.onSurface }]}>First Name:</Text>
                  <Text style={[styles.infoValue, { color: colors.onSurface }]}>{profileData.firstName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.onSurface }]}>Last Name:</Text>
                  <Text style={[styles.infoValue, { color: colors.onSurface }]}>{profileData.lastName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.onSurface }]}>Email:</Text>
                  <Text style={[styles.infoValue, { color: colors.onSurface }]}>{user.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.onSurface }]}>Birthday:</Text>
                  <Text style={[styles.infoValue, { color: colors.onSurface }]}>{profileData.birthday}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.onSurface }]}>Height:</Text>
                  <Text style={[styles.infoValue, { color: colors.onSurface }]}>{profileData.height} inches</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.onSurface }]}>Weight:</Text>
                  <Text style={[styles.infoValue, { color: colors.onSurface }]}>{profileData.weight} lbs</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.onSurface }]}>Sex:</Text>
                  <Text style={[styles.infoValue, { color: colors.onSurface }]}>{profileData.sex}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.onSurface }]}>Phone:</Text>
                  <Text style={[styles.infoValue, { color: colors.onSurface }]}>{profileData.phone}</Text>
                </View>
              </Card.Content>
            </Card>
          ) : (
            <Text style={[styles.text, { color: colors.onBackground }]}>No profile data found</Text>
          )}
          <Button
            mode="contained"
            onPress={handleSignOut}
            style={[styles.button, { backgroundColor: colors.primary }]}
            labelStyle={{ color: colors.onPrimary }}
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    marginBottom: 24,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  divider: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    width: '100%',
  },
});

export default Dashboard;
