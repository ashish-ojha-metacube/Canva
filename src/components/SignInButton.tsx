import React from 'react';
import { useMsal } from '@azure/msal-react';
import styles from "styles/components.css";



export const SignInButton = () => {
    const {instance} = useMsal();

    const handleSignIn = () => {
        let accountId = "";
        
       /* try {
            const loginResponse =instance.loginPopup({});
            console.log(loginResponse);
            const accountId = loginResponse.account.homeAccountId;
            console.log(accountId);
        } catch (err) {
            // handle error
            console.log(err);
        }*/
        
        instance.loginPopup()
  .then(function (loginResponse) {
    accountId = loginResponse.accessToken;
    console.log(accountId);
    console.log(loginResponse);
  })
  .catch(function (error) {
    //login failure
    console.log(error);
  });
  }

    return (
      <> 
    <button className={styles.button} onClick={SignInButton}>
        Authenticate
      </button>
    </>
    )
};