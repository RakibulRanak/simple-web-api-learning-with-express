const Story = require('../../../models/storyModel');
const AppError = require('../../../errors/appError');
const { StoryDao } = require('./storyDao');
const { StoryDto } = require('../../dto/storyDto')


class PgStoryDao extends StoryDao {
    constructor() { super(); }
    createStory = async (storyBody) => {
        const { title, username, story } = storyBody;
        const createdstory = await Story.create({ title, username, story });
        return new StoryDto(createdstory);
    };
    getStory = async (storyId) => {
        const story = await Story.findOne({ where: { id: storyId } });
        if (!story) throw new AppError(`Story not found`, 404);
        return new StoryDto(story);
    };

    getStories = async (req) => {
        let { page, size } = req.query;
        if (!page)
            page = 1;
        if (!size)
            size = 10;
        const limit = parseInt(size);
        const skip = limit * (parseInt(page) - 1);
        //const stories = await Story.findAll({ limit, offset: skip, order: [['createdAt', 'DESC']] });
        const stories = await Story.findAll({ order: [['createdAt', 'DESC']] });
        if (stories[0] == null) throw new AppError(`No story found`, 404);
        let storyArray = [];
        for (let i = 0; i < stories.length; i++) {
            storyArray[i] = new StoryDto(stories[i]);
        }
        return storyArray;
    };
    updateStory = async (req) => {
        let hasStory = await Story.findOne({ where: { id: req.params.id } });
        if (hasStory == null)
            throw new AppError(`Story Does Not found`, 404);
        if (req.user.username != hasStory.username)
            throw new AppError(`You are Not allowed to perform this action`, 403);
        const { title, story } = req.body;
        const storyUpdated = await Story.update({ title, story }, { returning: true, where: { id: req.params.id } });
        return new StoryDto(storyUpdated[1][0]);
    };

    deleteStory = async (req) => {
        let hasStory = await Story.findOne({ where: { id: req.params.id } });
        if (hasStory == null)
            throw new AppError(`Story Does Not found`, 404);
        if (req.user.username != hasStory.username)
            throw new AppError(`You are Not allowed to perform this action`, 403);
        const storyDeleted = await Story.destroy({ where: { id: req.params.id } });
        return;
    };


}
module.exports = { PgStoryDao };