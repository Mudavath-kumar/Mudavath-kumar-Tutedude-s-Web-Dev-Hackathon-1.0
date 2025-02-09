import type React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/Header"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CreateRecipe from "./pages/CreateRecipe"
import RecipeDetails from "./pages/RecipeDetails"

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="container mx-auto mt-4 p-4">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/create-recipe" component={CreateRecipe} />
              <Route path="/recipe/:id" component={RecipeDetails} />
            </Switch>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

