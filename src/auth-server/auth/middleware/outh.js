'use strict';
const superagent = require('superagent');
const userModel = require('../models/users.js')
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const oauthURL = 'https://www.googleapis.com/auth/gmail.labels';

module.exports = async (req, res, next)=>{

    console.log(req.query);

    const code = req.query.code;
    console.log("AFTER FORM 1.CODE ======== ", code);
    // const token = await getCodeFromOAuth(code);
    // console.log("AFTER FORM 2.TOKEN ======== ", token);
    // // 3. Use the access token to access the user API
    // let remoteUser = await exchangeTokenWithUserInfo(token);
    // console.log("AFTER FORM 3.USER ======== ", remoteUser);
    // let [localUser, localToken] = await getLocalUser(remoteUser);
    // req.user = localUser;
    // req.token = localToken;
    // next();

}
async function getCodeFromOAuth(code) {
    try {
        //get request and recieve code
        const res = await superagent.get(oauthURL);
        // Get the code from the body
        // const code = res.body
        console.log(res.body);
    } catch (er) {
        console.log(er.message);
    }
}

async function exchangeCodeWithToken(code) {
  // tokenUrl + params
  // response : token from github
  try {
      const tokenResponse = await superagent.post(tokenUrl).send({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code
      });
      console.log("tokenResponse.body", tokenResponse.body)
      return tokenResponse.body.access_token;
  } catch(err) {
      console.log(err);
  }
}

async function exchangeTokenWithUserInfo(token) {
   try {
      const userInfo = await superagent.get(userUrl).set({
          'Authorization': `token ${token}`,
          'User-Agent': 'Rawan/1.0'
      });
      return userInfo.body;
   } catch(err) {
      console.log(err);
   }
}

async function getLocalUser(userObj) {
  try {
      let userRecord = {
          username: userObj.login,
          password: 'oauth' 
      }
      let newUser = new userModel(userRecord);
      let user = await newUser.save();
      let token = jwt.sign({username: user.username}, SECRET);
      return [user, token];
  }catch(err) {
      console.log(err)
  }
}