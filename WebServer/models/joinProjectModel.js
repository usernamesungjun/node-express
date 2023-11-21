const db = require('../db.js');

exports.addUserToProject = async (userId, projectId) => {
  const sql = 'INSERT INTO joinproject (userId, projectId) VALUES (?, ?)';
  await db.query(sql, [userId, projectId]);
};

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
exports.deleteProjectByUserId = async (userId) => {
  const query = 'DELETE FROM joinproject WHERE userId = ?';
  try {
    const result = await db.query(query, [userId]);
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