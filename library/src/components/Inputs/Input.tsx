import React, { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";
import EyeIcon from "@assets/eye.svg";

interface IInputProps extends TextInputProps {
  title?: string;
  icon?: React.FC<SvgProps>;
  titleStyle?: TextStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

export function Input({ 
  title, 
  icon: Icon, 
  titleStyle, 
  inputStyle, 
  containerStyle, 
  ...props 
}: IInputProps) {
  const [showPassword, setShowPassword] = useState(props?.secureTextEntry ?? false);

  return (
    <View style={{ gap: 8 }}>
      {title && (
        <Text
          style={[
            {
              fontSize: 14,
              color: "#000",
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}

      <View
        style={[
          {
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 999,
            paddingVertical: 5,
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          },
          containerStyle,
        ]}
      >
        {Icon && <Icon width={20} height={20} />}

        <TextInput
          {...props}
          style={[
            {
              flex: 1,
              fontSize: 16,
              color: "#000",
            },
            inputStyle,
          ]}
          placeholderTextColor={props.placeholderTextColor || "#666"}
          secureTextEntry={props.secureTextEntry ? showPassword : false}
        />

        {props?.secureTextEntry && (
          <Pressable onPress={() => setShowPassword((prev) => !prev)}>
            <EyeIcon />
          </Pressable>
        )}
      </View>
    </View>
  );
}
