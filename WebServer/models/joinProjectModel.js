const db = require('../db.js');

exports.addUserToProject = async (userId, projectId) => {
  const sql = 'INSERT INTO joinproject (userId, projectId) VALUES (?, ?)';
  await db.query(sql, [userId, projectId]);
};

exports.findUsersByProjectId = async (projectId) => {
  const sql = 'SELECT userId FROM joinproject WHERE projectId = ?';
  try {
    const result = await db.query(sql, [projectId]);
    console.log(result); // Log the result for debugging
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
    console.log(result); // Log the result for debugging
    return result.map(entry => entry.projectId); // Make sure the property name matches your column name
  } catch (error) {
    console.error('Error in findProjectsByUserId:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};
