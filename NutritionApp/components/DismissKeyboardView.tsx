// components/DismissKeyboardView.tsx
import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View, ViewProps } from 'react-native';

const DismissKeyboardView: React.FC<ViewProps> = ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        <View {...props}>
            {children}
        </View>
    </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
