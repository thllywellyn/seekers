import React, { useContext } from 'react'
import {Context} from "../../main"
import {Link} from "react-router-dom"
import { FaGithub , FaLinkedin} from "react-icons/fa"
import { SiLeetcode } from "react-icons/si";
function Footer() {
  const {isAuthorized}  = useContext(Context)
  return (
    <footer className= {isAuthorized ? "footerShow" : "footerHide"}>
<div>&copy; All Rights Reserved by Seekers.</div>
<div>
  <Link to={'https://github.com/thllywellyn/seekers'} target='github'><FaGithub></FaGithub></Link>
</div>
      
    </footer>
  )
}

export default Footer