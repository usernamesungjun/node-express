const workModel = require('../models/workModel.js')
const projectModel = require('../models/projectModel.js');
const mentionModel = require('../models/mentionModel.js')
const userModel = require('../models/userModel.js')

exports.createWork = async (req, res) => {
  try {
    const {projectId ,workTitle, workState} = req.body

    const newWorkId = await workModel.creatWork(projectId ,workTitle, workState);

    res.status(201).json({workId: newWorkId ,message : 'Work create successfully' })
  } catch (error) {
    console.error(error)
    res.status(400).json({message: error.message})
  }
}

exports.getProjectWork = async (req, res) => {
  const { projectId } = req.query 

  const isProjectId = await projectModel.isProjectExist(projectId);
  if(!isProjectId) return res.status(404).json({message: 'invaild project'})

  const workData = await workModel.findByProjectId(projectId)

  const workWithMentions = await Promise.all(workData.map(async (work) => {
    const mentions = await mentionModel.findMentionsByWorkId(work.workId);
    const mentionsWithUserNames = await Promise.all(mentions.map(async (mention) => {
      const user = await userModel.findNameByUserId(mention.userId);
      const userName = user.length > 0 ? user[0].name : 'Unknown';
      return {
        mentionId: mention.mentionId,
        name: userName,
        content : mention.contents,
        registerDate : mention.registerDate
      }
    }));
    return {
      ...work,
      mentions: mentionsWithUserNames
    };
  }));

  res.status(200).json(workWithMentions)
}

exports.updateProjectWork = async (req,res) => {
  try {
    const newData = req.body
    const {workId} = req.params
  
    if (!newData || Object.keys(newData).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    await workModel.updateWork(workId,newData);
    res.status(200).json({ message: 'Work updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating work' });
  }
}

exports.deleteWork = async (req,res) => {
  try {
    const {workId} = req.params

    await mentionModel.deleteMentionByWorkId(workId)
    await workModel.deleteWorkByWorkId(workId)
    res.status(200).json({ message: 'Work delete successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleteing work' });
  }
}
