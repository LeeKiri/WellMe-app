// Requiring path to so we can use relative routes to our HTML files
// const path = require("path");
const isAuthenticated = require("../config/middleware/isAuthenticated");
const { getRecipes } = require("../config/spoonacularAPI/spoonacularAPI");
module.exports = function(app) {
  // routing for the signup page
  app.get("/", (req, res) => {
    res.render("signup", {
      style: "signup.css"
    });
  });
  //route to redirect from login to signup page
  app.get("/signup", (req, res) => {
    res.render("signup", {
      style: "signup.css"
    });
  });
  // Routing for the login page
  app.get("/login", (req, res) => {
    res.render("login", {
      style: "signup.css"
    });
  });
  // Routing for the members page
  // Authenticated middleware on this route.
  app.get("/members", isAuthenticated, (req, res) => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      return res.render("members", {
        style: "members.css",
        UserId: req.user.id,
        user: req.user
      });
    }
    // User not logged in will be redirected to the signup page
    return res.render("signup", {
      style: "signup.css"
    });
  });

  //Routing for graph page
  app.get("/graph", (req, res) => {
    res.render("graph", {
      style: "graph.css",
      user: req.user
    });
  });
  //Routing for recipeInspiration page
  app.get("/recipeInspiration", (req, res) => {
    // Run getRecipes() which will return
    // Spoonacular API calls with specified number of recipes.
    getRecipes().then(response => {
      // Reduce the amount of data in Spoonacular response to data we will use.
      const reducedRecipesData = response.map(item => {
        return {
          title: item.title,
          image: item.image,
          url: item.spoonacularSourceUrl,
          nutrientsUnit: item.nutrition.nutrients[0].unit,
          nutrientsName: item.nutrition.nutrients[0].name,
          nutrientsAmount: item.nutrition.nutrients[0].amount
        };
      });
      res.render("recipeInspiration", {
        style: "recipes.css",
        user: req.user,
        recipesReturned: reducedRecipesData
      });
      return response;
    });
  });
};
