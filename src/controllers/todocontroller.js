import { TodoCategory } from "../models/todo-category.model.js";

export const posttodo = async (req, res, next) => {
  try {
    const todo = new TodoCategory(req.body);
    await todo.save();
    return res.status(200).json({
      message: " suess ",
    });
  } catch (err) {
    return res.status(404).json({
      message: ` some thing wrong ${err}`,
    });
  }
};

export const postgettodo = async (req, res) => {    //it is get
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required as a query parameter.",
    });
  }
  let todocat = await TodoCategory.find({ userId: userId });

  return res.json({
    message: "done",
    todocat,
  });
};

export const postsubtodo = async (req, res) => {
  const subtodocat = req.params.categoryName;
  const { todoTitle } = req.body;

  let category = await TodoCategory.findOne({ categoryName: subtodocat });
  await TodoCategory.updateOne(category, {
    $push: {
      subtodos: {
        todoTitle,
        completed: false,
      },
    },
  });

  res.status(200).json({
    message: "SubTodo added successfully",
    category,
  });
};


export const getallsubtodo = async (req, res) => { 
     //it is get
  const {userId,categoryName }= req.body

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required as a query parameter.",
    });
  }
  let todocat = await TodoCategory.find({ userId: userId });
 let subtodo = await TodoCategory.findOne({
      userId: userId,
      categoryName: categoryName
    });
  subtodo=subtodo.subtodos
  return res.json({
    message: "done",
    subtodo,
  });
};


export const postdeletesubtodo = async (req, res) => {
   const subtodocat = req.params.categoryName;
  // const { todoTitle } = req.body;
const {userid,subtodoid}=req.body
try{
  let category = await TodoCategory.findOne({ categoryName: subtodocat,userId:userid});
  
  let deletedsubtodo=await TodoCategory.updateOne(category, {
    $pull: {
      subtodos: {
       _id:subtodoid
      },
    },
  });
 
     res.json({message:` sucessfully deleted the subtodo `
     })

}
catch(error){
console.log(error);
return res.json({
  message:error
})

} 
};


export const postdeletetodo = async (req, res) => {
  //  const category = req.body.categoryName;
  // const { todoTitle } = req.body;
const {todoid}=req.body

try{
  
  let deletedtodo=await TodoCategory.findByIdAndDelete({_id:todoid})
 
     res.json({message:` sucessfully deleted the todo `
     })

}
catch(error){
return res.json({
  message:error
})

} 
};
