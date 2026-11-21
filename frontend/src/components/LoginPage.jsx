import React from 'react';
import AuthPage from './AuthPage';

export default function LoginPage({
  onBack,
  onNavigateToSignup,
  onAuthSuccess,
  defaultRole = 'recruiter'
}) {
  return (
    <AuthPage
      initialMode="login"
      defaultRole={defaultRole}
      onBack={onBack}
      onNavigateToSignup={onNavigateToSignup}
      onAuthSuccess={onAuthSuccess}
    />
  );
}
