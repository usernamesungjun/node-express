const ProjectModel = require('../models/projectModel.js');
const UserModel = require('../models/userModel.js');
const JoinProjectModel = require('../models/joinProjectModel.js');
const jwt = require('../jwt/jwt.js'); // jwt 파일의 정확한 경로를 확인해주세요.

exports.createProject = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ message: 'No authorization header provided' });

    const accessToken = authHeader.split(' ')[1];
    const decoded = jwt.verify(accessToken); // 비밀키와 함께 토큰을 검증합니다.
    const ownerId = decoded.loginId; // ownerId는 디코딩된 토큰에서 userId를 가져옵니다.

    // 프로젝트 생성 로직
    const { projectName, startDate, endDate, personnel } = req.body;
    console.log(req.body)
    const newProject = await ProjectModel.createProject( projectName, startDate, endDate, ownerId, personnel );

    // JoinProjectModel을 이용해 프로젝트에 사용자를 추가합니다.
      await JoinProjectModel.addUserToProject(decoded.userId,newProject);

    // 성공적으로 생성된 프로젝트의 정보를 응답으로 보냅니다.
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error); // 에러 로깅
    res.status(400).send({ message: error.message });
  }
};
