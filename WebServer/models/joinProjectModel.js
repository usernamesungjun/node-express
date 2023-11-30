const db = require('../db.js');

exports.addUserToProject = async (userId, projectId) => {
  const sql = 'INSERT INTO joinproject (userId, projectId) VALUES (?, ?)';
  await db.query(sql, [userId, projectId]);
};

//projectId로 userId찾기
exports.findUsersByProjectId = async (projectId) => {
  const sql = 'SELECT userId FROM joinproject WHERE projectId = ?';
  try {
    const result = await db.query(sql, [projectId]);
    return result.map(entry => entry.userId); // Make sure the property name matches your column name
  } catch (error) {
    console.error('Error in findUsersByProjectId:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

//userId로 projectId찾기
exports.findProjectsByUserId = async (userId) => {
  const sql = 'SELECT projectId FROM joinproject WHERE userId = ?';
  try {
    const result = await db.query(sql, [userId]);
    return result.map(entry => entry.projectId); // Make sure the property name matches your column name
  } catch (error) {
    console.error('Error in findProjectsByUserId:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

//프로젝트 탈퇴
exports.deleteProjectByUserId = async (userId,projectId) => {
  const query = 'DELETE FROM joinproject WHERE userId = ? AND projectId = ?';
  try {
    const result = await db.query(query, [userId,projectId]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in secession:', error);
    throw error;
  }
}

//프로젝트 삭제
exports.deleteJoinProject = async (projectId) => {
  const query = 'DELETE FROM joinproject WHERE projectId = ?';
  try {
    const result = await db.query(query, [projectId]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in secession:', error);
    throw error;
  }
}

//팀원 존재 여부
exports.isUserExist = async (userId) => {
  const result = await db.query('SELECT * FROM joinproject WHERE userId = ?', [userId])
  return result.length>0
}

exports.isUserInProject = async (userId, projectId) => {
  const result = await db.query('SELECT * FROM joinproject WHERE userId = ? AND projectId = ?', [userId, projectId])
  return result.length>0
}
