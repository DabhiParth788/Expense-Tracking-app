const express = require("express");
const router = express.Router();
const fetchUser = require("../middleWare/fetchUser");
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const Budget = require("../models/Budget");
const { body, validationResult } = require("express-validator");

// fetch all expense of a user
router.get("/fetchAllExpense", fetchUser, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (error) {
    console.log(error.massage);
    res.status(500).send("Internal server error.");
  }
});

// fetch all expense of a user by category
router.get("/fetchByCategory", fetchUser, async (req, res) => {
  try {
    const expense = await Expense.find({
      user: req.user.id,
      category: req.header("categoryId"),
    });
    if(expense.length == 0){
      res.status(404).send("Not Found!");
    }
    res.json(expense);
  } catch (error) {
    console.log(error.massage);
    res.status(500).send("Internal Server Error!");
  }
});

// add a new expense
router.post(
  "/addExpense",
  fetchUser,
  [
    body("amount", "Should be integer").isInt(),
    body("category", "Should be at least 3 char long").isLength({ min: 3 }),
    body("description", "Should be at least 3 char long").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      const { amount, category, description } = req.body;

      const categoryLower = category.toLowerCase();
      let ctg = await Category.findOne({
        name: categoryLower,
        user: req.user.id,
      });
      if (!ctg) {
        ctg = await Category.create({
          user: req.user.id,
          name: categoryLower,
        });
      } else {
        ctg = await Category.findByIdAndUpdate(
          ctg.id,
          {
            $set: { items: ctg.items + 1 },
          },
          { new: true }
        );
      }

      const expense = new Expense({
        amount,
        description,
        category: ctg.id,
        user: req.user.id,
      });
      expense.save();

      res.send(expense);
    } catch (error) {
      console.log(error.massage);
      res.status(500).send("Internal Server Error!");
    }
  }
);

// update expense
router.put("/updateExpense/:id", fetchUser, async (req, res) => {
  const { amount, category, description } = req.body;
  try {
    const newNode = {};
    if (amount) {
      newNode.amount = amount;
    }
    if (category) {
      newNode.category = category;
    }
    if (description) {
      newNode.description = description;
    }

    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).send("Not Found");
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    if(category){
      let cat = await Category.findByIdAndUpdate(
          expense.category,
          {
            $set: { items: cat.items - 1 },
          },
          { new: true }
        );
      }

      let lower = category.toLowerCase();
      let ctg = await Category.findOne({
        name: lower,
        user: req.user.id,
      });
      if (!ctg) {
        ctg = await Category.create({
          user: req.user.id,
          name: lower,
        });
      } else {
        ctg = await Category.findByIdAndUpdate(
          ctg.id,
          {
            $set: { items: ctg.items + 1 },
          },
          { new: true }
        );
      }

      newNode.category = cat.id;

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        $set: newNode,
      },
      { new: true }
    );

    return res.send({ expense });
  } catch (error) {
    console.error(error.massage);
    res.status(500).send("Internal server error!");
  }
});

// delete Expense
router.delete("/deleteExpense/:id", fetchUser, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).send("Not Found!");
    }
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed!");
    }

    // managing Category
    let cat = await Category.findByIdAndUpdate(
        expense.category,
        {
          $set: { items: cat.items - 1 },
        },
        { new: true }
      );

    expense = await Expense.findByIdAndDelete(req.params.id);

    return res.json({ success: "Expense has been deleted", Expense });
  } catch (error) {
    console.log(error.massage);
    res.status(500).send("Internal Server Error!");
  }
});

// fetch all category
router.get("/fetchCategory", fetchUser, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
  } catch (error) {
    console.log(error.massage);
    res.status(500).send("Internal server error!");
  }
});

// fetch all the budget
router.get("/fetchBudget", fetchUser, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (error) {
    console.log(error.massage);
    res.status(500).send("Internal Server Error!");
  }
});

// add Budget details
router.post(
  "/addBudget",
  fetchUser,
  [body("amount", "Should be integer").isInt()],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      const { amount } = req.body;
      const bgt = await Budget.create({
        user: req.user.id,
        amount,
        category: req.header("categoryId"),
      });
      res.send(bgt);
    } catch (error) {
      console.log(error.massage);
      res.status(500).send("Internal Server Error!.");
    }
  }
);

// update Budget
router.put(
  "/updateBudget/:id",
  fetchUser,
  [body("amount", "Should be integer").isInt()],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      const { amount } = req.body;

      let budget = await Budget.findById(req.params.id);
      if (!budget) {
        return res.status(404).send("Not Found!");
      }

      if (budget.user.toString() !== req.user.id) {
        return res.status(400).send("Not allowed!");
      }

      budget = await Budget.findByIdAndUpdate(
        req.params.id,
        {
          $set: { amount },
        },
        { new: true }
      );

      return res.send({ budget });
    } catch (error) {
      console.error(error.massage);
      res.status(500).send("Internal Server Error!");
    }
  }
);

// delete budget
router.delete("/deleteBudget/:id", fetchUser, async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).send("Not Found!");
    }
    if (budget.user.toString() !== req.user.id) {
      return res.status(400).send("Not Allowed!");
    }

    budget = await Budget.findByIdAndDelete(req.params.id);
    return res.send({ success: "success", budget });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error!");
  }
});

// add new category
router.post("/createCategory", fetchUser, async (req, res) => {
  try {
    let name = req.body.name.toLowerCase();
    let cat = await Category.find({ user: req.user.id, name: name });
    if(cat.length == 0){
      cat = await Category.create({
        user: req.user.id,
        name: name,
        items: 0
      })
    } else {
      res.status(400).json( { success: "success", error: "Sorry, a category with same name already exist!" } );
    }
    res.json(cat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
})

// update category name
router.put("/updateCategory/:id", fetchUser, async (req, res) => {
  try {
    let cat = await Category.findById(req.params.id);
    if(cat.user.toString() === req.user.id){
      newName = req.body.name.toLowerCase();
      cat = await Category.findByIdAndUpdate(req.params.id, {
        $set: { name: newName }
      }, { new: true });
      return res.json(cat);
    } else {
      return res.status(400).send("Not Permitted!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
})

// delete category with expenses
router.delete("/deleteCategory/:id", fetchUser, async (req, res) => {
  try {
    let ctg = await Category.findById(req.params.id);
    if (ctg.user.toString() !== req.user.id){
      return res.status(400).send("This is Not permitted!");
    }
    let expenses = await Expense.find( { category: req.params.id } );
    let deleteExpenses = []
    expenses.forEach( async (element) => {
      ele = await Expense.findByIdAndDelete(element.id);
      deleteExpenses.push(ele);
    });
    
    ctg = await Category.findByIdAndDelete(req.params.id);
    return res.send( { category: ctg, expenses: deleteExpenses } );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
})

module.exports = router;
