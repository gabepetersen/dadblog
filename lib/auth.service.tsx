/**
 * logout method to clear the user token
 */
export function logout() {
  deleteToken();
  console.log("Logged Out");
}
/**
 * Login route fetch that returns jwt if succesful
 * @param email 
 * @param password 
 * @returns Promise<any>
 */
export async function apiLogin(email: string, password: string) {
  return fetch("/api/login-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ email: email, pass: password })
  }).then(x => x.json());
}
/**
 * Singup route fetch that returns jwt if succesful
 * @param name 
 * @param email 
 * @param password 
 * @returns Promise<any>
 */
export async function apiSignup(name: string, email: string, password: string) {
  return fetch("/api/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ name: name, email: email, pass: password })
  }).then(x => x.json());
}
/**
 * sends a confirmation email to the given email
 * @param email 
 */
export async function sendConfirmation(email: string) {
  console.log("Level 1");
  return fetch("/api/email/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ email: email })
  }).then(x => x.json());
}
/**
 * check if the user has a stored token
 * @returns boolean
 */
export function checkLogin() {
  if (getToken()) {
    return true;
  } else {
    return false;
  }
}
/**
 * stores the token in localstorage
 * @param token 
 * @returns number
 */
export function storeToken(token) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('user_token', token);
    } catch (err) {
      console.error("Error with Storage: ", err);
    }
  } else {
    return 0
  }
}
/**
 * gets the current user token - 0 if error
 * @returns string or number
 */
export function getToken() {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('user_token');
    } catch (err) {
      console.error("Error with Storage: ", err);
      return 0;
    }
  } else {
    return 0;
  }
}
/**
 * removes token from local storage
 * @returns boolean
 */
export function deleteToken() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('user_token');
      return true;
    } catch (err) {
      console.error("Error with Storage: ", err);
      return false;
    }
  } else { 
    return 0;
  }
}