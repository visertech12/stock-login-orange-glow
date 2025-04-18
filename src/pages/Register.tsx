
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaKey, FaPhone, FaGlobe } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { isValidEmail, isValidPhone } from '@/lib/utils';
import { toast } from 'sonner';
import { apiService } from '@/services/api';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    country_code: 'US',
    password: '',
    password_confirmation: '',
    inviteCode: '',
    firstname: '',
    lastname: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Extract referral code from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, inviteCode: ref }));
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate all fields
      if (!formData.username || formData.username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }
      
      if (!isValidEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!isValidPhone(formData.mobile)) {
        throw new Error('Please enter a valid phone number');
      }
      
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      if (formData.password !== formData.password_confirmation) {
        throw new Error('Passwords do not match');
      }
      
      await apiService.register(formData);
      
      toast.success("Registration successful! Please login.");
      navigate('/');
      
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-gradient"></div>
      
      <img 
        className="absolute top-[-25px] right-[-25px] w-[30%] mix-blend-multiply rotate-[40deg] scale-[1.1] opacity-[60%]"
        src="https://cdn-icons-png.flaticon.com/128/11069/11069063.png"
        alt="decorative"
      />
      
      <div className="relative z-10">
        <div className="p-[15px]"></div>
        
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-[80px] w-auto"
              src="https://mystock-admin.scriptbasket.com/assets/images/logoIcon/logo.png"
              alt="myStock"
            />
            
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white drop-shadow-md">
              REGISTER
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Username Input */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <FaUser className="text-orange-500 h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="username"
                  className="auth-input"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <MdEmail className="text-orange-500 h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Mobile Input */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <FaPhone className="text-orange-500 h-4 w-4" />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  className="auth-input"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Country Code */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <FaGlobe className="text-orange-500 h-4 w-4" />
                </div>
                <select
                  name="country_code"
                  className="auth-input"
                  value={formData.country_code}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="BD">Bangladesh</option>
                </select>
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <FaKey className="text-orange-500 h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  className="auth-input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <FaKey className="text-orange-500 h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password_confirmation"
                  className="auth-input"
                  placeholder="Confirm Password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Invite Code Input */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <FaUser className="text-orange-500 h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="inviteCode"
                  className="auth-input"
                  placeholder="Invite Code (Optional)"
                  value={formData.inviteCode}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button 
                  type="submit" 
                  className="auth-button flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Signing Up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <p className="mt-10 text-center text-sm text-gray-500">
              Already have an account?
              <Link 
                to="/" 
                className="font-semibold leading-6 text-orange-400 hover:text-orange-500 ps-1"
              >
                Login Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
