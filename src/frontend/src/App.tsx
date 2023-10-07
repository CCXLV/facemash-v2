import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Submit from './Submit';
import Rankings from './Rankings';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/submit" element={<Submit />} />
                    <Route path="/rankings" element={<Rankings />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
