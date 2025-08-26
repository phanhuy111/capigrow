import React from "react";
import { OtpInput as BaseOtpInput, OtpInputProps } from "react-native-otp-entry";

interface CustomOtpInputProps extends OtpInputProps {}

const OtpInput = (props: CustomOtpInputProps) => {
  return (
    <BaseOtpInput
      numberOfDigits={6}
      {...props}
      theme={{
        containerStyle: {
          width: "100%",
          height: 60,
        },
        pinCodeContainerStyle: {
          width: 50,
          height: 50,
          borderRadius: 8,
          backgroundColor: "rgba(240, 245, 255, 0.7)",
          borderWidth: 1,
          borderColor: "rgba(220, 225, 235, 1)",
        },
        pinCodeTextStyle: {
          color: "#000",
          fontSize: 22,
        },
        focusStickStyle: {
          backgroundColor: "#4067AD",
        },
        focusedPinCodeContainerStyle: {
          borderColor: "#4067AD",
        },
        ...props.theme,
      }}
    />
  );
};

export default OtpInput;
