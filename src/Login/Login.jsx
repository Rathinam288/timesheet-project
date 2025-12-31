import Loginform from "./Loginform/Loginform";
import Logo from "./Logo/Logo";
import './Login.css'; 

function Login() {
    return (
        <div className="login-page">
           <div><Logo /></div> 
            <div id="log-form"><Loginform /></div>
        </div>
    );
}

export default Login;
