const db = require('../db.js');

exports.addUserToProject = async (userId, projectId) => {
  const sql = 'INSERT INTO joinproject (userId, projectId) VALUES (?, ?)';
  await db.query(sql, [userId, projectId]);
};

// exports.removeUserFromProject = async (userId, projectId) => {
//   const sql = 'DELETE FROM join_projects WHERE user_id = ? AND project_id = ?';
//   await db.query(sql, [userId, projectId]);
// };

// exports.getUsersByProjectId = async (projectId) => {
//   const sql = 'SELECT user_id FROM join_projects WHERE project_id = ?';
//   const result = await db.query(sql, [projectId]);
//   return result.map(entry => entry.user_id);
// };

// exports.getProjectsByUserId = async (userId) => {
//   const sql = 'SELECT project_id FROM join_projects WHERE user_id = ?';
//   const result = await db.query(sql, [userId]);
//   return result.map(entry => entry.project_id);
// };