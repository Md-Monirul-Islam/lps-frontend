import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Signup from './account_app/Signup';
import Login from './account_app/Login';



function App() {

    return (
        <>
            <Navbar />
            <Routes>
                {/* <Route path='/' element={<HomePage />} /> */}

                <Route path='/signup/' element={<Signup />} />

                <Route path='/login/' element={<Login />} />

                {/* <Route path='/login/' element={<Login />} />

                <Route path="/dashboard/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}

            </Routes>
        </>
    );
}

export default App;