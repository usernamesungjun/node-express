const moment = require('moment-timezone')
const mentionModel = require('../models/mentionModel.js')
const projectModel = require('../models/projectModel.js')
const workModel = require('../models/workModel.js')
const userModel = require('../models/userModel.js')

exports.createMention = async (req, res) => {
  try {
    const { workId, userId , contents} = req.body;
    const registerDate = moment().tz('Asia/Seoul').format()

    const newMentionId = await mentionModel.createMention(workId, userId, contents, registerDate)
    
    res.status(201).json({mentionId:newMentionId,message: '멘션등록이 성공했습니다.'})
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.getMention = async (req,res) => {
  try {
    const { projectId } = req.query

    const isProjectExist = await projectModel.isProjectExist(projectId)
    if (!isProjectExist) return res.status(404).json({ message: '존재하지 않는 project입니다.' });

    const workIds = await workModel.findWorkIdByProjectId(projectId)
    let allMentions = [];
    for (const work of workIds) {
    const mentions = await mentionModel.findMentionsByWorkId(work.workId);
    allMentions = allMentions.concat(mentions.map(mention => ({
    ...mention,
    workTitle: work.workTitle
  })));
}

const sortedMentions = allMentions.sort((a, b) => new Date(b.registerDate) - new Date(a.registerDate)).slice(0, 5);

// Map sorted mentions to include userName
const finalMentions = await Promise.all(sortedMentions.map(async (mention) => {
  const user = await userModel.findNameByUserId(mention.userId);
  const userName = user.length > 0 ? user[0].name : 'Unknown';
  return {
    workTitle: mention.workTitle,
    name: userName,
    content: mention.contents,
    registerDate: mention.registerDate
  };
}));

    res.status(200).json(finalMentions)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.updateMention = async (req,res) => {
  try {
    const newData = req.body
    const {mentionId} = req.params

    const updateDate = moment().tz('Asia/Seoul').format()
    newData.registerDate = updateDate

    if (!newData || Object.keys(newData).length === 0) {
      return res.status(400).json({ message: 'No update data provided' })
    }

    await mentionModel.updateMention(mentionId, newData)
    res.status(200).json({message: 'Success is Update Mention'})
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.deleteMention = async (req,res) => {
  try {
    const {mentionId} = req.params
    console.log('DeleteMetionId:' , mentionId)

    const isMentionExist = await mentionModel.isMentionExist(mentionId)
    if(!isMentionExist) return res.status(400).json({ message: 'Invalid MentionId' });
    
    await mentionModel.deleteMentionByMentionId(mentionId)
    res.status(200).json({message: 'Success is Delete Mention'})
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}