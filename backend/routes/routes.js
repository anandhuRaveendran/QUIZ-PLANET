const express = require("express");
const router = express.Router();
const quizes = require('../Models/Quizes');
const results = require("../Models/QuizResults");
const verifyToken = require("../middleware/authMiddleware")

router.get("/api/get-quiz/:joinID", async (req, res) => {
    const id=req.params.joinID
    console.log(id)
    const quizdata = await quizes.findOne({ joinid:id });
    console.log(quizdata)
    res.json(quizdata);
});


router.get("/home", async (req, res) => {
    const quiz_mainlist = await quizes.find({isPrivate:false,active:true});
    res.json(quiz_mainlist);
});

router.post('/api/save-result', async (req, res) => {
    try {
        req.body.username=req.email
        const data=req.body
        data.qna=JSON.stringify(data.qna)

       const result_details= await results.create(data)
        res.status(200).json({ message: 'Result saved successfully' });
    } catch (error) {
        console.error('Failed to save result:', error);
        res.status(500).json({ error: 'Failed to save result' });
    }
});

router.get("/quiz/:id", async (req, res) => {
    const quizId = req.params.id;
    const details = await quizes.findOne({ quizid: quizId }, { _id: 0 });
    res.json(details);
});

router.get("/joinquiz", async (req, res) => {
    const joinId = req.body.joinid;
    const details = await quizes.findOne({ joinid: joinId }, { _id: 0 });
    res.json(details);
});
// router.post('/api/signup', async (req, res) => {
//     const email = req.body.email;
//     useremail = email;
//     const data = req.body
//     const existingUser = await users.findOne({ email });
//     if (existingUser) {
//         return res.json({ status: 'error', message: 'Email already exists' });
//     }

//     const user = await users.create(data);

//     res.json({ status: 'success', message: 'Signup successful!' });
// });
router.get('/api/leaderboard', async (req, res) => {
    try {
      const leaderboard = await results.find().sort({ marksObtained: -1 }); // Sorting by marksObtained in descending order
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching leaderboard data', error });
    }
  });
// router.post('/api/login', async (req, res) => {
//     const { email, password } = req.body;
//     useremail = email;
//     const user = await users.findOne({ email, password });
//     if (user) {
//         res.json({ status: 'success', message: 'Login successful!' });
//     } else {
//         res.json({ status: 'error', message: 'Invalid email or password' });
//     }
// });

router.post("/addQuiz", async (req, res) => {
    try {
        // req.body.creator=email;
        console.log(req.body)
        req.body.creator = '';  
        req.body.thumbnail=null
        const data = req.body;
        const result = await quizes.create(data);
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
});
router.put("/updateStatus", async (req, res) => {
    try {
        // req.body.creator=email;
const creator={'_id':req.body.id}
        const data = {'active':req.body.active};
        
const result=await quizes.findOneAndUpdate(creator,data);
console.log(result)
res.status(201)
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
});


router.get("/myquizes",verifyToken, async (req, res) => {
console.log('myquizes',req.useremail)
    const user_quizez = await quizes.find({ creator: req.cookies.User });
    res.json(user_quizez);
});

router.get("/quizdetails/:id", async (req, res) => {
    const quizid=req.params.id;
    console.log(quizid)
    const user_quizez = await results.find({ quizid: quizid });
    res.json(user_quizez);
});
router.get("/results",verifyToken, async (req, res) => {
    const quiz_history = await results.find({ username: req.cookies.User });
    res.json(quiz_history);
});
router.delete('/delete/:quiz_id',async(req,res)=>{
    console.log(req.params.quiz_id)
const id={'_id':req.params.quiz_id};
console.log(id)
    try{
        const result=await quizes.findOneAndDelete(id);
        console.log(result)
        res.status(201).json();
    
    }
    catch(error){
        console.log(error);
        res.status(500).json();
    }
 });
module.exports = router;
