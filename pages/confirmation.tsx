import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm, Controller } from "react-hook-form";
import { 
  CircularProgress, 
  TextField,
  Container,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Collapse,
  IconButton,
  Alert,
  Snackbar
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { Phone, User, FileText, Send, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import axios from "@/ulti/axios";

// Components
import Cart from "@/components/Cart";
import AlertSuccessful from "@/components/AlertSuccessful";

interface BookingSubmitForm {
  firstName: string;
  lastName: string;
  phone: string;
  note: string;
}

const ConfirmationPage: React.FC = () => {
  // Theme and Media Query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isCartExpanded, setIsCartExpanded] = useState(false);

  // State
  const [ok, setOk] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [res, setRes] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const urlStoreUuid = router.query;
  const { control, handleSubmit, formState: { errors }, reset } = useForm<BookingSubmitForm>();

  // Selectors
  const bookingInfo = useSelector((state: any) => state.cart);

  // Effects
  useEffect(() => {
    if (bookingInfo?.guests.length === 0 && urlStoreUuid.storeUuid) {
      router.push("/?storeUuid=" + urlStoreUuid.storeUuid);
    }
  }, [bookingInfo, router, urlStoreUuid.storeUuid]);

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }
    const captchaTokenResponse = await executeRecaptcha('booking');
    setCaptchaToken(captchaTokenResponse);
  }, [executeRecaptcha]);

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  // Form submission
  const onSubmit = async (formData: BookingSubmitForm) => {
    setIsLoading(true);
    setError(null);
    handleReCaptchaVerify();

    const payload = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      },
      note: formData.note,
      bookingTime: `${bookingInfo.selectedDate} ${bookingInfo.selectedHour}`,
      guests: bookingInfo.guests
    };

    try {
      const response = await axios.post(
        "/reservation/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            'X-StoreID': urlStoreUuid.storeUuid,
            "Captcha-Token": captchaToken,
          },
        }
      );
      setOk(response.status === 201);
      setRes(response.data);
      reset(); // Reset form on success
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      setError(
        error.response?.data?.message || 
        "Something went wrong while creating your booking. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="error"
            onClose={handleCloseError}
            variant="filled"
            icon={<AlertCircle className="w-5 h-5" />}
            sx={{ 
              width: '100%',
              alignItems: 'center',
              '.MuiAlert-message': {
                flex: 1
              }
            }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Header */}
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" mb={4}>
          Booking Confirmation
        </Typography>

        {/* Mobile Cart Summary */}
        {isMobile && (
          <Box mb={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                overflow: 'hidden'
              }}
            >
              {/* Cart Header with Toggle */}
              <Box 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: isCartExpanded ? '1px solid' : 'none',
                  borderColor: 'grey.200'
                }}
              >
                <Typography variant="h6" fontWeight="medium">
                  Booking Summary
                </Typography>
                <IconButton 
                  onClick={() => setIsCartExpanded(!isCartExpanded)}
                  size="small"
                >
                  {isCartExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </IconButton>
              </Box>

              {/* Collapsible Cart Content */}
              <Collapse in={isCartExpanded}>
                <Box sx={{ p: 3 }}>
                  <Cart />
                </Box>
              </Collapse>

              {/* Continue Button */}
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50',
                  borderTop: '1px solid',
                  borderColor: 'grey.200',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Typography 
                  variant="body2" 
                  color="primary"
                  onClick={() => setIsCartExpanded(false)}
                  sx={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  Continue to Contact Details
                  <ChevronDown className="w-4 h-4" />
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Main Content */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          {/* Form Section */}
          <Box flex={1}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box mb={4}>
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Contact Information
                  </Typography>
                  
                  {/* Name Fields */}
                  <Box display="flex" gap={2} mb={3}>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ 
                        required: "First name is required",
                        maxLength: { value: 20, message: "First name cannot exceed 20 characters" }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="First Name"
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                          InputProps={{
                            startAdornment: <User className="w-4 h-4 text-gray-400 mr-2" />,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{ 
                        required: "Last name is required",
                        maxLength: { value: 20, message: "Last name cannot exceed 20 characters" }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Last Name"
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </Box>

                  {/* Phone Field */}
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Phone number is required",
                      pattern: { 
                        value: /^04[0-9]{8}$/, 
                        message: "Please enter a valid Australian mobile number" 
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Mobile Number"
                        placeholder="04xxxxxxxx"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        InputProps={{
                          startAdornment: <Phone className="w-4 h-4 text-gray-400 mr-2" />,
                        }}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Note Field */}
                <Box mb={4}>
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Additional Notes
                  </Typography>
                  <Controller
                    name="note"
                    control={control}
                    rules={{
                      maxLength: { value: 100, message: "Note cannot exceed 100 characters" }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label="Special Requests or Notes"
                        placeholder="Any special requests or notes for your booking..."
                        error={!!errors.note}
                        helperText={errors.note?.message}
                        InputProps={{
                          startAdornment: <FileText className="w-4 h-4 text-gray-400 mr-2" />,
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Submit Button */}
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                  loadingPosition="start"
                  startIcon={<Send className="w-4 h-4" />}
                  sx={{
                    width: '100%',
                    py: 1.5,
                    bgcolor: 'black',
                    '&:hover': {
                      bgcolor: 'grey.900',
                    },
                    borderRadius: 2,
                  }}
                >
                  {isLoading ? 'Creating Booking...' : 'Confirm Booking'}
                </LoadingButton>
              </form>
            </Paper>
          </Box>

          {/* Desktop Cart Summary */}
          {!isMobile && (
            <Box 
              flex={1}
              sx={{ 
                position: 'sticky',
                top: '2rem',
              }}
            >
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  maxHeight: 'calc(100vh - 4rem)',
                  overflow: 'auto'
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Booking Summary
                </Typography>
                <Cart />
              </Paper>
            </Box>
          )}
        </Box>

        {/* Success Dialog */}
        <AlertSuccessful
          bookingInfo={bookingInfo}
          ok={ok}
          id={res?.id}
          status={res?.status}
          isLoading={isLoading}
        />
      </Box>
    </Container>
  );
};

export default ConfirmationPage;