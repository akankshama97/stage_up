import React from 'react';
import AuthPage from './AuthPage';

export default function SignupPage({
  onBack,
  onNavigateToLogin,
  onAuthSuccess,
  defaultRole = 'recruiter'
}) {
  return (
    <AuthPage
      initialMode="signup"
      defaultRole={defaultRole}
      onBack={onBack}
      onNavigateToLogin={onNavigateToLogin}
      onAuthSuccess={onAuthSuccess}
    />
  );
}
