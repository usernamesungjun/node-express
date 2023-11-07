const db = require('../db.js');

exports.createProject = async (projectName, startDate, endDate, ownerId, personnel) => {
  try {
    const result = await db.query(
      'INSERT INTO project (projectName, startDate, endDate, ownerId, personnel) VALUES (?, ?, ?, ?, ?)',
      [projectName, startDate, endDate, ownerId, personnel]);
    return result.insertId; // Node.js의 mysql 라이브러리는 일반적으로 insertId를 사용하여 새로 생성된 ID를 반환합니다.
  } catch (error) {
    throw error; // 에러를 캐치하고, 호출 스택에 에러를 던집니다.
  }
};

exports.getProjectById = async (projectId) => {
  const sql = 'SELECT * FROM project WHERE projectId = ?';
  const result = await db.query(sql, [projectId]);
  return result[0];
};

// exports.updateProject = async (projectId, { name, startDate, endDate }) => {
//   const sql = 'UPDATE projects SET name = ?, start_date = ?, end_date = ? WHERE id = ?';
//   await db.query(sql, [name, startDate, endDate, projectId]);
// };

// exports.deleteProject = async (projectId) => {
//   const sql = 'DELETE FROM projects WHERE id = ?';
//   await db.query(sql, [projectId]);
// };
