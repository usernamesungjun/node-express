const db = require('../db.js');

exports.createDocument = async (projectId, documentName, yorkieId) => {
  try {
    const result = await db.query('INSERT INTO document (projectId, documentName, yorkieId) VALUES (?, ?, ?)',
    [projectId, documentName, yorkieId])
    return result.insertId
  } catch (error) {
    throw error
  }
}

exports.findByDocumentId = async (documentId) => {
  try {
    const sql = 'SELECT documentName FROM document WHERE documentId = ?';
    const result = await db.query(sql, [documentId]);
    return result[0];
  } catch (error) {
    throw error
  }
}