import { createContext, use, useState, useEffect } from "react";
// import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";


export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
  const [companyToken, setCompanyToken] = useState(null)
  const [companyData, setCompanyData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [userApplications, setUserApplications] = useState([])


  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`, { headers: { token: companyToken } })

      if (data.success) {
        setJobs(data.jobs)
        console.log(data.jobsData)
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    // setJobs(jobsData)
  }
  // function to fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken()
      const url = `${backendUrl}/api/users/user`
      console.log('fetchUserData -> url:', url, 'token:', token)
      const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setUserData(data.user)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      // improved error logging
      console.error('fetchUserData error', error)
      if (error.response) {
        console.error('response data:', error.response.data, 'status:', error.response.status)
        toast.error(error.response.data?.message || `Request failed: ${error.response.status}`)
      } else {
        toast.error(error.message)
      }
    }
  }
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, { headers: { token: companyToken } })
      if (data.success) {
        setCompanyData(data.company)
        console.log(data)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(() => {
    fetchJobs()
    const storedCompanyToken = localStorage.getItem('companyToken')
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken)
    }
  }, [])
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData()
    }
  }, [companyToken])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
    if (!isLoaded) return
    if (user?.id) fetchUserData()
  }, [user?.id, isLoaded])

  const value = {
    setIsSearched,
    isSearched,
    setSearchFilter,
    searchFilter,
    jobs, setJobs,
    showRecruiterLogin, setShowRecruiterLogin,
    companyToken, setCompanyToken,
    companyData, setCompanyData, backendUrl,
    userData, userApplications
  }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}