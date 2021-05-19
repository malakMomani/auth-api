'use strict';
const superagent = require('superagent');
const userModel = require('../models/users.js')
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const oauthURL = 'https://www.googleapis.com/auth/gmail.labels';
const jwt = require('jsonwebtoken');
const tokenUrl = 'https://oauth2.googleapis.com/token';

module.exports = async (req, res, next)=>{

    console.log(req.query);

    const code = req.query.code;
    const token = await getCodeFromOAuth(code);
    // 3. Use the access token to access the user API
    let remoteUser = await exchangeTokenWithUserInfo(token);
    console.log("AFTER FORM 3.USER ======== ", remoteUser);
    let [localUser, localToken] = await getLocalUser(remoteUser);
    req.user = localUser;
    req.token = localToken;
    next();

}
async function getCodeFromOAuth(code) {
    try {
        const tokenResponse = await superagent.post(tokenUrl).send({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            redirect_uri:'https://auth-server-malak.herokuapp.com/oauth',
            grant_type: 'authorization_code'

        });
        console.log("tokenResponse.body", tokenResponse.body)
        return tokenResponse.body.access_token;
    } catch(err) {
        console.log(err.message);
    }
}

async function exchangeTokenWithUserInfo(token) {
   try {
    const userUrl = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`;

      const userInfo = await superagent.get(userUrl).set({
          'Authorization': `Bearer ${token}`
      });
      return userInfo.body;
   } catch(err) {
      console.log(err.message);
   }
}

async function getLocalUser(userObj) {
  try {
      let userRecord = {
          username: userObj.name,
          password: 'oauth' 
      }
      let newUser = new userModel(userRecord);
      let user = await newUser.save();
      let token = jwt.sign({username: user.username}, process.env.SECRET);
      return [user, token];
  }catch(err) {
      console.log(err)
  }
}