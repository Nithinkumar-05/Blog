const express = require('express');
const router = express.Router();
const Post =require('../models/Post');

//Router
router.get('', async (req, res) => {
    
    try {
        const locals={
            title: "Blog",
            description: "A simple blog created using Nodejs, Express & MongoDB"
        };
    
        const perPage = 10;
        let page = parseInt(req.query.page) || 1; 
        // Correctly calculate the skip value
        const skipValue = (page - 1) * perPage;

        const data = await Post.find()
        .sort({ createdAt: -1 })  // Sort documents by createdAt field in descending order
        .skip(skipValue)
        .limit(perPage)
        .exec();
    
        
        const count = await Post.countDocuments();
        const nextPage = page + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : false 
        });
        
    } catch (error) {
        console.log(error);
    }
});





/**
 * GET
 * POST ID
 */
router.get('/post/:id', async (req, res) => {
    try {
        
        let slug = req.params.id;
        const data = await Post.findById({ _id:slug}).maxTimeMS(30000); 
        const locals={
            title: data.title,
            description: "A simple blog created using Nodejs, Express & MongoDB"
        };
        res.render('post',{locals,data});
        
    } catch (error) {
        console.log(error);
    }

    // res.render('index',{ locals });
    
});

/**
 * POST
 * POST - searchTerm
 */

router.post('/search', async (req, res) => {
    
    try {
        const locals={
            title: "Search",
            description: "A simple blog created using Nodejs, Express & MongoDB"
        };
        
        let searchTerm= req.body.searchTerm;
        // console.log(searchTerm);
        //remove special characters from searchTerm
        const searchNoSpecail= searchTerm.replace(/[^a-zA-Z0-9]/g,"");
        const data=await Post.find(
            {
                $or: [
                    {"title": {$regex : new RegExp(searchNoSpecail,'i') }},
                    {"description":{$regex : new RegExp(searchNoSpecail,'i')}}
                ]
            }
        );
        
        res.render('search',{locals,data});
        
    } catch (error) {
        console.log(error);
    }
});








//about
router.get('/about',(req,res)=>{
    res.render('about');
});


//contact
router.get('/contact',(req,res)=>{
res.render('contact');
});

//export
module.exports=router;





// //insert data
// function insertData(){
//     Post.insertMany([{
//         title:"Building a blog",
//         content:"This is a body"
//     },
//     {
//         title:"My blog second post",
//         content:"blog-2 content main"
//     }
// ])
// }

// insertData();
// async function insertPost(imageUrl, title, content) {
//     try {
//         // Create a new post document
//         const newPost = new Post({
//             imageUrl,
//             title,
//             content
//         }); 

//         // Save the new post document to the database
//         const savedPost = await newPost.save();
//         console.log('Post inserted successfully:', savedPost);
//         return savedPost;
//     } catch (error) {
//         console.error('Error inserting post:', error);
//         throw error;
//     }
// }
//insertPost('/img/blog','Image blog','a blog with an image in it');