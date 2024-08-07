import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    SignIn: undefined;
    CreateAccount: undefined;
    Tabs: undefined;
};

export type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;
export type CreateAccountScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateAccount'>;
export type TabsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tabs'>;

export type SignInScreenRouteProp = RouteProp<RootStackParamList, 'SignIn'>;
export type CreateAccountScreenRouteProp = RouteProp<RootStackParamList, 'CreateAccount'>;
export type TabsScreenRouteProp = RouteProp<RootStackParamList, 'Tabs'>;
