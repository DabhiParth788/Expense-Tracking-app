import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './component/Navbar';
import ExpenseState from './context/expense/expenseState';
import Dashboard from './component/Dashboard';
import Expense from './component/Expense';
import Category from './component/Category';
import Graph from './component/Graph';
import Login from './component/Login';
import SignUp from './component/SignUp';

function App() {
  return (
    <>
      {/* <ExpenseState> */}
        <Router>
          <div className='w-screen h-screen overflow-hidden'>
            <Navbar />
            <div>
              <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/expense" element={<Expense />} />
                <Route exact path="/category" element={<Category />} />
                <Route exact path="/graph" element={<Graph />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signUp" element={<SignUp />} />
              </Routes>
            </div>
          </div>
        </Router>
      {/* </ExpenseState> */}
    </>
  );
}

export default App;
