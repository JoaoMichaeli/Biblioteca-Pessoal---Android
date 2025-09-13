import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Keyboard as RNKeyboard } from "react-native";

interface IKeyboardProps {
  children: ReactNode;
}

export function Keyboard({ children }: IKeyboardProps) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      enabled={true}
    >
      <Pressable style={{ flex: 1 }} onPress={() => RNKeyboard.dismiss()}>
        {children}
      </Pressable>
    </KeyboardAvoidingView>
  );
}