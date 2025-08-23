import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { COLORS, SPACING } from '../../utils/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { formSchemas } from '../../utils/validation';

type CreateAccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateAccount'>;
type CreateAccountScreenRouteProp = RouteProp<RootStackParamList, 'CreateAccount'>;

const CreateAccountScreen: React.FC = () => {
  const navigation = useNavigation<CreateAccountScreenNavigationProp>();
  const route = useRoute<CreateAccountScreenRouteProp>();
  const { phoneNumber } = route.params;

  const { control, handleSubmit, formState: { isValid } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: ''
    },
    resolver: formSchemas.createAccount,
    mode: 'onChange'
  });

  const onSubmit = (data: any) => {
    // Navigate to password creation screen
    navigation.navigate('CreatePassword', {
      phoneNumber,
      userInfo: data
    });
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
          <Text style={styles.headerTitle}>Tạo tài khoản</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Nhập thông tin cá nhân</Text>
            <Text style={styles.subtitle}>
              Vui lòng điền đầy đủ thông tin để hoàn tất việc tạo tài khoản
            </Text>

            <View style={styles.form}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Họ"
                    placeholder="Nhập họ của bạn"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    autoCapitalize="words"
                    leftIcon={<Text style={styles.inputIcon}>👤</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Tên"
                    placeholder="Nhập tên của bạn"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    autoCapitalize="words"
                    leftIcon={<Text style={styles.inputIcon}>👤</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Email"
                    placeholder="Nhập email của bạn"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Ngày sinh"
                    placeholder="DD/MM/YYYY"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    keyboardType="numeric"
                    leftIcon={<Text style={styles.inputIcon}>🎂</Text>}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Tiếp tục"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            size="large"
            fullWidth
            disabled={!isValid}
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
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
});

export default CreateAccountScreen;
