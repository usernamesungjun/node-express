const yorkie = require("yorkie-js-sdk");
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const documentModel = require("../models/documentModel")
const projectModel = require("../models/projectModel")
const userModel = require('../models/userModel.js')

exports.createDocument = async (req, res) => {
  const { projectId, documentName } = req.body;
  console.log("문서 생성요청", req.body);

  try {
    const isProjectExist = await projectModel.isProjectExist(projectId);
    if (!isProjectExist){
      return res.status(400).json({ message: "projectId is not found" });
    }

    const documentId = await documentModel.createDocument(projectId,documentName);

    res.status(201).json({success: true,documentId: documentId, message: "Document created successfully.",});
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).send("Error creating document");
  }
};

exports.writeDocument = async (req, res) => {
  const { documentId } = req.query
  console.log(req.query)

  try {
    const documentName = await documentModel.findByDocumentId(documentId)

    res.status(200).json({success: true, documentName: documentName});
  } catch (error) {
    console.error("Error writing document:", error);
    res.status(500).send("Error writing document");
  }
}