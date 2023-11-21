const db = require('../db.js');

//프로젝트 생성
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

//프로젝트 아이디로 프로젝트정보 가져오기
exports.getProjectById = async (projectId) => {
  const sql = 'SELECT * FROM project WHERE projectId = ?';
  try {
    const result = await db.query(sql, [projectId]);
    return result[0];
  } catch (error) {
    console.error('Error in getProjectById:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

//프로젝트 아이디로 프로젝트 이름 가져오기
exports.findProjectNameById = async (projectId) => {
  const sql = 'SELECT * From project WHERE projectId = ?';
  try {
    const result = await db.query(sql, [projectId]);
    return result[0];
  } catch (error) {
    console.error('Error in findProjectNameById:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

//프로젝트 아이디로 ownerId 조회
exports.findOwnerIdById = async (projectId) => {
  const sql = 'SELECT ownerId FROM project WHERE projectId = ?';
  try {
    const result = await db.query(sql, [projectId]);
    return result[0];
  } catch (error) {
    console.error('Error in getProjectOwnerId:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

exports.isProjectExist = async (projectId) => {
  const result = await db.query('SELECT * FROM project WHERE projectId = ?', [projectId]);
  return result.length>0;
}

exports.updateProject = async (projectId, newData) => {
  const updates = [];
  const values = [];

  // Constructing the dynamic query
  Object.keys(newData).forEach(key => {
    if (newData[key] != null) {
      updates.push(`${key} = ?`);
      values.push(newData[key]);
    }
  });

  if (updates.length === 0) {
    throw new Error('No updates provided');
  }

  const query = `UPDATE project SET ${updates.join(', ')} WHERE projectId = ?`;
  values.push(projectId);

  try {
    const result = await db.query(query, values);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in updateProject:', error);
    throw error;
  }
};

exports.deleteProject = async (projectId) => {
  const query = 'DELETE FROM project WHERE projectId = ?';
  try {
    const result = await db.query(query, [projectId]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in deleteProject:', error);
    throw error;
  }
}