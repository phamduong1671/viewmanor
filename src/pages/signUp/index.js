import { useNavigate } from 'react-router-dom'

function SignUp() {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/');
    }

    return (
        <div>
            <h2>Sign Up page</h2>
            <button onClick={handleClick}>Sign Up</button>
        </div>
    );
}

export default SignUp;