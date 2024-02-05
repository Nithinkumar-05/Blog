const express = require('express');
const router = express.Router();
const Post =require('../models/Post');
const User =require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const adminLayout='../views/layouts/admin';
const jwtSecret=process.env.JWTSECRET;


/**
 * CHECK LOGIN
 */
const authMiddleware=(req,res,next) =>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message : 'Unauthorized'});
    }

    try {
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message : 'Unauthorized'});
    }
}





/**
 * GET/
 * ADMIN - Login Page
 */
router.get('/admin', async (req, res) => {
    try {
        
        const locals={
            title: "Admin",
            description: "A simple blog created using Nodejs, Express & MongoDB",
            currentRoute : '/admin'
        };
        
        
        res.render('admin/index',{locals,layout: adminLayout});
    } catch (error) {
        console.log(error);
    }

    // res.render('index',{ locals });
    
});

/**
 * GET/
 * ADMIN - Check Login 
 */


router.post('/admin', async (req, res) => {
    
    try {
        const {username, password} = req.body;
        const user = await User.findOne({ username});
        if (!user) return res.status(400).send("Invalid username ");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid ) return res.status(400).send("Invalid Password");

        //token
        const token = jwt.sign({ userId: user._id},jwtSecret);
        res.cookie('token' , token , { httpOnly: true});

        res.redirect('/dashboard',{currentRoute : '/dashboard'});

    } catch (error) {
        
    }
    // res.render('index',{ locals });
    
});

/**
 * GET/
 * ADMIN - Check Login 
 */


router.post('/register', async (req, res) => {
    try {
        
        const {username, password} = req.body;
        const hashedpassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedpassword});
            res.status(201).json({ message: 'User created',user}); 
        } catch (error) {
            if(error.code=== 11000){
                res.status(409).json({message: 'User already in use'});
            }
            res.status(500).json({ message:' internal server error'});
        }

    } catch (error) {
        console.log(error);
    }
    // res.render('index',{ locals });
    
});



/**
 * GET/
 * ADMIN - Dashboard
 */

router.get('/dashboard', authMiddleware,async (req,res) =>{
    try {
        const locals={
            title: "Dashboard",
            description: "A simple blog created using Nodejs, Express & MongoDB",
            currentRoute : '/dashboard'
        };
        const data = await Post.find();
        res.render('admin/dashboard',{
            data,
            locals,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
})  
    /**
 * GET/
 * ADMIN - Create New Post
 */

router.get('/add-post', authMiddleware,async (req,res) =>{
    try {
        const locals={
            title: "Add Post",
            description: "A simple blog created using Nodejs, Express & MongoDB",
            currentRoute : '/add-post'
        };
        
        const data=Post.find();
        res.render('admin/add-post',{
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
})
    
   /**
 * GET/
 * ADMIN - Dashboard
 */

router.get('/dashboard', authMiddleware,async (req,res) =>{
    try {
        const locals={
            title: "Dashboard",
            description: "A simple blog created using Nodejs, Express & MongoDB", currentRoute : '/dashboard'
        };
        const data = await Post.find();
        res.render('admin/dashboard',{
            layout: adminLayout,
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
})
 /**
 * POST/
 * ADMIN - Create  a new post
 */

 router.post('/add-post', authMiddleware,async (req,res) =>{
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.body,
            currentRoute : '/add-post'
        })
        await Post.create(newPost);
        res.redirect('/dashboard',{currentRoute : '/dashboard'});
    } catch (error) {
        console.log(error);
    }
    
});
 /**
 * GET/
 * ADMIN - Update  a post
 */
 router.get('/edit-post/:id', authMiddleware,async (req,res) =>{
    try {
        const data= await Post.findOne({ _id: req.params.id});
        const locals={
            title: "Edit Post",
            description: "A simple blog created using Nodejs, Express & MongoDB",
            currentRoute : '/edit-post/:id'
        };
       res.render('admin/edit-post',{
        locals,
        data,
        layout: adminLayout
       });
    } catch (error) {
        console.log(error);
    }
    
});

 /**
 * PUT/
 * ADMIN - Update  a post
 */
 router.put('/edit-post/:id', authMiddleware,async (req,res) =>{
    try {
        // Update the post in the database
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.body,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`,{currentRoute : `/edit-post/${req.params.id}`});
       
    } catch (error) {

        console.error(error);
    }
    
});


/**
 * DELETE/
 * ADMIN - Delete a post
 */
router.delete('/delete-post/:id', authMiddleware,async (req,res) =>{
    try {
        // Update the post in the database
        await Post.deleteOne( {_id:req.params.id });
        res.redirect(`/dashboard`);
       
    } catch (error) {

        console.error(error);
    }
    
});

/**
 * DELETE/
 * ADMIN - Delete a post
 */
router.get('/logout',(req,res)=>{
    res.clearCookie('token');
   // res.json({ message:'Logout sucessful'})
   res.redirect('/',{currentRoute : '/'});
});




module.exports= router;