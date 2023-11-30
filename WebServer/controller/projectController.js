const ProjectModel = require('../models/projectModel.js');
const UserModel = require('../models/userModel.js');
const JoinProjectModel = require('../models/joinProjectModel.js');
const jwt = require('../jwt/jwt.js'); // jwt 파일의 정확한 경로를 확인해주세요.

exports.createProject = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No authorization header provided' });

    const accessToken = authHeader.split(' ')[1];
    const decoded = jwt.verify(accessToken); // 비밀키와 함께 토큰을 검증합니다.
    console.log(decoded)
    const ownerId = decoded.loginId; // ownerId는 디코딩된 토큰에서 userId를 가져옵니다.

    // 프로젝트 생성 로직
    const { projectName, startDate, endDate, personnel } = req.body;
    const newProject = await ProjectModel.createProject( projectName, startDate, endDate, ownerId, personnel );

    // JoinProjectModel을 이용해 프로젝트에 사용자를 추가합니다.
    await JoinProjectModel.addUserToProject(decoded.userId,newProject);

    // 성공적으로 생성된 프로젝트의 정보를 응답으로 보냅니다.
    res.status(201).json({projectId:newProject,message:'프로젝트가 성공적으로 생성되었습니다.'});
  } catch (error) {
    console.error(error); // 에러 로깅
    res.status(400).json({ message: error.message });
  }
};

//팀원 등록
exports.registerTeam = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { emails } = req.body; // Array of emails

    let validUserIds = [];

    for (const email of emails) {
      const emailExists = await UserModel.isEmailExist(email);
      if (emailExists) {
        const user = await UserModel.findUserIdByEmail(email);
        if (user) {
          const userId = user.userId;
          console.log(userId)
          const isAlreadyMember = await JoinProjectModel.isUserInProject(userId, projectId);
          if (!isAlreadyMember) {
            validUserIds.push(userId);
          } else {
            console.log(`User with email ${email} is already a member.`);
          }
        }
      } else {
        console.log(`Email ${email} does not exist.`);
      }
    }
    
    for (const userId of validUserIds) {
      await JoinProjectModel.addUserToProject(userId, projectId);
    }

    res.status(201).json({ message: 'Valid team members have been registered.' });
  } catch (error) {
    console.error('Error in registerTeam:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const { userId } = req.query;

    const isUserId = await UserModel.isUserExist(userId);
    if (!isUserId) return res.status(404).json({ message: '존재하지 않는 userId입니다.' });

    const projectIds = await JoinProjectModel.findProjectsByUserId(userId);

    const projectsData = await Promise.all(
      projectIds.map(projectId => ProjectModel.findProjectNameById(projectId))
    );

    const projects = projectsData.map(projectData => {
      return { projectName: projectData.projectName, projectId: projectData.projectId };
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while retrieving projects' });
  }
};

//프로젝트 업데이트
exports.updateProject = async (req, res) => {
  try {
    const newData  = req.body;
    const { projectId } = req.params;

    if (!newData || Object.keys(newData).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    const projectExists = await ProjectModel.isProjectExist(projectId);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await ProjectModel.updateProject(projectId, newData);
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating project' });
  }
};

//프로젝트 삭제
exports.deleteProject = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No authorization header provided' });

    const accessToken = authHeader.split(' ')[1];
    const decoded = jwt.verify(accessToken); // 비밀키와 함께 토큰을 검증합니다.
    const userId = decoded.userId; // ownerId는 디코딩된 토큰에서 userId를 가져옵니다.

    const { projctId } = req.params
    const ownerId = await ProjectModel.findOwnerIdById(projctId)

    if(userId === ownerId){
      res.status(300).json({message: " 프로젝트 삭제 권한이 없습니다. "})
    }

    await JoinProjectModel.deleteJoinProject(projctId)

    res.status(200).json({message:'프로젝트가 성공적으로 삭제되었습니다.'});
  } catch (error) {
    console.error(error); // 에러 로깅
    res.status(400).json({ message: error.message });
  }
};

//프로젝트 관리 조회
exports.projectManage = async (req,res) => {
  try {
    const { projectId } = req.query

    const userIds = await JoinProjectModel.findUsersByProjectId(projectId)

    const manageData = await Promise.all(userIds.map(async (userId) => {
      try {
        const users = await UserModel.findNameByUserId(userId);
        if (users && users.length > 0 && users[0].name) {
          return { name: users[0].name };
        } else {
          console.log(`No users found or name missing for userId: ${userId}`);
          return null;
        }
      } catch (error) {
        console.log(`Error fetching user for userId ${userId}:`, error);
        return null;
      }
    }));

    const validData = manageData.filter(item => item !== null);

    res.status(200).json(validData);
  } catch (error) {
    console.error(error); // 에러 로깅
    res.status(400).json({ message: error.message });
  }
}

//팀원삭제
exports.deleteTeam = async (req,res) => {
  try {
    const {userId, projectId} = req.params
    console.log(req.params)
    
    const isUserExist = await JoinProjectModel.isUserExist(userId)
    if(!isUserExist) return res.status(400).json({message: 'Not exist user'})

    await JoinProjectModel.deleteProjectByUserId(userId,projectId)

    res.status(200).json({message:'팀원이 성공적으로 탈퇴되었습니다.'});
  } catch (error) {
    console.error(error); // 에러 로깅
    res.status(400).json({ message: error.message });
  }
}