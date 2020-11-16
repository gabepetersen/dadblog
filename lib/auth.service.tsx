/**
 * logout method to clear the user token
 */
export function logout() {
  deleteToken();
  deleteRole();
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
 * stores the token in sessionStorage
 * @param token 
 */
export function storeToken(token) {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('user_token', token);
    } catch (err) {
      console.error("Error with Storage: ", err);
    }
  }
}
/**
 * stores the user role - this should not be used for any security
 * Only as an convienience auth guard
 * @param role 
 */
export function storeRole(role: string) {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('user_role', role)
    } catch (err) {
      console.error("Error with Storage: ", err);
    }
  }
}
/**
 * gets the current user token
 */
export function getToken() {
  if (typeof window !== 'undefined') {
    try {
      return sessionStorage.getItem('user_token');
    } catch (err) {
      console.error("Error with Storage: ", err);
    }
  }
}
/**
 * gets the user role - for front-end purposes ONLY
 */
export function getRole() {
  if (typeof window !== 'undefined') {
    try {
      return sessionStorage.getItem('user_role');
    } catch (err) {
      console.error("Error with Storage: ", err);
    }
  }
}
/**
 * removes token from session storage
 */
export function deleteToken() {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem('user_token');
    } catch (err) {
      console.error("Error with Storage: ", err);
    }
  }
}
/**
 * removes user role from session storage
 */
export function deleteRole() {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem('user_role');
    } catch (err) {
      console.error("Error with Storage: ", err);
    }
  }
}