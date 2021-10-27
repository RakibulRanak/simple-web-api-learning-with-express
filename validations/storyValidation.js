const { body, param } = require('express-validator')



exports.createStory = () => {
    return [
        body('title').trim().isLength({ max: 20, min: 1 }).withMessage("Title must contain 1-20 letters"),
        body('story').trim().isLength({ max: 1000, min: 1 }).withMessage("Story must contain 1-1000 letters"),
        body('username').trim().not().isEmpty().withMessage("Username can't be null")
    ];

};

exports.getStory = () => {
    return [
        param('id').exists().isInt().withMessage("Param id must be integer!"),
    ];

};

exports.updateStory = () => {
    return [
        param('id').exists().isInt().withMessage("Param id must be integer!"),
        body('title').if(body('title').exists()).trim().isLength({ max: 20, min: 1 }).withMessage("Title must contain 1-20 letters"),
        body('story').if(body('story').exists()).trim().isLength({ max: 1000, min: 1 }).withMessage("Story must contain 1-1000 letters"),
        body('username').trim().not().isEmpty().withMessage("Username can't be null")
    ];

};

exports.deleteStory = () => {
    return [
        param('id').exists().isInt().withMessage("Param id must be integer!"),
    ];

};