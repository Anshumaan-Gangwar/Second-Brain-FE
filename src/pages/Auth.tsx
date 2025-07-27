import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSignup, setIsSignup] = useState(location.pathname === '/Signup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Update mode based on route
  useEffect(() => {
    setIsSignup(location.pathname === '/Signup');
    setError(null);
    setSuccessMessage(null);
    setValidationErrors({});
  }, [location.pathname]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      errors.username = 'Username must be less than 20 characters';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 50) {
      errors.password = 'Password must be less than 50 characters';
    }

    if (isSignup && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignup) {
        await api.signup({ username: formData.username, password: formData.password });
        setSuccessMessage('Account created successfully! You can now sign in.');
        // Switch to signin mode after successful signup
        setTimeout(() => {
          setIsSignup(false);
          navigate('/Signin');
        }, 2000);
      } else {
        const data = await api.signin({ username: formData.username, password: formData.password });
        localStorage.setItem('token', data.token);
        navigate('/Dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setFormData({ username: '', password: '', confirmPassword: '' });
    setValidationErrors({});
    setError(null);
    setSuccessMessage(null);
    navigate(isSignup ? '/Signin' : '/Signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF6F0] to-[#DDD0C8] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-[#DDD0C8]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#5C4033] mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-[#7B5E57] text-sm">
            {isSignup 
              ? 'Join Conscious and start building your second brain'
              : 'Sign in to access your second brain'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#5C4033] mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A47148] transition-colors ${
                validationErrors.username 
                  ? 'border-red-300 focus:ring-red-300' 
                  : 'border-[#DDD0C8] focus:border-[#A47148]'
              }`}
              placeholder="Enter your username"
              disabled={isLoading}
            />
            {validationErrors.username && (
              <p className="mt-1 text-red-600 text-sm">{validationErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#5C4033] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A47148] transition-colors ${
                validationErrors.password 
                  ? 'border-red-300 focus:ring-red-300' 
                  : 'border-[#DDD0C8] focus:border-[#A47148]'
              }`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {validationErrors.password && (
              <p className="mt-1 text-red-600 text-sm">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password (Signup only) */}
          {isSignup && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5C4033] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A47148] transition-colors ${
                  validationErrors.confirmPassword 
                    ? 'border-red-300 focus:ring-red-300' 
                    : 'border-[#DDD0C8] focus:border-[#A47148]'
                }`}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-red-600 text-sm">{validationErrors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#A47148] hover:bg-[#8a5d3c] disabled:bg-[#A47148]/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isSignup ? 'Creating Account...' : 'Signing In...'}
              </div>
            ) : (
              isSignup ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-8 text-center">
          <p className="text-[#7B5E57] text-sm">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={switchMode}
              className="ml-1 text-[#A47148] hover:text-[#8a5d3c] font-medium transition-colors"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;