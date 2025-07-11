"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setLoading, setError } from "@/store/slices/loginSlice";
import { Eye, EyeOff } from "lucide-react";
import { Loading } from "@/lib/loader";
import config from "../api/config";
import toast from "react-hot-toast";
export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.login);
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    mobile: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const validateMobile = (mobile) => {
    const mobileRegex = /^(?:\+91)?[6-9]\d{9}$/;
    return mobileRegex.test(mobile)
      ? ""
      : "Please enter a valid 10 digits mobile number";
  };
  const validatePassword = (password) => {
    return password.length >= 4 ? "" : "Password must be at least 4 characters";
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "mobile") {
      setErrors((prev) => ({ ...prev, mobile: validateMobile(value) }));
    } else if (name === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const mobileError = validateMobile(formData.mobile);
    const passwordError = validatePassword(formData.password);
    setErrors({ mobile: mobileError, password: passwordError });
    if (mobileError || passwordError) {
      return;
    }
    const ENV_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (formData.password !== ENV_PASSWORD) {
      toast.error("Incorrect password!");
      dispatch(setError("Incorrect admin password"));
      return;
    }
    try {
      dispatch(setLoading());
      const response = await fetch(`${config.api_url}/auth/v1/loginnew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: formData.mobile }),
      });
      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Login failed");
      }
      dispatch(
        setLogin({
          user: data.user_details,
          token: data.accessToken,
        })
      );
      localStorage.setItem("userToken", data.accessToken);
      localStorage.setItem("userDetails", JSON.stringify(data.user_details));
      localStorage.setItem("City", data.user_details.city);
      router.push("/dashboard");
      toast.success(`Welcome, ${data.user_details.name || "User"}!`);
    } catch (err) {
      dispatch(setError(err.message || "An error occurred during login"));
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your number below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="mobile">Phone Number</Label>
          <Input
            id="mobile"
            name="mobile"
            type="tel"
            placeholder="+91"
            value={formData.mobile}
            onChange={handleChange}
            pattern="[0-9+]*"
            required
            className={errors.mobile ? "border-red-500" : ""}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile}</p>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              className={errors.password ? "border-red-500" : ""}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-[#1D3A76] flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loading size={5} color="white" />
              <span>Loading...</span>
            </>
          ) : (
            "Login"
          )}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
      </div>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <a
          href="/"
          className="text-blue-900  hover:text-blue-500 transition-colors duration-200 font-semibold  hover:no-underline"
        >
          Sign up
        </a>
      </div>
    </form>
  );
}
