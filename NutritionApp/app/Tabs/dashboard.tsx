import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Dashboard: React.FC = () => {
  const { colors } = useTheme();
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('SignIn');
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.onBackground }]}>
        {user?.email ? `Logged in as: ${user.email}` : "Not logged in"}
      </Text>
      <Button
        mode="contained"
        onPress={handleSignOut}
        style={{ backgroundColor: colors.primary }}
      >
        Sign Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Dashboard;
