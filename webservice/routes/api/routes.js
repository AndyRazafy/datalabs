const express = require("express");
const router = express.Router();

// Dataset Model
const Dataset = require("../../models/Dataset");

// @route  GET api/datasets
// @desc   Get all datasets
// @access Public
router.get("/datasets", (req, res) => {
  Dataset.find()
    .then(datasets => res.json(datasets))
    .catch(err => res.status(404).json({ message: err.message }));
});

// @route  GET api/datasets/:id
// @desc   Get dataset by id
// @access Public
router.get("/datasets/:id", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => res.json(dataset))
    .catch(err => res.status(404).json({ message: err.message }));
});

// @route  GET api/datasets/:id/labels
// @desc   Get dataset's labels
// @access Public
router.get("/datasets/:id/docs", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => res.json(dataset.docs))
    .catch(err => res.status(404).json({ message: err.message }));
});

// @route  GET api/datasets/:id/labels
// @desc   Get dataset's labels
// @access Public
router.get("/datasets/:id/labels", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => res.json(dataset.labels))
    .catch(err => res.status(404).json({ message: err.message }));
});

// @route  GET api/datasets/:id/ready
// @desc   Get dataset's ready
// @access Public
router.get("/datasets/:id/ready", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => res.json(dataset.ready))
    .catch(err => res.status(404).json({ message: err.message }));
});

// @route  GET api/datasets/:id/trained
// @desc   Get dataset's trained
// @access Public
router.get("/datasets/:id/trained", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => res.json(dataset.trained))
    .catch(err => res.status(404).json({ message: err.message }));
});

// @route  GET api/datasets/:id/trained
// @desc   Get dataset's trained
// @access Public
router.get("/datasets/:id/test", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => res.json(dataset.test))
    .catch(err => res.status(404).json({ message: err.message }));
});

// @route  POST api/datasets
// @desc   Create a dataset
// @access Public
router.post("/datasets", (req, res) => {
  const newDataset = new Dataset({
    model: req.body.model,
    labels: req.body.labels,
    docs: req.body.docs,
    ready: req.body.ready,
    trained: req.body.trained,
    test: req.body.test
  });

  newDataset.save()
    .then(dataset => res.json({ success: 1, data: dataset }))
    .catch(err => {res.status(404).json({ success: 0, message: err.message })});
});

// @route  PUT api/datasets
// @desc   Update a dataset docs
// @access Public
router.put("/datasets/:id/docs", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => dataset.updateOne({  
      docs: req.body.docs
    })).then(() => res.json({ success: 1 }))
    .catch(err => res.status(404).json({ success: 0, message: err.message }));
});

// @route  POST api/datasets//:id/labels
// @desc   add label to dataset
// @access Public
router.put("/datasets/:id/labels", (req, res) => {
  Dataset.findByIdAndUpdate(
    req.params.id,
    {$push: {labels: req.body.label}},
    {useFindAndModify: false})
    .then(() => res.json({ success: 1 }))
    .catch(err => {res.status(404).json({ success: 0, message: err.message })});
});

// @route  PUT api/datasets
// @desc   Update a dataset labels
// @access Public
router.put("/datasets/:id/ready", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => dataset.updateOne({  
      ready: req.body.ready
    })).then(() => res.json({ success: 1 }))
    .catch(err => res.status(404).json({ success: 0, message: err.message }));
});

// @route  PUT api/datasets
// @desc   Update a dataset
// @access Public
router.put("/datasets/:id/trained", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => dataset.updateOne({  
      trained: req.body.trained
    })).then(() => res.json({ success: 1 }))
    .catch(err => res.status(404).json({ success: 0, message: err.message }));
});

// @route  PUT api/datasets
// @desc   Update a dataset
// @access Public
router.put("/datasets/:id/test", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => dataset.updateOne({  
      test: req.body.test
    })).then(() => res.json({ success: 1 }))
    .catch(err => res.status(404).json({ success: 0, message: err.message }));
});

// @route  DELETE api/datasets
// @desc   Delete a dataset
// @access Public
router.delete("/datasets/:id", (req, res) => {
  Dataset.findById(req.params.id)
    .then(dataset => dataset.remove()
      .then(() => res.json({ success: 1 })))
    .catch(err => res.status(404).json({ success: 0, message: err.message }));
});

module.exports = router;