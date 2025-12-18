//@ts-nocheck
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import Loader from "../loader"
import { LoaderCircle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { setFullname, setUser } from "@/redux/userSlice"




export function LoginForm({ setError }) {

const navigate = useNavigate()
const dispatch = useDispatch()

const { fullname } = useSelector(state => state.user)

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        const { user } = data
        dispatch(setUser(user._id))
        dispatch(setFullname(user.fullname))

        setError(null)
        navigate('/')
        // Handle successful login (e.g., redirect or store user data)
      } else {
        const errorData = await response.json();
        setError(errorData.message)
        console.error('Login failed:', errorData);
        // Handle login error (e.g., show error message)
      }
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)
      console.error('Error during login:', error);
      // Handle network or other errors
    }
  };
    
    return (
      <form className="space-y-4" onSubmit={handleLogin}>
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
        <Button 
        type="submit" className="w-full text-white  ">
          {isLoading ? <LoaderCircle /> : 'Log in'}
        </Button>
      </form>
    )
  }