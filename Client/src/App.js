import React, { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return { ...state, count: action.count };
        case 'INCREMENT':
            return { ...state, count: state.count + 1 };
        case 'DECREMENT':
            return { ...state, count: state.count - 1 };
        case 'SET_MY_COUNT':
            return { ...state, myCount: action.myCount };
        case 'INCREMENT_MY_COUNT':
            return { ...state, myCount: state.myCount + 1 };
        case 'DECREMENT_MY_COUNT':
            return { ...state, myCount: state.myCount - 1 };
        default:
            return state;
    }
};

const Home = () => {
    const [counterData, setCounterData] = useState();

    useEffect(() => {
        const fetchCounterData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/counter');
                setCounterData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCounterData();
    }, []);

    return (
        <div>
            <h1>Counter Value: {counterData ? counterData.count : 0}</h1>
            <h1>MyCounter Value: {counterData ? counterData.mycount : 0}</h1>
        </div>
    );
};

const Counter = () => {
    const { state, dispatch } = useContext(CounterContext);
    const navigate = useNavigate();

    const fetchCounter = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/counter');
            dispatch({ type: 'SET', count: response.data.count });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCounter();
    }, [fetchCounter]);

    const incrementCounter = useCallback(async () => {
        try {
            await axios.post('http://localhost:5000/api/counter/increment');
            dispatch({ type: 'INCREMENT' });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

    const decrementCounter = useCallback(async () => {
        try {
            await axios.post('http://localhost:5000/api/counter/decrement');
            dispatch({ type: 'DECREMENT' });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

    return (
        <div>
            <h2>Counter</h2>
            <p>Count: {state.count}</p>
            <button onClick={incrementCounter}>Increment</button>
            <button onClick={decrementCounter}>Decrement</button>
            <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
    );
};

const MyCounter = () => {
    const { state, dispatch } = useContext(CounterContext);
    const navigate = useNavigate();

    const fetchCounter = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/counter');
            dispatch({ type: 'SET_MY_COUNT', myCount: response.data.mycount }); // Corrected property name
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCounter();
    }, [fetchCounter]);

    const incrementMyCounter = useCallback(async () => {
        try {
            await axios.post('http://localhost:5000/api/counter/myCounterincrement');
            dispatch({ type: 'INCREMENT_MY_COUNT' });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

    const decrementMyCounter = useCallback(async () => {
        try {
            await axios.post('http://localhost:5000/api/counter/myCounterdecrement');
            dispatch({ type: 'DECREMENT_MY_COUNT' });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);


    return (
        <div>
            <h2>My Counter</h2>
            <p>My Count: {state.myCount}</p> {/* Corrected property name */}
            <button onClick={incrementMyCounter}>Increment</button>
            <button onClick={decrementMyCounter}>Decrement</button>
            <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
    );
};



const App = () => {
    const [state, dispatch] = useReducer(counterReducer, { count: 0, myCount: 0 });

    return (
        <CounterContext.Provider value={{ state, dispatch }}>
            <Router>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/counter">Counter</Link>
                            </li>
                            <li>
                                <Link to="/my-counter">My Counter</Link>
                            </li>
                        </ul>
                    </nav>

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/counter" element={<Counter />} />
                        <Route path="/my-counter" element={<MyCounter />} />
                    </Routes>
                </div>
            </Router>
        </CounterContext.Provider>
    );
};

export default App;
