const ProjectModel = require('../models/projectModel.js');
const UserModel = require('../models/userModel.js');
const JoinProjectModel = require('../models/joinProjectModel.js');
const jwt = require('../jwt/jwt.js'); // jwt 파일의 정확한 경로를 확인해주세요.

exports.createProject = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token); // jwt.verify 함수의 사용법을 확인하고, 필요한 인자를 전달해야 합니다.
    const ownerId = decoded.userId; // ownerId는 decoded된 토큰에서 userId를 가져와야 합니다.

    // 프로젝트 생성 로직
    const { projectName, startDate, endDate, personnel } = req.body;

    // ProjectModel.create 함수에 필요한 인자를 전달합니다.
    const newProjectId = await ProjectModel.createProject(projectName, startDate, endDate, ownerId, personnel);

    // JoinProjectModel.addUserToProject 함수에 필요한 인자를 전달합니다.
    await JoinProjectModel.addUserToProject(ownerId, newProjectId);

    // 새 프로젝트 정보를 가져와서 응답에 포함합니다.
    const newProject = await ProjectModel.getProjectById(newProjectId);

    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.searchUsers = async (req, res) => {
  try {
    // 사용자 검색 로직
    const { loginId } = req.query;

    // UserModel.findByLoginId 함수를 호출하여 사용자를 찾습니다.
    const user = await UserModel.findByLoginId(loginId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ name: user.name, email: user.email });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
