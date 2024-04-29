const User = require("../models/user");

// Signup
module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signup = async(req,res)=>{
    try{
        let {username,password,email} = req.body;
        const newUser = new User({username,email});
    
        const registerUser = await User.register(newUser,password);
    
        req.login(registerUser,(err)=>{   // login after sign up
              if(err){
                return next(err);
              }
              req.flash("success","Welcome to Wanderlust!");
              res.redirect("/listings");
        });
        
    }
    catch(e){
        req.flash("error",e.message);
        req.redirect("/signup");
    }   
};



//login
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};


module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


//logout 
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
      if(err){
         return next(err);
      }
      req.flash("success","You are logged out!");
      res.redirect("/listings");
    });
};
