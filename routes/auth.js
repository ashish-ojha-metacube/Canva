
const axios = require('axios');
var express = require('express');
var msal = require('@azure/msal-node');
var FinalState;
var access_Token;
const {LocalStorage} = require("node-localstorage");
var localStorage = new LocalStorage('./scratch'); 


const scope=["Mail.Read","Mail.ReadBasic","Mail.ReadWrite","User.Read","Team.ReadBasic.All","Channel.ReadBasic.All"," ChannelSettings.Read.All","ChannelSettings.ReadWrite.All","Group.Read.All","TeamMember.Read.All","TeamMember.ReadWrite.All"];
var {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
    GRAPH_ME_ENDPOINT
} = require('../authConfig');

const router = express.Router();
const msalInstance = new msal.ConfidentialClientApplication(msalConfig);
const cryptoProvider = new msal.CryptoProvider();

/**
 * Prepares the auth code request parameters and initiates the first leg of auth code flow
 * @param req: Express request object
 * @param res: Express response object
 * @param next: Express next function
 * @param authCodeUrlRequestParams: parameters for requesting an auth code url
 * @param authCodeRequestParams: parameters for requesting tokens using auth code
 */
async function redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams) {

    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

    req.session.pkceCodes = {
        challengeMethod: 'S256',
        verifier: verifier,
        challenge: challenge,
    };


    req.session.authCodeUrlRequest = {
        redirectUri: REDIRECT_URI,
        responseMode: 'form_post', // recommended for confidential clients
        codeChallenge: req.session.pkceCodes.challenge,
        codeChallengeMethod: req.session.pkceCodes.challengeMethod,
        ...authCodeUrlRequestParams,
    };

    req.session.authCodeRequest = {
        redirectUri: REDIRECT_URI,
        code: "",
        ...authCodeRequestParams,
    };

    try {
        const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
        res.redirect(authCodeUrlResponse);
    } catch (error) {
        next(error);
    }
};

router.get('/signin', async function (req, res, next) {

    const { time, user, brand, extensions, states, code } = req.query;
    FinalState = req.query.state;
    console.log("FinalState",FinalState);
    console.log("time",time);
    console.log("user",user);
    console.log("brand",brand);
    console.log("extensions",extensions);

    req.session.csrfToken = cryptoProvider.createNewGuid();

    const state = cryptoProvider.base64Encode(
        JSON.stringify({
            csrfToken: req.session.csrfToken,
            redirectTo: '/'
        })
    );

    const authCodeUrlRequestParams = {
        state: state,
        scopes: scope,
    };

    const authCodeRequestParams = {
        scopes: scope,
    };
    return redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams)
});

router.get('/acquireToken', async function (req, res, next) {

    req.session.csrfToken = cryptoProvider.createNewGuid();

    const state = cryptoProvider.base64Encode(
        JSON.stringify({
            csrfToken: req.session.csrfToken,
            redirectTo: '/users/profile'
        })
    );

    const authCodeUrlRequestParams = {
        state: state,
        scopes: scope,
    };

    const authCodeRequestParams = {
        scopes: scope,
    };

    // trigger the first leg of auth code flow
    return redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams)
});

router.post('/redirect', async function (req, res, next) {
    if (req.body.state) {
        const state = JSON.parse(cryptoProvider.base64Decode(req.body.state));

        // check if csrfToken matches
        if (state.csrfToken === req.session.csrfToken) {
            req.session.authCodeRequest.code = req.body.code; // authZ code
            req.session.authCodeRequest.codeVerifier = req.session.pkceCodes.verifier // PKCE Code Verifier

            try {
                const tokenResponse = await msalInstance.acquireTokenByCode(req.session.authCodeRequest);
                req.session.accessToken = tokenResponse.accessToken;
                req.session.idToken = tokenResponse.idToken;
                req.session.account = tokenResponse.account;
                req.session.isAuthenticated = true;
                access_Token = req.session.accessToken;
                  
                console.log('-- **AccessToken** -- '+req.session.accessToken);
                localStorage.setItem('accessToken' , req.session.accessToken);
                // res.redirect(state.redirectTo);
                /*const graphResponse = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken);
                console.log("**graphresponse**",graphResponse);
                const endpoint = "https://graph.microsoft.com/v1.0/me";

                const options = {
                    headers: {
                        Authorization: `Bearer ${req.session.accessToken}`
                    }
                };
            
                console.log('request made to web API at: ' + new Date().toString());
            
                try {
                    const response = await axios.get(endpoint, options);
                    console.log("response.data;",response.data);
                } catch (error) {
                    console.log("error;",error);
                    console.log(error);
                }*/


                // res.redirect(302,`https://canva.com/apps/configured?success=true&state=${FinalState}`);
                const redirect = state.redirectTo;
                if(redirect.length >2){
                    res.redirect(state.redirectTo);
                }else {
                    res.redirect(302,`https://canva.com/apps/configured?success=true&state=${FinalState}`);
                } 
                //const redirect = state.redirectTo; 
              //  console.log("redirectTo",typeof state.redirectTo );
                //console.log("redirectTo",redirect.length );
                
              //  res.redirect(state.redirectTo);
                //res.redirect(302,`https://canva.com/apps/configured?success=true&state=${FinalState}`); */
            } catch (error) {
                next(error);
            }
        } else {
            next(new Error('csrf token does not match'));
        }
    } else {
        next(new Error('state is missing'));
    }
});

router.get('/signout', function (req, res) {
    const logoutUri = `${msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;

    req.session.destroy(() => {
        res.redirect(logoutUri);
    });
});
module.exports = {
   access_Token
};
module.exports = router;
