import { useNavigate } from 'react-router-dom'

function SignIn() {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/');
    }

    return (
        <div>
            <h2>Sign In page</h2>
            <button onClick={handleClick}>Sign In</button>
        </div>
    );
}

export default SignIn;