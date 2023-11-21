const db = require('../db.js');

exports.createMention = async ( workId, userId, contents, registerDate) => {
  try {
    const result = await db.query(
      'INSERT INTO mention( workId, userId , contents, registerDate) VALUES(?,?,?,?)'
      ,[workId, userId , contents, registerDate]
      )
      return result.insertId
  } catch (error) {
    console.error('Error in getProjectById:', error);
    throw error;
  }
}

exports.updateMention = async (workId, mentionId, newData) => {
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

  const query = `UPDATE mention SET ${updates.join(', ')} WHERE workId = ? AND mentionId = ?`;
  values.push(workId);
  values.push(mentionId);

  try {
    const result = await db.query(query, values);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in updateMention:', error);
    throw error;
  }
};

//멘션 조회
exports.findMentionsByWorkId = async (workId) => {
  const mention = await db.query('SELECT * FROM mention WHERE workId = ?',[workId])
  return mention;
}

//멘션 만 삭제
exports.deleteMentionByMentionId = async (mentionId) => {
  const query = 'DELETE FROM mention WHERE mentionId = ?';
  try {
    const result = await db.query(query, [mentionId]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in deleteMention:', error);
    throw error;
  }
}

//작업과 관련된 멘션 삭제
exports.deleteMentionByWorkId= async (workId) => {
  const query = 'DELETE FROM mention WHERE workId = ?';
  try {
    const result = await db.query(query, [workId]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in deleteMention:', error);
    throw error;
  }
}

//멘션이 존재하는지 체크
exports.isMentionExist = async (mentionId) => {
  const mention = await db.query('SELECT * FROM mention WHERE mentionId = ?',[mentionId])
  return mention.length>0;
}

