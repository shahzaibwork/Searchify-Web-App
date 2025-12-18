//@ts-nocheck

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Loader from "../loader";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { setFullname, setUser } from "@/redux/userSlice";


export function SignUpForm({ setError }) {

  const dispatch = useDispatch()  
  const navigate = useNavigate()  

  const [fullname, setfullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sign up successful:", data);

        const { user } = data
        dispatch(setUser(user._id))
        dispatch(setFullname(user.fullname))

        setError(null)
        navigate('/')
        // Handle successful sign-up (e.g., redirect or show success message)
      } else {
        const errorData = await response.json();
        setError(errorData.message)
        console.error("Sign up failed:", errorData);
        // Handle sign-up error (e.g., show error message)
      }
      setIsLoading(false)

    } catch (error) {
    setIsLoading(false)
      console.error("Error during sign-up:", error);
      // Handle network or other errors
    }
  }
    return (
      <form className="space-y-4" onSubmit={handleSignUp}>
        <div className="space-y-2 text-white">
          <Label htmlFor="name">Name</Label>
          <Input 
          value={fullname}
          onChange={(e) => setfullname(e.target.value)}
          id="fullname"  required />
        </div>
        <div className="space-y-2 text-white">
          <Label htmlFor="email">Email</Label>
          <Input 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email" type="email"  required />
        </div>
        <div className="space-y-2 text-white">
          <Label htmlFor="password">Password</Label>
          <Input 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full text-white">
          {isLoading ? <LoaderCircle /> : 'Create Account'}
        </Button>
      </form>
    )
  }