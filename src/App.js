import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Signup from './account_app/Signup';
import Login from './account_app/Login';
import TaskManager from './project_app/TaskManager';
import ProtectedRoute from './authentication/ProtectedRoute';
import ActivityList from './project_app/ActivityList';



function App() {

    return (
        <>
            <Navbar />
            <Routes>
                {/* <Route path='/' element={<HomePage />} /> */}

                <Route path='/signup/' element={<Signup />} />

                <Route path='/login/' element={<Login />} />

                <Route path="/dashboard/" element={<ProtectedRoute><TaskManager /></ProtectedRoute>} />

                {/* <Route path="/dashboard/" element={<ProtectedRoute><ActivityList /></ProtectedRoute>} /> */}

            </Routes>
        </>
    );
}

export default App;