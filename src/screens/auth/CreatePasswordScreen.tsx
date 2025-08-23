import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useCreateAccount } from '../../services/authService';
import { formSchemas } from '../../utils/validation';

type CreatePasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePassword'>;
type CreatePasswordScreenRouteProp = RouteProp<RootStackParamList, 'CreatePassword'>;

const CreatePasswordScreen: React.FC = () => {
  const navigation = useNavigation<CreatePasswordScreenNavigationProp>();
  const route = useRoute<CreatePasswordScreenRouteProp>();
  const { phoneNumber, userInfo } = route.params;
  const createAccountMutation = useCreateAccount();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: formSchemas.createPassword,
    mode: 'onChange'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    try {
      await createAccountMutation.mutateAsync({
        phoneNumber,
        ...userInfo,
        password: data.password,
      });

      Alert.alert(
        'Tạo tài khoản thành công',
        'Tài khoản của bạn đã được tạo thành công!',
        [
          {
            text: 'Tiếp tục',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tạo tài khoản');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo mật khẩu</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Tạo mật khẩu bảo mật</Text>
            <Text style={styles.subtitle}>
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
            </Text>

            <View style={styles.form}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    value={value}
                    onChangeText={onChange}
                    error={errors.password?.message}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                    rightIcon={
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                      </TouchableOpacity>
                    }
                    onRightIconPress={() => setShowPassword(!showPassword)}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Xác nhận mật khẩu"
                    placeholder="Nhập lại mật khẩu"
                    value={value}
                    onChangeText={onChange}
                    error={errors.confirmPassword?.message}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                    rightIcon={
                      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                      </TouchableOpacity>
                    }
                    onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )}
              />

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
                <Text style={styles.requirementItem}>• Ít nhất 8 ký tự</Text>
                <Text style={styles.requirementItem}>• Có chữ hoa và chữ thường</Text>
                <Text style={styles.requirementItem}>• Có ít nhất 1 số</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={createAccountMutation.isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            size="large"
            fullWidth
            loading={createAccountMutation.isPending}
            disabled={createAccountMutation.isPending || !isValid}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
  },
  content: {
    flex: 1,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.xxxl,
  },
  form: {
    flex: 1,
  },
  inputIcon: {
    fontSize: FONT_SIZES.lg,
  },
  eyeIcon: {
    fontSize: FONT_SIZES.lg,
  },
  requirementsContainer: {
    backgroundColor: COLORS.gray50,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  requirementsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  requirementItem: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
});

export default CreatePasswordScreen;
