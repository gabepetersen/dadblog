
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
export function apiSignup(name: string, email: string, password: string) {
  console.log("Signup: ", { n: name, e: email, p: password });
  return fetch("/api/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ name: name, email: email, pass: password })
  }).then(x => x.json());
}